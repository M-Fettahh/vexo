import { QRCodeItem, UserProfile, Vehicle, QRScanLog, AdminStats } from '../types';
import { generateBatchQRIds, formatPlateNumber, cleanPhone10 } from '../utils/qrGenerator';
import { supabase } from '../lib/supabase';

// Active Session Key in SessionStorage (Temporary browser session only, NOT permanent storage)
const SESSION_USER_KEY = 'vexo_session_user';

// In-Memory Database Cache synced with Supabase
interface DatabaseCache {
  users: UserProfile[];
  vehicles: Vehicle[];
  qrs: QRCodeItem[];
  scans: QRScanLog[];
  initialized: boolean;
}

const cache: DatabaseCache = {
  users: [],
  vehicles: [],
  qrs: [],
  scans: [],
  initialized: false,
};

// Sync from Supabase - Single Source of Truth
export async function syncFromSupabase() {
  if (typeof window === 'undefined') return { success: false, cache };
  try {
    const res = await fetch('/api/db', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      body: JSON.stringify({ action: 'FETCH_ALL' }),
    });
    const data = await res.json();

    if (data.success) {
      cache.users = (data.profiles || []).map((row: any) => ({
        id: row.id,
        fullName: row.full_name || '',
        phone: row.phone || '',
        passwordHash: row.password_hash || '',
        role: row.role || 'user',
        showNameOnQR: row.show_name_on_qr ?? true,
        createdAt: row.created_at || new Date().toISOString(),
      }));

      cache.vehicles = (data.vehicles || []).map((row: any) => ({
        id: row.id,
        userId: row.user_id,
        plateNumber: row.plate_number,
        packageId: row.package_id || 'standard',
        createdAt: row.created_at || new Date().toISOString(),
      }));

      cache.qrs = (data.qrs || []).map((row: any) => ({
        id: row.id,
        qrCodeId: row.qr_code_id,
        status: row.status || 'unassigned',
        vehicleId: row.vehicle_id || null,
        userId: row.user_id || null,
        createdAt: row.created_at || new Date().toISOString(),
        activatedAt: row.activated_at || null,
        scanCount: row.scan_count || 0,
      }));

      cache.scans = (data.scans || []).map((row: any) => ({
        id: row.id,
        qrCodeId: row.qr_code_id,
        scannedAt: row.scanned_at || new Date().toISOString(),
        userAgent: row.user_agent || '',
      }));

      cache.initialized = true;
      return { success: true, cache };
    }
  } catch (err) {
    console.error('Failed to sync from Supabase:', err);
  }
  return { success: false, cache };
}

// Initial sync call
if (typeof window !== 'undefined') {
  syncFromSupabase();
}

// Helper to send actions to API / Supabase endpoint
async function sendSupabaseAction(action: string, payload?: any) {
  try {
    if (typeof window === 'undefined') return;
    await fetch('/api/db', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, payload }),
    });
  } catch (e) {
    console.error('Supabase action error:', e);
  }
}

export const dbService = {
  // Session handling using sessionStorage (transient browser session)
  getCurrentUser(): UserProfile | null {
    if (typeof window === 'undefined') return cache.users[1]; // fallback default
    try {
      const raw = sessionStorage.getItem(SESSION_USER_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return null;
  },

  setCurrentUser(user: UserProfile | null) {
    if (typeof window === 'undefined') return;
    try {
      if (user) {
        sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(user));
      } else {
        sessionStorage.removeItem(SESSION_USER_KEY);
      }
    } catch {}
  },

  // Auth: Login with Phone & Password against Supabase Users
  login(phone: string, password: string): { success: boolean; user?: UserProfile; error?: string } {
    const clean = cleanPhone10(phone);

    // Admin login shortcut check
    if (clean === '5000000000' && (password === 'fettahyusuf1212!' || password === 'admin123')) {
      const admin = cache.users.find(u => u.role === 'admin') || {
        id: 'u-admin',
        fullName: 'VEXO Yönetici',
        phone: '5000000000',
        passwordHash: 'fettahyusuf1212!',
        role: 'admin' as const,
        createdAt: new Date().toISOString(),
      };
      this.setCurrentUser(admin);
      return { success: true, user: admin };
    }

    const user = cache.users.find(u => cleanPhone10(u.phone) === clean && u.passwordHash === password);
    if (!user) {
      return { success: false, error: 'Telefon numarası veya şifre hatalı.' };
    }

    this.setCurrentUser(user);
    return { success: true, user };
  },

  logout() {
    this.setCurrentUser(null);
  },

  // QR Lookup from Supabase cache
  getQRByCodeId(codeId: string): QRCodeItem | null {
    return cache.qrs.find(q => q.qrCodeId === codeId) || null;
  },

  // Force sync cache from Supabase API
  syncFromSupabase,

  // Live async QR Details & Owner lookup directly from Supabase
  async getQROwnerDetailsAsync(codeId: string): Promise<{ qr: QRCodeItem; vehicle?: Vehicle; user?: UserProfile } | null> {
    try {
      if (typeof window !== 'undefined') {
        const res = await fetch('/api/db', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store',
          body: JSON.stringify({ action: 'FETCH_QR_DETAILS', payload: { qrCodeId: codeId } }),
        });
        const data = await res.json();

        if (data.success && data.exists && data.qr) {
          const qr: QRCodeItem = data.qr;
          const user: UserProfile | undefined = data.user || undefined;
          const vehicle: Vehicle | undefined = data.vehicle || undefined;

          // Sync local cache
          const qIndex = cache.qrs.findIndex(q => q.qrCodeId === codeId);
          if (qIndex !== -1) cache.qrs[qIndex] = qr;
          else cache.qrs.push(qr);

          if (user) {
            const uIndex = cache.users.findIndex(u => u.id === user.id);
            if (uIndex !== -1) cache.users[uIndex] = user;
            else cache.users.push(user);
          }

          if (vehicle) {
            const vIndex = cache.vehicles.findIndex(v => v.id === vehicle.id);
            if (vIndex !== -1) cache.vehicles[vIndex] = vehicle;
            else cache.vehicles.push(vehicle);
          }

          return { qr, user, vehicle };
        }

        if (data.success && !data.exists) {
          return null;
        }
      }
    } catch (err) {
      console.error('getQROwnerDetailsAsync error:', err);
    }

    return null;
  },

  // Get QR Details with Owner info from Supabase cache
  getQROwnerDetails(codeId: string): { qr: QRCodeItem; vehicle?: Vehicle; user?: UserProfile } | null {
    const qr = this.getQRByCodeId(codeId);
    if (!qr) return null;

    if (qr.status !== 'active' || !qr.userId) {
      return { qr };
    }

    const user = cache.users.find(u => u.id === qr.userId);
    const vehicle = cache.vehicles.find(v => v.id === qr.vehicleId);

    return { qr, user, vehicle };
  },

  // Live Async Registration of an unassigned QR code to user & vehicle -> Persisted to Supabase
  async registerQRCodeAsync(params: {
    qrCodeId: string;
    fullName: string;
    phone: string;
    password: string;
    plateNumber: string;
  }): Promise<{ success: boolean; user?: UserProfile; vehicle?: Vehicle; qr?: QRCodeItem; error?: string }> {
    const { qrCodeId, fullName, phone, password, plateNumber } = params;
    const cleanPhone = cleanPhone10(phone);
    const formattedPlate = formatPlateNumber(plateNumber);

    try {
      const res = await fetch('/api/db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'REGISTER_USER_AND_QR',
          payload: {
            qrCodeId,
            fullName,
            phone: cleanPhone,
            password,
            plateNumber: formattedPlate,
            role: 'user',
          },
        }),
      });
      const data = await res.json();

      if (data.success && data.user && data.vehicle && data.qr) {
        const user: UserProfile = {
          id: data.user.id,
          fullName: data.user.full_name || fullName,
          phone: data.user.phone || cleanPhone,
          passwordHash: data.user.password_hash || password,
          role: data.user.role || 'user',
          showNameOnQR: true,
          createdAt: data.user.created_at || new Date().toISOString(),
        };

        const vehicle: Vehicle = {
          id: data.vehicle.id,
          userId: data.vehicle.user_id,
          plateNumber: data.vehicle.plate_number || formattedPlate,
          packageId: data.vehicle.package_id || 'standard',
          createdAt: data.vehicle.created_at || new Date().toISOString(),
        };

        const qr: QRCodeItem = {
          id: data.qr.id,
          qrCodeId: data.qr.qr_code_id || qrCodeId,
          status: 'active',
          userId: user.id,
          vehicleId: vehicle.id,
          createdAt: data.qr.created_at || new Date().toISOString(),
          activatedAt: data.qr.activated_at || new Date().toISOString(),
          scanCount: data.qr.scan_count || 0,
        };

        // Sync local cache
        const qIndex = cache.qrs.findIndex(q => q.qrCodeId === qrCodeId);
        if (qIndex !== -1) cache.qrs[qIndex] = qr;
        else cache.qrs.push(qr);

        const uIndex = cache.users.findIndex(u => u.id === user.id);
        if (uIndex !== -1) cache.users[uIndex] = user;
        else cache.users.push(user);

        const vIndex = cache.vehicles.findIndex(v => v.id === vehicle.id);
        if (vIndex !== -1) cache.vehicles[vIndex] = vehicle;
        else cache.vehicles.push(vehicle);

        this.setCurrentUser(user);
        return { success: true, user, vehicle, qr };
      } else if (data.alreadyActive) {
        return { success: false, error: 'Bu QR kod daha önce başka bir araç için aktif edilmiştir.' };
      } else {
        return { success: false, error: data.error || 'Kayıt sırasında bir hata oluştu.' };
      }
    } catch (err: any) {
      console.error('registerQRCodeAsync error:', err);
      return { success: false, error: err.message || 'Sunucu bağlantı hatası.' };
    }
  },

  // Register an unassigned QR code to user & vehicle -> Fallback Sync method
  registerQRCode(params: {
    qrCodeId: string;
    fullName: string;
    phone: string;
    password: string;
    plateNumber: string;
  }): { success: boolean; user?: UserProfile; vehicle?: Vehicle; qr?: QRCodeItem; error?: string } {
    const { qrCodeId, fullName, phone, password, plateNumber } = params;

    const qrIndex = cache.qrs.findIndex(q => q.qrCodeId === qrCodeId);
    if (qrIndex !== -1 && cache.qrs[qrIndex].status === 'active') {
      return { success: false, error: 'Bu QR kod daha önce başka bir araç için aktif edilmiştir.' };
    }

    const cleanPhone = cleanPhone10(phone);
    const formattedPlate = formatPlateNumber(plateNumber);

    let user = cache.users.find(u => cleanPhone10(u.phone) === cleanPhone);

    if (!user) {
      user = {
        id: 'u-' + Date.now(),
        fullName,
        phone: cleanPhone,
        passwordHash: password,
        role: 'user',
        showNameOnQR: true,
        createdAt: new Date().toISOString(),
      };
      cache.users.push(user);
    }

    const vehicle: Vehicle = {
      id: 'v-' + Date.now(),
      userId: user.id,
      plateNumber: formattedPlate,
      packageId: 'standard',
      createdAt: new Date().toISOString(),
    };
    cache.vehicles.push(vehicle);

    const qr: QRCodeItem = {
      id: qrIndex !== -1 ? cache.qrs[qrIndex].id : 'qr-' + Date.now(),
      qrCodeId,
      status: 'active',
      userId: user.id,
      vehicleId: vehicle.id,
      createdAt: new Date().toISOString(),
      activatedAt: new Date().toISOString(),
      scanCount: qrIndex !== -1 ? cache.qrs[qrIndex].scanCount : 0,
    };

    if (qrIndex !== -1) cache.qrs[qrIndex] = qr;
    else cache.qrs.push(qr);

    this.setCurrentUser(user);

    sendSupabaseAction('REGISTER_USER_AND_QR', {
      qrCodeId,
      fullName,
      phone: cleanPhone,
      password,
      plateNumber: formattedPlate,
    });

    return { success: true, user, vehicle, qr };
  },

  // Record a call/scan attempt -> Persisted to Supabase
  logScan(codeId: string) {
    const qr = cache.qrs.find(q => q.qrCodeId === codeId);
    if (qr) {
      qr.scanCount = (qr.scanCount || 0) + 1;
    }

    const scanLog: QRScanLog = {
      id: 'scan-' + Date.now(),
      qrCodeId: codeId,
      scannedAt: new Date().toISOString(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    };
    cache.scans.push(scanLog);

    // Send action to Supabase
    sendSupabaseAction('LOG_SCAN', {
      qrCodeId: codeId,
      userAgent: scanLog.userAgent,
    });
  },

  // Get User Dashboard Details from Supabase cache
  getUserDashboardData(userId: string): {
    user: UserProfile | null;
    vehicles: Vehicle[];
    qrs: QRCodeItem[];
  } {
    const user = cache.users.find(u => u.id === userId) || null;
    const userVehicles = cache.vehicles.filter(v => v.userId === userId);
    const userQRs = cache.qrs.filter(q => q.userId === userId);

    return { user, vehicles: userVehicles, qrs: userQRs };
  },

  // Profile Updates -> Persisted to Supabase
  updateUserProfile(userId: string, newFullName: string, showNameOnQR?: boolean): boolean {
    const index = cache.users.findIndex(u => u.id === userId);
    if (index !== -1) {
      cache.users[index].fullName = newFullName;
      if (showNameOnQR !== undefined) {
        cache.users[index].showNameOnQR = showNameOnQR;
      }

      const currentUser = this.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        currentUser.fullName = newFullName;
        if (showNameOnQR !== undefined) {
          currentUser.showNameOnQR = showNameOnQR;
        }
        this.setCurrentUser(currentUser);
      }

      // Persist to Supabase
      sendSupabaseAction('UPDATE_PROFILE', {
        userId,
        fullName: newFullName,
        showNameOnQR,
      });

      return true;
    }
    return false;
  },

  updateUserPassword(userId: string, oldPassword: string, newPassword: string): { success: boolean; error?: string } {
    const index = cache.users.findIndex(u => u.id === userId);
    if (index === -1) return { success: false, error: 'Kullanıcı bulunamadı.' };

    if (cache.users[index].passwordHash !== oldPassword) {
      return { success: false, error: 'Mevcut şifreniz yanlış.' };
    }

    cache.users[index].passwordHash = newPassword;

    // Persist to Supabase
    sendSupabaseAction('UPDATE_PASSWORD', {
      userId,
      newPassword,
    });

    return { success: true };
  },

  // ADMIN OPERATIONS -> Calculated & synced with Supabase
  getAdminStats(): AdminStats {
    const activeQRs = cache.qrs.filter(q => q.status === 'active').length;
    const unassignedQRs = cache.qrs.filter(q => q.status === 'unassigned').length;
    const regularUsers = cache.users.filter(u => u.role === 'user').length;

    const totalSales = activeQRs;
    const totalRevenue = totalSales * 200; // 200 TL per standard package

    return {
      totalSales,
      totalRevenue,
      totalQRs: cache.qrs.length,
      activeQRs,
      unassignedQRs,
      totalUsers: regularUsers,
    };
  },

  getAllQRs(): QRCodeItem[] {
    return cache.qrs;
  },

  getAllUsersWithVehicles(): Array<{ user: UserProfile; vehicle?: Vehicle; qr?: QRCodeItem }> {
    const regularUsers = cache.users.filter(u => u.role === 'user');

    return regularUsers.map(user => {
      const vehicle = cache.vehicles.find(v => v.userId === user.id);
      const qr = cache.qrs.find(q => q.userId === user.id);
      return { user, vehicle, qr };
    });
  },

  // Delete a user, their vehicles, unassign/delete associated QRs (Admin) -> Persisted to Supabase
  async deleteUser(userId: string): Promise<boolean> {
    try {
      const res = await fetch('/api/db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        body: JSON.stringify({ action: 'DELETE_USER', payload: { userId } }),
      });
      const data = await res.json();
      if (data.success) {
        await syncFromSupabase();
        return true;
      }
      return false;
    } catch (err) {
      console.error('deleteUser error:', err);
      return false;
    }
  },

  // Generate batch QR codes (Admin) -> Persisted to Supabase
  async generateBulkQRs(count: number): Promise<QRCodeItem[]> {
    const batchIds = generateBatchQRIds(count);

    const newQRs: QRCodeItem[] = batchIds.map(codeId => ({
      id: 'qr-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
      qrCodeId: codeId,
      status: 'unassigned',
      vehicleId: null,
      userId: null,
      createdAt: new Date().toISOString(),
      scanCount: 0,
    }));

    try {
      await fetch('/api/db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        body: JSON.stringify({ action: 'GENERATE_BULK_QRS', payload: { qrs: newQRs } }),
      });
      await syncFromSupabase();
    } catch (err) {
      console.error('generateBulkQRs error:', err);
    }

    return newQRs;
  },

  // Delete a QR code (Admin) -> Persisted to Supabase
  async deleteQR(qrCodeId: string): Promise<boolean> {
    try {
      const res = await fetch('/api/db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        body: JSON.stringify({ action: 'DELETE_QR', payload: { qrCodeId } }),
      });
      const data = await res.json();
      if (data.success) {
        await syncFromSupabase();
        return true;
      }
      return false;
    } catch (err) {
      console.error('deleteQR error:', err);
      return false;
    }
  },
};

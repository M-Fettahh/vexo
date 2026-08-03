export type QRStatus = 'unassigned' | 'active' | 'disabled';
export type UserRole = 'user' | 'admin';

export interface UserProfile {
  id: string;
  fullName: string;
  phone: string;
  passwordHash?: string;
  role: UserRole;
  showNameOnQR?: boolean;
  createdAt: string;
}

export interface Vehicle {
  id: string;
  userId: string;
  plateNumber: string;
  packageId: string;
  createdAt: string;
}

export interface QRCodeItem {
  id: string;
  qrCodeId: string; // Unpredictable 16-char crypto string e.g. Q7XaP9LmR4Tk8WnB
  status: QRStatus;
  vehicleId?: string | null;
  userId?: string | null;
  createdAt: string;
  activatedAt?: string | null;
  scanCount: number;
}

export interface QRScanLog {
  id: string;
  qrCodeId: string;
  scannedAt: string;
  userAgent?: string;
}

export interface AdminStats {
  totalSales: number;
  totalRevenue: number;
  totalQRs: number;
  activeQRs: number;
  unassignedQRs: number;
  totalUsers: number;
}

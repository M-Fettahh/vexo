import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

// Helper UUID generator
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, payload } = body;

    if (!supabase) {
      return NextResponse.json({ success: false, error: 'Supabase client is not configured' }, { status: 500 });
    }

    switch (action) {
      case 'FETCH_QR_DETAILS': {
        const { qrCodeId } = payload || {};
        if (!qrCodeId) {
          return NextResponse.json({ success: false, error: 'qrCodeId is required' }, { status: 400 });
        }

        console.log(`Incoming QR: ${qrCodeId}`);
        console.log(`SELECT * FROM qrs WHERE qr_code_id='${qrCodeId}'`);

        // 1. Query strictly from qrs table by qr_code_id
        const { data: qrsData, error: qrErr } = await supabase
          .from('qrs')
          .select('*')
          .eq('qr_code_id', qrCodeId);

        if (qrErr) {
          console.error('[DEBUG] FETCH_QR_DETAILS Supabase error:', qrErr);
          return NextResponse.json({ success: false, error: qrErr.message }, { status: 500 });
        }

        let qrRow = qrsData?.[0];

        // Fallback: If not found by qr_code_id AND qrCodeId matches UUID format, check id column
        if (!qrRow && /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(qrCodeId)) {
          const { data: qrsByIdData } = await supabase
            .from('qrs')
            .select('*')
            .eq('id', qrCodeId);
          if (qrsByIdData && qrsByIdData.length > 0) {
            qrRow = qrsByIdData[0];
          }
        }

        if (!qrRow) {
          console.log(`QR NOT FOUND: ${qrCodeId}`);
          return NextResponse.json({
            success: true,
            exists: false,
            qr: null,
            user: null,
            vehicle: null,
          });
        }

        console.log(`QR FOUND: ID=${qrRow.id}, qr_code_id=${qrRow.qr_code_id}, status=${qrRow.status}`);

        const formattedQR = {
          id: qrRow.id,
          qrCodeId: qrRow.qr_code_id,
          status: qrRow.status || 'unassigned',
          vehicleId: qrRow.vehicle_id || null,
          userId: qrRow.user_id || null,
          createdAt: qrRow.created_at || new Date().toISOString(),
          activatedAt: qrRow.activated_at || null,
          scanCount: qrRow.scan_count || 0,
          stickerPrinted: qrRow.sticker_printed ?? false,
        };

        let formattedUser = null;
        let formattedVehicle = null;

        if (qrRow.status === 'active') {
          let userRow = null;
          let vehicleRow = null;

          if (qrRow.user_id) {
            const { data: profileData } = await supabase.from('profiles').select('*').eq('id', qrRow.user_id).maybeSingle();
            userRow = profileData;
          }

          if (qrRow.vehicle_id) {
            const { data: vData } = await supabase.from('vehicles').select('*').eq('id', qrRow.vehicle_id).maybeSingle();
            vehicleRow = vData;
          } else if (qrRow.user_id) {
            const { data: vData } = await supabase.from('vehicles').select('*').eq('user_id', qrRow.user_id).maybeSingle();
            vehicleRow = vData;
          }

          formattedUser = userRow ? {
            id: userRow.id,
            fullName: userRow.full_name || 'Araç Sahibi',
            phone: userRow.phone || '',
            passwordHash: userRow.password_hash || '',
            role: userRow.role || 'user',
            createdAt: userRow.created_at || new Date().toISOString(),
          } : {
            id: qrRow.user_id || uuidv4(),
            fullName: 'Araç Sahibi',
            phone: '',
            passwordHash: '',
            role: 'user',
            createdAt: new Date().toISOString(),
          };

          formattedVehicle = vehicleRow ? {
            id: vehicleRow.id,
            userId: vehicleRow.user_id,
            plateNumber: vehicleRow.plate_number || 'Araç Plakası',
            packageId: vehicleRow.package_id || 'standard',
            createdAt: vehicleRow.created_at || new Date().toISOString(),
          } : {
            id: qrRow.vehicle_id || uuidv4(),
            userId: qrRow.user_id || uuidv4(),
            plateNumber: 'Araç Plakası',
            packageId: 'standard',
            createdAt: new Date().toISOString(),
          };
        }

        return NextResponse.json({
          success: true,
          exists: true,
          qr: formattedQR,
          user: formattedUser,
          vehicle: formattedVehicle,
        });
      }

      case 'FETCH_ALL': {
        const [profilesRes, vehiclesRes, qrsRes, scansRes] = await Promise.all([
          supabase.from('profiles').select('*'),
          supabase.from('vehicles').select('*'),
          supabase.from('qrs').select('*'),
          supabase.from('scans').select('*'),
        ]);

        return NextResponse.json({
          success: true,
          profiles: profilesRes.data || [],
          vehicles: vehiclesRes.data || [],
          qrs: qrsRes.data || [],
          scans: scansRes.data || [],
        });
      }

      case 'REGISTER_USER_AND_QR': {
        const { qrCodeId, fullName, phone, password, plateNumber, role } = payload || {};

        // Sanitize role strictly to 'user' or 'admin', defaulting to 'user'
        let userRole: 'user' | 'admin' = 'user';
        if (role && typeof role === 'string') {
          const lower = role.toLowerCase().trim();
          if (lower === 'admin') userRole = 'admin';
        }

        // Fetch target QR
        const { data: qrRows } = await supabase.from('qrs').select('*').eq('qr_code_id', qrCodeId);
        const qrRow = qrRows?.[0];

        if (qrRow && qrRow.status === 'active') {
          return NextResponse.json({
            success: false,
            error: 'Bu QR kod daha önce başka bir araç için aktif edilmiştir.'
          }, { status: 400 });
        }

        // Check if QR exists
        let targetQRId = qrRow?.id || uuidv4();

        // Check if phone exists in profiles
        const { data: existingProfiles } = await supabase.from('profiles').select('*').eq('phone', phone);
        let userRow = existingProfiles?.[0];

        if (!userRow) {
          userRow = {
            id: uuidv4(),
            full_name: fullName || '',
            phone: phone || '',
            password_hash: password || '',
            role: userRole,
            created_at: new Date().toISOString(),
          };
          const { error: profErr } = await supabase.from('profiles').upsert([userRow]);
          if (profErr) {
            console.error('Profile upsert error:', profErr);
            return NextResponse.json({ success: false, error: profErr.message }, { status: 400 });
          }
        } else {
          // If user exists but role is invalid or missing, update it to userRole
          if (userRow.role !== 'user' && userRow.role !== 'admin') {
            userRow.role = userRole;
            await supabase.from('profiles').update({ role: userRole }).eq('id', userRow.id);
          }
        }

        // Create vehicle
        const vehicleRow = {
          id: uuidv4(),
          user_id: userRow.id,
          plate_number: plateNumber || '',
          package_id: 'standard',
          created_at: new Date().toISOString(),
        };
        const { error: vehErr } = await supabase.from('vehicles').upsert([vehicleRow]);
        if (vehErr) {
          console.error('Vehicle upsert error:', vehErr);
        }

        // Upsert QR as active
        const updatedQR = {
          id: targetQRId,
          qr_code_id: qrCodeId,
          status: 'active',
          user_id: userRow.id,
          vehicle_id: vehicleRow.id,
          activated_at: new Date().toISOString(),
          created_at: qrRow?.created_at || new Date().toISOString(),
          scan_count: (qrRow?.scan_count || 0),
        };
        const { error: qrErr } = await supabase.from('qrs').upsert([updatedQR]);
        if (qrErr) {
          console.error('QR upsert error:', qrErr);
          return NextResponse.json({ success: false, error: 'QR güncelleme hatası: ' + qrErr.message }, { status: 400 });
        }

        return NextResponse.json({
          success: true,
          user: userRow,
          vehicle: vehicleRow,
          qr: updatedQR,
        });
      }

      case 'CREATE_USER': {
        const { fullName, phone, password, role } = payload || {};

        let userRole: 'user' | 'admin' = 'user';
        if (role && typeof role === 'string') {
          const lower = role.toLowerCase().trim();
          if (lower === 'admin') userRole = 'admin';
        }

        const newUser = {
          id: uuidv4(),
          full_name: fullName || '',
          phone: phone || '',
          password_hash: password || '',
          role: userRole,
          created_at: new Date().toISOString(),
        };

        const { data, error } = await supabase.from('profiles').upsert([newUser]).select();
        if (error) {
          console.error('CREATE_USER profile error:', error);
          return NextResponse.json({ success: false, error: error.message }, { status: 400 });
        }
        return NextResponse.json({ success: true, user: data?.[0] || newUser });
      }

      case 'UPDATE_PROFILE': {
        const { userId, fullName, showNameOnQR } = payload;
        const updateData: Record<string, any> = {};
        if (fullName !== undefined) updateData.full_name = fullName;

        const { error } = await supabase.from('profiles').update(updateData).eq('id', userId);
        return NextResponse.json({ success: !error, error: error?.message });
      }

      case 'UPDATE_PASSWORD': {
        const { userId, newPassword } = payload;
        const { error } = await supabase.from('profiles').update({ password_hash: newPassword }).eq('id', userId);
        return NextResponse.json({ success: !error, error: error?.message });
      }

      case 'GENERATE_BULK_QRS': {
        const { qrs } = payload;
        const rows = qrs.map((q: any) => ({
          id: uuidv4(),
          qr_code_id: q.qrCodeId,
          status: 'unassigned',
          user_id: null,
          vehicle_id: null,
          scan_count: 0,
          sticker_printed: false,
          created_at: new Date().toISOString(),
        }));

        const { error } = await supabase.from('qrs').upsert(rows);
        return NextResponse.json({ success: !error, rows, error: error?.message });
      }

      case 'UPDATE_STICKER_PRINTED': {
        const { qrCodeId, stickerPrinted } = payload || {};
        if (!qrCodeId) {
          return NextResponse.json({ success: false, error: 'qrCodeId is required' }, { status: 400 });
        }
        const { error } = await supabase
          .from('qrs')
          .update({ sticker_printed: stickerPrinted })
          .or(`qr_code_id.eq.${qrCodeId},id.eq.${qrCodeId}`);
        if (error) {
          console.error('UPDATE_STICKER_PRINTED error:', error);
          return NextResponse.json({ success: false, error: error.message }, { status: 400 });
        }
        return NextResponse.json({ success: true });
      }

      case 'DELETE_QR': {
        const { qrCodeId } = payload || {};
        if (!qrCodeId) {
          return NextResponse.json({ success: false, error: 'qrCodeId is required' }, { status: 400 });
        }
        console.log(`[DEBUG] DELETE_QR - qrCodeId: ${qrCodeId}`);
        const { error: err1 } = await supabase.from('qrs').delete().eq('qr_code_id', qrCodeId);
        if (/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(qrCodeId)) {
          await supabase.from('qrs').delete().eq('id', qrCodeId);
        }
        if (err1) {
          console.error('DELETE_QR error:', err1);
          return NextResponse.json({ success: false, error: err1.message }, { status: 400 });
        }
        return NextResponse.json({ success: true });
      }

      case 'DELETE_USER': {
        const { userId } = payload;
        await supabase.from('vehicles').delete().eq('user_id', userId);
        await supabase.from('qrs').update({ status: 'unassigned', user_id: null, vehicle_id: null }).eq('user_id', userId);
        const { error } = await supabase.from('profiles').delete().eq('id', userId);
        return NextResponse.json({ success: !error, error: error?.message });
      }

      case 'FETCH_ALL': {
        const [profilesRes, vehiclesRes, qrsRes, scansRes] = await Promise.all([
          supabase.from('profiles').select('*'),
          supabase.from('vehicles').select('*'),
          supabase.from('qrs').select('*'),
          supabase.from('scans').select('*'),
        ]);

        return NextResponse.json({
          success: true,
          profiles: profilesRes.data || [],
          vehicles: vehiclesRes.data || [],
          qrs: qrsRes.data || [],
          scans: scansRes.data || [],
        });
      }

      case 'LOG_SCAN': {
        const { qrCodeId, userAgent } = payload;
        await supabase.from('scans').insert([{
          id: uuidv4(),
          qr_code_id: qrCodeId,
          user_agent: userAgent || '',
          scanned_at: new Date().toISOString()
        }]);

        // Increment scan count in qrs
        const { data: currentQRs } = await supabase.from('qrs').select('scan_count').eq('qr_code_id', qrCodeId);
        if (currentQRs && currentQRs.length > 0) {
          const newCount = (currentQRs[0].scan_count || 0) + 1;
          await supabase.from('qrs').update({ scan_count: newCount }).eq('qr_code_id', qrCodeId);
        }

        return NextResponse.json({ success: true });
      }

      default:
        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

'use client';

import React, { useState, useEffect } from 'react';
import { Phone, ShieldCheck, Car, QrCode, ArrowLeft } from 'lucide-react';
import { APP_CONFIG } from '../../config/appConfig';
import { getRawTelUrl, formatCensoredName } from '../../utils/qrGenerator';
import { dbService } from '../../services/db';

interface QRPublicViewProps {
  qrCodeId: string;
  onNavigateHome: () => void;
}

export const QRPublicView: React.FC<QRPublicViewProps> = ({
  qrCodeId,
  onNavigateHome,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const details = mounted ? dbService.getQROwnerDetails(qrCodeId) : null;

  useEffect(() => {
    if (mounted && details && details.qr) {
      dbService.logScan(qrCodeId);
    }
  }, [mounted, qrCodeId]);

  if (!mounted || !details || !details.user || !details.vehicle) {
    return null; // Fallback or setup screen will be triggered
  }

  const { user, vehicle } = details;
  const rawTelUrl = getRawTelUrl(user.phone);

  const handleCallClick = () => {
    dbService.logScan(qrCodeId);
    window.location.href = rawTelUrl;
  };

  const censoredOwnerName = formatCensoredName(user.fullName);

  return (
    <div className="min-h-screen bg-[#F7F8FA] dark:bg-[#09090B] text-zinc-900 dark:text-zinc-100 flex flex-col items-center justify-between p-6 sm:p-10 relative transition-colors duration-200">
      
      {/* Top Header */}
      <div className="w-full max-w-md flex items-center justify-center z-10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center font-bold text-xs">
            <QrCode className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-sm tracking-wider text-zinc-950 dark:text-white">
            {APP_CONFIG.name}
          </span>
        </div>
      </div>

      {/* Main Public Call Card */}
      <div className="w-full max-w-md my-auto py-8 z-10">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-[28px] p-8 text-center space-y-7 shadow-sm">
          
          {/* Large Center Icon Badge */}
          <div className="mx-auto w-20 h-20 rounded-[22px] bg-[#F8F9FA] dark:bg-zinc-950/80 border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-center text-zinc-950 dark:text-white shadow-2xs relative">
            <Car className="w-10 h-10 text-zinc-900 dark:text-white" />
            <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Prominent Vehicle Plate Display */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">
              Plaka
            </span>
            <div className="inline-block px-7 py-3 rounded-2xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-black text-2xl sm:text-3xl tracking-widest uppercase shadow-xs font-mono border border-zinc-800 dark:border-zinc-200">
              {vehicle.plateNumber}
            </div>
          </div>

          {/* Heading & Subtitle */}
          <div className="space-y-2.5">
            {user.showNameOnQR !== false && censoredOwnerName && (
              <div className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Araç Sahibi: <span className="text-zinc-950 dark:text-white font-extrabold">{censoredOwnerName}</span>
              </div>
            )}
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 dark:text-white tracking-tight leading-snug">
              Araç sahibine ulaşmak mı istiyorsunuz?
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xs mx-auto font-medium">
              Aşağıdaki butona dokunarak araç sahibine telefon araması yapabilirsiniz.
            </p>
          </div>

          {/* Large Call Button */}
          <button
            onClick={handleCallClick}
            className="w-full py-4.5 rounded-2xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-black text-base hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all shadow-md flex items-center justify-center gap-3 active:scale-[0.98] cursor-pointer"
            id="btn-call-vehicle-owner"
          >
            <Phone className="w-5 h-5 stroke-[2.5]" />
            <span>Araç Sahibini Ara</span>
          </button>

          {/* Security Note */}
          <p className="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium pt-0.5">
            Tek tıkla doğrudan arama ekranınız açılır.
          </p>

        </div>
      </div>

      {/* Bottom Powered By Footer */}
      <div className="text-center text-xs text-zinc-400 dark:text-zinc-500 z-10 pb-2 font-semibold">
        Powered by <span className="text-zinc-950 dark:text-white">{APP_CONFIG.name}</span>
      </div>

    </div>
  );
};

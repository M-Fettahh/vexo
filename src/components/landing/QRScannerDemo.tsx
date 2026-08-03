'use client';

import React, { useState } from 'react';
import { X, QrCode, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

interface QRScannerDemoProps {
  isOpen: boolean;
  onClose: () => void;
  onScanQR: (qrCodeId: string) => void;
}

export const QRScannerDemo: React.FC<QRScannerDemoProps> = ({
  isOpen,
  onClose,
  onScanQR,
}) => {
  const [customInput, setCustomInput] = useState('');

  if (!isOpen) return null;

  const handleTestCode = (code: string) => {
    onScanQR(code.trim());
    onClose();
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInput.trim()) {
      handleTestCode(customInput);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[28px] max-w-lg w-full p-6 sm:p-8 text-zinc-900 dark:text-zinc-100 relative shadow-2xl space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
          id="btn-close-qr-demo-modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-bold border border-zinc-200 dark:border-zinc-700">
            <QrCode className="w-3.5 h-3.5" />
            <span>Canlı QR Tarama Simülatörü</span>
          </div>
          <h3 className="text-2xl font-black text-zinc-950 dark:text-white tracking-tight">
            QR Kod Okutma Testi
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
            Araç camındaki QR kodu akıllı telefonla okutulduğunda gerçekleşen deneyimi hemen test edebilirsiniz.
          </p>
        </div>

        {/* Quick Demo Options */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-zinc-950 dark:text-zinc-200 uppercase tracking-wider block">
            Hazır Test Senaryoları
          </label>

          {/* Test Option 1: Registered Active Vehicle */}
          <button
            onClick={() => handleTestCode('Q7XaP9LmR4Tk8WnB')}
            className="w-full p-4 rounded-2xl bg-[#F8F9FA] dark:bg-zinc-950/80 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-800 text-left transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-zinc-950 dark:text-white flex items-center gap-2">
                    <span>34 VEX 34 - Aktif Araç</span>
                    <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold px-2 py-0.5 rounded">Aktif</span>
                  </div>
                  <div className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono mt-0.5">
                    ID: Q7XaP9LmR4Tk8WnB (Arif Yıl.)
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors" />
            </div>
          </button>

          {/* Test Option 2: Unregistered New Sticker (Triggers Setup) */}
          <button
            onClick={() => handleTestCode('Q9ZbK4P1M7XwN3Rt')}
            className="w-full p-4 rounded-2xl bg-[#F8F9FA] dark:bg-zinc-950/80 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-800 text-left transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs border border-amber-200 dark:border-amber-800">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-zinc-950 dark:text-white flex items-center gap-2">
                    <span>İlk Kurulum Ekranı Testi</span>
                    <span className="text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold px-2 py-0.5 rounded">Sıfır Sticker</span>
                  </div>
                  <div className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono mt-0.5">
                    ID: Q9ZbK4P1M7XwN3Rt (Boş Sticker)
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors" />
            </div>
          </button>
        </div>

        {/* Custom Input Form */}
        <form onSubmit={handleCustomSubmit} className="pt-2 space-y-2">
          <label className="text-xs font-bold text-zinc-950 dark:text-zinc-200 uppercase tracking-wider block">
            Özel QR Kod ID Girin
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Örn: Q7XaP9LmR4Tk8WnB"
              className="flex-1 bg-[#F8F9FA] dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-950 dark:text-white focus:outline-none focus:border-zinc-950 dark:focus:border-white font-mono"
            />
            <button
              type="submit"
              className="px-5 py-3 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-bold text-xs hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors cursor-pointer"
            >
              Test Et
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

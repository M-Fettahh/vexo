'use client';

import React from 'react';
import { Check, ShieldCheck, ShoppingCart, Lock } from 'lucide-react';
import { APP_CONFIG } from '../../config/appConfig';
import { AppleCard } from '../layout/AppleCard';

interface PricingProps {
  onOpenOrder: () => void;
}

export const Pricing: React.FC<PricingProps> = ({ onOpenOrder }) => {
  const std = APP_CONFIG.packages.standard;

  return (
    <section id="pricing" className="py-24 bg-[#F7F8FA] dark:bg-[#09090B] border-t border-zinc-200/80 dark:border-zinc-800/80 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold tracking-widest text-zinc-400 uppercase">
            Paketler & Fiyatlandırma
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-950 dark:text-white tracking-tight">
            Şeffaf, Tek Seferlik Ödeme
          </h2>
          <p className="text-base text-zinc-600 dark:text-zinc-400 font-normal">
            Aylık veya yıllık abonelik ücreti yok. Her pakette 3 adet yüksek kaliteli QR sticker bulunur.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          
          {/* Standart Paket (ACTIVE PRIMARY) */}
          <AppleCard className="p-8 bg-white dark:bg-zinc-900 border-zinc-950 dark:border-white border-2 relative shadow-md flex flex-col justify-between h-full">
            
            {/* Badge */}
            <div className="absolute -top-3.5 right-6 px-3.5 py-1 rounded-full bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-bold text-xs uppercase tracking-wider shadow-sm">
              {std.badge}
            </div>

            <div>
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                <ShieldCheck className="w-4 h-4" />
                <span>3 Adet Sticker Dahil</span>
              </div>

              <h3 className="text-2xl font-bold text-zinc-950 dark:text-white">
                {std.name}
              </h3>

              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
                {std.description}
              </p>

              {/* Price Display */}
              <div className="my-6 flex items-baseline gap-2">
                <span className="text-5xl font-black text-zinc-950 dark:text-white tracking-tight">
                  {std.price}
                </span>
                <span className="text-lg font-bold text-zinc-600 dark:text-zinc-300">
                  {std.currency}
                </span>
                <span className="text-xs text-zinc-400 dark:text-zinc-500 ml-1">/ Tek seferlik</span>
              </div>

              {/* Features list */}
              <div className="space-y-3 pt-4 border-t border-zinc-100 dark:border-zinc-800 text-sm text-zinc-700 dark:text-zinc-300">
                {std.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200 dark:border-emerald-800">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-zinc-800 dark:text-zinc-200">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Button */}
            <div className="pt-8 mt-6 border-t border-zinc-100 dark:border-zinc-800">
              <button
                onClick={onOpenOrder}
                className="w-full py-4 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-bold text-sm hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                id="btn-pricing-order-standard"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Sipariş Ver (200 TL)</span>
              </button>
            </div>

          </AppleCard>

          {/* Gold & Premium Future Expansion Card */}
          <AppleCard className="p-8 bg-zinc-50/80 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 opacity-80 flex flex-col justify-between h-full">
            <div>
              <div className="inline-block px-3 py-1 rounded-md bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-wider mb-3">
                Gelecek Güncelleme
              </div>

              <h3 className="text-xl font-bold text-zinc-800 dark:text-zinc-200">
                Gold & Premium VIP
              </h3>

              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
                Lazer kesim metal plakalı QR stickerlar ve VIP asistansı çok yakında sunulacaktır.
              </p>

              <div className="my-6 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-zinc-400 dark:text-zinc-500">Yakında</span>
              </div>

              <div className="space-y-3 pt-4 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                <p>• Metal / Alüminyum QR Plaka opsiyonu</p>
                <p>• Çoklu Araç Tanımlama altyapısı</p>
                <p>• Özel VIP İletişim Asistanı</p>
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-200/80 dark:border-zinc-800">
              <div className="w-full py-3.5 rounded-xl bg-zinc-200/60 dark:bg-zinc-800/60 text-zinc-500 dark:text-zinc-400 font-bold text-xs text-center border border-zinc-300/60 dark:border-zinc-700/60 flex items-center justify-center gap-2">
                <Lock className="w-3.5 h-3.5" />
                <span>Şimdilik Sadece Standart Paket Aktif</span>
              </div>
            </div>
          </AppleCard>

        </div>

      </div>
    </section>
  );
};

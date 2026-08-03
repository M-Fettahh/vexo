'use client';

import React from 'react';
import { Layers, Smartphone, QrCode, PhoneCall } from 'lucide-react';
import { AppleCard } from '../layout/AppleCard';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      stepNumber: '01',
      title: 'Stickerı Yapıştır',
      description: 'Paketinizden çıkan 3 adet dayanıklı QR stickerı aracınızın camlarına yapıştırın.',
      icon: Layers,
    },
    {
      stepNumber: '02',
      title: 'Kurulumu Yap',
      description: 'QR kodu telefonunuzla okutun. Ad Soyad, Telefon, Plaka ve istediğiniz şifreyi tanımlayın.',
      icon: Smartphone,
    },
    {
      stepNumber: '03',
      title: 'QR Okutulsun',
      description: 'Size ulaşmak isteyen kişi kamerasını okutur. Ekstra uygulama yüklemesine gerek kalmaz.',
      icon: QrCode,
    },
    {
      stepNumber: '04',
      title: 'Anında Bağlantı Kurulsun',
      description: 'Arama butonuna basıldığı an numaranız doğrudan arama ekranında açılır.',
      icon: PhoneCall,
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-[#F7F8FA] dark:bg-[#09090B] border-t border-zinc-200/80 dark:border-zinc-800/80 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold tracking-widest text-zinc-400 uppercase">
            Nasıl Çalışır?
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-950 dark:text-white tracking-tight">
            4 Basit Adımda VEXO Sticker Kullanımı
          </h2>
          <p className="text-base text-zinc-600 dark:text-zinc-400 font-normal">
            Karmaşık üyelik formları yok. Mail veya adres zorunluluğu yok. Sadece plakanız ve telefonunuz yeterli.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s) => {
            const IconComponent = s.icon;
            return (
              <AppleCard
                key={s.stepNumber}
                hoverEffect
                className="p-6 sm:p-8 flex flex-col justify-between bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-950 dark:text-white flex items-center justify-center shadow-2xs">
                      <IconComponent className="w-6 h-6 stroke-[2]" />
                    </div>
                    <span className="text-2xl font-black text-zinc-300 dark:text-zinc-700 font-mono">
                      {s.stepNumber}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-zinc-950 dark:text-white mb-2">
                    {s.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
                    {s.description}
                  </p>
                </div>
              </AppleCard>
            );
          })}
        </div>

      </div>
    </section>
  );
};

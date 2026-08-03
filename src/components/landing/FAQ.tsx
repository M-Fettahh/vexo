'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { AppleCard } from '../layout/AppleCard';
import { APP_CONFIG } from '../../config/appConfig';

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Telefon numaram internette veya sitede doğrudan yayınlanıyor mu?',
      a: 'Hayır. QR kodunuz okutulduğunda arayan kişinin ekranında numaranız metin olarak açıkça gösterilmez. "Araç Sahibini Ara" butonuna tıklandığında numaranız doğrudan telefonun varsayılan arama uygulamasına iletilir.',
    },
    {
      q: 'Neden tek pakette 3 adet QR Sticker geliyor?',
      a: '3 sticker da tamamen AYNI QR koda tanımlıdır. Aracınızın ön camına, arka camına ve yan camına yapıştırarak her açıdan taranabilmesini sağlarsınız.',
    },
    {
      q: 'Kurulum sırasında hangi bilgileri girmem gerekiyor?',
      a: 'Sadece Ad Soyad, Telefon Numarası, Belirleyeceğiniz Şifre ve Araç Plakanız istenmektedir. Mail adresi veya açık adres talep edilmemektedir.',
    },
    {
      q: 'Aylık veya yıllık bir kullanım ücreti var mıdır?',
      a: `${APP_CONFIG.name} Standart Paket tek seferlik 200 TL ödeme ile satın alınır. Herhangi bir abonelik veya yenileme ücreti yoktur.`,
    },
    {
      q: 'Telefon numaramı veya bilgilerimi değiştirebilir miyim?',
      a: 'Evet! İstediğiniz zaman Telefon ve Şifreniz ile Kullanıcı Paneline giriş yaparak bilgilerinizi güncelleyebilirsiniz.',
    },
    {
      q: 'Sticker suya veya oto yıkamaya dayanıklı mıdır?',
      a: 'Evet, özel koruyucu lamine kaplama sayesinde yüksek basınçlı oto yıkama, yağmur, kar ve yoğun güneş ışığına karşı %100 dayanıklıdır.',
    },
  ];

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-24 bg-[#F7F8FA] dark:bg-[#09090B] border-t border-zinc-200/80 dark:border-zinc-800/80 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-zinc-900 text-xs font-bold text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 shadow-2xs">
            <HelpCircle className="w-3.5 h-3.5 text-zinc-900 dark:text-amber-400" />
            <span>Merak Edilenler</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-950 dark:text-white tracking-tight">
            Sık Sorulan Sorular
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 font-normal">
            {APP_CONFIG.name} akıllı QR sticker sistemi hakkında tüm merak ettikleriniz.
          </p>
        </div>

        {/* Accordion list */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <AppleCard
                key={idx}
                onClick={() => toggleAccordion(idx)}
                className="p-6 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 cursor-pointer hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-sm sm:text-base font-bold text-zinc-950 dark:text-white">
                    {faq.q}
                  </h3>
                  <div className={`p-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>

                {isOpen && (
                  <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal animate-fadeIn">
                    {faq.a}
                  </div>
                )}
              </AppleCard>
            );
          })}
        </div>

      </div>
    </section>
  );
};

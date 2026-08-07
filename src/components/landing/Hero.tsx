'use client';

import React from 'react';
import { ArrowRight, QrCode, CheckCircle2, PhoneCall, Sparkles } from 'lucide-react';
import { AppleCard } from '../layout/AppleCard';

interface HeroProps {
  onOpenOrder: () => void;
  onOpenQRTest: () => void;
  onHowItWorksClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenOrder,
  onOpenQRTest,
  onHowItWorksClick,
}) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-24 lg:pb-32 bg-[#F7F8FA] dark:bg-[#09090B] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Copywriting & CTAs */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-800 dark:text-zinc-200 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-zinc-900 dark:text-amber-400" />
              <span>Yeni Nesil Akıllı Araç QR İletişim Sistemi</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-zinc-950 dark:text-white leading-[1.08]">
              Tek Taramayla <br className="hidden sm:block" />
              <span className="text-zinc-600 dark:text-zinc-400 font-extrabold">
                Araç Sahibine Ulaşım
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl font-normal leading-relaxed mx-auto lg:mx-0">
              QR Stickerınızı aracınıza yapıştırın. Size ulaşmak isteyen kişi tek dokunuşla sizi arasın.
            </p>

            {/* Key Value Points */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 font-semibold">
              <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 px-3.5 py-1.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>3 Adet QR Sticker (Tek Paket)</span>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 px-3.5 py-1.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Anında Arama Bağlantısı</span>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 px-3.5 py-1.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Suya & Güneşe Dayanıklı</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onOpenOrder}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-bold text-base hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-3 cursor-pointer"
                id="btn-hero-order"
              >
                <span>Satın Al (200 TL)</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={onHowItWorksClick}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white font-bold text-base hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all border border-zinc-200 dark:border-zinc-800 flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                id="btn-hero-how-it-works"
              >
                <span>Nasıl Çalışır?</span>
              </button>
            </div>

            {/* Quick QR Test Demo */}
            <div className="pt-2 flex items-center justify-center lg:justify-start">
              <button
                onClick={onOpenQRTest}
                className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors underline underline-offset-4 cursor-pointer"
                id="btn-hero-quick-demo"
              >
                <QrCode className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Örnek QR kodu hemen tara ve test et</span>
              </button>
            </div>

          </div>

          {/* Right Column: Apple / Tesla Style Clean Mockup */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md">
              
              <AppleCard className="p-6 sm:p-8 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-xl relative overflow-hidden group">
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center font-bold text-xs">
                      <QrCode className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-sm tracking-wide text-zinc-900 dark:text-white">
                      VEXO STICKER
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-[11px] font-bold border border-zinc-200 dark:border-zinc-700">
                    ÖN & ARKA CAM
                  </span>
                </div>

                {/* Inner Mockup */}
                <div className="bg-[#F8F9FA] dark:bg-zinc-950/80 rounded-2xl p-6 border border-zinc-200/80 dark:border-zinc-800 text-center space-y-5">
                  
                  {/* Plate Badge */}
                  <div className="inline-flex items-center justify-center px-6 py-1.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-950 dark:text-white font-black text-sm tracking-widest uppercase shadow-xs">
                    34 VEX 34
                  </div>

                  {/* QR Image Mockup */}
                  <div className="relative mx-auto w-36 h-36 bg-white p-3 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-700 flex items-center justify-center">
                    <img
                      src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://vexosticker.vercel.app/q/rKc834QlGkA9hzJb&color=09090b&bgcolor=ffffff"
                      alt="VEXO Sticker QR"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Instruction text */}
                  <div>
                    <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 tracking-wide uppercase">
                      Bu Araç Sahibine Ulaş
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                      Kameranızı doğrultun ve tek dokunuşla arayın.
                    </p>
                  </div>

                  {/* Test Action */}
                  <button
                    onClick={onOpenQRTest}
                    className="w-full py-3 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-bold text-xs hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Araç Sahibini Ara (Canlı Demo)</span>
                  </button>

                </div>

                {/* Card Footer */}
                <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                  <span>1 Paket = 3 Adet Sticker</span>
                  <span className="font-bold text-zinc-950 dark:text-white">200 TL</span>
                </div>

              </AppleCard>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

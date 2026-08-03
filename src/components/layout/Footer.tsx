'use client';

import React from 'react';
import { QrCode, Shield, MessageCircle, Instagram, ShoppingBag } from 'lucide-react';
import { APP_CONFIG } from '../../config/appConfig';

interface FooterProps {
  setActiveView: (view: string) => void;
  onOpenOrder: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveView, onOpenOrder }) => {
  return (
    <footer className="bg-white dark:bg-zinc-950 border-t border-zinc-200/80 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 py-16 px-4 sm:px-6 lg:px-8 mt-12 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Column 1: Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center font-black shadow-sm">
                <QrCode className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-zinc-950 dark:text-white">
                {APP_CONFIG.name}
              </span>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Araç camına yapıştırılan akıllı QR kod sticker sistemi. Tek dokunuşla ulaşılırsınız.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <a
                href={`https://wa.me/${APP_CONFIG.whatsappPhone}`}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 transition-colors"
                title="WhatsApp Destek"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href={`https://instagram.com/${APP_CONFIG.instagramHandle}`}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-pink-600 dark:hover:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-950/60 transition-colors"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={APP_CONFIG.trendyolUrl}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/60 transition-colors"
                title="Trendyol Mağazası"
              >
                <ShoppingBag className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-zinc-950 dark:text-white tracking-wider uppercase">
              Hızlı Erişim
            </h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <button
                  onClick={() => setActiveView('landing')}
                  className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer"
                >
                  Ana Sayfa
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveView('landing');
                    setTimeout(() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' }), 100);
                  }}
                  className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer"
                >
                  Nasıl Çalışır?
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveView('landing');
                    setTimeout(() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' }), 100);
                  }}
                  className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer"
                >
                  Paket Detayları
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveView('landing');
                    setTimeout(() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' }), 100);
                  }}
                  className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer"
                >
                  Sık Sorulan Sorular
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Portals */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-zinc-950 dark:text-white tracking-wider uppercase">
              Kullanıcı Portalları
            </h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <button
                  onClick={() => setActiveView('login')}
                  className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer"
                >
                  Kullanıcı Girişi
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenOrder}
                  className="text-zinc-950 dark:text-white font-bold hover:underline cursor-pointer"
                >
                  Sipariş Ver (200 TL)
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Specs */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-zinc-950 dark:text-white tracking-wider uppercase">
              Ürün Özellikleri
            </h4>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 space-y-2 leading-relaxed font-medium">
              <p>• 1 Pakette 3 adet yüksek kaliteli QR Sticker</p>
              <p>• Güneş, su ve yıkamaya dayanıklı özel kaplama</p>
              <p>• Uygulama indirmeden doğrudan tarama</p>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 gap-4">
          <p>© {new Date().getFullYear()} {APP_CONFIG.name}. Tüm hakları saklıdır.</p>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">Powered by {APP_CONFIG.name}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

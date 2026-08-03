'use client';

import React from 'react';
import { X, MessageCircle, ShoppingBag, Instagram, Phone, ShoppingCart, CheckCircle2 } from 'lucide-react';
import { APP_CONFIG } from '../../config/appConfig';

interface ContactDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactDrawer: React.FC<ContactDrawerProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[28px] max-w-lg w-full p-6 sm:p-8 text-zinc-900 dark:text-zinc-100 relative shadow-2xl space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
          id="btn-close-contact-modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Sipariş & İletişim Kanalları</span>
          </div>
          <h3 className="text-2xl font-black text-zinc-950 dark:text-white tracking-tight">
            {APP_CONFIG.name} Standart Paket (200 TL)
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
            Ürünlerimiz elden teslim veya online pazaryerleri üzerinden güvenle temin edilebilir. İstediğiniz kanaldan siparişinizi verebilirsiniz.
          </p>
        </div>

        {/* Package Highlights */}
        <div className="bg-zinc-50 dark:bg-zinc-950/60 p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 text-xs text-zinc-700 dark:text-zinc-300 font-semibold space-y-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>1 Paket = 3 Adet Özdeş QR Sticker</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Elden veya Kargo İle Hızlı Teslimat</span>
          </div>
        </div>

        {/* Contact Action Buttons */}
        <div className="space-y-3 pt-2">
          
          {/* WhatsApp Direct Order */}
          <a
            href={`https://wa.me/${APP_CONFIG.whatsappPhone}?text=${encodeURIComponent('Merhaba, VEXO 3 adetli QR Sticker paketinden sipariş vermek istiyorum.')}`}
            target="_blank"
            rel="noreferrer"
            className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all flex items-center justify-between shadow-xs"
          >
            <div className="flex items-center gap-3">
              <MessageCircle className="w-5 h-5" />
              <span>WhatsApp İle Hızlı Sipariş</span>
            </div>
            <span className="text-xs font-semibold bg-emerald-700 px-2.5 py-1 rounded-lg">Anında Yanıt</span>
          </a>

          {/* Trendyol */}
          <a
            href={APP_CONFIG.trendyolUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full py-3.5 px-4 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm transition-all flex items-center justify-between shadow-xs"
          >
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5" />
              <span>Trendyol Mağazasından Al</span>
            </div>
            <span className="text-xs font-semibold bg-orange-600 px-2.5 py-1 rounded-lg">Trendyol Güvencesi</span>
          </a>

          {/* Dolap */}
          <a
            href={APP_CONFIG.dolapUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full py-3.5 px-4 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm transition-all flex items-center justify-between shadow-xs"
          >
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5" />
              <span>Dolap Uygulamasından Satın Al</span>
            </div>
            <span className="text-xs font-semibold bg-purple-700 px-2.5 py-1 rounded-lg">Dolap Güvencesi</span>
          </a>

          {/* Instagram */}
          <a
            href={`https://instagram.com/${APP_CONFIG.instagramHandle}`}
            target="_blank"
            rel="noreferrer"
            className="w-full py-3.5 px-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-bold text-sm transition-all flex items-center gap-3 border border-zinc-200 dark:border-zinc-700"
          >
            <Instagram className="w-5 h-5 text-pink-600 dark:text-pink-400" />
            <span>Instagram DM (@{APP_CONFIG.instagramHandle})</span>
          </a>

          {/* Phone Call */}
          <a
            href={`tel:${APP_CONFIG.supportPhone}`}
            className="w-full py-3.5 px-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-bold text-sm transition-all flex items-center gap-3 border border-zinc-200 dark:border-zinc-700"
          >
            <Phone className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>Müşteri Hizmetlerini Ara ({APP_CONFIG.supportPhone})</span>
          </a>

        </div>

        {/* Footer info */}
        <p className="text-[11px] text-zinc-400 dark:text-zinc-500 text-center pt-2 font-medium">
          Powered by {APP_CONFIG.name} • Akıllı Araç İletişim Altyapısı
        </p>

      </div>
    </div>
  );
};

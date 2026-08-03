'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingBag, Banknote, QrCode, CheckCircle2, Users } from 'lucide-react';
import { AppleCard } from '../layout/AppleCard';
import { dbService } from '../../services/db';
import { APP_CONFIG } from '../../config/appConfig';

export const AdminMetrics: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const stats = mounted
    ? dbService.getAdminStats()
    : { totalSales: 0, totalRevenue: 0, totalQRs: 0, activeQRs: 0, unassignedQRs: 0, totalUsers: 0 };

  const cards = [
    {
      title: 'Toplam Satış',
      value: `${stats.totalSales} Adet`,
      desc: 'Aktifleştirilmiş paket',
      icon: ShoppingBag,
      highlight: false,
    },
    {
      title: 'Toplam Kazanç',
      value: `${stats.totalRevenue.toLocaleString('tr-TR')} TL`,
      desc: `Toplam Satış x ${APP_CONFIG.packages.standard.price} TL`,
      icon: Banknote,
      highlight: true,
    },
    {
      title: 'Toplam QR',
      value: `${stats.totalQRs} Adet`,
      desc: 'Sistemde oluşturulan ID',
      icon: QrCode,
      highlight: false,
    },
    {
      title: 'Aktif QR',
      value: `${stats.activeQRs} Adet`,
      desc: 'Bir araca bağlı QR',
      icon: CheckCircle2,
      highlight: false,
    },
    {
      title: 'Toplam Kullanıcı',
      value: `${stats.totalUsers} Kişi`,
      desc: 'Kayıtlı araç sahibi',
      icon: Users,
      highlight: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((c, idx) => {
        const Icon = c.icon;
        return (
          <AppleCard
            key={idx}
            className={`p-5 ${
              c.highlight
                ? 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 border-zinc-950 dark:border-white shadow-md'
                : 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border-zinc-200/80 dark:border-zinc-800 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className={`text-[11px] font-bold uppercase tracking-wider ${c.highlight ? 'text-zinc-400 dark:text-zinc-500' : 'text-zinc-400 dark:text-zinc-500'}`}>
                {c.title}
              </span>
              <div className={`p-2 rounded-xl ${c.highlight ? 'bg-zinc-800 dark:bg-zinc-100 text-white dark:text-zinc-950' : 'bg-[#F8F9FA] dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200'}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className={`text-2xl font-black tracking-tight font-mono ${c.highlight ? 'text-white dark:text-zinc-950' : 'text-zinc-950 dark:text-white'}`}>
              {c.value}
            </div>

            <p className={`text-[11px] mt-2 font-medium ${c.highlight ? 'text-zinc-400 dark:text-zinc-500' : 'text-zinc-400 dark:text-zinc-500'}`}>
              {c.desc}
            </p>
          </AppleCard>
        );
      })}
    </div>
  );
};

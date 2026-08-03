'use client';

import React, { useState, useEffect } from 'react';
import { Shield, LogOut, RefreshCw } from 'lucide-react';
import { APP_CONFIG } from '../../config/appConfig';
import { AdminMetrics } from './AdminMetrics';
import { AdminQRBatch } from './AdminQRBatch';
import { AdminTables } from './AdminTables';
import { dbService } from '../../services/db';

interface AdminDashboardProps {
  onLogout: () => void;
  onScanQR: (qrCodeId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onLogout,
  onScanQR,
}) => {
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    dbService.syncFromSupabase();
  }, [refreshKey]);

  const handleQRsUpdated = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] dark:bg-[#09090B] text-zinc-900 dark:text-zinc-100 py-10 px-4 sm:px-6 lg:px-8 space-y-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-[28px] p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center font-black text-xl shadow-md">
              <Shield className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xs font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase block">
                Sistem Yönetimi
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 dark:text-white tracking-tight">
                {APP_CONFIG.name} Admin Paneli
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setRefreshKey((prev) => prev + 1)}
              className="p-3 rounded-2xl bg-[#F8F9FA] dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer"
              title="Yenile"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={onLogout}
              className="px-4 py-3 rounded-2xl bg-red-50 dark:bg-red-950/60 hover:bg-red-100 dark:hover:bg-red-900/60 border border-red-200 dark:border-red-800 text-xs font-bold text-red-600 dark:text-red-400 transition-colors flex items-center gap-2 cursor-pointer"
              id="btn-admin-logout"
            >
              <LogOut className="w-4 h-4" />
              <span>Çıkış Yap</span>
            </button>
          </div>
        </div>

        {/* 1. Metrics Overview */}
        <AdminMetrics key={`metrics-${refreshKey}`} />

        {/* 2. Cryptographic QR Generator & PDF Exporter */}
        <AdminQRBatch onQRsUpdated={handleQRsUpdated} />

        {/* 3. Detailed QR Codes & Users Tables */}
        <AdminTables onScanQR={onScanQR} refreshKey={refreshKey} />

      </div>
    </div>
  );
};

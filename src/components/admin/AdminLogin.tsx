'use client';

import React, { useState } from 'react';
import { Shield, Lock, ArrowLeft, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { APP_CONFIG } from '../../config/appConfig';
import { dbService } from '../../services/db';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onNavigateHome: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onLoginSuccess,
  onNavigateHome,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Accept specified admin password or admin123 for backward compatibility
    if (password === 'fettahyusuf1212!' || password === 'admin123' || password === 'admin') {
      dbService.setCurrentUser({
        id: 'u-admin',
        fullName: 'VEXO Yönetici',
        phone: '05000000000',
        role: 'admin',
        createdAt: new Date().toISOString(),
      });
      onLoginSuccess();
    } else {
      setError('Yönetici şifresi hatalı.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] dark:bg-[#09090B] text-zinc-900 dark:text-zinc-100 flex flex-col items-center justify-center p-4 relative transition-colors duration-200">
      
      {/* Back button */}
      <div className="absolute top-6 left-6">
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors bg-white dark:bg-zinc-900 px-3.5 py-2 rounded-xl border border-zinc-200/80 dark:border-zinc-800 shadow-2xs cursor-pointer"
          id="btn-admin-login-back"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Ana Sayfa</span>
        </button>
      </div>

      <div className="w-full max-w-sm bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-[28px] p-8 space-y-6 shadow-sm relative">
        
        <div className="flex flex-col items-center justify-center text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center shadow-md">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-zinc-950 dark:text-white tracking-tight">
              {APP_CONFIG.name} Admin
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              Yönetici Girişi
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 text-xs font-semibold flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider block">
              Yönetici Şifresi
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-400 dark:text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-[#F8F9FA] dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl pl-11 pr-11 py-3 text-sm text-zinc-950 dark:text-white focus:outline-none focus:border-zinc-950 dark:focus:border-white font-medium transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors p-1"
                title={showPassword ? 'Şifreyi Gizle' : 'Şifreyi Göster'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-bold text-sm hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all shadow-xs mt-2 cursor-pointer"
            id="btn-admin-login-submit"
          >
            Yönetici Girişi Yap
          </button>
        </form>

      </div>
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import { User, Phone, Lock, Car, Sparkles, AlertCircle, ArrowLeft, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { dbService } from '../../services/db';
import { validateTurkishPlate, validatePhone10, validateFullName } from '../../utils/qrGenerator';

interface QRSetupViewProps {
  qrCodeId: string;
  onSetupSuccess: () => void;
  onNavigateHome: () => void;
}

export const QRSetupView: React.FC<QRSetupViewProps> = ({
  qrCodeId,
  onSetupSuccess,
  onNavigateHome,
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [plateNumber, setPlateNumber] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateFullName(fullName)) {
      setError('Lütfen geçerli bir Ad ve Soyad girin (En az 2 kelime).');
      return;
    }

    if (!validatePhone10(phone)) {
      setError('Lütfen 10 haneli geçerli bir cep telefonu numarası girin (Örn: 5320000000).');
      return;
    }

    if (!password.trim() || password.length < 4) {
      setError('Şifre en az 4 karakterden oluşmalıdır.');
      return;
    }

    if (!validateTurkishPlate(plateNumber)) {
      setError('Lütfen geçerli bir Türkiye araç plakası girin (Örn: 34 VEX 34).');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const res = dbService.registerQRCode({
        qrCodeId,
        fullName: fullName.trim(),
        phone: phone.trim(),
        password,
        plateNumber: plateNumber.trim(),
      });

      setLoading(false);

      if (res.success) {
        onSetupSuccess();
      } else {
        setError(res.error || 'Kurulum yapılamadı.');
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] dark:bg-[#09090B] text-zinc-900 dark:text-zinc-100 flex flex-col items-center justify-center p-4 sm:p-6 relative transition-colors duration-200">
      
      {/* Back button */}
      <div className="absolute top-6 left-6">
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors bg-white dark:bg-zinc-900 px-3.5 py-2 rounded-xl border border-zinc-200/80 dark:border-zinc-800 shadow-2xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Ana Sayfa</span>
        </button>
      </div>

      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-[28px] p-6 sm:p-8 space-y-6 shadow-sm relative my-8">
        
        {/* Step progress header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-bold border border-zinc-200 dark:border-zinc-700">
              <Sparkles className="w-3.5 h-3.5" />
              <span>İlk Kurulum</span>
            </div>
            <span className="text-xs font-bold font-mono text-zinc-400 dark:text-zinc-500">
              KOD: {qrCodeId}
            </span>
          </div>

          <div>
            <h1 className="text-2xl font-black text-zinc-950 dark:text-white tracking-tight">
              Aktivasyon & Kurulum
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium mt-1">
              QR stickerınızı aracınız için aktif etmek üzere bilgilerinizi girin.
            </p>
          </div>

          {/* Progress bar visual indicator */}
          <div className="flex items-center gap-2 pt-1">
            <div className="flex-1 h-1.5 rounded-full bg-zinc-950 dark:bg-white" />
            <div className="flex-1 h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800" />
            <div className="flex-1 h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800" />
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-semibold flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Setup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Ad Soyad */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider block">
              Ad Soyad
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-zinc-400 dark:text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Adınız Soyadınız"
                required
                className="w-full bg-[#F8F9FA] dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-zinc-950 dark:text-white focus:outline-none focus:border-zinc-950 dark:focus:border-white font-medium transition-colors"
              />
            </div>
          </div>

          {/* Telefon */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider block">
              Telefon Numarası
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-zinc-400 dark:text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="5XX XXX XX XX"
                required
                className="w-full bg-[#F8F9FA] dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-zinc-950 dark:text-white focus:outline-none focus:border-zinc-950 dark:focus:border-white font-medium transition-colors"
              />
            </div>
          </div>

          {/* Şifre */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider block">
              Giriş Şifreniz
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-400 dark:text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-[#F8F9FA] dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl pl-11 pr-11 py-3.5 text-sm text-zinc-950 dark:text-white focus:outline-none focus:border-zinc-950 dark:focus:border-white font-medium transition-colors"
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

          {/* Plaka */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider block">
              Araç Plakası
            </label>
            <div className="relative">
              <Car className="w-4 h-4 text-zinc-400 dark:text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={plateNumber}
                onChange={(e) => setPlateNumber(e.target.value)}
                placeholder="34 ABC 123"
                required
                className="w-full bg-[#F8F9FA] dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-zinc-950 dark:text-white focus:outline-none focus:border-zinc-950 dark:focus:border-white font-black tracking-widest uppercase transition-colors"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-bold text-sm hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all shadow-xs mt-4 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            id="btn-qr-setup-submit"
          >
            {loading ? (
              <span>Kaydediliyor...</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Kurulumu Tamamla ve Aktif Et</span>
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};

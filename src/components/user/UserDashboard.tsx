'use client';

import React, { useState, useEffect } from 'react';
import { Eye, Download, User, Lock, LogOut, X, ExternalLink, Car } from 'lucide-react';
import { AppleCard } from '../layout/AppleCard';
import { dbService } from '../../services/db';
import { downloadQRStickerPNG } from '../../utils/qrStickerDownload';

interface UserDashboardProps {
  onLogout: () => void;
  onOpenQRTest: () => void;
  onScanQR: (qrCodeId: string) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  onLogout,
  onScanQR,
}) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const currentUser = mounted ? dbService.getCurrentUser() : null;

  // Modals state
  const [viewQRModalOpen, setViewQRModalOpen] = useState(false);
  const [editNameModalOpen, setEditNameModalOpen] = useState(false);
  const [editPasswordModalOpen, setEditPasswordModalOpen] = useState(false);

  // Form states
  const [newFullName, setNewFullName] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (currentUser) {
      setNewFullName(currentUser.fullName);
    }
  }, [currentUser]);

  if (!currentUser) return null;

  const { user, vehicles, qrs } = dbService.getUserDashboardData(currentUser.id);

  const primaryVehicle = vehicles[0];
  const primaryQR = qrs[0];

  const handleNameUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFullName.trim()) {
      dbService.updateUserProfile(currentUser.id, newFullName.trim());
      setStatusMsg({ type: 'success', text: 'İsminiz başarıyla güncellendi.' });
      setEditNameModalOpen(false);
    }
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);
    if (oldPassword && newPassword) {
      const res = dbService.updateUserPassword(currentUser.id, oldPassword, newPassword);
      if (res.success) {
        setStatusMsg({ type: 'success', text: 'Şifreniz başarıyla değiştirildi.' });
        setEditPasswordModalOpen(false);
        setOldPassword('');
        setNewPassword('');
      } else {
        setStatusMsg({ type: 'error', text: res.error || 'Şifre güncellenemedi.' });
      }
    }
  };

  const handleDownloadQR = () => {
    if (!primaryQR) return;
    downloadQRStickerPNG(primaryQR.qrCodeId);
  };

  const firstName = (user?.fullName || currentUser.fullName).split(' ')[0];

  return (
    <div className="min-h-screen bg-[#F7F8FA] dark:bg-[#09090B] text-zinc-900 dark:text-zinc-100 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-xl mx-auto space-y-8">
        
        {/* Status Notification */}
        {statusMsg && (
          <div className={`p-4 rounded-2xl text-xs font-semibold flex items-center justify-between animate-fadeIn ${
            statusMsg.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300' : 'bg-red-50 dark:bg-red-950/80 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'
          }`}>
            <span>{statusMsg.text}</span>
            <button onClick={() => setStatusMsg(null)} className="p-1 hover:opacity-80 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Minimal Greeting Header */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-zinc-950 dark:text-white tracking-tight">
            Merhaba {firstName} 👋
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium mt-1">
            Araç ve QR kod durumunuzu buradan yönetebilirsiniz.
          </p>
        </div>

        {/* Araç Kartı (Vehicle Card) */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
            Araç Kartı
          </h2>

          <AppleCard className="p-6 sm:p-8 bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 space-y-6 shadow-sm">
            
            {primaryVehicle ? (
              <>
                {/* Plate & Status Row */}
                <div className="flex items-center justify-between pb-6 border-b border-zinc-100 dark:border-zinc-800">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase block">
                      Araç Plakası
                    </span>
                    <div className="text-2xl font-black text-zinc-950 dark:text-white tracking-widest font-mono">
                      {primaryVehicle.plateNumber}
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <span className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase block">
                      QR Durumu
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Aktif</span>
                    </span>
                  </div>
                </div>

                {/* Scan Count stat */}
                {primaryQR && (
                  <div className="flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-300 bg-[#F8F9FA] dark:bg-zinc-950/80 p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800">
                    <span className="font-semibold">Toplam Okutulma Sayısı:</span>
                    <span className="font-black text-zinc-950 dark:text-white font-mono text-sm">{primaryQR.scanCount || 0} Kez</span>
                  </div>
                )}

                {/* Action Buttons: QR Görüntüle & QR İndir */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => setViewQRModalOpen(true)}
                    className="py-3.5 px-4 rounded-2xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-bold text-xs hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                    id="btn-user-view-qr"
                  >
                    <Eye className="w-4 h-4" />
                    <span>QR Görüntüle</span>
                  </button>

                  <button
                    onClick={handleDownloadQR}
                    className="py-3.5 px-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold text-xs hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all flex items-center justify-center gap-2 border border-zinc-200 dark:border-zinc-700 cursor-pointer"
                    id="btn-user-download-qr"
                  >
                    <Download className="w-4 h-4" />
                    <span>QR İndir</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-6 space-y-3 text-zinc-400">
                <Car className="w-10 h-10 mx-auto text-zinc-300 dark:text-zinc-700" />
                <p className="text-xs font-medium">Henüz kayıtlı bir aracınız bulunmuyor.</p>
              </div>
            )}

          </AppleCard>
        </div>

        {/* Profil Bölümü */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
            Profil
          </h2>

          <AppleCard className="p-4 bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 space-y-2 shadow-sm">
            
            {/* İsmini Değiştir */}
            <button
              onClick={() => setEditNameModalOpen(true)}
              className="w-full p-4 rounded-2xl bg-[#F8F9FA] dark:bg-zinc-950/80 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between text-left transition-all text-xs font-bold text-zinc-800 dark:text-zinc-200 cursor-pointer"
              id="btn-user-edit-name"
            >
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                <span>Adını değiştir</span>
              </div>
              <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500">{user?.fullName || currentUser.fullName}</span>
            </button>

            {/* İsim Gözüksün Toggle */}
            <div className="w-full p-4 rounded-2xl bg-[#F8F9FA] dark:bg-zinc-950/80 border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between text-left text-xs font-bold text-zinc-800 dark:text-zinc-200">
              <div className="flex items-center gap-3">
                <Eye className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                <div>
                  <span>İsmim QR sayfasında gösterilsin</span>
                  <span className="block text-[10px] font-normal text-zinc-400 dark:text-zinc-500 pt-0.5">
                    Açık: Sansürlü gösterim (örn: Arif Y***) | Kapalı: Tamamen gizli
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  const currentVal = user?.showNameOnQR ?? true;
                  const newVal = !currentVal;
                  dbService.updateUserProfile(currentUser.id, user?.fullName || currentUser.fullName, newVal);
                  setStatusMsg({
                    type: 'success',
                    text: newVal ? 'QR sayfasında adınız sansürlü olarak gösterilecek.' : 'QR sayfasında adınız gizlendi.',
                  });
                }}
                className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ease-in-out shrink-0 ${
                  (user?.showNameOnQR ?? true) ? 'bg-zinc-950 dark:bg-white justify-end' : 'bg-zinc-300 dark:bg-zinc-700 justify-start'
                }`}
                id="btn-user-toggle-show-name"
                title={(user?.showNameOnQR ?? true) ? 'İsim Görünür (Kapatsanız gizlenir)' : 'İsim Gizli (Açarsanız görünür)'}
              >
                <span
                  className={`w-4 h-4 rounded-full transition-all ${
                    (user?.showNameOnQR ?? true) ? 'bg-white dark:bg-zinc-950' : 'bg-white dark:bg-zinc-400'
                  }`}
                />
              </button>
            </div>

            {/* Şifre Değiştir */}
            <button
              onClick={() => setEditPasswordModalOpen(true)}
              className="w-full p-4 rounded-2xl bg-[#F8F9FA] dark:bg-zinc-950/80 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between text-left transition-all text-xs font-bold text-zinc-800 dark:text-zinc-200 cursor-pointer"
              id="btn-user-edit-password"
            >
              <div className="flex items-center gap-3">
                <Lock className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                <span>Şifre değiştir</span>
              </div>
              <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500">••••••••</span>
            </button>

            {/* Çıkış Yap */}
            <button
              onClick={onLogout}
              className="w-full p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 hover:bg-red-100/80 dark:hover:bg-red-900/60 border border-red-200/80 dark:border-red-800/80 flex items-center justify-between text-left transition-all text-xs font-bold text-red-600 dark:text-red-400 cursor-pointer"
              id="btn-user-logout-bottom"
            >
              <div className="flex items-center gap-3">
                <LogOut className="w-4 h-4" />
                <span>Çıkış Yap</span>
              </div>
            </button>

          </AppleCard>
        </div>

      </div>

      {/* QR VIEW MODAL */}
      {viewQRModalOpen && primaryQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[28px] max-w-sm w-full p-6 text-zinc-900 dark:text-zinc-100 relative shadow-2xl text-center space-y-6">
            <button
              onClick={() => setViewQRModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1 pt-2">
              <h3 className="text-xl font-bold text-zinc-950 dark:text-white">QR Kodu Görüntüle</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{primaryVehicle?.plateNumber} aracınıza ait özel QR kod.</p>
            </div>

            <div className="bg-white p-4 rounded-2xl inline-block border border-zinc-200 dark:border-zinc-700 shadow-xs">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(window.location.origin + '/q/' + primaryQR.qrCodeId)}&color=09090b&bgcolor=ffffff`}
                alt="VEXO QR Code"
                className="w-48 h-48 mx-auto object-contain"
              />
            </div>

            <div className="text-xs font-mono text-zinc-600 dark:text-zinc-300 bg-[#F8F9FA] dark:bg-zinc-950/80 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800">
              ID: {primaryQR.qrCodeId}
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  setViewQRModalOpen(false);
                  onScanQR(primaryQR.qrCodeId);
                }}
                className="w-full py-3.5 rounded-2xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-bold text-xs hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Sayfayı Önizle</span>
              </button>

              <button
                onClick={handleDownloadQR}
                className="w-full py-3.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold text-xs hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
              >
                Görseli İndir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT NAME MODAL */}
      {editNameModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[28px] max-w-sm w-full p-6 text-zinc-900 dark:text-zinc-100 relative shadow-2xl space-y-4">
            <button
              onClick={() => setEditNameModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-zinc-950 dark:text-white">Adını değiştir</h3>

            <form onSubmit={handleNameUpdate} className="space-y-4">
              <input
                type="text"
                value={newFullName}
                onChange={(e) => setNewFullName(e.target.value)}
                required
                className="w-full bg-[#F8F9FA] dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-950 dark:text-white focus:outline-none focus:border-zinc-950 dark:focus:border-white font-medium"
              />
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-bold text-xs hover:bg-zinc-800 dark:hover:bg-zinc-100 cursor-pointer transition-colors"
              >
                Kaydet
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PASSWORD MODAL */}
      {editPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[28px] max-w-sm w-full p-6 text-zinc-900 dark:text-zinc-100 relative shadow-2xl space-y-4">
            <button
              onClick={() => setEditPasswordModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-zinc-950 dark:text-white">Şifre değiştir</h3>

            <form onSubmit={handlePasswordUpdate} className="space-y-3">
              <input
                type="password"
                placeholder="Mevcut Şifre"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
                className="w-full bg-[#F8F9FA] dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-950 dark:text-white focus:outline-none focus:border-zinc-950 dark:focus:border-white font-medium"
              />
              <input
                type="password"
                placeholder="Yeni Şifre"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full bg-[#F8F9FA] dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-950 dark:text-white focus:outline-none focus:border-zinc-950 dark:focus:border-white font-medium"
              />
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-bold text-xs hover:bg-zinc-800 dark:hover:bg-zinc-100 cursor-pointer transition-colors"
              >
                Şifreyi Güncelle
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

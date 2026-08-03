'use client';

import React, { useState, useEffect } from 'react';
import { Search, ExternalLink, Printer, QrCode, CheckCircle2, ShieldAlert, Trash2, X, AlertTriangle, Download } from 'lucide-react';
import { AppleCard } from '../layout/AppleCard';
import { dbService } from '../../services/db';
import { downloadQRStickerPNG } from '../../utils/qrStickerDownload';
import { QRCodeItem } from '../../types';

interface AdminTablesProps {
  onScanQR: (qrCodeId: string) => void;
  refreshKey: number;
}

export const AdminTables: React.FC<AdminTablesProps> = ({ onScanQR, refreshKey }) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterSticker, setFilterSticker] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isDownloadLoading, setIsDownloadLoading] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  // Delete modal state
  const [deleteModalQR, setDeleteModalQR] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    dbService.syncFromSupabase().then(() => setTableRefresh((r) => r + 1));
  }, [refreshKey]);

  const [tableRefresh, setTableRefresh] = useState(0);

  const allQRs: QRCodeItem[] = mounted ? dbService.getAllQRs() : [];
  const userList = mounted ? dbService.getAllUsersWithVehicles() : [];

  // Helper mapping for active QR owners and vehicles
  const qrOwnerMap = new Map<string, { user?: any; vehicle?: any }>();
  userList.forEach(({ user, vehicle, qr }) => {
    if (qr) {
      qrOwnerMap.set(qr.qrCodeId, { user, vehicle });
    }
  });

  // Filter QRs
  const filteredQRs = allQRs.filter((q) => {
    const matchesStatus = filterStatus === 'all' || q.status === filterStatus;
    const matchesSticker =
      filterSticker === 'all' ||
      (filterSticker === 'printed' && q.stickerPrinted) ||
      (filterSticker === 'unprinted' && !q.stickerPrinted);

    const ownerData = qrOwnerMap.get(q.qrCodeId);
    const ownerSearch = ownerData?.user?.fullName || ownerData?.user?.phone || ownerData?.vehicle?.plateNumber || '';

    const matchesSearch =
      q.qrCodeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ownerSearch.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSticker && matchesSearch;
  });

  // Requirement 8: Batch download all unassigned QRs as high-res 1024x1024 PNG files
  const handleDownloadAllUnassigned = async () => {
    const unassignedQRs = allQRs.filter((q) => q.status === 'unassigned');
    if (unassignedQRs.length === 0) {
      alert('İndirilecek henüz tanımlanmamış (unassigned) QR kod bulunmuyor.');
      return;
    }
    setIsDownloadLoading(true);
    try {
      for (const q of unassignedQRs) {
        await downloadQRStickerPNG(q.qrCodeId, 'black');
        // Small delay between downloads so the browser can process each file download smoothly
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    } catch (err) {
      console.error('Batch QR download error:', err);
    } finally {
      setIsDownloadLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (deleteModalQR) {
      setIsDeleting(true);
      await dbService.deleteQR(deleteModalQR);
      await dbService.syncFromSupabase();
      setDeleteModalQR(null);
      setIsDeleting(false);
      setTableRefresh((prev) => prev + 1);
    }
  };

  return (
    <AppleCard className="p-6 sm:p-8 border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-6 shadow-sm">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 shadow-xs">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-zinc-950 dark:text-white tracking-tight">
              Sistemdeki Bütün QR Kodları ({allQRs.length})
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              Aşağıdaki listede aktif araç eşleşmeleri, baskı durumları ve boş QR stokları yer almaktadır.
            </p>
          </div>
        </div>

        {/* Batch Print / Download Unassigned QRs Button */}
        <button
          onClick={handleDownloadAllUnassigned}
          disabled={isDownloadLoading}
          className="px-4 py-2.5 rounded-2xl bg-zinc-950 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-100 text-white dark:text-zinc-950 font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
          id="btn-admin-print-unassigned-pdf"
        >
          <Printer className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>{isDownloadLoading ? 'PNG Dosyaları Hazırlanıyor...' : "Tanımsız QR'ları İndir (PNG)"}</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-zinc-400 dark:text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="QR ID, isim, tel veya plaka ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#F8F9FA] dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-950 dark:text-white font-medium focus:outline-none focus:border-zinc-950 dark:focus:border-white transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-[#F8F9FA] dark:bg-zinc-950 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800">
            {['all', 'active', 'unassigned'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  filterStatus === st
                    ? 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 shadow-2xs'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                {st === 'all' ? `Tümü (${allQRs.length})` : st === 'active' ? `Aktif (${allQRs.filter(q => q.status === 'active').length})` : `Tanımsız (${allQRs.filter(q => q.status === 'unassigned').length})`}
              </button>
            ))}
          </div>

          {/* Sticker Filter */}
          <div className="flex items-center gap-1 bg-[#F8F9FA] dark:bg-zinc-950 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800">
            {[
              { id: 'all', label: 'Tüm Stickerlar' },
              { id: 'printed', label: 'Basıldı' },
              { id: 'unprinted', label: 'Basılmadı' },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setFilterSticker(st.id)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  filterSticker === st.id
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Consolidated Table */}
      <div className="overflow-x-auto rounded-2xl border border-zinc-200/80 dark:border-zinc-800">
        <table className="w-full text-left text-xs text-zinc-700 dark:text-zinc-300">
          <thead className="bg-[#F8F9FA] dark:bg-zinc-950/80 text-zinc-600 dark:text-zinc-400 font-bold uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800">
            <tr>
              <th className="p-3.5 text-center w-24">Sticker</th>
              <th className="p-3.5">QR Kod ID</th>
              <th className="p-3.5">Durum</th>
              <th className="p-3.5">Araç Plakası</th>
              <th className="p-3.5">Araç Sahibi / İletişim</th>
              <th className="p-3.5">Taranma</th>
              <th className="p-3.5">Oluşturulma</th>
              <th className="p-3.5 text-right">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200/80 dark:divide-zinc-800">
            {filteredQRs.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-zinc-400 dark:text-zinc-500 font-medium">
                  Kayıt bulunamadı.
                </td>
              </tr>
            ) : (
              filteredQRs.map((q) => {
                const owner = qrOwnerMap.get(q.qrCodeId);
                const isPrinted = q.stickerPrinted ?? false;
                return (
                  <tr key={q.id} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/50 transition-colors">
                    {/* Sticker Printed Checkbox */}
                    <td className="p-3.5 text-center">
                      <label className="inline-flex items-center gap-1.5 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={isPrinted}
                          onChange={async (e) => {
                            const val = e.target.checked;
                            await dbService.updateStickerPrinted(q.qrCodeId, val);
                            setTableRefresh((r) => r + 1);
                          }}
                          className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 text-emerald-600 focus:ring-emerald-500 cursor-pointer accent-emerald-600"
                        />
                        <span className={`text-[10px] font-bold ${isPrinted ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-400 dark:text-zinc-500'}`}>
                          {isPrinted ? 'Basıldı' : 'Basılmadı'}
                        </span>
                      </label>
                    </td>
                    <td className="p-3.5 font-mono font-black text-zinc-950 dark:text-white">
                      {q.qrCodeId}
                    </td>
                    <td className="p-3.5">
                      {q.status === 'active' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Aktif</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 text-[10px] font-bold border border-amber-200 dark:border-amber-800">
                          <ShieldAlert className="w-3 h-3" />
                          <span>Tanımsız (Boş)</span>
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 font-mono font-black text-zinc-900 dark:text-zinc-100">
                      {owner?.vehicle?.plateNumber ? (
                        <span className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white uppercase">
                          {owner.vehicle.plateNumber}
                        </span>
                      ) : (
                        <span className="text-zinc-400 dark:text-zinc-600 font-normal">-</span>
                      )}
                    </td>
                    <td className="p-3.5 font-medium">
                      {owner?.user ? (
                        <div>
                          <div className="font-bold text-zinc-950 dark:text-white">{owner.user.fullName}</div>
                          <div className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">{owner.user.phone}</div>
                        </div>
                      ) : (
                        <span className="text-zinc-400 dark:text-zinc-600 font-normal">-</span>
                      )}
                    </td>
                    <td className="p-3.5 text-zinc-600 dark:text-zinc-400 font-semibold font-mono">
                      {q.scanCount || 0} kez
                    </td>
                    <td className="p-3.5 text-zinc-500 dark:text-zinc-400 text-[11px]">
                      {new Date(q.createdAt).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => onScanQR(q.qrCodeId)}
                        className="p-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition-colors inline-flex items-center gap-1 text-[11px] font-bold cursor-pointer"
                        title="Okutulmuş Gibi Test Et"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Test</span>
                      </button>

                      {/* Siyah QR İndir (Black QR + White background) */}
                      <button
                        onClick={() => downloadQRStickerPNG(q.qrCodeId, 'black')}
                        className="px-2 py-1.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white transition-colors inline-flex items-center gap-1 text-[11px] font-bold cursor-pointer shadow-xs border border-zinc-800 dark:border-zinc-700"
                        title="Siyah QR (Beyaz Arka Plan) 1024x1024 PNG İndir"
                        id={`btn-download-qr-black-${q.qrCodeId}`}
                      >
                        <Download className="w-3 h-3 text-zinc-300" />
                        <span>Siyah QR</span>
                      </button>

                      {/* Beyaz QR İndir (White QR + Black background) */}
                      <button
                        onClick={() => downloadQRStickerPNG(q.qrCodeId, 'white')}
                        className="px-2 py-1.5 rounded-xl bg-zinc-200 hover:bg-zinc-300 dark:bg-white dark:hover:bg-zinc-100 text-zinc-950 transition-colors inline-flex items-center gap-1 text-[11px] font-bold cursor-pointer shadow-xs border border-zinc-300 dark:border-zinc-200"
                        title="Beyaz QR (Siyah Arka Plan) 1024x1024 PNG İndir"
                        id={`btn-download-qr-white-${q.qrCodeId}`}
                      >
                        <Download className="w-3 h-3 text-zinc-800 dark:text-zinc-950" />
                        <span>Beyaz QR</span>
                      </button>

                      <button
                        onClick={() => setDeleteModalQR(q.qrCodeId)}
                        className="p-1.5 rounded-xl bg-red-50 dark:bg-red-950/60 hover:bg-red-100 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 transition-colors inline-flex items-center gap-1 text-[11px] font-bold cursor-pointer border border-red-200 dark:border-red-800"
                        title="QR Kodu Sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Sil</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {deleteModalQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[28px] max-w-sm w-full p-6 text-zinc-900 dark:text-zinc-100 relative shadow-2xl space-y-4 text-center">
            <button
              onClick={() => setDeleteModalQR(null)}
              disabled={isDeleting}
              className="absolute top-4 right-4 p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto border border-red-200 dark:border-red-800">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-zinc-950 dark:text-white">QR Kodu Sil</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                <code className="font-mono font-bold text-zinc-800 dark:text-zinc-200">{deleteModalQR}</code> kodlu QR kaydını Supabase veritabanından tamamen silmek istediğinize emin misiniz?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setDeleteModalQR(null)}
                disabled={isDeleting}
                className="py-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold text-xs hover:bg-zinc-200 dark:hover:bg-zinc-700 cursor-pointer transition-colors"
              >
                Vazgeç
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="py-3 rounded-2xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 cursor-pointer transition-colors disabled:opacity-50"
              >
                {isDeleting ? 'Siliniyor...' : 'Evet, Sil'}
              </button>
            </div>
          </div>
        </div>
      )}

    </AppleCard>
  );
};


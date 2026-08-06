'use client';

import React, { useState } from 'react';
import { Plus, Sparkles, Check, Printer, AlertCircle } from 'lucide-react';
import { AppleCard } from '../layout/AppleCard';
import { dbService } from '../../services/db';
import { generatePrintablePDF } from '../../utils/pdfGenerator';
import { QRCodeItem } from '../../types';

interface AdminQRBatchProps {
  onQRsUpdated: () => void;
}

export const AdminQRBatch: React.FC<AdminQRBatchProps> = ({ onQRsUpdated }) => {
  const [generateCount, setGenerateCount] = useState<number>(10);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [lastGeneratedQRs, setLastGeneratedQRs] = useState<QRCodeItem[]>([]);
  const [isPdfLoading, setIsPdfLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (generateCount <= 0 || generateCount > 500) return;

    setIsGenerating(true);
    setError(null);
    setLastGeneratedQRs([]);

    try {
      // 1. ÖNCE: INSERT veritabanına yapılır
      const result = await dbService.generateBulkQRs(generateCount);

      if (!result.success || result.qrs.length === 0) {
        setError(result.error || 'QR kodlar veritabanına kaydedilemedi.');
        return;
      }

      // 2. SONRA: INSERT başarılı olduysa PDF oluşturulur
      try {
        await generatePrintablePDF(result.qrs.map(q => q.qrCodeId), 'VEXO QR Sticker Baski Sayfasi');
      } catch (pdfErr) {
        console.error('PDF indirme hatası:', pdfErr);
      }

      // 3. SONRA: Başarı mesajı gösterilir & tablo güncellenir
      setLastGeneratedQRs(result.qrs);
      onQRsUpdated();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'QR kodlar oluşturulurken beklenmeyen bir hata oluştu.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPDF = async (qrList: string[]) => {
    setIsPdfLoading(true);
    try {
      await generatePrintablePDF(qrList, 'VEXO QR Sticker Baski Sayfasi');
    } catch (err) {
      console.error(err);
    } finally {
      setIsPdfLoading(false);
    }
  };

  return (
    <AppleCard className="p-6 sm:p-8 border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-6 shadow-sm">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-bold border border-zinc-200 dark:border-zinc-700 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kriptografik Rastgele ID Üreteci</span>
          </div>
          <h2 className="text-xl font-black text-zinc-950 dark:text-white tracking-tight">
            Yeni QR Kod Serisi Oluştur & PDF Yazdır
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium mt-1">
            Her bir QR kod benzersiz, 16 karakterli rastgele kriptografik dizidir.
          </p>
        </div>

        {/* Quick Batch Options */}
        <div className="flex items-center gap-2">
          {[6, 12, 24, 100].map(cnt => (
            <button
              key={cnt}
              onClick={() => setGenerateCount(cnt)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                generateCount === cnt
                  ? 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 shadow-xs'
                  : 'bg-[#F8F9FA] dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:text-zinc-950 dark:hover:text-white'
              }`}
            >
              {cnt} Adet
            </button>
          ))}
        </div>
      </div>

      {/* Generation Form */}
      <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row gap-4 items-end">
        <div className="flex-1 space-y-1.5 w-full">
          <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider block">
            Oluşturulacak QR Miktarı
          </label>
          <input
            type="number"
            min={1}
            max={500}
            value={generateCount}
            onChange={(e) => setGenerateCount(parseInt(e.target.value) || 1)}
            className="w-full bg-[#F8F9FA] dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-4 py-3 text-sm text-zinc-950 dark:text-white font-mono font-bold focus:outline-none focus:border-zinc-950 dark:focus:border-white"
          />
        </div>

        <button
          type="submit"
          disabled={isGenerating}
          className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-extrabold text-xs hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
          id="btn-admin-generate-qr"
        >
          <Plus className="w-4 h-4" />
          <span>{isGenerating ? 'Oluşturuluyor...' : `${generateCount} Adet QR Üret`}</span>
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Generated Results & PDF Export Bar */}
      {lastGeneratedQRs.length > 0 && (
        <div className="p-5 rounded-2xl bg-[#F8F9FA] dark:bg-zinc-950/80 border border-emerald-200 dark:border-emerald-800 space-y-4 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
              <Check className="w-4 h-4" />
              <span>{lastGeneratedQRs.length} Adet Yeni Kriptografik QR Başarıyla Oluşturuldu</span>
            </div>

            <button
              onClick={() => handleDownloadPDF(lastGeneratedQRs.map(q => q.qrCodeId))}
              disabled={isPdfLoading}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
              id="btn-admin-download-batch-pdf"
            >
              <Printer className="w-4 h-4" />
              <span>{isPdfLoading ? 'PDF Hazırlanıyor...' : 'Baskı PDF\'ini İndir'}</span>
            </button>
          </div>

          {/* List preview of created QR codes */}
          <div className="flex flex-wrap gap-2 pt-2">
            {lastGeneratedQRs.slice(0, 12).map((q) => (
              <span key={q.id} className="px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-[11px] font-mono font-bold text-zinc-800 dark:text-zinc-200">
                {q.qrCodeId}
              </span>
            ))}
            {lastGeneratedQRs.length > 12 && (
              <span className="px-3 py-1.5 text-[11px] text-zinc-500 dark:text-zinc-400 font-mono font-bold">
                +{lastGeneratedQRs.length - 12} daha...
              </span>
            )}
          </div>
        </div>
      )}

    </AppleCard>
  );
};

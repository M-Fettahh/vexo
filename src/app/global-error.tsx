'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="tr">
      <body className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-3xl font-extrabold text-zinc-900 mb-2">Sistem Hatası</h1>
        <p className="text-zinc-500 mb-6 font-medium">Bilinmeyen bir sistem hatası oluştu.</p>
        <button
          onClick={() => reset()}
          className="px-5 py-2.5 bg-zinc-900 text-white rounded-xl font-bold text-sm cursor-pointer"
        >
          Yeniden Yükle
        </button>
      </body>
    </html>
  );
}

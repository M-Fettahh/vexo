'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-zinc-950 flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white mb-2">Bir Hata Oluştu</h1>
      <p className="text-zinc-500 dark:text-zinc-400 mb-6 font-medium">Sistemde beklenmeyen bir hata meydana geldi.</p>
      <div className="flex items-center gap-3">
        <button
          onClick={() => reset()}
          className="px-5 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity cursor-pointer"
        >
          Tekrar Dene
        </button>
        <Link
          href="/"
          className="px-5 py-2.5 bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
        >
          Ana Sayfa
        </Link>
      </div>
    </div>
  );
}

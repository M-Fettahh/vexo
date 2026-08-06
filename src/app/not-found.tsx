import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-zinc-950 flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-4xl font-extrabold text-zinc-900 dark:text-white mb-2">404</h1>
      <p className="text-zinc-500 dark:text-zinc-400 mb-6 font-medium">Aradığınız sayfa bulunamadı.</p>
      <Link
        href="/"
        className="px-5 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
      >
        Ana Sayfaya Dön
      </Link>
    </div>
  );
}

import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'VEXO - Premium Akıllı Araç QR Kod ve İletişim Sistemi',
  description: 'QR Stickerınızı aracınıza yapıştırın. Size ulaşmak isteyen kişi tek dokunuşla sizi arasın.',
  keywords: ['VEXO', 'QR Kod', 'Araç QR', 'Akıllı İletişim', 'Araç Sticker', 'Park QR'],
  authors: [{ name: 'VEXO' }],
  openGraph: {
    title: 'VEXO - Premium Akıllı Araç QR Kod ve İletişim Sistemi',
    description: 'QR Stickerınızı aracınıza yapıştırın. Size ulaşmak isteyen kişi tek dokunuşla sizi arasın.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={`light ${plusJakartaSans.variable}`}>
      <body className="min-h-screen bg-[#F7F8FA] text-zinc-900 selection:bg-zinc-900 selection:text-white font-sans antialiased">
        {children}
      </body>
    </html>
  );
}

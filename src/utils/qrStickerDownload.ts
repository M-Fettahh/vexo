import QRCode from 'qrcode';

export type QRColorVariant = 'black' | 'white';

/**
 * Generates and downloads a pure high-resolution 1024x1024 PNG QR code image.
 * Uses native QRCode rendering with errorCorrectionLevel 'H' and margin 4.
 *
 * 1. Siyah QR (Black QR):
 *    - QR modules (dark): #000000
 *    - Background (light): #FFFFFF
 *
 * 2. Beyaz QR (White QR):
 *    - QR modules (dark): #FFFFFF
 *    - Background (light): #000000
 *
 * Both are rendered natively using QRCode library options without post-hoc color inversion.
 * Optimized for mobile camera QR scanners (iOS / Android).
 */
export async function downloadQRStickerPNG(qrCodeId: string, variant: QRColorVariant = 'black'): Promise<void> {
  if (typeof window === 'undefined') return;

  const isWhite = variant === 'white';
  const darkColor = isWhite ? '#FFFFFF' : '#000000';
  const lightColor = isWhite ? '#000000' : '#FFFFFF';

  const baseUrl = window.location.origin;
  const scanUrl = `${baseUrl}/q/${qrCodeId}`;

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;

  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.imageSmoothingEnabled = false;
  }

  // Render QR Code natively with QRCode library onto 1024x1024 canvas
  await QRCode.toCanvas(canvas, scanUrl, {
    width: 1024,
    margin: 4,
    errorCorrectionLevel: 'H',
    color: {
      dark: darkColor,
      light: lightColor,
    },
  });

  const fileName = `${qrCodeId}-${isWhite ? 'beyaz' : 'siyah'}.png`;

  // Convert Canvas to opaque PNG Blob & Trigger Download
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 'image/png', 1.0);
}



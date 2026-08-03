import QRCode from 'qrcode';

export type QRColorVariant = 'black' | 'white';

/**
 * Generates and downloads a pure high-resolution 1024x1024 PNG QR code image.
 * Variant 'black': Siyah QR + Beyaz arka plan -> [qrCodeId]-siyah.png
 * Variant 'white': Beyaz QR + Siyah arka plan -> [qrCodeId]-beyaz.png
 */
export async function downloadQRStickerPNG(qrCodeId: string, variant: QRColorVariant = 'black'): Promise<void> {
  if (typeof window === 'undefined') return;

  const canvas = document.createElement('canvas');
  const canvasSize = 1024;
  canvas.width = canvasSize;
  canvas.height = canvasSize;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Build target URL for the QR code scan
  const baseUrl = window.location.origin;
  const scanUrl = `${baseUrl}/q/${qrCodeId}`;

  const isWhite = variant === 'white';
  const bgColor = isWhite ? '#000000' : '#FFFFFF';
  const darkColor = isWhite ? '#FFFFFF' : '#000000';
  const lightColor = isWhite ? '#000000' : '#FFFFFF';

  // Fill canvas with background color
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvasSize, canvasSize);

  // Generate QR Code image as data URL (960x960 inside 1024x1024 canvas)
  const qrDataUrl = await QRCode.toDataURL(scanUrl, {
    width: 960,
    margin: 2,
    color: {
      dark: darkColor,
      light: lightColor,
    },
  });

  // Load QR image
  const qrImg = new Image();
  await new Promise<void>((resolve, reject) => {
    qrImg.onload = () => resolve();
    qrImg.onerror = (e) => reject(e);
    qrImg.src = qrDataUrl;
  });

  // Draw QR code centered in the 1024x1024 canvas
  const offset = (canvasSize - 960) / 2;
  ctx.drawImage(qrImg, offset, offset, 960, 960);

  // Convert Canvas to PNG Blob & Trigger Download
  const fileName = `${qrCodeId}-${isWhite ? 'beyaz' : 'siyah'}.png`;
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
  }, 'image/png');
}


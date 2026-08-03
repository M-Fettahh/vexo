import QRCode from 'qrcode';

/**
 * Generates and downloads a pure high-resolution 1024x1024 PNG QR code image.
 * File format: [qrCodeId].png
 */
export async function downloadQRStickerPNG(qrCodeId: string): Promise<void> {
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

  // Fill canvas with solid white background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvasSize, canvasSize);

  // Generate QR Code image as data URL (1024x1024)
  const qrDataUrl = await QRCode.toDataURL(scanUrl, {
    width: 960,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF',
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
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${qrCodeId}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 'image/png');
}


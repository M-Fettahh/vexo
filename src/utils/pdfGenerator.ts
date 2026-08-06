import { APP_CONFIG } from '../config/appConfig';

/**
 * Generate Printable PDF sheet for QR Sticker batch
 * Renders QR codes on grid layout with cut lines, brand logos, and instructions.
 */
export async function generatePrintablePDF(
  qrCodes: string[],
  title: string = 'VEXO QR Sticker Baski Sayfasi'
) {
  if (qrCodes.length === 0 || typeof window === 'undefined') return;

  const { jsPDF } = await import('jspdf');

  // Create A4 PDF in portrait mode
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210 mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297 mm

  const margin = 15;
  const columns = 3;
  const rows = 3;
  const itemsPerPage = columns * rows;

  const cardWidth = (pageWidth - margin * 2 - (columns - 1) * 8) / columns; // ~53mm
  const cardHeight = 75; // mm

  let currentPage = 1;

  for (let i = 0; i < qrCodes.length; i++) {
    const itemIndexOnPage = i % itemsPerPage;

    if (i > 0 && itemIndexOnPage === 0) {
      doc.addPage();
      currentPage++;
    }

    const col = itemIndexOnPage % columns;
    const row = Math.floor(itemIndexOnPage / columns);

    const x = margin + col * (cardWidth + 8);
    const y = margin + 15 + row * (cardHeight + 8);

    const qrCodeId = qrCodes[i];
    const fullScanUrl = `${window.location.origin}/q/${qrCodeId}`;

    // Draw card border & crop guide
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.roundedRect(x, y, cardWidth, cardHeight, 3, 3);

    // Draw VEXO header banner
    doc.setFillColor(15, 15, 18);
    doc.roundedRect(x, y, cardWidth, 12, 3, 3);
    // Cover bottom rounded corners of the header
    doc.rect(x, y + 6, cardWidth, 6, 'F');

    // Header Text
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(APP_CONFIG.name, x + cardWidth / 2, y + 8, { align: 'center' });

    // Generate QR Canvas Image Data
    const qrDataUrl = await generateQRCodeDataURL(fullScanUrl);
    if (qrDataUrl) {
      const qrSize = 38;
      const qrX = x + (cardWidth - qrSize) / 2;
      const qrY = y + 16;
      doc.addImage(qrDataUrl, 'PNG', qrX, qrY, qrSize, qrSize);
    }

    // Call Instruction Text
    doc.setTextColor(30, 30, 30);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text('ARAC SAHIBINE ULAS', x + cardWidth / 2, y + 58, { align: 'center' });

    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.text('Kameraniz ile QR kodu tarayin', x + cardWidth / 2, y + 62, { align: 'center' });

    // QR Code ID Footer Label
    doc.setTextColor(140, 140, 140);
    doc.setFont('courier', 'bold');
    doc.setFontSize(6);
    doc.text(`ID: ${qrCodeId}`, x + cardWidth / 2, y + 69, { align: 'center' });
  }

  // Header on Page
  doc.setPage(currentPage);
  doc.setTextColor(20, 20, 20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(`${title} - ${APP_CONFIG.name}`, margin, 10);

  // Save PDF file
  const filename = `VEXO_QR_Baski_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}

/**
 * Helper to generate PNG Data URL from QR code text using invisible canvas
 */
function generateQRCodeDataURL(text: string): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 250;
    canvas.height = 250;

    // Use dynamically imported QRCode canvas renderer if available, or fall back to native QR image API
    const qrImageApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(text)}&color=000000&bgcolor=ffffff&margin=1`;
    
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, 250, 250);
        resolve(canvas.toDataURL('image/png'));
      } else {
        resolve('');
      }
    };
    img.onerror = () => resolve('');
    img.src = qrImageApiUrl;
  });
}

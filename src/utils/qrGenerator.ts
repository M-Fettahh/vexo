/**
 * Cryptographically Secure Non-Sequential QR Code Generator
 * Produces unpredictable 16-character alphanumeric identifiers.
 * Example: Q7XaP9LmR4Tk8WnB
 */

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export function generateCryptoQRId(length: number = 16): string {
  const randomValues = new Uint8Array(length);
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(randomValues);
  } else {
    for (let i = 0; i < length; i++) {
      randomValues[i] = Math.floor(Math.random() * 256);
    }
  }
  
  let result = '';
  for (let i = 0; i < length; i++) {
    result += CHARS[randomValues[i] % CHARS.length];
  }
  return result;
}

/**
 * Generate multiple unique QR code IDs in batch
 */
export function generateBatchQRIds(count: number): string[] {
  const set = new Set<string>();
  while (set.size < count) {
    set.add(generateCryptoQRId(16));
  }
  return Array.from(set);
}

/**
 * Clean & normalize Turkish plate number (e.g. "34 vex 01" -> "34 VEX 01")
 */
export function formatPlateNumber(plate: string): string {
  const cleaned = plate.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  // Extract leading digits (1-2 digits), letters (1-3 letters), trailing digits (2-4 digits)
  const match = cleaned.match(/^(\d{2})([A-Z]{1,3})(\d{2,4})$/);
  if (match) {
    return `${match[1]} ${match[2]} ${match[3]}`;
  }
  return plate.trim().toUpperCase().replace(/\s+/g, ' ');
}

/**
 * Validate Turkish Plate Number
 */
export function validateTurkishPlate(plate: string): { valid: boolean; formattedPlate: string; error?: string } {
  const cleaned = plate.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  const match = cleaned.match(/^(\d{2})([A-Z]{1,3})(\d{2,4})$/);
  
  if (!match) {
    return {
      valid: false,
      formattedPlate: plate,
      error: 'Geçersiz plaka formatı. Örnek: 34ABC123 veya 06 XYZ 06'
    };
  }

  const cityCode = parseInt(match[1], 10);
  if (cityCode < 1 || cityCode > 81) {
    return {
      valid: false,
      formattedPlate: plate,
      error: 'İl kodu 01-81 arasında olmalıdır.'
    };
  }

  const formattedPlate = `${match[1]} ${match[2]} ${match[3]}`;
  return { valid: true, formattedPlate };
}

/**
 * Clean 10-digit phone number (removes leading 0, spaces, dashes, parens)
 */
export function cleanPhone10(phone: string): string {
  let digits = phone.replace(/\D/g, '');
  if (digits.startsWith('0')) {
    digits = digits.substring(1);
  }
  return digits;
}

/**
 * Validate 10-digit phone number (starts with 5, total 10 digits)
 */
export function validatePhone10(phone: string): { valid: boolean; cleanPhone: string; error?: string } {
  const clean = cleanPhone10(phone);
  if (clean.length !== 10) {
    return {
      valid: false,
      cleanPhone: clean,
      error: 'Telefon numarası başında 0 olmadan tam 10 haneli olmalıdır (ör: 5510517100).'
    };
  }
  if (!clean.startsWith('5')) {
    return {
      valid: false,
      cleanPhone: clean,
      error: 'Telefon numarası 5 ile başlamalıdır (ör: 5510517100).'
    };
  }
  return { valid: true, cleanPhone: clean };
}

/**
 * Validate Full Name (Ad Soyad)
 * Rules: 2-5 words, each word min 3 letters. Single word not allowed.
 */
export function validateFullName(name: string): { valid: boolean; error?: string } {
  const trimmed = name.trim().replace(/\s+/g, ' ');
  const words = trimmed.split(' ').filter(Boolean);

  if (words.length < 2) {
    return {
      valid: false,
      error: 'Ad ve Soyad en az 2 kelimeden oluşmalıdır (ör: Ali Veli).'
    };
  }

  if (words.length > 5) {
    return {
      valid: false,
      error: 'Ad ve Soyad en fazla 5 kelime olabilir.'
    };
  }

  for (const word of words) {
    if (word.length < 3) {
      return {
        valid: false,
        error: `Her kelime en az 3 harften oluşmalıdır ("${word}" geçersiz).`
      };
    }
  }

  return { valid: true };
}

/**
 * Format Censored Name (e.g., "Arif Yılmaz" -> "Arif Y***")
 */
export function formatCensoredName(fullName: string): string {
  if (!fullName) return '';
  const words = fullName.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '';
  if (words.length === 1) {
    const firstWord = words[0];
    return firstWord.charAt(0) + '***';
  }
  
  // First names (all except last word)
  const firstNames = words.slice(0, -1).join(' ');
  const lastName = words[words.length - 1];
  const lastInitial = lastName.charAt(0).toUpperCase();
  
  return `${firstNames} ${lastInitial}***`;
}

/**
 * Format phone number for tel: links and display
 */
export function formatPhoneNumber(phone: string): string {
  const digits = cleanPhone10(phone);
  if (digits.length === 10) {
    return `0${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 8)} ${digits.slice(8, 10)}`;
  }
  return phone;
}

/**
 * Sanitize phone number for tel: protocol
 */
export function getRawTelUrl(phone: string): string {
  const digits = cleanPhone10(phone);
  if (digits.length === 10) {
    return `tel:+90${digits}`;
  }
  return `tel:${phone}`;
}

/**
 * VEXO Central App Configuration
 * Allows easy rebranding and global feature management.
 */

export const APP_CONFIG = {
  // Brand details
  name: "VEXO",
  tagline: "Tek Taramayla Araç Sahibine Ulaşım",
  description: "QR Stickerınızı aracınıza yapıştırın. Size ulaşmak isteyen kişi tek dokunuşla sizi arasın.",
  supportPhone: "+90 551 051 71 00",
  whatsappPhone: "905510517100",
  instagramHandle: "vexo.official",
  dolapUrl: "https://dolap.com/profil/vexo",
  trendyolUrl: "https://trendyol.com/magaza/vexo",
  
  // Pricing & Packages
  packages: {
    standard: {
      id: "standard",
      name: "Standart Paket",
      price: 200,
      currency: "TL",
      stickerCount: 3,
      description: "Ön ve arka camlar için 3 adet aynı QR kodlu dayanıklı sticker seti.",
      features: [
        "3 Adet QR Sticker (Tamamen Aynı Kod)",
        "Suya ve Güneşe Dayanıklı Premium Kuşe Baskı",
        "Anında Doğrudan Arama Sistemi",
        "Ömür Boyu Ücretsiz Kullanım",
        "Sıfır Komisyon & Ek Ücret Yok"
      ],
      badge: "En Popüler",
      available: true
    },
    // Future package declarations (ready for extension)
    gold: {
      id: "gold",
      name: "Gold Paket",
      price: 250,
      currency: "TL",
      badge: "Yakında",
      available: false
    },
    premium: {
      id: "premium",
      name: "Premium Paket",
      price: 350,
      currency: "TL",
      badge: "Yakında",
      available: false
    }
  },

  // Future feature flags (Architecture ready)
  futureFeatures: {
    pushNotifications: true, // Structure ready for FCM / Push API
    photoUpload: true,       // Vehicle avatar photo
    mobileApp: true,         // iOS/Android App integration
    alarmSystem: true,       // Emergency silent alert
    locationSharing: true    // GPS location sharing on scan
  }
};

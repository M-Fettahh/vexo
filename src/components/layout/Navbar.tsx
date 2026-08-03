'use client';

import React, { useState, useEffect } from 'react';
import { QrCode, User, Menu, X, ArrowRight, Sun, Moon } from 'lucide-react';
import { APP_CONFIG } from '../../config/appConfig';
import { dbService } from '../../services/db';
import { UserProfile } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface NavbarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  onOpenQRTest: () => void;
  onOpenOrder: () => void;
  currentUser?: UserProfile | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  setActiveView,
  onOpenQRTest,
  onOpenOrder,
  currentUser: propCurrentUser,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (propCurrentUser !== undefined) {
      setCurrentUser(propCurrentUser);
    } else {
      setCurrentUser(dbService.getCurrentUser());
    }
  }, [propCurrentUser, activeView]);

  const handleNavClick = (view: string, sectionId?: string) => {
    setActiveView(view);
    setMobileMenuOpen(false);
    if (view === 'landing' && sectionId) {
      setTimeout(() => {
        const elem = document.getElementById(sectionId);
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else if (view === 'landing') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800/80 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <button
            onClick={() => handleNavClick('landing')}
            className="flex items-center group cursor-pointer"
            id="btn-navbar-logo"
            aria-label="VEXO Ana Sayfa"
          >
            <img
              src="/logo-black.png"
              alt="VEXO Logo"
              className="h-9 sm:h-10 w-auto object-contain dark:hidden group-hover:opacity-90 transition-opacity"
            />
            <img
              src="/logo-white.png"
              alt="VEXO Logo"
              className="h-9 sm:h-10 w-auto object-contain hidden dark:block group-hover:opacity-90 transition-opacity"
            />
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => handleNavClick('landing')}
              className={`text-sm font-semibold transition-colors cursor-pointer ${
                activeView === 'landing'
                  ? 'text-zinc-950 dark:text-white font-bold'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              Ana Sayfa
            </button>
            <button
              onClick={() => handleNavClick('landing', 'how-it-works')}
              className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Nasıl Çalışır
            </button>
            <button
              onClick={() => handleNavClick('landing', 'pricing')}
              className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Paketler
            </button>
            <button
              onClick={() => handleNavClick('landing', 'faq')}
              className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              SSS
            </button>
            <button
              onClick={() => handleNavClick('landing', 'contact')}
              className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              İletişim
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* Apple Style Theme Switch Toggle */}
            <button
              onClick={toggleTheme}
              className="relative p-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
              title={theme === 'light' ? 'Koyu Temaya Geç' : 'Açık Temaya Geç'}
              id="btn-navbar-theme-toggle"
            >
              <div className={`p-1.5 rounded-full transition-all duration-200 ${theme === 'light' ? 'bg-white text-amber-500 shadow-xs' : 'text-zinc-400'}`}>
                <Sun className="w-3.5 h-3.5" />
              </div>
              <div className={`p-1.5 rounded-full transition-all duration-200 ${theme === 'dark' ? 'bg-zinc-900 text-indigo-400 shadow-xs' : 'text-zinc-400'}`}>
                <Moon className="w-3.5 h-3.5" />
              </div>
            </button>

            {/* QR Test Button */}
            <button
              onClick={onOpenQRTest}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-2xl text-zinc-700 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all border border-zinc-200/80 dark:border-zinc-800 cursor-pointer"
              title="Sistemde Kayıtlı Örnek Bir QR Kodunu Test Et"
              id="btn-navbar-qr-test"
            >
              <QrCode className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>QR Test Et</span>
            </button>

            {/* Satın Al CTA */}
            <button
              onClick={onOpenOrder}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-2xl text-white dark:text-zinc-950 bg-zinc-950 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all shadow-sm cursor-pointer"
              id="btn-navbar-buy"
            >
              <span>Satın Al</span>
            </button>

            {/* User Panel or Login */}
            {currentUser ? (
              <button
                onClick={() => handleNavClick(currentUser.role === 'admin' ? 'admin' : 'panel')}
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-2xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-sm cursor-pointer"
                id="btn-navbar-user-panel"
              >
                <User className="w-4 h-4" />
                <span>{currentUser.fullName.split(' ')[0]} Paneli</span>
              </button>
            ) : (
              <button
                onClick={() => handleNavClick('login')}
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-2xl text-zinc-800 dark:text-zinc-200 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all shadow-xs cursor-pointer"
                id="btn-navbar-login"
              >
                <User className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                <span>Giriş Yap</span>
              </button>
            )}

          </div>

          {/* Mobile menu button & quick theme toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 text-xs font-bold rounded-2xl text-zinc-700 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 cursor-pointer"
              title="Tema Değiştir"
              id="btn-navbar-mobile-theme-toggle"
            >
              {theme === 'light' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>

            <button
              onClick={onOpenQRTest}
              className="p-2.5 text-xs font-semibold rounded-2xl text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 cursor-pointer"
              title="QR Test"
            >
              <QrCode className="w-5 h-5" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 text-zinc-700 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-white rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 cursor-pointer"
              id="btn-navbar-mobile-toggle"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
          
          {/* Mobile Theme Toggle Banner */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-4 py-3 text-xs font-bold rounded-2xl text-zinc-800 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 cursor-pointer"
          >
            <span>Tema Değiştir</span>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200">
              {theme === 'light' ? <Sun className="w-3.5 h-3.5 text-amber-500" /> : <Moon className="w-3.5 h-3.5 text-indigo-400" />}
              <span>{theme === 'light' ? 'Açık' : 'Koyu'}</span>
            </div>
          </button>

          <button
            onClick={() => handleNavClick('landing')}
            className="block w-full text-left py-2 text-sm font-semibold text-zinc-900 dark:text-white hover:text-zinc-600 dark:hover:text-zinc-300"
          >
            Ana Sayfa
          </button>
          <button
            onClick={() => handleNavClick('landing', 'how-it-works')}
            className="block w-full text-left py-2 text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
          >
            Nasıl Çalışır
          </button>
          <button
            onClick={() => handleNavClick('landing', 'pricing')}
            className="block w-full text-left py-2 text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
          >
            Paketler
          </button>
          <button
            onClick={() => handleNavClick('landing', 'faq')}
            className="block w-full text-left py-2 text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
          >
            SSS
          </button>
          <button
            onClick={() => handleNavClick('landing', 'contact')}
            className="block w-full text-left py-2 text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
          >
            İletişim
          </button>

          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex flex-col gap-2">
            <button
              onClick={onOpenOrder}
              className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-2xl text-white dark:text-zinc-950 bg-zinc-950 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 cursor-pointer"
            >
              <span>Satın Al (200 TL)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {currentUser ? (
              <button
                onClick={() => handleNavClick(currentUser.role === 'admin' ? 'admin' : 'panel')}
                className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-2xl bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 cursor-pointer"
              >
                <User className="w-4 h-4" />
                <span>{currentUser.fullName} Paneli</span>
              </button>
            ) : (
              <button
                onClick={() => handleNavClick('login')}
                className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-2xl bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 cursor-pointer"
              >
                <User className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                <span>Giriş Yap</span>
              </button>
            )}

          </div>
        </div>
      )}
    </header>
  );
};


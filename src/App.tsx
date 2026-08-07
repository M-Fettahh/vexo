'use client';

/**
 * VEXO - Premium Vehicle QR & Communication Platform
 */

import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { APP_CONFIG } from './config/appConfig';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/landing/Hero';
import { HowItWorks } from './components/landing/HowItWorks';
import { Pricing } from './components/landing/Pricing';
import { FAQ } from './components/landing/FAQ';
import { ContactDrawer } from './components/landing/ContactDrawer';
import { QRScannerDemo } from './components/landing/QRScannerDemo';
import { QRPublicView } from './components/qr/QRPublicView';
import { QRSetupView } from './components/qr/QRSetupView';
import { UserLogin } from './components/user/UserLogin';
import { UserDashboard } from './components/user/UserDashboard';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { dbService } from './services/db';
import { UserProfile, QRCodeItem, Vehicle } from './types';
import { ThemeProvider } from './context/ThemeContext';

interface AppProps {
  initialCode?: string;
  initialView?: string;
}

function MainContent({ initialCode, initialView }: AppProps) {
  const [activeView, setActiveView] = useState<string>(
    initialView || (initialCode ? 'q' : 'landing')
  );
  const [scannedQRId, setScannedQRId] = useState<string | null>(initialCode || null);
  const [scanCounter, setScanCounter] = useState<number>(0);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [qrDetails, setQrDetails] = useState<{ qr: QRCodeItem; vehicle?: Vehicle; user?: UserProfile } | null>(null);
  const [qrLoading, setQrLoading] = useState<boolean>(true);
  const [isMounted, setIsMounted] = useState(false);

  // Modals state
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [qrDemoModalOpen, setQrDemoModalOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      setCurrentUser(dbService.getCurrentUser());
    }
  }, [isMounted, activeView]);

  useEffect(() => {
    let isSubscribed = true;
    if (isMounted && scannedQRId && activeView === 'q') {
      console.log(`Incoming QR: ${scannedQRId}`);
      setQrLoading(true);
      dbService.getQROwnerDetailsAsync(scannedQRId).then((res) => {
        if (isSubscribed) {
          if (res && res.qr) {
            console.log(`QR FOUND: ID=${res.qr.id}, qr_code_id=${res.qr.qrCodeId}, status=${res.qr.status}`);
          } else {
            console.log(`QR NOT FOUND: ${scannedQRId}`);
          }
          setQrDetails(res);
          setQrLoading(false);
        }
      });
    } else {
      setQrLoading(false);
    }
    return () => {
      isSubscribed = false;
    };
  }, [isMounted, scannedQRId, activeView, scanCounter]);

  // Check URL query on initial load (e.g. ?qr=Q7XaP9LmR4Tk8WnB or /q/Q7XaP9LmR4Tk8WnB or /vexopro2027)
  useEffect(() => {
    if (initialView) {
      setActiveView(initialView);
      return;
    }
    if (initialCode) {
      setScannedQRId(initialCode);
      setActiveView('q');
      return;
    }

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const qrParam = params.get('qr');
      const path = window.location.pathname;

      if (qrParam) {
        handleScanQR(qrParam);
      } else if (path.includes('vexopro2027')) {
        setActiveView('admin');
      } else if (path.startsWith('/q/')) {
        const codeFromPath = path.substring(3);
        if (codeFromPath) {
          handleScanQR(codeFromPath);
        }
      } else if (path === '/panel') {
        setActiveView('panel');
      } else if (path === '/login') {
        setActiveView('login');
      }
    }
  }, [initialCode, initialView]);

  const handleScanQR = (codeId: string) => {
    setScannedQRId(codeId);
    setActiveView('q');
    setScanCounter((c) => c + 1);
    if (typeof window !== 'undefined' && window.history) {
      window.history.pushState({}, '', `/q/${codeId}`);
    }
  };

  const handleOpenQRTest = () => {
    // Always navigate directly to demo QR: rKc834QlGkA9hzJb
    handleScanQR('rKc834QlGkA9hzJb');
  };

  const handleLogout = () => {
    dbService.logout();
    setCurrentUser(null);
    setActiveView('landing');
  };

  // Determine subview for QR scanning: Either setup or public call view based strictly on active status in Supabase
  const isQRRegistered = Boolean(qrDetails && qrDetails.qr && qrDetails.qr.status === 'active');

  return (
    <div className="min-h-screen bg-[#F7F8FA] dark:bg-[#09090B] text-zinc-900 dark:text-zinc-100 transition-colors duration-200 font-sans antialiased">
      
      {/* 1. PUBLIC QR SCAN VIEW */}
      {activeView === 'q' && scannedQRId && (
        qrLoading ? (
          <div className="min-h-screen bg-[#F7F8FA] dark:bg-[#09090B] flex flex-col items-center justify-center p-6 transition-colors">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-8 max-w-sm w-full text-center space-y-4 shadow-sm">
              <div className="w-10 h-10 border-3 border-zinc-200 dark:border-zinc-800 border-t-zinc-950 dark:border-t-white rounded-full animate-spin mx-auto" />
              <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">QR Durumu Kontrol Ediliyor...</p>
            </div>
          </div>
        ) : !qrDetails || !qrDetails.qr ? (
          /* 404 - QR Code Not Found in Supabase */
          <div className="min-h-screen bg-[#F7F8FA] dark:bg-[#09090B] flex flex-col items-center justify-center p-6 transition-colors text-zinc-900 dark:text-zinc-100">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-8 max-w-sm w-full text-center space-y-4 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto border border-amber-200 dark:border-amber-800">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h2 className="text-lg font-black text-zinc-950 dark:text-white">QR Kod Bulunamadı</h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                  <code className="font-mono font-bold text-zinc-800 dark:text-zinc-200">{scannedQRId}</code> kodlu QR kaydı sistemde bulunamadı veya silinmiş.
                </p>
              </div>
              <button
                onClick={() => {
                  setActiveView('landing');
                  setScannedQRId(null);
                }}
                className="w-full py-3 rounded-2xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-bold text-xs hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors cursor-pointer"
              >
                Ana Sayfaya Dön
              </button>
            </div>
          </div>
        ) : qrDetails.qr.status === 'active' ? (
          /* STATUS ACTIVE: Render QRPublicView directly. Setup screen is NEVER rendered */
          <QRPublicView
            qrCodeId={scannedQRId}
            onNavigateHome={() => {
              setActiveView('landing');
              setScannedQRId(null);
            }}
          />
        ) : (
          /* STATUS UNASSIGNED: Render QRSetupView */
          <QRSetupView
            qrCodeId={scannedQRId}
            onSetupSuccess={(newUser) => {
              const loggedInUser = newUser || dbService.getCurrentUser();
              if (loggedInUser) {
                dbService.setCurrentUser(loggedInUser);
                setCurrentUser(loggedInUser);
              }
              setScannedQRId(null);
              setQrDetails(null);
              setActiveView('panel');
              if (typeof window !== 'undefined' && window.history) {
                window.history.pushState({}, '', '/panel');
              }
            }}
            onNavigateHome={() => {
              setActiveView('landing');
              setScannedQRId(null);
            }}
          />
        )
      )}

      {/* 2. USER LOGIN VIEW */}
      {activeView === 'login' && (
        <UserLogin
          onLoginSuccess={() => {
            setCurrentUser(dbService.getCurrentUser());
            setActiveView('panel');
          }}
          onNavigateHome={() => setActiveView('landing')}
          onNavigateAdmin={() => setActiveView('admin')}
        />
      )}

      {/* 3. USER PANEL VIEW */}
      {activeView === 'panel' && (
        currentUser ? (
          <div>
            <Navbar
              activeView={activeView}
              setActiveView={setActiveView}
              onOpenQRTest={handleOpenQRTest}
              onOpenOrder={() => setOrderModalOpen(true)}
              currentUser={currentUser}
            />
            <UserDashboard
              onLogout={handleLogout}
              onOpenQRTest={handleOpenQRTest}
              onScanQR={handleScanQR}
            />
            <Footer
              setActiveView={setActiveView}
              onOpenOrder={() => setOrderModalOpen(true)}
            />
          </div>
        ) : (
          <UserLogin
            onLoginSuccess={() => {
              setCurrentUser(dbService.getCurrentUser());
              setActiveView('panel');
            }}
            onNavigateHome={() => setActiveView('landing')}
            onNavigateAdmin={() => setActiveView('admin')}
          />
        )
      )}

      {/* 4. ADMIN PANEL VIEW */}
      {activeView === 'admin' && (
        currentUser && currentUser.role === 'admin' ? (
          <div>
            <Navbar
              activeView={activeView}
              setActiveView={setActiveView}
              onOpenQRTest={handleOpenQRTest}
              onOpenOrder={() => setOrderModalOpen(true)}
              currentUser={currentUser}
            />
            <AdminDashboard
              onLogout={handleLogout}
              onScanQR={handleScanQR}
            />
            <Footer
              setActiveView={setActiveView}
              onOpenOrder={() => setOrderModalOpen(true)}
            />
          </div>
        ) : (
          <AdminLogin
            onLoginSuccess={() => {
              setCurrentUser(dbService.getCurrentUser());
              setActiveView('admin');
            }}
            onNavigateHome={() => setActiveView('landing')}
          />
        )
      )}

      {/* 5. MAIN LANDING WEB SITE */}
      {activeView === 'landing' && (
        <div>
          <Navbar
            activeView={activeView}
            setActiveView={setActiveView}
            onOpenQRTest={handleOpenQRTest}
            onOpenOrder={() => setOrderModalOpen(true)}
            currentUser={currentUser}
          />

          <main>
            <Hero
              onOpenOrder={() => setOrderModalOpen(true)}
              onOpenQRTest={handleOpenQRTest}
              onHowItWorksClick={() => {
                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            <HowItWorks />

            <Pricing onOpenOrder={() => setOrderModalOpen(true)} />

            <FAQ />
          </main>

          <Footer
            setActiveView={setActiveView}
            onOpenOrder={() => setOrderModalOpen(true)}
          />
        </div>
      )}

      {/* MODALS */}
      <ContactDrawer
        isOpen={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
      />

      <QRScannerDemo
        isOpen={qrDemoModalOpen}
        onClose={() => setQrDemoModalOpen(false)}
        onScanQR={handleScanQR}
      />

    </div>
  );
}

export default function App(props: AppProps) {
  return (
    <ThemeProvider>
      <MainContent {...props} />
    </ThemeProvider>
  );
}

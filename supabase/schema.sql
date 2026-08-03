-- =========================================================
-- VEXO - Production Ready Vehicle QR & Communication Database Schema
-- Supabase / PostgreSQL Schema with Complete Constraints & RLS
-- =========================================================

-- Enable required extensions for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================================================
-- 1. PACKAGES TABLE
-- =========================================================
CREATE TABLE IF NOT EXISTS public.packages (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL DEFAULT 200.00,
    currency TEXT NOT NULL DEFAULT 'TL',
    badge TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================================
-- 2. PROFILES TABLE
-- =========================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT constraint_profiles_phone_unique UNIQUE (phone),
    CONSTRAINT constraint_profiles_role_check CHECK (role IN ('user', 'admin'))
);

-- =========================================================
-- 3. VEHICLES TABLE
-- =========================================================
CREATE TABLE IF NOT EXISTS public.vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    plate_number TEXT NOT NULL,
    package_id TEXT NOT NULL DEFAULT 'standard',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_vehicles_user FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
    CONSTRAINT fk_vehicles_package FOREIGN KEY (package_id) REFERENCES public.packages(id) ON DELETE SET DEFAULT
);

-- =========================================================
-- 4. QRS TABLE
-- =========================================================
CREATE TABLE IF NOT EXISTS public.qrs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    qr_code_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'unassigned',
    vehicle_id UUID,
    user_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    activated_at TIMESTAMPTZ,
    scan_count INTEGER NOT NULL DEFAULT 0,
    sticker_printed BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT constraint_qrs_code_unique UNIQUE (qr_code_id),
    CONSTRAINT constraint_qrs_status_check CHECK (status IN ('unassigned', 'active', 'disabled')),
    CONSTRAINT fk_qrs_vehicle FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id) ON DELETE SET NULL,
    CONSTRAINT fk_qrs_user FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- =========================================================
-- 5. SCANS LOG TABLE
-- =========================================================
CREATE TABLE IF NOT EXISTS public.scans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    qr_code_id TEXT NOT NULL,
    scanned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ip_address TEXT,
    user_agent TEXT,
    CONSTRAINT fk_scans_qr FOREIGN KEY (qr_code_id) REFERENCES public.qrs(qr_code_id) ON DELETE CASCADE
);

-- =========================================================
-- 6. NOTIFICATIONS TABLE
-- =========================================================
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    notification_type TEXT NOT NULL DEFAULT 'call_attempt',
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
    CONSTRAINT constraint_notifications_type_check CHECK (notification_type IN ('call_attempt', 'system', 'emergency'))
);

-- =========================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- =========================================================
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON public.profiles(phone);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_vehicles_user_id ON public.vehicles(user_id);
CREATE INDEX IF NOT EXISTS idx_qrs_qr_code_id ON public.qrs(qr_code_id);
CREATE INDEX IF NOT EXISTS idx_qrs_user_id ON public.qrs(user_id);
CREATE INDEX IF NOT EXISTS idx_qrs_vehicle_id ON public.qrs(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_qrs_status ON public.qrs(status);
CREATE INDEX IF NOT EXISTS idx_scans_qr_code_id ON public.scans(qr_code_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);

-- =========================================================
-- SEED DEFAULT DATA
-- =========================================================
INSERT INTO public.packages (id, name, price, currency, badge, is_active)
VALUES ('standard', 'Standart Paket', 200.00, 'TL', 'En Popüler', TRUE)
ON CONFLICT (id) DO UPDATE SET price = 200.00;

-- Initial Demo Admin Account (phone: 5000000000, pass: fettahyusuf1212!)
INSERT INTO public.profiles (id, full_name, phone, password_hash, role)
VALUES ('00000000-0000-0000-0000-000000000001', 'VEXO Yönetici', '5000000000', 'fettahyusuf1212!', 'admin')
ON CONFLICT (phone) DO NOTHING;

-- Initial Demo User Account (phone: 5321002030, pass: 123456)
INSERT INTO public.profiles (id, full_name, phone, password_hash, role)
VALUES ('00000000-0000-0000-0000-000000000002', 'Arif Yılmaz', '5321002030', '123456', 'user')
ON CONFLICT (phone) DO NOTHING;

-- Initial Demo Vehicle
INSERT INTO public.vehicles (id, user_id, plate_number, package_id)
VALUES ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', '34 VEX 34', 'standard')
ON CONFLICT (id) DO NOTHING;

-- Initial Demo QR Codes
INSERT INTO public.qrs (id, qr_code_id, status, vehicle_id, user_id, activated_at, scan_count)
VALUES 
    ('00000000-0000-0000-0000-000000000004', 'Q7XaP9LmR4Tk8WnB', 'active', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', NOW(), 14),
    ('00000000-0000-0000-0000-000000000005', 'DEMO123', 'unassigned', NULL, NULL, NULL, 0),
    ('00000000-0000-0000-0000-000000000006', 'Q9ZbK4P1M7XwN3Rt', 'unassigned', NULL, NULL, NULL, 0)
ON CONFLICT (qr_code_id) DO NOTHING;

-- =========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qrs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- PACKAGES
DROP POLICY IF EXISTS "Allow all for packages" ON public.packages;
CREATE POLICY "Allow all for packages" ON public.packages FOR ALL USING (true) WITH CHECK (true);

-- PROFILES
DROP POLICY IF EXISTS "Allow all for profiles" ON public.profiles;
CREATE POLICY "Allow all for profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);

-- VEHICLES
DROP POLICY IF EXISTS "Allow all for vehicles" ON public.vehicles;
CREATE POLICY "Allow all for vehicles" ON public.vehicles FOR ALL USING (true) WITH CHECK (true);

-- QRS
DROP POLICY IF EXISTS "Allow all for qrs" ON public.qrs;
CREATE POLICY "Allow all for qrs" ON public.qrs FOR ALL USING (true) WITH CHECK (true);

-- SCANS
DROP POLICY IF EXISTS "Allow all for scans" ON public.scans;
CREATE POLICY "Allow all for scans" ON public.scans FOR ALL USING (true) WITH CHECK (true);

-- NOTIFICATIONS
DROP POLICY IF EXISTS "Allow all for notifications" ON public.notifications;
CREATE POLICY "Allow all for notifications" ON public.notifications FOR ALL USING (true) WITH CHECK (true);

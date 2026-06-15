-- SQL Schema for Barbershop AI Bot & Admin Dashboard
-- Paste this script in your Supabase SQL Editor (Dashboard > SQL Editor > New Query > Run)

-- 1. Services Table
CREATE TABLE IF NOT EXISTS public.barbershop_services (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price INTEGER NOT NULL,
    duration_minutes INTEGER NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE NOT NULL
);

-- 2. Barbers Table
CREATE TABLE IF NOT EXISTS public.barbershop_barbers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    rating NUMERIC(3, 2) DEFAULT 5.0 NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL
);

-- 3. Settings Table
CREATE TABLE IF NOT EXISTS public.barbershop_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL
);

-- 4. Bookings Table
CREATE TABLE IF NOT EXISTS public.barbershop_bookings (
    id TEXT PRIMARY KEY,
    client_name TEXT NOT NULL,
    client_phone TEXT NOT NULL,
    service_id TEXT REFERENCES public.barbershop_services(id) ON DELETE SET NULL,
    service_name TEXT NOT NULL,
    price INTEGER NOT NULL,
    barber_id TEXT REFERENCES public.barbershop_barbers(id) ON DELETE SET NULL,
    barber_name TEXT NOT NULL,
    date TEXT NOT NULL, -- Format: YYYY-MM-DD
    time TEXT NOT NULL, -- Format: HH:MM
    status TEXT DEFAULT 'confirmed' NOT NULL, -- 'confirmed', 'cancelled', 'completed'
    user_id BIGINT, -- Telegram User ID
    username TEXT, -- Telegram Username
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Realtime for bookings (useful for real-time dashboard updates)
ALTER PUBLICATION supabase_realtime ADD TABLE public.barbershop_bookings;

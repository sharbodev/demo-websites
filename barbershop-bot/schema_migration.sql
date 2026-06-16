-- SQL Schema Migrations for Barbershop Bot Improvements
-- Paste this script in your Supabase SQL Editor (Dashboard > SQL Editor > New Query > Run)

-- 1. Add loyalty, reminder, and review columns to public.barbershop_bookings
ALTER TABLE public.barbershop_bookings ADD COLUMN IF NOT EXISTS loyalty_processed BOOLEAN DEFAULT FALSE;
ALTER TABLE public.barbershop_bookings ADD COLUMN IF NOT EXISTS discount_applied BOOLEAN DEFAULT FALSE;
ALTER TABLE public.barbershop_bookings ADD COLUMN IF NOT EXISTS reminder_sent_24h BOOLEAN DEFAULT FALSE;
ALTER TABLE public.barbershop_bookings ADD COLUMN IF NOT EXISTS reminder_sent_2h BOOLEAN DEFAULT FALSE;
ALTER TABLE public.barbershop_bookings ADD COLUMN IF NOT EXISTS review_requested BOOLEAN DEFAULT FALSE;

-- 2. Create Clients Table
CREATE TABLE IF NOT EXISTS public.barbershop_clients (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    telegram_user_id BIGINT UNIQUE,
    telegram_username TEXT,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    loyalty_visits INTEGER DEFAULT 0 NOT NULL,
    discount_available BOOLEAN DEFAULT FALSE NOT NULL,
    discount_percent INTEGER DEFAULT 20 NOT NULL,
    referral_code TEXT UNIQUE,
    referred_by TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Loyalty Log Table
CREATE TABLE IF NOT EXISTS public.barbershop_loyalty_log (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    client_id TEXT REFERENCES public.barbershop_clients(id) ON DELETE CASCADE NOT NULL,
    booking_id TEXT REFERENCES public.barbershop_bookings(id) ON DELETE SET NULL,
    action TEXT NOT NULL, -- 'visit_counted', 'discount_earned', 'discount_used', 'referral_bonus'
    visits_before INTEGER NOT NULL,
    visits_after INTEGER NOT NULL,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create Reviews Table
CREATE TABLE IF NOT EXISTS public.barbershop_reviews (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    booking_id TEXT REFERENCES public.barbershop_bookings(id) ON DELETE SET NULL,
    client_id TEXT REFERENCES public.barbershop_clients(id) ON DELETE SET NULL,
    barber_id TEXT REFERENCES public.barbershop_barbers(id) ON DELETE SET NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Realtime for new tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.barbershop_clients;
ALTER PUBLICATION supabase_realtime ADD TABLE public.barbershop_reviews;

"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { 
  Calendar, 
  Users, 
  Scissors, 
  Settings as SettingsIcon, 
  Plus, 
  Trash2, 
  Check, 
  X, 
  Save, 
  Database,
  Smartphone,
  CheckCircle,
  AlertCircle,
  Menu,
  Clock,
  MapPin,
  Phone,
  MessageSquare,
  Star,
  TrendingUp,
  Award
} from "lucide-react";

export default function BarbershopAdmin() {
  // Database configuration states
  const [supabaseUrl, setSupabaseUrl] = useState("");
  const [supabaseKey, setSupabaseKey] = useState("");
  const [isDbConfigured, setIsDbConfigured] = useState(false);
  const [supabaseClient, setSupabaseClient] = useState<any>(null);

  // Active tab state: 'bookings' | 'barbers' | 'services' | 'settings'
  const [activeTab, setActiveTab] = useState("bookings");

  // Data states
  const [bookings, setBookings] = useState<any[]>([]);
  const [barbers, setBarbers] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({
    business_name: "Blade Barbershop",
    phone: "+996 555 123 456",
    address: "ул. Киевская 122, Бишкек",
    working_hours: { weekdays: "10:00 - 21:00", saturday: "10:00 - 21:00", sunday: "11:00 - 19:00" },
    ai_instructions: "Ты — администратор...",
    faq: []
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Modals / forms states
  const [newBarberName, setNewBarberName] = useState("");
  const [newBarberRating, setNewBarberRating] = useState("5.0");
  const [newServiceName, setNewServiceName] = useState("");
  const [newServicePrice, setNewServicePrice] = useState("");
  const [newServiceDuration, setNewServiceDuration] = useState("40");
  const [newServiceDesc, setNewServiceDesc] = useState("");

  // 1. Initialize Supabase client
  useEffect(() => {
    // Check environment variables first
    const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Check local storage second
    const localUrl = localStorage.getItem("barbershop_supabase_url");
    const localKey = localStorage.getItem("barbershop_supabase_key");

    const finalUrl = envUrl || localUrl || "";
    const finalKey = envKey || localKey || "";

    if (finalUrl && finalKey) {
      try {
        const client = createClient(finalUrl, finalKey);
        setSupabaseClient(client);
        setSupabaseUrl(finalUrl);
        setSupabaseKey(finalKey);
        setIsDbConfigured(true);
      } catch (err) {
        console.error("Supabase client init error:", err);
      }
    }
  }, []);

  // 2. Fetch data from Supabase
  useEffect(() => {
    if (isDbConfigured && supabaseClient) {
      fetchData();
    }
  }, [isDbConfigured, supabaseClient]);

  const fetchData = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      // Fetch bookings
      const { data: bData, error: bErr } = await supabaseClient
        .from("barbershop_bookings")
        .select("*")
        .order("created_at", { ascending: false });
      if (bErr) throw bErr;
      setBookings(bData || []);

      // Fetch barbers
      const { data: barData, error: barErr } = await supabaseClient
        .from("barbershop_barbers")
        .select("*")
        .order("name");
      if (barErr) throw barErr;
      setBarbers(barData || []);

      // Fetch services
      const { data: sData, error: sErr } = await supabaseClient
        .from("barbershop_services")
        .select("*")
        .order("name");
      if (sErr) throw sErr;
      setServices(sData || []);

      // Fetch clients
      const { data: cData, error: cErr } = await supabaseClient
        .from("barbershop_clients")
        .select("*")
        .order("created_at", { ascending: false });
      if (!cErr) setClients(cData || []);

      // Fetch reviews
      const { data: rData, error: rErr } = await supabaseClient
        .from("barbershop_reviews")
        .select("*")
        .order("created_at", { ascending: false });
      if (!rErr) setReviews(rData || []);

      // Fetch settings
      const { data: setDocs, error: setErr } = await supabaseClient
        .from("barbershop_settings")
        .select("value")
        .eq("key", "general");
      if (setErr) throw setErr;
      
      if (setDocs && setDocs.length > 0) {
        setSettings(setDocs[0].value);
      }
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setErrorMsg(`Не удалось загрузить данные: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  // 3. Save Supabase keys to local storage
  const handleSaveKeys = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabaseUrl.trim() || !supabaseKey.trim()) {
      setErrorMsg("Заполните оба поля!");
      return;
    }

    try {
      localStorage.setItem("barbershop_supabase_url", supabaseUrl.trim());
      localStorage.setItem("barbershop_supabase_key", supabaseKey.trim());
      
      const client = createClient(supabaseUrl.trim(), supabaseKey.trim());
      setSupabaseClient(client);
      setIsDbConfigured(true);
      setErrorMsg("");
      setSuccessMsg("Подключение успешно настроено!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err: any) {
      setErrorMsg(`Ошибка подключения: ${err.message}`);
    }
  };

  const handleResetConnection = () => {
    if (confirm("Вы уверены, что хотите сбросить подключение к базе данных?")) {
      localStorage.removeItem("barbershop_supabase_url");
      localStorage.removeItem("barbershop_supabase_key");
      setSupabaseClient(null);
      setSupabaseUrl("");
      setSupabaseKey("");
      setIsDbConfigured(false);
      setBookings([]);
      setBarbers([]);
      setServices([]);
    }
  };

  // 4. Update Barber toggle
  const toggleBarberActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabaseClient
        .from("barbershop_barbers")
        .update({ is_active: !currentStatus })
        .eq("id", id);
      if (error) throw error;
      setBarbers(barbers.map(b => b.id === id ? { ...b, is_active: !currentStatus } : b));
      showSuccess("Мастер успешно обновлен");
    } catch (err: any) {
      alert(`Ошибка: ${err.message}`);
    }
  };

  // 5. Add Barber
  const handleAddBarber = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBarberName.trim()) return;

    const id = newBarberName.toLowerCase().replace(/\s+/g, "_");
    const newBarber = {
      id,
      name: newBarberName.trim(),
      rating: parseFloat(newBarberRating) || 5.0,
      is_active: true
    };

    try {
      const { error } = await supabaseClient
        .from("barbershop_barbers")
        .insert(newBarber);
      if (error) throw error;
      
      setBarbers([...barbers, newBarber]);
      setNewBarberName("");
      showSuccess("Мастер успешно добавлен!");
    } catch (err: any) {
      alert(`Ошибка добавления мастера: ${err.message}`);
    }
  };

  // 6. Delete Barber
  const handleDeleteBarber = async (id: string) => {
    if (!confirm("Удалить мастера? Все связанные записи останутся, но мастер больше не будет доступен.")) return;
    try {
      const { error } = await supabaseClient
        .from("barbershop_barbers")
        .delete()
        .eq("id", id);
      if (error) throw error;
      setBarbers(barbers.filter(b => b.id !== id));
      showSuccess("Мастер удален");
    } catch (err: any) {
      alert(`Ошибка: ${err.message}`);
    }
  };

  // 7. Toggle Service
  const toggleServiceActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabaseClient
        .from("barbershop_services")
        .update({ is_active: !currentStatus })
        .eq("id", id);
      if (error) throw error;
      setServices(services.map(s => s.id === id ? { ...s, is_active: !currentStatus } : s));
      showSuccess("Услуга обновлена");
    } catch (err: any) {
      alert(`Ошибка: ${err.message}`);
    }
  };

  // 8. Add Service
  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName.trim() || !newServicePrice) return;

    const id = newServiceName.toLowerCase().replace(/\s+/g, "_");
    const newService = {
      id,
      name: newServiceName.trim(),
      price: parseInt(newServicePrice),
      duration_minutes: parseInt(newServiceDuration) || 40,
      description: newServiceDesc.trim(),
      is_active: true
    };

    try {
      const { error } = await supabaseClient
        .from("barbershop_services")
        .insert(newService);
      if (error) throw error;
      
      setServices([...services, newService]);
      setNewServiceName("");
      setNewServicePrice("");
      setNewServiceDesc("");
      showSuccess("Услуга успешно добавлена!");
    } catch (err: any) {
      alert(`Ошибка добавления услуги: ${err.message}`);
    }
  };

  // 9. Delete Service
  const handleDeleteService = async (id: string) => {
    if (!confirm("Удалить услугу?")) return;
    try {
      const { error } = await supabaseClient
        .from("barbershop_services")
        .delete()
        .eq("id", id);
      if (error) throw error;
      setServices(services.filter(s => s.id !== id));
      showSuccess("Услуга удалена");
    } catch (err: any) {
      alert(`Ошибка: ${err.message}`);
    }
  };

  // 10. Update Booking status (complete/cancel)
  const updateBookingStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabaseClient
        .from("barbershop_bookings")
        .update({ status: newStatus })
        .eq("id", id);
      if (error) throw error;
      setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
      showSuccess(`Запись ${newStatus === "cancelled" ? "отменена" : "выполнена"}`);
    } catch (err: any) {
      alert(`Ошибка: ${err.message}`);
    }
  };

  // 10b. Delete Booking
  const deleteBooking = async (id: string) => {
    if (!confirm("Вы уверены, что хотите безвозвратно удалить эту запись?")) return;
    try {
      const { error } = await supabaseClient
        .from("barbershop_bookings")
        .delete()
        .eq("id", id);
      if (error) throw error;
      setBookings(bookings.filter(b => b.id !== id));
      showSuccess("Запись успешно удалена");
    } catch (err: any) {
      alert(`Ошибка при удалении: ${err.message}`);
    }
  };

  // 10c. Update Client Loyalty stats manually
  const updateClientLoyalty = async (id: string, visits: number, discountAvailable: boolean) => {
    try {
      const { error } = await supabaseClient
        .from("barbershop_clients")
        .update({ loyalty_visits: visits, discount_available: discountAvailable })
        .eq("id", id);
      if (error) throw error;
      setClients(clients.map(c => c.id === id ? { ...c, loyalty_visits: visits, discount_available: discountAvailable } : c));
      showSuccess("Лояльность клиента успешно обновлена");
    } catch (err: any) {
      alert(`Ошибка при обновлении лояльности: ${err.message}`);
    }
  };

  // 11. Save general settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabaseClient
        .from("barbershop_settings")
        .upsert({
          key: "general",
          value: settings
        });
      if (error) throw error;
      showSuccess("Настройки успешно сохранены!");
    } catch (err: any) {
      alert(`Ошибка сохранения настроек: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  // SQL schema code string for instructions
  const sqlSchemaCode = `CREATE TABLE barbershop_services (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price INTEGER NOT NULL,
    duration_minutes INTEGER NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE NOT NULL
);

CREATE TABLE barbershop_barbers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    rating NUMERIC(3, 2) DEFAULT 5.0 NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL
);

CREATE TABLE barbershop_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL
);

CREATE TABLE barbershop_bookings (
    id TEXT PRIMARY KEY,
    client_name TEXT NOT NULL,
    client_phone TEXT NOT NULL,
    service_id TEXT REFERENCES barbershop_services(id),
    service_name TEXT NOT NULL,
    price INTEGER NOT NULL,
    barber_id TEXT REFERENCES barbershop_barbers(id),
    barber_name TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    status TEXT DEFAULT 'confirmed' NOT NULL,
    user_id BIGINT,
    username TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);`;

  // --- RENDERING CONFIGURATION GUIDE IF DB NOT CONFIGURED ---
  if (!isDbConfigured) {
    return (
      <div className="min-h-screen bg-[#070A13] text-[#E2E8F0] py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-3xl mx-auto bg-[#0F172A]/80 border border-[#1E293B] rounded-2xl p-8 backdrop-blur-md shadow-2xl">
          <div className="flex items-center space-x-3 mb-6 text-indigo-400">
            <Database className="w-8 h-8" />
            <h1 className="text-2xl font-bold tracking-tight">Подключение к базе данных Supabase</h1>
          </div>

          <p className="text-[#94A3B8] mb-8 leading-relaxed">
            Похоже, база данных ещё не подключена. Мы используем бесплатное облачное хранилище Supabase. 
            Следуйте инструкции ниже, чтобы подключить панель управления за 3 минуты.
          </p>

          <div className="space-y-6 mb-8">
            <div className="bg-[#1E293B]/50 p-5 rounded-xl border border-[#334155]">
              <h3 className="font-semibold text-white mb-2 flex items-center">
                <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs mr-2">1</span>
                Создайте проект в Supabase
              </h3>
              <p className="text-sm text-[#94A3B8] pl-8">
                Зайдите на <a href="https://supabase.com/" target="_blank" rel="noreferrer" className="text-indigo-400 underline">supabase.com</a>, 
                зарегистрируйтесь (бесплатно) и создайте новый проект (например, "Barbershop Bot").
              </p>
            </div>

            <div className="bg-[#1E293B]/50 p-5 rounded-xl border border-[#334155]">
              <h3 className="font-semibold text-white mb-2 flex items-center">
                <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs mr-2">2</span>
                Создайте таблицы (SQL Editor)
              </h3>
              <p className="text-sm text-[#94A3B8] pl-8 mb-3">
                В левом меню Supabase откройте раздел **SQL Editor**, нажмите **New Query**, вставьте код ниже и нажмите **Run**:
              </p>
              <pre className="text-xs bg-[#070A13] p-4 rounded-lg overflow-x-auto text-cyan-400 border border-[#1E293B] max-h-48 pl-8">
                {sqlSchemaCode}
              </pre>
            </div>

            <div className="bg-[#1E293B]/50 p-5 rounded-xl border border-[#334155]">
              <h3 className="font-semibold text-white mb-2 flex items-center">
                <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs mr-2">3</span>
                Скопируйте ключи API
              </h3>
              <p className="text-sm text-[#94A3B8] pl-8">
                Перейдите в **Project Settings ➡️ API** и найдите параметры **Project URL** и **anon public API key**.
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveKeys} className="space-y-4">
            <h3 className="font-semibold text-white text-lg">Ввод настроек подключения</h3>
            
            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#94A3B8] mb-1">SUPABASE_URL</label>
              <input 
                type="text" 
                placeholder="https://xxxxxxxxx.supabase.co" 
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                className="w-full bg-[#070A13] border border-[#1E293B] rounded-lg px-4 py-2.5 text-[#E2E8F0] focus:outline-none focus:border-indigo-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#94A3B8] mb-1">SUPABASE_ANON_KEY</label>
              <input 
                type="password" 
                placeholder="eyJhbGciOi..." 
                value={supabaseKey}
                onChange={(e) => setSupabaseKey(e.target.value)}
                className="w-full bg-[#070A13] border border-[#1E293B] rounded-lg px-4 py-2.5 text-[#E2E8F0] focus:outline-none focus:border-indigo-500 text-sm"
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 px-4 rounded-lg transition duration-200 text-sm flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/25 mt-6 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Подключить и войти</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- MAIN ADMIN PANEL VIEW (ONCE DB CONFIGURED) ---
  return (
    <div className="min-h-screen bg-[#070A13] text-[#E2E8F0] font-sans">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-[#0F172A]/85 backdrop-blur-md border-b border-[#1E293B] px-4 sm:px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <Scissors className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight">{settings.business_name || "Blade Barbershop"}</h1>
              <span className="text-xs text-[#94A3B8] flex items-center">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                Панель управления 24/7
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button 
              onClick={fetchData}
              className="text-xs bg-[#1E293B] hover:bg-[#2D3748] px-3 py-1.5 rounded-lg border border-[#334155] cursor-pointer transition"
            >
              Обновить
            </button>
            <button 
              onClick={handleResetConnection}
              title="Сбросить подключение к Supabase"
              className="text-xs bg-red-950/40 hover:bg-red-900/50 text-red-400 px-3 py-1.5 rounded-lg border border-red-900/40 cursor-pointer transition"
            >
              Сбросить БД
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        
        {/* Alerts / Status banners */}
        {successMsg && (
          <div className="mb-6 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl text-sm flex items-center space-x-2 animate-bounce">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-sm flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Tab Buttons (Mobile Friendly Slider / Grid) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 mb-8 bg-[#0F172A]/50 border border-[#1E293B] p-1.5 rounded-xl">
          <button
            onClick={() => setActiveTab("bookings")}
            className={`flex items-center justify-center space-x-2 py-3 px-1.5 rounded-lg text-xs sm:text-sm font-medium transition cursor-pointer ${
              activeTab === "bookings" ? "bg-indigo-600 text-white shadow-md" : "text-[#94A3B8] hover:text-white"
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Записи</span>
          </button>
          <button
            onClick={() => setActiveTab("barbers")}
            className={`flex items-center justify-center space-x-2 py-3 px-1.5 rounded-lg text-xs sm:text-sm font-medium transition cursor-pointer ${
              activeTab === "barbers" ? "bg-indigo-600 text-white shadow-md" : "text-[#94A3B8] hover:text-white"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Мастера</span>
          </button>
          <button
            onClick={() => setActiveTab("services")}
            className={`flex items-center justify-center space-x-2 py-3 px-1.5 rounded-lg text-xs sm:text-sm font-medium transition cursor-pointer ${
              activeTab === "services" ? "bg-indigo-600 text-white shadow-md" : "text-[#94A3B8] hover:text-white"
            }`}
          >
            <Scissors className="w-4 h-4" />
            <span>Услуги</span>
          </button>
          <button
            onClick={() => setActiveTab("clients")}
            className={`flex items-center justify-center space-x-2 py-3 px-1.5 rounded-lg text-xs sm:text-sm font-medium transition cursor-pointer ${
              activeTab === "clients" ? "bg-indigo-600 text-white shadow-md" : "text-[#94A3B8] hover:text-white"
            }`}
          >
            <Users className="w-4 h-4 text-emerald-400" />
            <span>Клиенты</span>
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`flex items-center justify-center space-x-2 py-3 px-1.5 rounded-lg text-xs sm:text-sm font-medium transition cursor-pointer ${
              activeTab === "reviews" ? "bg-indigo-600 text-white shadow-md" : "text-[#94A3B8] hover:text-white"
            }`}
          >
            <Star className="w-4 h-4 text-amber-400" />
            <span>Отзывы</span>
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`flex items-center justify-center space-x-2 py-3 px-1.5 rounded-lg text-xs sm:text-sm font-medium transition cursor-pointer ${
              activeTab === "analytics" ? "bg-indigo-600 text-white shadow-md" : "text-[#94A3B8] hover:text-white"
            }`}
          >
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <span>Аналитика</span>
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center justify-center space-x-2 py-3 px-1.5 rounded-lg text-xs sm:text-sm font-medium transition cursor-pointer ${
              activeTab === "settings" ? "bg-indigo-600 text-white shadow-md" : "text-[#94A3B8] hover:text-white"
            }`}
          >
            <SettingsIcon className="w-4 h-4" />
            <span>Настройки</span>
          </button>
        </div>

        {/* LOADING INDICATOR */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-10 h-10 border-4 border-t-indigo-500 border-indigo-950 rounded-full animate-spin mb-3"></div>
            <p className="text-sm text-[#94A3B8]">Загрузка данных из облака...</p>
          </div>
        )}

        {/* --- TAB CONTENT: BOOKINGS --- */}
        {!loading && activeTab === "bookings" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-indigo-400" />
              <span>Список записей клиентов</span>
            </h2>

            {bookings.length === 0 ? (
              <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-12 text-center">
                <Calendar className="w-12 h-12 text-[#334155] mx-auto mb-3" />
                <p className="text-[#94A3B8] text-sm">Записей клиентов пока нет.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bookings.map((booking) => (
                  <div 
                    key={booking.id} 
                    className={`bg-[#0F172A]/85 border rounded-2xl p-5 shadow-lg relative overflow-hidden transition ${
                      booking.status === "cancelled" 
                        ? "border-red-950 opacity-60" 
                        : booking.status === "completed" 
                        ? "border-emerald-950/60 bg-emerald-950/5" 
                        : "border-[#1E293B]"
                    }`}
                  >
                    {/* Status Badge & Delete Button */}
                    <div className="absolute top-4 right-4 flex items-center space-x-2">
                      <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                        booking.status === "cancelled" 
                          ? "bg-red-500/15 text-red-400" 
                          : booking.status === "completed" 
                          ? "bg-emerald-500/15 text-emerald-400" 
                          : "bg-indigo-500/15 text-indigo-400 animate-pulse"
                      }`}>
                        {booking.status === "cancelled" ? "Отменено" : booking.status === "completed" ? "Выполнено" : "Подтверждено"}
                      </span>
                      <button
                        onClick={() => deleteBooking(booking.id)}
                        className="text-[#64748B] hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition cursor-pointer flex items-center justify-center"
                        title="Удалить запись"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h3 className="font-bold text-white text-lg">{booking.client_name}</h3>
                        <p className="text-xs text-indigo-400 flex items-center mt-1">
                          <Phone className="w-3.5 h-3.5 mr-1" />
                          <a href={`tel:${booking.client_phone}`}>{booking.client_phone}</a>
                        </p>
                      </div>

                      <div className="border-t border-[#1E293B] pt-3 grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-[#64748B] block uppercase tracking-wider text-[10px]">Услуга:</span>
                          <span className="font-semibold text-white">{booking.service_name}</span>
                          <span className="text-[#94A3B8] block">
                            {booking.price} сом
                            {booking.discount_applied && (
                              <span className="ml-1.5 px-1.5 py-0.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded text-[9px] font-medium uppercase tracking-wider">Скидка</span>
                            )}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#64748B] block uppercase tracking-wider text-[10px]">Мастер:</span>
                          <span className="font-semibold text-white">{booking.barber_name}</span>
                        </div>
                      </div>

                      <div className="bg-[#070A13] px-3 py-2 rounded-xl flex items-center justify-between text-xs border border-[#1E293B]">
                        <div className="flex items-center space-x-1.5 text-[#E2E8F0]">
                          <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                          <span>{booking.date}</span>
                        </div>
                        <div className="flex items-center space-x-1.5 text-[#E2E8F0]">
                          <Clock className="w-3.5 h-3.5 text-indigo-400" />
                          <span>{booking.time}</span>
                        </div>
                      </div>

                      {/* Telegram Username Info */}
                      {booking.username && (
                        <p className="text-[11px] text-[#64748B] flex items-center">
                          <MessageSquare className="w-3.5 h-3.5 mr-1 text-slate-500" />
                          tg: @{booking.username}
                        </p>
                      )}

                      {/* Control buttons */}
                      {booking.status === "confirmed" && (
                        <div className="flex items-center space-x-2 pt-2">
                          <button
                            onClick={() => updateBookingStatus(booking.id, "completed")}
                            className="flex-1 bg-emerald-600/10 hover:bg-emerald-600/25 border border-emerald-500/35 text-emerald-400 hover:text-emerald-300 font-medium py-2 rounded-lg text-xs transition cursor-pointer"
                          >
                            Завершить
                          </button>
                          <button
                            onClick={() => updateBookingStatus(booking.id, "cancelled")}
                            className="flex-1 bg-red-600/10 hover:bg-red-600/25 border border-red-500/35 text-red-400 hover:text-red-300 font-medium py-2 rounded-lg text-xs transition cursor-pointer"
                          >
                            Отменить
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- TAB CONTENT: BARBERS --- */}
        {!loading && activeTab === "barbers" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-xl font-bold flex items-center space-x-2">
                <Users className="w-5 h-5 text-indigo-400" />
                <span>Управление мастерами (барберами)</span>
              </h2>
            </div>

            {/* Add Barber Form */}
            <form onSubmit={handleAddBarber} className="bg-[#0F172A]/70 border border-[#1E293B] p-5 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#94A3B8] mb-1">Имя мастера</label>
                <input 
                  type="text" 
                  placeholder="Самат Саматов"
                  value={newBarberName}
                  onChange={(e) => setNewBarberName(e.target.value)}
                  className="w-full bg-[#070A13] border border-[#1E293B] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#94A3B8] mb-1">Рейтинг (⭐)</label>
                <select 
                  value={newBarberRating}
                  onChange={(e) => setNewBarberRating(e.target.value)}
                  className="w-full bg-[#070A13] border border-[#1E293B] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 text-sm"
                >
                  <option value="5.0">5.0 ⭐</option>
                  <option value="4.9">4.9 ⭐</option>
                  <option value="4.8">4.8 ⭐</option>
                  <option value="4.7">4.7 ⭐</option>
                  <option value="4.5">4.5 ⭐</option>
                </select>
              </div>
              <button 
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 px-4 rounded-lg transition text-sm flex items-center justify-center space-x-1 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Добавить барбера</span>
              </button>
            </form>

            {/* Barbers Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {barbers.map((barber) => (
                <div 
                  key={barber.id}
                  className={`border rounded-2xl p-5 shadow-md flex items-center justify-between ${
                    barber.is_active ? "bg-[#0F172A] border-[#1E293B]" : "bg-[#0F172A]/40 border-dashed border-[#1E293B] opacity-50"
                  }`}
                >
                  <div>
                    <h3 className="font-bold text-white text-base">{barber.name}</h3>
                    <p className="text-xs text-amber-400 mt-0.5">⭐ {barber.rating} Рейтинг</p>
                    <span className={`inline-block text-[10px] mt-2 font-semibold px-2 py-0.5 rounded-full ${
                      barber.is_active ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-500/10 text-slate-400"
                    }`}>
                      {barber.is_active ? "Активен (принимает записи)" : "Отключен"}
                    </span>
                  </div>

                  <div className="flex flex-col items-end space-y-3">
                    <button
                      onClick={() => toggleBarberActive(barber.id, barber.is_active)}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-medium cursor-pointer transition ${
                        barber.is_active 
                          ? "bg-amber-600/10 hover:bg-amber-600/25 border-amber-500/30 text-amber-400" 
                          : "bg-emerald-600/10 hover:bg-emerald-600/25 border-emerald-500/30 text-emerald-400"
                      }`}
                    >
                      {barber.is_active ? "Отключить" : "Включить"}
                    </button>
                    <button
                      onClick={() => handleDeleteBarber(barber.id)}
                      className="text-red-400 hover:text-red-300 p-1.5 rounded-lg hover:bg-red-500/10 transition cursor-pointer"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TAB CONTENT: SERVICES --- */}
        {!loading && activeTab === "services" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold flex items-center space-x-2">
              <Scissors className="w-5 h-5 text-indigo-400" />
              <span>Управление списком услуг</span>
            </h2>

            {/* Add Service Form */}
            <form onSubmit={handleAddService} className="bg-[#0F172A]/70 border border-[#1E293B] p-5 rounded-2xl space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#94A3B8] mb-1">Название услуги</label>
                  <input 
                    type="text" 
                    placeholder="Моделирование бороды"
                    value={newServiceName}
                    onChange={(e) => setNewServiceName(e.target.value)}
                    className="w-full bg-[#070A13] border border-[#1E293B] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#94A3B8] mb-1">Цена (сом)</label>
                  <input 
                    type="number" 
                    placeholder="400"
                    value={newServicePrice}
                    onChange={(e) => setNewServicePrice(e.target.value)}
                    className="w-full bg-[#070A13] border border-[#1E293B] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#94A3B8] mb-1">Длительность (мин)</label>
                  <input 
                    type="number" 
                    placeholder="30"
                    value={newServiceDuration}
                    onChange={(e) => setNewServiceDuration(e.target.value)}
                    className="w-full bg-[#070A13] border border-[#1E293B] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#94A3B8] mb-1">Короткое описание</label>
                <textarea 
                  placeholder="Стрижка бороды и усов, оформление контуров шейвером."
                  rows={2}
                  value={newServiceDesc}
                  onChange={(e) => setNewServiceDesc(e.target.value)}
                  className="w-full bg-[#070A13] border border-[#1E293B] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 text-sm resize-none"
                />
              </div>

              <div className="flex justify-end">
                <button 
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 px-6 rounded-lg transition text-sm flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Добавить услугу</span>
                </button>
              </div>
            </form>

            {/* Services Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {services.map((service) => (
                <div 
                  key={service.id}
                  className={`border rounded-2xl p-5 shadow-md flex justify-between ${
                    service.is_active ? "bg-[#0F172A] border-[#1E293B]" : "bg-[#0F172A]/40 border-dashed border-[#1E293B] opacity-50"
                  }`}
                >
                  <div className="space-y-1 pr-4">
                    <h3 className="font-bold text-white text-base">{service.name}</h3>
                    <p className="text-xs text-[#94A3B8] italic">{service.description || "Без описания"}</p>
                    <div className="flex items-center space-x-4 pt-1.5 text-xs text-[#E2E8F0]">
                      <span className="bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-md font-semibold">{service.price} сом</span>
                      <span className="bg-[#1E293B] px-2 py-0.5 rounded-md text-[#94A3B8]">{service.duration_minutes} минут</span>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between items-end flex-shrink-0">
                    <button
                      onClick={() => toggleServiceActive(service.id, service.is_active)}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-medium cursor-pointer transition ${
                        service.is_active 
                          ? "bg-amber-600/10 hover:bg-amber-600/25 border-amber-500/30 text-amber-400" 
                          : "bg-emerald-600/10 hover:bg-emerald-600/25 border-emerald-500/30 text-emerald-400"
                      }`}
                    >
                      {service.is_active ? "Скрыть" : "Показать"}
                    </button>
                    <button
                      onClick={() => handleDeleteService(service.id)}
                      className="text-red-400 hover:text-red-300 p-1.5 rounded-lg hover:bg-red-500/10 transition mt-4 cursor-pointer"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TAB CONTENT: SETTINGS --- */}
        {!loading && activeTab === "settings" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold flex items-center space-x-2">
              <SettingsIcon className="w-5 h-5 text-indigo-400" />
              <span>Настройки филиала и промпт ИИ</span>
            </h2>

            <form onSubmit={handleSaveSettings} className="bg-[#0F172A] border border-[#1E293B] p-6 rounded-2xl space-y-5 shadow-xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#94A3B8] mb-1">Название бизнеса</label>
                  <input 
                    type="text" 
                    value={settings.business_name || ""}
                    onChange={(e) => setSettings({ ...settings, business_name: e.target.value })}
                    className="w-full bg-[#070A13] border border-[#1E293B] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#94A3B8] mb-1">Номер телефона</label>
                  <input 
                    type="text" 
                    value={settings.phone || ""}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    className="w-full bg-[#070A13] border border-[#1E293B] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#94A3B8] mb-1">Адрес барбершопа</label>
                <input 
                  type="text" 
                  value={settings.address || ""}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  className="w-full bg-[#070A13] border border-[#1E293B] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>

              {/* Working Hours Sub-Group */}
              <div className="border border-[#1E293B] p-4 rounded-xl space-y-3">
                <h4 className="font-semibold text-sm text-indigo-400 flex items-center">
                  <Clock className="w-4.5 h-4.5 mr-1" />
                  <span>Режим работы</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-[#94A3B8] mb-1">Будни</label>
                    <input 
                      type="text" 
                      value={settings.working_hours?.weekdays || ""}
                      onChange={(e) => setSettings({ 
                        ...settings, 
                        working_hours: { ...settings.working_hours, weekdays: e.target.value } 
                      })}
                      className="w-full bg-[#070A13] border border-[#1E293B] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#94A3B8] mb-1">Суббота</label>
                    <input 
                      type="text" 
                      value={settings.working_hours?.saturday || ""}
                      onChange={(e) => setSettings({ 
                        ...settings, 
                        working_hours: { ...settings.working_hours, saturday: e.target.value } 
                      })}
                      className="w-full bg-[#070A13] border border-[#1E293B] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#94A3B8] mb-1">Воскресенье</label>
                    <input 
                      type="text" 
                      value={settings.working_hours?.sunday || ""}
                      onChange={(e) => setSettings({ 
                        ...settings, 
                        working_hours: { ...settings.working_hours, sunday: e.target.value } 
                      })}
                      className="w-full bg-[#070A13] border border-[#1E293B] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 text-sm"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#94A3B8] mb-1">
                  Личность ИИ и Инструкции Администратора (AI System Instructions)
                </label>
                <textarea 
                  rows={6}
                  value={settings.ai_instructions || ""}
                  onChange={(e) => setSettings({ ...settings, ai_instructions: e.target.value })}
                  className="w-full bg-[#070A13] border border-[#1E293B] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 text-sm font-mono leading-relaxed"
                />
              </div>

              <div className="flex justify-end pt-3">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 px-6 rounded-lg transition duration-200 text-sm flex items-center space-x-1.5 shadow-lg shadow-indigo-600/20 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{loading ? "Сохранение..." : "Сохранить изменения"}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* --- TAB CONTENT: CLIENTS --- */}
        {!loading && activeTab === "clients" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold flex items-center space-x-2">
              <Users className="w-5 h-5 text-emerald-400" />
              <span>База клиентов и программа лояльности</span>
            </h2>

            {clients.length === 0 ? (
              <div className="bg-[#0F172A] border border-[#1E293B] p-8 rounded-2xl text-center text-[#94A3B8]">
                Клиенты еще не зарегистрированы в системе.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {clients.map((client) => {
                  return (
                    <div key={client.id} className="bg-[#0F172A]/70 border border-[#1E293B] p-5 rounded-2xl space-y-4 shadow-lg hover:border-emerald-500/25 transition duration-200">
                      <div>
                        <h3 className="font-bold text-white text-base">{client.full_name || "Без имени"}</h3>
                        {client.telegram_username && (
                          <span className="text-xs text-indigo-400 block mt-0.5">tg: @{client.telegram_username}</span>
                        )}
                        <span className="text-xs text-[#94A3B8] block mt-1">📱 {client.phone || "Номер не указан"}</span>
                      </div>

                      <div className="border-t border-[#1E293B]/60 pt-3 space-y-2.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[#64748B]">Прогресс лояльности:</span>
                          <span className="font-bold text-white">{client.loyalty_visits}/3 визитов</span>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="w-full bg-[#070A13] h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-emerald-500 h-full transition-all duration-300"
                            style={{ width: `${(client.loyalty_visits / 3) * 100}%` }}
                          ></div>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[#64748B]">Скидка 20%:</span>
                          {client.discount_available ? (
                            <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full text-[10px] font-semibold tracking-wider">ГОТОВА</span>
                          ) : (
                            <span className="px-2 py-0.5 bg-slate-800 border border-slate-700 text-[#64748B] rounded-full text-[10px] font-semibold tracking-wider">НЕТ</span>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[#64748B]">Реф. код / Приглашён:</span>
                          <span className="font-mono text-white text-[11px] bg-[#070A13] px-2 py-0.5 rounded border border-[#1E293B]">
                            {client.referral_code} {client.referred_by && `(от ${client.referred_by})`}
                          </span>
                        </div>
                      </div>

                      <div className="border-t border-[#1E293B]/60 pt-3 flex items-center justify-between gap-2">
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => updateClientLoyalty(client.id, Math.max(0, client.loyalty_visits - 1), client.discount_available)}
                            className="bg-slate-800 hover:bg-slate-700 text-white font-bold w-8 h-8 rounded-lg text-xs transition cursor-pointer"
                          >
                            -1
                          </button>
                          <button
                            onClick={() => updateClientLoyalty(client.id, Math.min(3, client.loyalty_visits + 1), client.loyalty_visits + 1 >= 3)}
                            className="bg-slate-800 hover:bg-slate-700 text-white font-bold w-8 h-8 rounded-lg text-xs transition cursor-pointer"
                          >
                            +1
                          </button>
                        </div>
                        <button
                          onClick={() => updateClientLoyalty(client.id, client.loyalty_visits, !client.discount_available)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition ${
                            client.discount_available 
                              ? "bg-amber-600/10 hover:bg-amber-600/25 border border-amber-500/30 text-amber-400" 
                              : "bg-emerald-600/10 hover:bg-emerald-600/25 border border-emerald-500/30 text-emerald-400"
                          }`}
                        >
                          {client.discount_available ? "Сбросить скидку" : "Выдать скидку"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* --- TAB CONTENT: REVIEWS --- */}
        {!loading && activeTab === "reviews" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold flex items-center space-x-2">
              <Star className="w-5 h-5 text-amber-400" fill="currentColor" />
              <span>Отзывы клиентов о стрижках</span>
            </h2>

            {reviews.length === 0 ? (
              <div className="bg-[#0F172A] border border-[#1E293B] p-8 rounded-2xl text-center text-[#94A3B8]">
                Отзывов пока нет. Бот запрашивает их через час после стрижки.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviews.map((rev) => {
                  const bInfo = bookings.find(b => b.id === rev.booking_id) || {};
                  const clientInfo = clients.find(c => c.id === rev.client_id) || {};
                  const stars = "★".repeat(rev.rating) + "☆".repeat(5 - rev.rating);
                  
                  return (
                    <div key={rev.id} className="bg-[#0F172A]/70 border border-[#1E293B] p-5 rounded-2xl space-y-3 shadow-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-amber-400 text-lg font-bold tracking-wider">{stars}</span>
                        <span className="text-[10px] text-[#64748B]">
                          {rev.created_at ? new Date(rev.created_at).toLocaleDateString("ru-RU") : ""}
                        </span>
                      </div>
                      
                      {rev.comment && (
                        <p className="text-[#E2E8F0] text-sm italic leading-relaxed bg-[#070A13] p-3 rounded-xl border border-[#1E293B]">
                          "{rev.comment}"
                        </p>
                      )}

                      <div className="border-t border-[#1E293B]/60 pt-3 grid grid-cols-2 gap-2 text-[11px] text-[#94A3B8]">
                        <div>
                          <span className="text-[#64748B] block uppercase text-[9px] tracking-wider">Клиент:</span>
                          <span className="font-semibold text-[#E2E8F0]">{clientInfo.full_name || bInfo.client_name || "Постоянный клиент"}</span>
                        </div>
                        <div>
                          <span className="text-[#64748B] block uppercase text-[9px] tracking-wider">Мастер / Услуга:</span>
                          <span className="font-semibold text-[#E2E8F0]">{bInfo.barber_name} — {bInfo.service_name}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* --- TAB CONTENT: ANALYTICS --- */}
        {!loading && activeTab === "analytics" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <span>Аналитика и статистика бизнеса</span>
            </h2>

            {/* Summary Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#0F172A]/70 border border-[#1E293B] p-5 rounded-2xl shadow-lg">
                <span className="text-xs text-[#94A3B8] uppercase tracking-wider block">Выручка</span>
                <span className="text-2xl font-bold text-white block mt-1">
                  {bookings.filter(b => b.status === "completed").reduce((sum, b) => sum + (b.price || 0), 0).toLocaleString()} сом
                </span>
                <span className="text-[10px] text-emerald-400 block mt-1">Выполненные визиты</span>
              </div>

              <div className="bg-[#0F172A]/70 border border-[#1E293B] p-5 rounded-2xl shadow-lg">
                <span className="text-xs text-[#94A3B8] uppercase tracking-wider block">Визитов выполнено</span>
                <span className="text-2xl font-bold text-white block mt-1">
                  {bookings.filter(b => b.status === "completed").length}
                </span>
                <span className="text-[10px] text-indigo-400 block mt-1">Стрижек сделано</span>
              </div>

              <div className="bg-[#0F172A]/70 border border-[#1E293B] p-5 rounded-2xl shadow-lg">
                <span className="text-xs text-[#94A3B8] uppercase tracking-wider block">Отмены записей</span>
                <span className="text-2xl font-bold text-white block mt-1">
                  {bookings.filter(b => b.status === "cancelled").length}
                </span>
                <span className="text-[10px] text-red-400 block mt-1">
                  Доля отмен: {bookings.length > 0 ? ((bookings.filter(b => b.status === "cancelled").length / bookings.length) * 100).toFixed(1) : 0}%
                </span>
              </div>

              <div className="bg-[#0F172A]/70 border border-[#1E293B] p-5 rounded-2xl shadow-lg">
                <span className="text-xs text-[#94A3B8] uppercase tracking-wider block">База клиентов</span>
                <span className="text-2xl font-bold text-white block mt-1">
                  {clients.length}
                </span>
                <span className="text-[10px] text-emerald-400 block mt-1">
                  Со скидкой лояльности: {clients.filter(c => c.discount_available).length} чел
                </span>
              </div>
            </div>

            {/* Popularity Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Popular Services */}
              <div className="bg-[#0F172A]/70 border border-[#1E293B] p-5 rounded-2xl shadow-lg space-y-4">
                <h3 className="font-bold text-white text-base">📈 Популярные услуги</h3>
                
                {(() => {
                  const completedBookings = bookings.filter(b => b.status === "completed");
                  const serviceCounts: { [key: string]: number } = {};
                  completedBookings.forEach(b => {
                    serviceCounts[b.service_name] = (serviceCounts[b.service_name] || 0) + 1;
                  });
                  
                  const sortedServices = Object.entries(serviceCounts)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5);
                  
                  const maxCount = sortedServices[0]?.[1] || 1;

                  if (sortedServices.length === 0) {
                    return <p className="text-sm text-[#64748B]">Записей еще нет.</p>;
                  }

                  return (
                    <div className="space-y-3.5">
                      {sortedServices.map(([name, count]) => (
                        <div key={name} className="space-y-1.5">
                          <div className="flex justify-between text-xs">
                            <span className="font-medium text-[#E2E8F0]">{name}</span>
                            <span className="font-semibold text-white">{count} раз</span>
                          </div>
                          <div className="w-full bg-[#070A13] h-1.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-indigo-500 h-full"
                              style={{ width: `${(count / maxCount) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>

              {/* Workload Barbers */}
              <div className="bg-[#0F172A]/70 border border-[#1E293B] p-5 rounded-2xl shadow-lg space-y-4">
                <h3 className="font-bold text-white text-base">💇‍♂️ Загруженность мастеров</h3>
                
                {(() => {
                  const completedBookings = bookings.filter(b => b.status === "completed");
                  const barberCounts: { [key: string]: number } = {};
                  completedBookings.forEach(b => {
                    barberCounts[b.barber_name] = (barberCounts[b.barber_name] || 0) + 1;
                  });
                  
                  const sortedBarbers = Object.entries(barberCounts)
                    .sort((a, b) => b[1] - a[1]);
                    
                  const maxCount = sortedBarbers[0]?.[1] || 1;

                  if (sortedBarbers.length === 0) {
                    return <p className="text-sm text-[#64748B]">Записей еще нет.</p>;
                  }

                  return (
                    <div className="space-y-3.5">
                      {sortedBarbers.map(([name, count]) => (
                        <div key={name} className="space-y-1.5">
                          <div className="flex justify-between text-xs">
                            <span className="font-medium text-[#E2E8F0]">{name}</span>
                            <span className="font-semibold text-white">{count} стрижек</span>
                          </div>
                          <div className="w-full bg-[#070A13] h-1.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-cyan-500 h-full"
                              style={{ width: `${(count / maxCount) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

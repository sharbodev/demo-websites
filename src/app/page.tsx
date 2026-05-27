"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Rocket, 
  Briefcase, 
  ShoppingCart, 
  MessageSquare, 
  CheckCircle,
  Clock,
  Tag,
  Laptop,
  Smartphone,
  Globe2,
  ExternalLink,
  ArrowDown
} from "lucide-react";
import { GlobalInfiniteGrid } from "@/components/ui/the-infinite-grid";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const demos = [
    {
      title: "Белая Улыбка",
      category: "Стоматология",
      desc: "Чистый и внушающий доверие сайт клиники. Сетка услуг, прайс-лист, отзывы и запись в один клик через WhatsApp.",
      href: "/dental-clinic/index.html",
      imgUrl: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=600",
      accent: "hover:border-cyan-400/30",
      accentColor: "text-cyan-400 border-cyan-400/20",
    },
    {
      title: "Чайхана Бишкек",
      category: "Ресторан",
      desc: "Уютный, стильный дизайн с красивым меню, вкладками цен, галереей залов и мгновенной бронью столов.",
      href: "/restaurant/index.html",
      imgUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=600",
      accent: "hover:border-amber-400/30",
      accentColor: "text-amber-400 border-amber-400/20",
    },
    {
      title: "Билим",
      category: "Образование",
      desc: "Яркий сайт для школы или курсов. Каталог направлений, сетка расписания, аккордеон с FAQ и кнопка заказа.",
      href: "/education/index.html",
      imgUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=600",
      accent: "hover:border-violet-400/30",
      accentColor: "text-violet-400 border-violet-400/20",
    },
    {
      title: "СтройМастер",
      category: "Строительство",
      desc: "Премиальный темный дизайн. Услуги и цены, визуальные карточки проектов «До/После» и интерактивные этапы работы.",
      href: "/construction/index.html",
      imgUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=600",
      accent: "hover:border-red-500/30",
      accentColor: "text-red-500 border-red-500/20",
    },
    {
      title: "АвтоПро",
      category: "Автосервис",
      desc: "Брутальный темный дизайн в стиле автоспорта. Полный прайс-лист по категориям, список обслуживаемых авто и форма записи.",
      href: "/auto-service/index.html",
      imgUrl: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&q=80&w=600",
      accent: "hover:border-cyan-500/30",
      accentColor: "text-cyan-500 border-cyan-500/20",
    },
  ];

  const services = [
    {
      name: "Продающий Лендинг",
      desc: "Страница с высокой конверсией, формой захвата контактов и моментальной отправкой заявок в WhatsApp.",
      price: "5 000 сом",
      term: "3–5 дней",
      features: [
        "Полная адаптивность",
        "Интеграция WhatsApp",
        "Премиум дизайн"
      ],
      icon: <Rocket className="w-6 h-6 text-cyan-400" />,
      popular: false
    },
    {
      name: "Бизнес-Сайт",
      desc: "Солидный многостраничный сайт для полноценного интернет-представительства вашей компании.",
      price: "8 000 сом",
      term: "5–7 дней",
      features: [
        "До 5 основных страниц",
        "Каталог ваших услуг/товаров",
        "Базовая SEO оптимизация"
      ],
      icon: <Briefcase className="w-6 h-6 text-blue-400" />,
      popular: true
    },
    {
      name: "Мини-Магазин",
      desc: "Электронная витрина товаров с корзиной и оформлением заказа напрямую в ваш WhatsApp.",
      price: "15 000 сом",
      term: "7–10 дней",
      features: [
        "Интерактивная корзина",
        "Удобная админ-панель",
        "Приём заказов в мессенджер"
      ],
      icon: <ShoppingCart className="w-6 h-6 text-[#ecd3ff]" />,
      popular: false
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#070A13] text-[#F1F5F9] overflow-x-hidden selection:bg-cyan-500/30 selection:text-white">
      
      {/* Noise filter backdrop layer */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      {/* Global subtle dots background grid (completely static, 0% CPU impact) */}
      <GlobalInfiniteGrid />

      {/* ========== HEADER ========== */}
      <nav 
        id="navbar" 
        className={`fixed top-0 left-0 right-0 w-full z-50 border-b transition-all duration-300 ${
          scrolled 
            ? "bg-[#0F172A]/85 backdrop-blur-xl border-white/10 shadow-lg py-4" 
            : "bg-transparent border-transparent py-6"
        }`}
      >
        <div className="flex justify-between items-center h-12 px-6 max-w-[1280px] mx-auto">
          <Link href="/" className="font-sora font-black text-2xl text-cyan-400 tracking-tight flex items-center gap-2 hover:scale-95 transition-transform duration-200">
            <span>WebPro<span className="text-white">.kg</span></span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-1">
            <a href="#portfolio" className="text-[#8FA0B5] hover:text-white transition-colors duration-300 text-label-caps px-4 py-2 rounded-lg hover:bg-white/5">
              Портфолио
            </a>
            <a href="#services" className="text-[#8FA0B5] hover:text-white transition-colors duration-300 text-label-caps px-4 py-2 rounded-lg hover:bg-white/5">
              Услуги
            </a>
            <a href="#workflow" className="text-[#8FA0B5] hover:text-white transition-colors duration-300 text-label-caps px-4 py-2 rounded-lg hover:bg-white/5">
              Как работаем
            </a>
            <a href="#advantages" className="text-[#8FA0B5] hover:text-white transition-colors duration-300 text-label-caps px-4 py-2 rounded-lg hover:bg-white/5">
              Преимущества
            </a>
          </div>

          <a 
            className="hidden md:inline-flex items-center justify-center px-6 py-3 bg-cyan-400 text-[#00363e] font-sora text-label-caps rounded-full shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
            href="https://wa.me/996555123456?text=Здравствуйте!%20Интересует%20создание%20сайта" 
            target="_blank"
            rel="noopener noreferrer"
          >
            Консультация
          </a>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-2" 
            id="mobile-menu-btn"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      <div className={`fixed inset-0 bg-[#070A13]/98 backdrop-blur-2xl z-40 flex flex-col items-center justify-center gap-8 transition-all duration-300 md:hidden ${
        mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}>
        <a href="#portfolio" onClick={() => setMobileMenuOpen(false)} className="text-xl font-bold tracking-widest text-[#8FA0B5] hover:text-white uppercase font-sora">Портфолио</a>
        <a href="#services" onClick={() => setMobileMenuOpen(false)} className="text-xl font-bold tracking-widest text-[#8FA0B5] hover:text-white uppercase font-sora">Услуги</a>
        <a href="#workflow" onClick={() => setMobileMenuOpen(false)} className="text-xl font-bold tracking-widest text-[#8FA0B5] hover:text-white uppercase font-sora">Как работаем</a>
        <a href="#advantages" onClick={() => setMobileMenuOpen(false)} className="text-xl font-bold tracking-widest text-[#8FA0B5] hover:text-white uppercase font-sora">Преимущества</a>
        
        <a 
          href="https://wa.me/996555123456?text=Здравствуйте!%20Интересует%20создание%20сайта" 
          target="_blank" 
          rel="noopener noreferrer"
          className="px-8 py-4 bg-cyan-400 text-[#00363e] font-sora font-black rounded-full shadow-[0_0_20px_rgba(34,211,238,0.3)] text-sm uppercase tracking-wider"
        >
          Написать в WhatsApp
        </a>
      </div>

      <main className="flex-grow pt-20 relative z-10 animate-fade-in">
        
        {/* ========== HERO SECTION ========== */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-24 px-6">
          {/* Background glowing blobs */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#8350e8]/5 rounded-full blur-[150px] mix-blend-screen" />
          </div>

          <div className="relative z-10 max-w-[1280px] mx-auto w-full text-center flex flex-col items-center">
            <div className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-md rounded-full px-5 py-2 mb-8 border border-white/10 shadow-inner">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              <span className="font-sans text-xs font-bold text-cyan-400 tracking-widest uppercase">
                Бишкек, Кыргызстан KGT (GMT+6)
              </span>
            </div>
            
            <h1 className="text-display-lg text-white mb-6 max-w-4xl">
              Создаем сайты нового <br className="hidden md:block"/>
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-[#d9b0ff] bg-clip-text text-transparent filter drop-shadow-sm">
                космического уровня
              </span>
            </h1>
            
            <p className="text-body-lg text-[#8FA0B5] max-w-2xl mx-auto mb-12">
              Эксклюзивный дизайн, интерактивные эффекты и удобная интеграция с WhatsApp. Запустим ваш проект за 3–5 дней.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <a 
                className="w-full sm:w-auto px-8 py-4 bg-cyan-400 text-[#00363e] font-sora text-sm font-black uppercase tracking-wider rounded-full shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2"
                href="https://wa.me/996555123456?text=Здравствуйте!%20Интересует%20создание%20сайта"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>Написать в WhatsApp</span>
              </a>
              
              <a 
                className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-sora text-xs font-black uppercase tracking-widest rounded-full border border-white/10 hover:border-white/20 transition-all duration-300 flex items-center justify-center gap-2"
                href="#portfolio"
              >
                <span>Смотреть работы</span>
                <ArrowDown className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* ========== STATS SECTION ========== */}
        <section className="py-16 px-6 bg-[#0B0E17]/60 border-y border-white/5 relative z-10">
          <div className="max-w-[1280px] mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { num: "50+", label: "Запущенных сайтов" },
                { num: "3–5", label: "Дней на разработку" },
                { num: "100%", label: "Адаптивный дизайн" },
                { num: "24/7", label: "Поддержка клиентов" },
              ].map((stat, idx) => (
                <div key={idx} className="text-center p-6 md:p-8 bg-[#0F172A]/40 backdrop-blur-md border border-white/5 rounded-2xl shadow-xl">
                  <div className="font-sora font-black text-3xl md:text-5xl text-cyan-400 mb-2">{stat.num}</div>
                  <div className="text-body-md text-[#8FA0B5] font-medium leading-relaxed">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========== PORTFOLIO SECTION ========== */}
        <section className="py-24 px-6 relative" id="portfolio">
          <div className="max-w-[1280px] mx-auto">
            <div className="text-center mb-20 space-y-4">
              <span className="text-label-caps text-cyan-400 py-1.5 px-4 bg-cyan-400/5 border border-cyan-400/20 rounded-full">
                Портфолио
              </span>
              <h2 className="text-display-lg text-white">
                Наши демо-сайты
              </h2>
              <p className="text-body-lg text-[#8FA0B5] max-w-2xl mx-auto leading-relaxed">
                Кликните по любой карточке, чтобы открыть полностью функциональный прототип сайта для вашей ниши
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {demos.map((demo, idx) => (
                <a 
                  key={idx} 
                  href={demo.href} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`bg-[#0F172A]/50 backdrop-blur-md rounded-2xl overflow-hidden group border border-white/5 ${demo.accent} hover:-translate-y-2 shadow-2xl transition-all duration-300 flex flex-col min-h-[440px]`}
                >
                  <div className="h-52 relative overflow-hidden bg-[#181B25]">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#070A13] via-transparent to-transparent z-10 opacity-80" />
                    
                    {/* Demo preview image */}
                    <img 
                      alt={demo.title} 
                      className="w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-80 transition-all duration-500" 
                      src={demo.imgUrl}
                      loading="lazy"
                    />

                    <div className="absolute top-4 left-4 z-20">
                      <span className={`px-3.5 py-1 bg-[#070A13]/90 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider rounded-full border ${demo.accentColor}`}>
                        {demo.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-8 flex-1 flex flex-col justify-between relative z-10 bg-gradient-to-b from-[#0F172A]/20 to-[#070A13]/90">
                    <div>
                      <h3 className="font-sora font-bold text-2xl text-white mb-3 group-hover:text-cyan-400 transition-colors">
                        {demo.title}
                      </h3>
                      <p className="text-body-md text-[#8FA0B5] leading-relaxed mb-6">
                        {demo.desc}
                      </p>
                    </div>
                    
                    <span className="text-xs font-bold text-cyan-400 group-hover:text-white transition-colors flex items-center gap-1.5 mt-auto">
                      <span>Открыть демо-сайт</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ========== SERVICES SECTION ========== */}
        <section className="py-24 px-6 bg-[#0B0E17]/40 border-y border-white/5 relative" id="services">
          <div className="max-w-[1280px] mx-auto">
            <div className="text-center mb-20 space-y-4">
              <span className="text-label-caps text-cyan-400 py-1.5 px-4 bg-cyan-400/5 border border-cyan-400/20 rounded-full">
                Услуги
              </span>
              <h2 className="text-display-lg text-white">
                Что мы предлагаем
              </h2>
              <p className="text-body-lg text-[#8FA0B5] max-w-2xl mx-auto leading-relaxed">
                Форматы сайтов, созданные для быстрого масштабирования вашего бизнеса
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
              {services.map((service, idx) => (
                <div 
                  key={idx} 
                  className={`bg-[#0F172A]/70 backdrop-blur-md rounded-2xl p-8 hover:border-cyan-400/20 shadow-2xl transition-all duration-300 flex flex-col justify-between relative group border ${
                    service.popular 
                      ? "border-cyan-400/30 shadow-[0_0_40px_rgba(34,211,238,0.06)] lg:-translate-y-4" 
                      : "border-white/5"
                  }`}
                >
                  {service.popular && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                      <span className="bg-cyan-400 text-[#00363e] text-label-caps px-4 py-1 rounded-full shadow-lg">
                        Популярный
                      </span>
                    </div>
                  )}

                  <div className="absolute top-6 right-6 opacity-5 group-hover:opacity-10 transition-opacity">
                    {service.icon}
                  </div>
                  
                  <div>
                    <div className="w-12 h-12 bg-white/5 border border-white/5 rounded-xl flex items-center justify-center mb-6 group-hover:border-cyan-400/30 group-hover:bg-cyan-400/5 transition-all">
                      {service.icon}
                    </div>
                    
                    <h3 className="text-headline-sm text-white mb-2">{service.name}</h3>
                    <p className="text-body-md text-[#8FA0B5] leading-relaxed mb-8">{service.desc}</p>
                  </div>
                  
                  <div className="mt-auto pt-6 border-t border-white/5">
                    <div className="font-sora font-black text-3xl text-cyan-400 mb-6">
                      {service.price}
                    </div>
                    
                    <ul className="space-y-4 mb-8">
                      <li className="flex items-center gap-3 text-body-md text-[#8FA0B5]">
                        <Clock className="w-4 h-4 text-cyan-400" />
                        <span>Срок: {service.term}</span>
                      </li>
                      {service.features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-center gap-3 text-body-md text-[#8FA0B5]">
                          <CheckCircle className="w-4 h-4 text-cyan-400" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <a 
                      className={`w-full py-3.5 block text-center rounded-full text-label-caps transition-all duration-300 font-sora ${
                        service.popular 
                          ? "bg-cyan-400 text-[#00363e] shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:shadow-[0_0_30px_rgba(34,211,238,0.4)]"
                          : "border border-white/10 text-white hover:bg-white/5 hover:border-white/20"
                      }`}
                      href="https://wa.me/996555123456?text=Здравствуйте!%20Интересует%20создание%20сайта"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Заказать
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========== TESTIMONIALS ========== */}
        <section className="py-24 px-6 relative" id="workflow">
          <div className="max-w-[1280px] mx-auto">
            <div className="text-center mb-20 space-y-4">
              <span className="text-label-caps text-cyan-400 py-1.5 px-4 bg-cyan-400/5 border border-cyan-400/20 rounded-full">
                Отзывы
              </span>
              <h2 className="text-display-lg text-white">
                Что говорят о нашей работе
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  quote: "Сотрудничество с WebPro изменило всё для нашего бизнеса. Наш сайт стоматологии был готов всего за 4 дня, и теперь новые пациенты записываются к нам ежедневно напрямую через WhatsApp!",
                  name: "Алина Каримова",
                  role: "Директор клиники «Белая Улыбка»",
                  img: "https://lh3.googleusercontent.com/aida/ADBb0ugejSBJkxzcJLyN0gmdiCooPN0W5elBKgHRLRp0hYovwP6iT0kHyKWppspJ1sl2yV4FVf-SCqry9P0YfKycQpDSaZSwKaIHznF7uwZNPbyp9yrJJ8-6zhBsy5SoXhm4d3gyNrHV5XL03P4RAIDvzsMI9N6M2OGwYM2E8xUnaOx7FlRTuw-rndp1HMCXoz5YDyc6BDL2mu4F8PhPYrrhROjoDmghx9PfVbTQPtPOiD7-UMtCvss0zShzs7o"
                },
                {
                  quote: "Удобное интерактивное меню и бронь столов. Все заявки приходят напрямую мне в WhatsApp. Отличная работа!",
                  name: "Меерим",
                  role: "Ресторан «Чайхана Бишкек»",
                  img: "https://lh3.googleusercontent.com/aida/ADBb0ujY-rq7qafUE5fRftifaOUzhMrq88NBfy8QJI1PPxEXWfVVJ7MGhbtBxzYIbON2DcEjd2jmaKrYQNJN55wBqLiLFqipQiJ82JsEE5O4tHsNTnPLcG5QyrC7qkZrpX72FjtPiXGtCFlHwuwhOvaGirWDT1JvohwTrDY6HdsELM39TJ78osEWGGAnQ36-oc5wmX-xuT6F8wgY2Cqy7tW6zH6OTM83xZmYj_mhLiwns2lUXCWbgzCVHro1dQ"
                },
                {
                  quote: "Ребята сделали стильный темный сайт для детейлинга и ремонта. Сразу пошел приток клиентов. Рекомендую!",
                  name: "Арсен",
                  role: "Автосервис «АвтоПро»",
                  img: "https://lh3.googleusercontent.com/aida/ADBb0ujdbagK7yLAHIQZQfKVh3VnZokWaKm-ZnoSkR72TM61Pyt2SYJLBKv109qi3pQ97u-hT7yatnHg5HHvOrxj2tDd6c1yfPPZhAKAT3zLoOL4unrbIae6QCuyzzWFhL815sidVtVK46Kpu46ViwcW6QvO4GqfMoPx3RU5FDojWHoE8WFVIGtFePuhjEm-qCSypiFSADwqsZO7SIyNJp1akKEv7zHy_5EQ7htjBO2dcWSED5kpF6uhZQQ7V6A"
                }
              ].map((t, idx) => (
                <div key={idx} className="bg-[#0F172A]/50 backdrop-blur-md rounded-2xl p-8 border border-white/5 flex flex-col justify-between hover:border-cyan-400/20 shadow-xl transition-all duration-300 relative">
                  <span className="absolute top-6 right-6 text-6xl text-cyan-400/5 font-serif select-none pointer-events-none">“</span>
                  <p className="text-body-md text-[#8FA0B5] italic leading-relaxed mb-8 relative z-10">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-4 border-t border-white/5 pt-6">
                    <img 
                      alt={t.name} 
                      className="w-12 h-12 rounded-full object-cover border-2 border-cyan-400/20" 
                      src={t.img}
                    />
                    <div>
                      <div className="font-bold text-white text-sm">{t.name}</div>
                      <div className="text-xs text-[#8FA0B5] mt-0.5">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========== PROCESS SECTION ========== */}
        <section className="py-24 px-6 bg-[#0B0E17]/40 border-y border-white/5 relative z-10" id="workflow">
          <div className="max-w-[1280px] mx-auto">
            <div className="text-center mb-20 space-y-4">
              <span className="text-label-caps text-cyan-400 py-1.5 px-4 bg-cyan-400/5 border border-cyan-400/20 rounded-full">
                Процесс
              </span>
              <h2 className="text-display-lg text-white">
                Как строится работа
              </h2>
              <p className="text-body-lg text-[#8FA0B5] max-w-2xl mx-auto leading-relaxed">
                Мы ценим ваше время, поэтому свели весь процесс разработки к 3 простым этапам
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { num: "01", title: "Обсуждение и ТЗ", desc: "В WhatsApp обсуждаем ваш проект, выбираем цвета, определяем структуру и сразу утверждаем окончательный бюджет." },
                { num: "02", title: "Быстрая разработка", desc: "Создаём полностью адаптивный и функциональный сайт за 3–5 дней. Вы видите процесс и можете легко вносить правки." },
                { num: "03", title: "Запуск и Поддержка", desc: "Размещаем сайт в интернете, подключаем к вашему домену и настраиваем форму для приема заявок. Сайт готов приносить прибыль." },
              ].map((step, idx) => (
                <div key={idx} className="bg-[#0F172A]/50 border border-white/5 rounded-2xl p-8 hover:border-cyan-400/10 shadow-xl transition-all duration-300">
                  <div className="w-12 h-12 bg-cyan-400/5 border border-cyan-400/20 rounded-xl flex items-center justify-center font-sora font-black text-cyan-400 text-lg">
                    {step.num}
                  </div>
                  <h3 className="text-headline-sm text-white mt-6 mb-3">{step.title}</h3>
                  <p className="text-body-md text-[#8FA0B5] leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========== WHY US (Bento Grid) ========== */}
        <section className="py-24 px-6 relative" id="advantages">
          <div className="max-w-[1280px] mx-auto">
            <div className="text-center mb-20 space-y-4">
              <span className="text-label-caps text-cyan-400 py-1.5 px-4 bg-cyan-400/5 border border-cyan-400/20 rounded-full">
                Преимущества
              </span>
              <h2 className="text-display-lg text-white">
                Почему выбирают WebPro.kg
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              
              {/* 1. SPEED CARD (2 columns) */}
              <div className="md:col-span-2 relative bg-[#0F172A]/50 border border-white/5 rounded-3xl p-8 hover:border-cyan-400/20 transition-all duration-300 flex flex-col justify-between overflow-hidden group min-h-[260px] shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl group-hover:bg-cyan-500/10 transition-colors pointer-events-none" />
                <div>
                  <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
                    <Clock className="w-6 h-6" />
                  </div>
                  <h3 className="font-sora font-black text-2xl text-white mb-3">Космическая скорость разработки</h3>
                  <p className="text-body-md text-[#8FA0B5] max-w-xl leading-relaxed">
                    Ваш полностью готовый, наполненный и рабочий сайт будет запущен всего за <strong className="text-white">3–5 дней</strong>. Сверхбыстрая разработка без потери премиального качества.
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-3 bg-white/5 border border-white/5 rounded-full px-4 py-2 w-fit backdrop-blur-md">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Разработка запущена</span>
                </div>
              </div>

              {/* 2. PRICE CARD */}
              <div className="relative bg-[#0F172A]/50 border border-white/5 rounded-3xl p-8 hover:border-cyan-400/20 transition-all duration-300 flex flex-col justify-between overflow-hidden group min-h-[260px] shadow-2xl">
                <div>
                  <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
                    <Tag className="w-6 h-6" />
                  </div>
                  <h3 className="font-sora font-black text-2xl text-white mb-3">Прозрачная стоимость</h3>
                  <p className="text-body-md text-[#8FA0B5] leading-relaxed">
                    Стоимость разработки стартует <strong className="text-white">от 5 000 сом</strong>. Полная прозрачность: никаких скрытых переплат, навязанных услуг или лишних ежемесячных подписок.
                  </p>
                </div>
                <div className="mt-6 text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                  Без скрытых платежей
                </div>
              </div>

              {/* 3. RESPONSIVENESS CARD */}
              <div className="relative bg-[#0F172A]/50 border border-white/5 rounded-3xl p-8 hover:border-cyan-400/20 transition-all duration-300 flex flex-col justify-between overflow-hidden group min-h-[260px] shadow-2xl">
                <div>
                  <div className="w-12 h-12 bg-[#8350e8]/10 border border-[#8350e8]/20 rounded-xl flex items-center justify-center text-[#d9b0ff] mb-6 group-hover:scale-110 transition-transform">
                    <Laptop className="w-6 h-6" />
                  </div>
                  <h3 className="font-sora font-black text-2xl text-white mb-3">100% адаптивность</h3>
                  <p className="text-body-md text-[#8FA0B5] leading-relaxed">
                    Ваш сайт будет выглядеть безупречно и открываться моментально на любых смартфонах, планшетах и компьютерах с сохранением всех интерактивных эффектов.
                  </p>
                </div>
                <div className="mt-6 flex gap-4 text-[#8FA0B5]">
                  <Smartphone className="w-5 h-5 group-hover:text-cyan-400 transition-colors" />
                  <Laptop className="w-5 h-5 group-hover:text-cyan-400 transition-colors" />
                </div>
              </div>

              {/* 4. WHATSAPP CARD (2 columns) */}
              <div className="md:col-span-2 relative bg-[#0F172A]/50 border border-white/5 rounded-3xl p-8 hover:border-cyan-400/20 transition-all duration-300 flex flex-col justify-between overflow-hidden group min-h-[260px] shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-colors pointer-events-none" />
                <div>
                  <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <h3 className="font-sora font-black text-2xl text-white mb-3">Лиды напрямую в ваш WhatsApp</h3>
                  <p className="text-body-md text-[#8FA0B5] max-w-xl leading-relaxed">
                    Настроим моментальную отправку заполненных заявок с сайта прямо на ваш личный WhatsApp-номер. Мгновенно узнавайте о новых клиентах и отвечайте им в один клик.
                  </p>
                </div>
                
                <div className="mt-6 flex items-center gap-3 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-4 w-full max-w-sm backdrop-blur-md">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-[9px] text-[#8FA0B5] font-bold uppercase tracking-wider">Новая заявка:</div>
                    <div className="text-xs text-white italic">«Здравствуйте! Хочу заказать расчет сметы...»</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ========== CTA SECTION ========== */}
        <section className="py-24 px-6 relative" id="contact">
          <div className="max-w-4xl mx-auto text-center relative z-10 bg-[#0F172A]/70 backdrop-blur-md p-12 md:p-16 rounded-3xl border border-cyan-400/20 shadow-[0_0_50px_rgba(34,211,238,0.06)]">
            <h2 className="text-display-lg text-white mb-6">
              Создадим ваш новый сайт сегодня?
            </h2>
            <p className="text-body-lg text-[#8FA0B5] max-w-xl mx-auto mb-10">
              Просто напишите мне в WhatsApp — обсудим цели, выберем крутой стиль и сразу запустим проект в работу.
            </p>
            
            <a 
              className="inline-flex items-center justify-center px-10 py-5 bg-[#25D366] text-white font-sora text-sm font-black uppercase tracking-wider rounded-full shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:bg-[#20bd5a] hover:shadow-[0_0_30px_rgba(37,211,102,0.6)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 gap-3"
              href="https://wa.me/996555123456?text=Здравствуйте!%20Интересует%20создание%20сайта"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"></path></svg>
              <span>Написать в WhatsApp</span>
            </a>
          </div>
        </section>

      </main>

      {/* ========== FOOTER ========== */}
      <footer className="bg-[#0B0E17] py-16 border-t border-white/5 relative z-10">
        <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2 space-y-4">
            <Link href="/" className="font-sora font-black text-2xl text-cyan-400">
              WebPro.kg
            </Link>
            <p className="text-[#8FA0B5] max-w-sm leading-relaxed text-body-md">
              Эксклюзивный веб-дизайн и разработка премиальных сайтов для вашего бизнеса в Бишкеке и по всему Кыргызстану.
            </p>
            <div className="text-xs text-[#566882] pt-4 font-sans">
              &copy; 2026 WebPro.kg. Все права защищены.
            </div>
          </div>
          
          <div>
            <h4 className="text-label-caps text-white mb-6">Навигация</h4>
            <ul className="space-y-3">
              <li><a href="#portfolio" className="text-[#8FA0B5] hover:text-cyan-400 transition-colors text-label-caps font-semibold">Портфолио</a></li>
              <li><a href="#services" className="text-[#8FA0B5] hover:text-cyan-400 transition-colors text-label-caps font-semibold">Услуги</a></li>
              <li><a href="#workflow" className="text-[#8FA0B5] hover:text-cyan-400 transition-colors text-label-caps font-semibold">Как работаем</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-label-caps text-white mb-6">Контакты</h4>
            <ul className="space-y-3 font-semibold text-[#8FA0B5] text-body-md">
              <li className="flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-cyan-400" />
                <span>Бишкек, Кыргызстан</span>
              </li>
              <li>
                <a className="hover:text-cyan-400 transition-colors" href="https://wa.me/996555123456">+996 555 123 456</a>
              </li>
            </ul>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Action button */}
      <a 
        href="https://wa.me/996555123456?text=Здравствуйте!%20Интересует%20создание%20сайта" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-50 bg-[#25D366] text-white w-16 h-16 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-transform group"
        aria-label="Написать в WhatsApp"
      >
        <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"></path></svg>
        <span className="absolute right-full mr-4 bg-[#0F172A] text-white px-4 py-2 rounded-lg text-xs font-bold shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10 font-sans">
          Связаться в WhatsApp
        </span>
      </a>

    </div>
  );
}

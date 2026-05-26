"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import AnoAI from "@/components/ui/animated-shader-background";
import { Spotlight } from "@/components/ui/ibelick-spotlight";
import { Card } from "@/components/ui/card";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { Marquee } from "@/components/ui/marquee";
import { 
  Activity, 
  Utensils, 
  GraduationCap, 
  Construction, 
  Wrench, 
  MessageSquare, 
  Zap, 
  DollarSign, 
  Layout, 
  CheckCircle,
  Clock,
  Tag,
  Laptop,
  Smartphone
} from "lucide-react";
import { LocationTag } from "@/components/ui/location-tag";
import PricingSection4 from "@/components/ui/pricing-section-4";
import { Testimonials } from "@/components/ui/unique-testimonial";
import { TheInfiniteGrid } from "@/components/ui/the-infinite-grid";

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
      category: "Клиники и стоматологии",
      desc: "Чистый и внушающий доверие сайт клиники. Сетка услуг, прайс-лист, отзывы и запись в один клик через WhatsApp.",
      href: "/dental-clinic/index.html",
      icon: <Activity className="w-5 h-5 text-sky-400" />,
      class: "from-sky-500/20 via-blue-500/10 to-transparent",
    },
    {
      title: "Чайхана Бишкек",
      category: "Кафе и рестораны",
      desc: "Уютный, стильный дизайн с красивым меню, вкладками цен, галереей залов и мгновенной бронью столов.",
      href: "/restaurant/index.html",
      icon: <Utensils className="w-5 h-5 text-amber-400" />,
      class: "from-amber-500/20 via-orange-500/10 to-transparent",
    },
    {
      title: "Билим",
      category: "Образовательные центры",
      desc: "Яркий сайт для школы или курсов. Каталог направлений, сетка расписания, аккордеон с FAQ и кнопка заказа.",
      href: "/education/index.html",
      icon: <GraduationCap className="w-5 h-5 text-violet-400" />,
      class: "from-violet-500/20 via-indigo-500/10 to-transparent",
    },
    {
      title: "СтройМастер",
      category: "Строительство и ремонт",
      desc: "Премиальный темный дизайн. Услуги и цены, визуальные карточки проектов «До/После» и интерактивные этапы работы.",
      href: "/construction/index.html",
      icon: <Construction className="w-5 h-5 text-rose-400" />,
      class: "from-rose-500/20 via-red-500/10 to-transparent",
    },
    {
      title: "АвтоПро",
      category: "Автосервисы и детейлинг",
      desc: "Брутальный темный дизайн в стиле автоспорта. Полный прайс-лист по категориям, список обслуживаемых авто и форма записи.",
      href: "/auto-service/index.html",
      icon: <Wrench className="w-5 h-5 text-cyan-400" />,
      class: "from-cyan-500/20 via-teal-500/10 to-transparent",
    },
  ];

  const services = [
    {
      name: "Одностраничный сайт",
      desc: "Вся ключевая информация о ваших услугах на одной красивой, структурированной странице.",
      price: "от 5 000 сом",
      icon: <Layout className="w-6 h-6 text-blue-400" />,
    },
    {
      name: "Сайт-визитка",
      desc: "Солидное интернет-представительство вашей компании с несколькими внутренними страницами.",
      price: "от 8 000 сом",
      icon: <Zap className="w-6 h-6 text-blue-400" />,
    },
    {
      name: "Продающий Лендинг",
      desc: "Страница с высокой конверсией, формой захвата контактов и моментальной отправкой заявок в WhatsApp.",
      price: "от 10 000 сом",
      icon: <MessageSquare className="w-6 h-6 text-blue-400" />,
    },
    {
      name: "Мини-магазин",
      desc: "Удобная витрина товаров с корзиной и оформлением заказа напрямую в ваш WhatsApp.",
      price: "от 15 000 сом",
      icon: <DollarSign className="w-6 h-6 text-blue-400" />,
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#070a13] text-[#f1f5f9] overflow-x-hidden">
      
      {/* Three.js Shader background (AnoAI) fixed in background */}
      <div className="fixed inset-0 w-full h-full pointer-events-none opacity-40 z-0">
        <AnoAI />
      </div>

      {/* Dotted Grid Background overlay */}
      <div className="fixed inset-0 bg-[radial-gradient(rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none z-10" />

      {/* ========== HEADER ========== */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#060913]/70 backdrop-blur-md border-b border-white/5 py-3" : "py-5"}`}>
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 font-outfit font-extrabold text-xl tracking-tight">
            <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path d="M4 4L10 2L16 4L16 12L10 18L4 12Z" stroke="white" strokeWidth="1.8" fill="none"/>
                <circle cx="10" cy="9" r="2.5" fill="white"/>
              </svg>
            </div>
            <span>WebPro<span className="text-blue-500">.kg</span></span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#8fa0b5]">
            <a href="#portfolio" className="hover:text-[#f1f5f9] transition-colors">Портфолио</a>
            <a href="#services" className="hover:text-[#f1f5f9] transition-colors">Услуги</a>
            <a href="#process" className="hover:text-[#f1f5f9] transition-colors">Как работаем</a>
            <a href="#why" className="hover:text-[#f1f5f9] transition-colors">Преимущества</a>
          </nav>

          <a 
            href="https://wa.me/996555123456?text=Здравствуйте!%20Интересует%20создание%20сайта" 
            target="_blank" 
            rel="noopener"
            className="hidden md:inline-flex items-center justify-center px-5 py-2.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-semibold text-sm rounded-lg shadow-lg shadow-blue-600/20 border border-white/10 transition-all"
          >
            Связаться
          </a>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="md:hidden flex flex-col gap-1.5 p-2"
          >
            <span className={`w-5 h-0.5 bg-white transition-all ${mobileMenuOpen ? "transform rotate-45 translate-y-2" : ""}`} />
            <span className={`w-5 h-0.5 bg-white transition-all ${mobileMenuOpen ? "opacity-0" : ""}`} />
            <span className={`w-5 h-0.5 bg-white transition-all ${mobileMenuOpen ? "transform -rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <nav className={`fixed inset-0 bg-[#010206]/98 backdrop-blur-lg z-40 flex flex-col items-center justify-center gap-6 transition-all duration-300 ${mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <a href="#portfolio" onClick={() => setMobileMenuOpen(false)} className="text-xl font-semibold hover:text-blue-500">Портфолио</a>
        <a href="#services" onClick={() => setMobileMenuOpen(false)} className="text-xl font-semibold hover:text-blue-500">Услуги</a>
        <a href="#process" onClick={() => setMobileMenuOpen(false)} className="text-xl font-semibold hover:text-blue-500">Как работаем</a>
        <a href="#why" onClick={() => setMobileMenuOpen(false)} className="text-xl font-semibold hover:text-blue-500">Преимущества</a>
        <a 
          href="https://wa.me/996555123456?text=Здравствуйте!%20Интересует%20создание%20сайта" 
          target="_blank" 
          rel="noopener"
          className="mt-4 px-8 py-3.5 bg-blue-600 text-white rounded-lg shadow-lg"
        >
          Написать в WhatsApp
        </a>
      </nav>

      {/* ========== HERO SECTION (Container Scroll display) ========== */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-8 z-20">
        <div className="max-w-6xl mx-auto px-6 w-full">
          <ContainerScroll
            titleComponent={
              <div className="text-center flex flex-col items-center">
                <div className="mb-6">
                  <LocationTag city="Бишкек" country="Кыргызстан" timezone="KGT (GMT+6)" />
                </div>
                <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight leading-none text-white max-w-4xl mx-auto">
                  Создаем сайты нового <br />
                  <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent filter drop-shadow-md">
                    космического уровня
                  </span>
                </h1>
                <p className="mt-6 text-base md:text-xl text-[#8fa0b5] max-w-2xl mx-auto font-normal leading-relaxed">
                  Эксклюзивный дизайн, интерактивный WebGL и удобная интеграция с WhatsApp. Запустим ваш проект за 3–5 дней.
                </p>
                <div className="mt-8 flex flex-wrap gap-4 justify-center">
                  <a 
                    href="https://wa.me/996555123456?text=Здравствуйте!%20Интересует%20создание%20сайта" 
                    target="_blank" 
                    rel="noopener"
                    className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-xl shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-2"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                    <span>Написать в WhatsApp</span>
                  </a>
                  <a 
                    href="#portfolio" 
                    className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-lg border border-white/10 transition-all"
                  >
                    Смотреть работы
                  </a>
                </div>
              </div>
            }
          >
            {/* Displaying inside 3D scroll mockup */}
            <div className="relative w-full h-full bg-[#0a0d15] flex flex-col">
              <div className="w-full bg-[#121824] px-4 py-3 flex items-center justify-between border-b border-white/5">
                <div className="flex gap-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-red-500" />
                  <span className="w-3.5 h-3.5 rounded-full bg-yellow-500" />
                  <span className="w-3.5 h-3.5 rounded-full bg-green-500" />
                </div>
                <span className="text-xs text-[#8fa0b5] font-mono">webpro.kg</span>
                <span className="w-8" />
              </div>
              <div className="flex-1 relative overflow-hidden flex flex-col justify-center items-center p-8 bg-gradient-to-b from-[#0a0e1b] to-[#04060d]">
                <div className="relative z-10 text-center max-w-lg">
                  <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-500/20 animate-bounce">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  </div>
                  <h3 className="font-outfit font-extrabold text-3xl mb-3 text-white">Интерактивный Опыт</h3>
                  <p className="text-sm text-[#8fa0b5] leading-relaxed">
                    Прокрутите страницу вниз, чтобы увидеть наши интерактивные демо-сайты в трехмерной перспективе с эффектами светового прожектора!
                  </p>
                </div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--primary-glow),transparent_60%)] pointer-events-none opacity-40" />
              </div>
            </div>
          </ContainerScroll>
        </div>
      </section>

      {/* ========== STATS STRIP ========== */}
      <div className="max-w-6xl mx-auto px-6 relative z-35 -mt-24 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { num: "50+", label: "Запущенных сайтов" },
            { num: "3–5", label: "Дней на разработку" },
            { num: "100%", label: "Адаптивный дизайн" },
            { num: "24/7", label: "Поддержка клиентов" },
          ].map((stat, idx) => (
            <div key={idx} className="bg-[#0a0e1a]/80 backdrop-blur-md border border-white/5 rounded-2xl p-6 text-center hover:border-white/10 transition-all">
              <div className="font-outfit font-extrabold text-3xl md:text-4xl text-white">{stat.num}</div>
              <div className="text-xs text-[#8fa0b5] font-semibold mt-2">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ========== PORTFOLIO SECTION (iBelick Spotlight Cards) ========== */}
      <section className="section bg-[#050811] border-y border-white/5 relative z-20" id="portfolio">
        <div className="max-w-6xl mx-auto px-6">
          <div className="section-header">
            <span className="section-label">Портфолио</span>
            <h2 className="section-title">Наши демо-сайты</h2>
            <p className="section-desc">Кликните по любой карточке, чтобы открыть полностью функциональный прототип сайта для вашей ниши</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {demos.map((demo, idx) => (
              <a 
                key={idx} 
                href={demo.href} 
                className="group relative bg-[#0a0e1a]/80 border border-white/5 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all flex flex-col min-h-[380px]"
              >
                {/* iBelick spring hover spotlight highlights */}
                <Spotlight className="from-blue-500/10 via-cyan-500/5 to-transparent" size={300} />

                <div className={`portfolio-preview h-48 bg-gradient-to-tr ${demo.class} flex items-center justify-center p-6 border-b border-white/5`}>
                  <div className="w-full h-full bg-[#05070e] rounded-t-xl border border-white/10 border-b-none p-4 flex flex-col gap-3 group-hover:-translate-y-2 transition-transform duration-500">
                    <div className="flex gap-1.5 items-center">
                      <span className="w-2 h-2 rounded-full bg-white/20 group-hover:bg-red-500 transition-colors" />
                      <span className="w-2 h-2 rounded-full bg-white/20 group-hover:bg-yellow-500 transition-colors" />
                      <span className="w-2 h-2 rounded-full bg-white/20 group-hover:bg-green-500 transition-colors" />
                    </div>
                    <div className="flex-1 flex flex-col gap-2 mt-2">
                      <span className="w-1/3 h-2 bg-white/10 rounded group-hover:bg-blue-500/40 transition-colors" />
                      <span className="w-3/4 h-1.5 bg-white/5 rounded" />
                      <span className="w-1/2 h-1.5 bg-white/5 rounded" />
                    </div>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between relative z-10 bg-gradient-to-b from-[#0a0e1b]/40 to-[#04060d]/80">
                  <div>
                    <span className="portfolio-category inline-block px-2.5 py-1 bg-white/5 border border-white/5 rounded-md text-[10px] font-bold text-[#8fa0b5] uppercase tracking-wider mb-3">
                      {demo.category}
                    </span>
                    <h3 className="font-outfit font-bold text-xl text-white mb-2 flex items-center gap-2.5">
                      {demo.icon}
                      {demo.title}
                    </h3>
                    <p className="text-xs text-[#8fa0b5] leading-relaxed mb-4">{demo.desc}</p>
                  </div>
                  <span className="portfolio-link text-xs font-bold text-blue-400 group-hover:text-cyan-400 group-hover:translate-x-2 transition-all flex items-center gap-1.5">
                    <span>Открыть демо-сайт</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ========== SERVICES SECTION ========== */}
      <section className="section relative z-20" id="services">
        <div className="max-w-6xl mx-auto px-6">
          <div className="section-header">
            <span className="section-label">Услуги</span>
            <h2 className="section-title">Что мы предлагаем</h2>
            <p className="section-desc">Форматы сайтов, созданные для быстрого масштабирования вашего бизнеса</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {services.map((service, idx) => (
              <div 
                key={idx} 
                className="group relative bg-[#0a0e1a]/85 border border-white/5 rounded-2xl p-6 hover:border-blue-500/20 transition-all flex flex-col justify-between"
              >
                <Spotlight className="from-blue-600/10 via-transparent to-transparent" size={240} />
                
                <div>
                  <div className="w-12 h-12 bg-white/5 border border-white/5 rounded-lg flex items-center justify-center mb-5 group-hover:border-blue-500/30 group-hover:bg-blue-500/5 transition-all">
                    {service.icon}
                  </div>
                  <h3 className="font-outfit font-bold text-[1.05rem] text-white mb-2">{service.name}</h3>
                  <p className="text-xs text-[#8fa0b5] leading-relaxed mb-6">{service.desc}</p>
                </div>
                <div className="border-t border-white/5 pt-4 font-outfit font-extrabold text-[1.15rem] text-[#f1f5f9] group-hover:text-cyan-400 transition-colors">
                  {service.price}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== PRICING SECTION ========== */}
      <section className="relative z-20" id="pricing">
        <div className="max-w-6xl mx-auto px-6">
          <PricingSection4 />
        </div>
      </section>

      {/* ========== PROCESS ========== */}
      <section className="section bg-[#050811] border-y border-white/5 relative z-20" id="process">
        <div className="max-w-6xl mx-auto px-6">
          <div className="section-header">
            <span className="section-label">Процесс</span>
            <h2 className="section-title">Как строится работа</h2>
            <p className="section-desc">Мы ценим ваше время, поэтому свели весь процесс разработки к 3 простым этапам</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { num: "01", title: "Обсуждение и ТЗ", desc: "В WhatsApp обсуждаем ваш проект, выбираем цвета, определяем структуру и сразу утверждаем окончательный бюджет." },
              { num: "02", title: "Быстрая разработка", desc: "Создаём полностью адаптивный и функциональный сайт за 3–5 дней. Вы видите процесс и можете легко вносить правки." },
              { num: "03", title: "Запуск и Поддержка", desc: "Размещаем сайт в интернете, подключаем к вашему домену и настраиваем форму для приема заявок. Сайт готов приносить прибыль." },
            ].map((step, idx) => (
              <div key={idx} className="bg-[#0a0e1a]/80 border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all">
                <div className="w-10 h-10 bg-white/5 border border-white/5 rounded-lg flex items-center justify-center font-outfit font-bold text-blue-400">
                  {step.num}
                </div>
                <h3 className="font-outfit font-bold text-lg text-white mt-5 mb-2">{step.title}</h3>
                <p className="text-xs text-[#8fa0b5] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== WHY US (Bento Grid) ========== */}
      <section className="section relative z-20" id="why">
        <div className="max-w-6xl mx-auto px-6">
          <div className="section-header">
            <span className="section-label">Преимущества</span>
            <h2 className="section-title">Почему выбирают WebPro.kg</h2>
            <p className="section-desc">Создаем сайты, которые реально работают на ваш бизнес и окупаются с первых дней</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* 1. SPEED CARD (2 columns on medium+) */}
            <div className="md:col-span-2 relative bg-[#0a0e1a]/85 border border-white/5 rounded-3xl p-8 hover:border-blue-500/20 transition-all flex flex-col justify-between overflow-hidden group min-h-[260px]">
              <Spotlight className="from-blue-600/10 via-transparent to-transparent" size={300} />
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors" />
              <div>
                <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="font-outfit font-extrabold text-2xl text-white mb-3">Космическая скорость разработки</h3>
                <p className="text-sm text-[#8fa0b5] max-w-md leading-relaxed">
                  Ваш полностью готовый, наполненный и рабочий сайт будет запущен всего за **3–5 дней**. Сверхбыстрая разработка без потери премиального качества.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-3 bg-white/5 border border-white/5 rounded-full px-4 py-2 w-fit backdrop-blur-md">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Разработка запущена</span>
              </div>
            </div>

            {/* 2. PRICE CARD (1 column) */}
            <div className="relative bg-[#0a0e1a]/85 border border-white/5 rounded-3xl p-8 hover:border-blue-500/20 transition-all flex flex-col justify-between overflow-hidden group min-h-[260px]">
              <Spotlight className="from-amber-600/10 via-transparent to-transparent" size={240} />
              <div>
                <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
                  <Tag className="w-6 h-6" />
                </div>
                <h3 className="font-outfit font-extrabold text-2xl text-white mb-3">Прозрачная стоимость</h3>
                <p className="text-sm text-[#8fa0b5] leading-relaxed">
                  Стоимость разработки стартует **от 5 000 сом**. Полная прозрачность: никаких скрытых переплат, навязанных услуг или лишних ежемесячных подписок.
                </p>
              </div>
              <div className="mt-6 text-sm font-semibold text-amber-400 uppercase tracking-wider">
                Без скрытых платежей
              </div>
            </div>

            {/* 3. RESPONSIVENESS CARD (1 column) */}
            <div className="relative bg-[#0a0e1a]/85 border border-white/5 rounded-3xl p-8 hover:border-blue-500/20 transition-all flex flex-col justify-between overflow-hidden group min-h-[260px]">
              <Spotlight className="from-indigo-600/10 via-transparent to-transparent" size={240} />
              <div>
                <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                  <Laptop className="w-6 h-6" />
                </div>
                <h3 className="font-outfit font-extrabold text-2xl text-white mb-3">100% адаптивность</h3>
                <p className="text-sm text-[#8fa0b5] leading-relaxed">
                  Ваш сайт будет выглядеть безупречно и открываться моментально на любых смартфонах, планшетах и компьютерах с сохранением всех интерактивных эффектов.
                </p>
              </div>
              <div className="mt-6 flex gap-4 text-[#8fa0b5]">
                <Smartphone className="w-5 h-5 group-hover:text-indigo-400 transition-colors" />
                <Laptop className="w-5 h-5 group-hover:text-indigo-400 transition-colors" />
              </div>
            </div>

            {/* 4. WHATSAPP CARD (2 columns on medium+) */}
            <div className="md:col-span-2 relative bg-[#0a0e1a]/85 border border-white/5 rounded-3xl p-8 hover:border-blue-500/20 transition-all flex flex-col justify-between overflow-hidden group min-h-[260px]">
              <Spotlight className="from-emerald-600/10 via-transparent to-transparent" size={300} />
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-colors" />
              <div>
                <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h3 className="font-outfit font-extrabold text-2xl text-white mb-3">Лиды напрямую в ваш WhatsApp</h3>
                <p className="text-sm text-[#8fa0b5] max-w-md leading-relaxed">
                  Настроим моментальную отправку заполненных заявок с сайта прямо на ваш личный WhatsApp-номер. Мгновенно узнавайте о новых клиентах и отвечайте им в один клик.
                </p>
              </div>
              <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-4 w-full sm:w-fit max-w-sm backdrop-blur-md">
                <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </div>
                <div className="flex-1 text-left">
                  <div className="text-[10px] text-[#8fa0b5] font-semibold uppercase tracking-wider">Новое сообщение:</div>
                  <div className="text-xs text-white italic">«Здравствуйте! Хочу заказать расчет сметы...»</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========== TESTIMONIALS (Interactive Switcher & Marquee) ========== */}
      <section className="section bg-[#050811] border-y border-white/5 relative z-20 overflow-hidden" id="testimonials">
        <div className="max-w-6xl mx-auto px-6">
          <div className="section-header">
            <span className="section-label">Отзывы</span>
            <h2 className="section-title">Что говорят о нашей работе</h2>
            <p className="section-desc">Доверие клиентов — наш главный космический ресурс. Читайте отзывы реальных владельцев бизнеса</p>
          </div>

          {/* Interactive Testimonial Switcher */}
          <div className="relative z-10 bg-[#0a0e1a]/40 border border-white/5 rounded-3xl p-4 md:p-8 backdrop-blur-md max-w-4xl mx-auto mb-16 shadow-2xl">
            <Testimonials />
          </div>
        </div>

        {/* Supporting Infinite Marquee Wall */}
        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden py-4 opacity-75">
          <Marquee className="[--duration:45s] p-2" pauseOnHover={true}>
            {[
              { name: "Д-р Алмаз", role: "Стоматология «Белая Улыбка»", text: "Сайт стоматологии запустили за 4 дня. Пациенты легко записываются через WhatsApp." },
              { name: "Меерим", role: "Ресторан «Чайхана Бишкек»", text: "Удобное интерактивное меню и бронь столов. Все заявки приходят напрямую мне в WhatsApp." },
              { name: "Данияр", role: "Учебный центр «Билим»", text: "Сделали интерактивное расписание и яркий дизайн. Будем сотрудничать дальше!" },
              { name: "Арсен", role: "Автосервис «АвтоПро»", text: "Ребята сделали стильный темный сайт для детейлинга и ремонта. Сразу пошел приток клиентов." }
            ].map((review, idx) => (
              <div 
                key={idx} 
                className="relative w-80 cursor-pointer overflow-hidden rounded-xl border border-white/5 bg-[#0a0e1a]/60 p-5 hover:border-blue-500/20 transition-all flex flex-col justify-between"
              >
                <p className="text-xs text-[#8fa0b5] italic leading-relaxed">«{review.text}»</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-white">{review.name}</span>
                  <span className="text-[9px] text-[#566882]">{review.role}</span>
                </div>
              </div>
            ))}
          </Marquee>
        </div>
      </section>

      {/* ========== INTERACTIVE GRID SHOWCASE ========== */}
      <section className="section bg-[#070a13] border-y border-white/5 relative z-20 overflow-hidden" id="sandbox">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="section-header">
            <span className="section-label">Лаборатория интерактива</span>
            <h2 className="section-title">Интерактивный Холст</h2>
            <p className="section-desc">Поводите курсором мыши по области ниже, чтобы проявить активный слой бесконечной сетки с эффектом следования света</p>
          </div>
        </div>
        <div className="h-[450px] relative w-full overflow-hidden border border-white/5 rounded-3xl max-w-5xl mx-auto my-6 bg-[#050811]/90 shadow-2xl backdrop-blur-md">
          <TheInfiniteGrid />
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className="cta-section relative py-24 z-20" id="contact">
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="bg-[#0a0e1a]/70 backdrop-blur-md border border-white/5 rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--primary-glow),transparent_70%)] pointer-events-none opacity-20" />
            <h2 className="font-outfit font-extrabold text-3xl md:text-4xl text-white mb-4 relative z-10">
              Создадим ваш новый сайт сегодня?
            </h2>
            <p className="text-sm md:text-base text-[#8fa0b5] max-w-lg mx-auto mb-8 relative z-10">
              Просто напишите мне в WhatsApp — обсудим цели, выберем крутой стиль и сразу запустим проект в работу.
            </p>
            <a 
              href="https://wa.me/996555123456?text=Здравствуйте!%20Интересует%20создание%20сайта" 
              target="_blank" 
              rel="noopener"
              className="inline-flex items-center gap-2.5 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-xl shadow-blue-500/30 active:scale-95 transition-all relative z-10"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
              <span>Написать в WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="footer bg-[#03050a]/90 relative z-10 border-t border-white/5 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-outfit font-black text-lg text-white">WebPro.kg</div>
          <div className="text-xs text-[#8fa0b5]">&copy; 2026 WebPro.kg. Все права защищены.</div>
          <div className="text-xs text-[#8fa0b5] flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            Бишкек, Кыргызстан
          </div>
        </div>
      </footer>

      {/* ========== FLOATING WHATSAPP ========== */}
      <a 
        href="https://wa.me/996555123456?text=Здравствуйте!%20Интересует%20создание%20сайта" 
        target="_blank" 
        rel="noopener"
        className="whatsapp-float"
        aria-label="Написать в WhatsApp"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        <span className="whatsapp-tooltip">Напишите нам</span>
      </a>

    </div>
  );
}

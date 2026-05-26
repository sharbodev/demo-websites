"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Sparkles as SparklesComp } from "@/components/ui/sparkles";
import { TimelineContent } from "@/components/ui/timeline-animation";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import { cn } from "@/lib/utils";
import NumberFlow from "@number-flow/react";
import { motion } from "framer-motion";
import { useRef, useState } from "react";

const plans = [
  {
    name: "Лендинг",
    description: "Идеально подходит для быстрого запуска рекламы, презентации одной услуги или товара.",
    price: 5000,
    yearlyPrice: 4000, // discount price if they order multiple
    buttonText: "Выбрать тариф",
    buttonVariant: "outline" as const,
    includes: [
      "В стоимость входит:",
      "Срок разработки: 3–5 дней",
      "Уникальный космический дизайн",
      "Полная адаптивность под телефоны",
      "Интеграция кнопки WhatsApp",
      "Подключение домена",
      "Базовая SEO оптимизация",
    ],
  },
  {
    name: "Бизнес-Сайт",
    description: "Солидный многостраничный сайт для полноценного интернет-представительства вашей компании.",
    price: 8000,
    yearlyPrice: 7000,
    buttonText: "Заказать сайт",
    buttonVariant: "default" as const,
    popular: true,
    includes: [
      "Все преимущества Лендинга, плюс:",
      "Срок разработки: 5–7 дней",
      "До 5 внутренних страниц",
      "Каталог товаров/услуг",
      "Форма обратной связи",
      "Интерактивная карта проезда",
      "Повышенная SEO оптимизация",
    ],
  },
  {
    name: "Мини-Магазин",
    description: "Электронная витрина товаров с корзиной и оформлением заказа напрямую в ваш WhatsApp.",
    price: 15000,
    yearlyPrice: 13000,
    buttonText: "Начать продажи",
    buttonVariant: "outline" as const,
    includes: [
      "Все преимущества Бизнеса, плюс:",
      "Срок разработки: 7–10 дней",
      "Интерактивная корзина покупок",
      "Оформление заказов в WhatsApp",
      "Каталог с фильтрами товаров",
      "Админ-панель для управления",
      "Инструкция по наполнению",
    ],
  },
];

const PricingSwitch = ({ onSwitch }: { onSwitch: (value: string) => void }) => {
  const [selected, setSelected] = useState("0");

  const handleSwitch = (value: string) => {
    setSelected(value);
    onSwitch(value);
  };

  return (
    <div className="flex justify-center">
      <div className="relative z-10 mx-auto flex w-fit rounded-full bg-neutral-900 border border-neutral-800 p-1">
        <button
          onClick={() => handleSwitch("0")}
          className={cn(
            "relative z-10 w-fit h-10 rounded-full sm:px-6 px-4 sm:py-2 py-1 font-medium transition-colors text-sm cursor-pointer",
            selected === "0" ? "text-white" : "text-gray-400 hover:text-white",
          )}
        >
          {selected === "0" && (
            <motion.span
              layoutId="switch"
              className="absolute top-0 left-0 h-10 w-full rounded-full border border-blue-500 bg-gradient-to-b from-blue-500 to-blue-600 shadow-md shadow-blue-500/25"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative">Обычная цена</span>
        </button>

        <button
          onClick={() => handleSwitch("1")}
          className={cn(
            "relative z-10 w-fit h-10 flex-shrink-0 rounded-full sm:px-6 px-4 sm:py-2 py-1 font-medium transition-colors text-sm cursor-pointer",
            selected === "1" ? "text-white" : "text-gray-400 hover:text-white",
          )}
        >
          {selected === "1" && (
            <motion.span
              layoutId="switch"
              className="absolute top-0 left-0 h-10 w-full rounded-full border border-blue-500 bg-gradient-to-b from-blue-500 to-blue-600 shadow-md shadow-blue-500/25"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative flex items-center gap-2">Со скидкой %</span>
        </button>
      </div>
    </div>
  );
};

export default function PricingSection4() {
  const [isYearly, setIsYearly] = useState(false);
  const pricingRef = useRef<HTMLDivElement>(null);

  const revealVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.15,
        duration: 0.5,
      },
    }),
    hidden: {
      filter: "blur(10px)",
      y: -20,
      opacity: 0,
    },
  };

  const togglePricingPeriod = (value: string) =>
    setIsYearly(Number.parseInt(value) === 1);

  return (
    <div
      className="py-24 mx-auto relative bg-[#070a13] overflow-hidden rounded-3xl border border-white/5 my-12"
      ref={pricingRef}
    >
      {/* Sparkles background effect */}
      <TimelineContent
        animationNum={4}
        timelineRef={pricingRef}
        customVariants={revealVariants}
        className="absolute inset-0 h-full w-full overflow-hidden [mask-image:radial-gradient(50%_50%,white,transparent)] pointer-events-none"
      >
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:70px_80px]"></div>
        <SparklesComp
          density={100}
          direction="bottom"
          speed={0.5}
          color="#38bdf8"
          className="absolute inset-0 h-full w-full"
        />
      </TimelineContent>

      <TimelineContent
        animationNum={5}
        timelineRef={pricingRef}
        customVariants={revealVariants}
        className="absolute left-0 top-0 w-full h-full flex flex-col items-center justify-center overflow-hidden pointer-events-none z-0"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
      </TimelineContent>

      <article className="text-center mb-12 max-w-3xl mx-auto space-y-4 relative z-10 px-6">
        <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
          <VerticalCutReveal
            splitBy="words"
            staggerDuration={0.1}
            staggerFrom="first"
            reverse={true}
            containerClassName="justify-center"
            transition={{
              type: "spring",
              stiffness: 250,
              damping: 40,
            }}
          >
            Тарифы под любые задачи
          </VerticalCutReveal>
        </h2>

        <TimelineContent
          as="p"
          animationNum={0}
          timelineRef={pricingRef}
          customVariants={revealVariants}
          className="text-[#8fa0b5] text-sm md:text-base max-w-lg mx-auto"
        >
          Выберите подходящий формат разработки. Прозрачные цены без скрытых платежей, разработанные специально для предпринимателей в Кыргызстане.
        </TimelineContent>

        <TimelineContent
          as="div"
          animationNum={1}
          timelineRef={pricingRef}
          customVariants={revealVariants}
          className="pt-2"
        >
          <PricingSwitch onSwitch={togglePricingPeriod} />
        </TimelineContent>
      </article>

      <div className="grid grid-cols-1 md:grid-cols-3 max-w-6xl gap-6 py-6 mx-auto px-6 relative z-10">
        {plans.map((plan, index) => (
          <TimelineContent
            key={plan.name}
            as="div"
            animationNum={2 + index}
            timelineRef={pricingRef}
            customVariants={revealVariants}
            className="h-full"
          >
            <Card
              className={cn(
                "relative text-white border-white/5 bg-[#0a0e1a]/80 h-full flex flex-col justify-between overflow-hidden",
                plan.popular && "border-blue-500/30 shadow-[0_0_50px_rgba(37,99,235,0.15)] bg-gradient-to-b from-[#0e162b]/95 to-[#050811]/98"
              )}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] uppercase tracking-wider font-extrabold px-3 py-1.5 rounded-bl-xl border-l border-b border-blue-400/20">
                  Популярный
                </div>
              )}

              <CardHeader className="text-left p-6 md:p-8">
                <h3 className="text-2xl font-extrabold mb-1 font-outfit">{plan.name}</h3>
                <p className="text-xs text-[#8fa0b5] leading-relaxed mb-6 min-h-[36px]">{plan.description}</p>
                
                <div className="flex items-baseline gap-1 mt-4">
                  <span className="text-4xl md:text-5xl font-black font-outfit text-white">
                    <NumberFlow
                      value={isYearly ? plan.yearlyPrice : plan.price}
                      className="font-black text-white"
                    />
                  </span>
                  <span className="text-sm font-semibold text-[#8fa0b5] ml-1">
                    сом
                  </span>
                </div>
              </CardHeader>

              <CardContent className="p-6 md:p-8 pt-0 flex-1 flex flex-col justify-between">
                <div>
                  <a
                    href={`https://wa.me/996555123456?text=Здравствуйте!%20Интересует%20тариф%20${encodeURIComponent(plan.name)}`}
                    target="_blank"
                    rel="noopener"
                    className={cn(
                      "w-full py-4.5 rounded-xl font-bold text-sm transition-all text-center flex items-center justify-center gap-2 cursor-pointer shadow-lg",
                      plan.popular
                        ? "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/10 active:scale-95"
                        : "bg-white/5 hover:bg-white/10 border border-white/10 text-white active:scale-95"
                    )}
                  >
                    <span>{plan.buttonText}</span>
                  </a>

                  <div className="space-y-4 pt-6 border-t border-white/5 mt-6">
                    <h4 className="font-bold text-xs text-white uppercase tracking-wider">
                      {plan.includes[0]}
                    </h4>
                    <ul className="space-y-3">
                      {plan.includes.slice(1).map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className="flex items-start gap-2.5"
                        >
                          <span className="h-2 w-2 bg-blue-500 rounded-full mt-1.5 shrink-0" />
                          <span className="text-xs text-[#8fa0b5] leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TimelineContent>
        ))}
      </div>
    </div>
  );
}

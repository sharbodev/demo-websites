"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface Dot {
  x0: number; // original X
  y0: number; // original Y
  x: number;  // current X
  y: number;  // current Y
  opacity: number;
}

export const TheInfiniteGrid = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: -1000, y: -1000 });
  const dots = useRef<Dot[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.current.x = e.clientX - rect.left;
      mouse.current.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.current.x = -1000;
      mouse.current.y = -1000;
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    const gap = 35; // dense and visual grid spacing

    const initDots = () => {
      const rect = container.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      
      const dpr = window.devicePixelRatio || 1;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.resetTransform();
      ctx.scale(dpr, dpr);

      const tempDots: Dot[] = [];
      const cols = Math.ceil(w / gap) + 1;
      const rows = Math.ceil(h / gap) + 1;

      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const x = c * gap;
          const y = r * gap;
          tempDots.push({
            x0: x,
            y0: y,
            x: x,
            y: y,
            opacity: 0.18,
          });
        }
      }
      dots.current = tempDots;
    };

    initDots();

    const resizeObserver = new ResizeObserver(() => {
      initDots();
    });
    resizeObserver.observe(container);

    const repelRadius = 130;
    const maxRepel = 40;
    const ease = 0.08;

    const animate = () => {
      const rect = container.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      dots.current.forEach((dot) => {
        const dx = dot.x0 - mouse.current.x;
        const dy = dot.y0 - mouse.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let targetX = dot.x0;
        let targetY = dot.y0;
        let targetOpacity = 0.16;
        let force = 0;

        if (dist < repelRadius) {
          force = (repelRadius - dist) / repelRadius; // 1 to 0
          const angle = Math.atan2(dy, dx);
          const push = force * maxRepel;

          targetX = dot.x0 + Math.cos(angle) * push;
          targetY = dot.y0 + Math.sin(angle) * push;
          targetOpacity = 0.16 + force * 0.7; // shines bright
        }

        dot.x += (targetX - dot.x) * ease;
        dot.y += (targetY - dot.y) * ease;
        dot.opacity += (targetOpacity - dot.opacity) * ease;

        ctx.beginPath();
        // Shift color from slate-blue to cyan-blue based on mouse proximity
        const r = Math.floor(143 + (56 - 143) * force);
        const g = Math.floor(160 + (189 - 160) * force);
        const b = Math.floor(181 + (248 - 181) * force);

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${dot.opacity})`;
        const radius = 1.0 + force * 1.5; // grows up to 2.5px
        ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[450px] bg-transparent overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-85"
      />
      {/* Dynamic ambient lights */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute right-[-20%] top-[-20%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute right-[10%] top-[-10%] w-[20%] h-[20%] rounded-full bg-cyan-500/10 blur-[100px]" />
        <div className="absolute left-[-10%] bottom-[-20%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6 max-w-2xl mx-auto space-y-6 pointer-events-none py-16">
        <div className="space-y-3">
          <h3 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-sm font-outfit">
            Интерактивный Холст
          </h3>
          <p className="text-sm md:text-base text-[#8fa0b5] max-w-lg mx-auto leading-relaxed">
            Поводите курсором по холсту, чтобы увидеть, как высокотехнологичная сетка точек рассыпается и деформируется под вашим движением.
          </p>
        </div>
        
        <div className="flex gap-4 pointer-events-auto">
          <a 
              href="#contact"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-lg active:scale-95 transition-all text-sm text-center flex items-center justify-center border border-white/5"
          >
              Обсудить проект
          </a>
        </div>
      </div>
    </div>
  );
};

export const GlobalInfiniteGrid = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const gap = 38; // visual screen-wide grid spacing

    const drawGrid = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      
      const dpr = window.devicePixelRatio || 1;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.resetTransform();
      ctx.scale(dpr, dpr);

      ctx.clearRect(0, 0, w, h);

      const cols = Math.ceil(w / gap) + 1;
      const rows = Math.ceil(h / gap) + 1;

      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const x = c * gap;
          const y = r * gap;

          ctx.beginPath();
          ctx.fillStyle = "rgba(143, 160, 181, 0.12)"; // beautiful baseline opacity
          ctx.arc(x, y, 1.0, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    drawGrid();

    const handleResize = () => {
      drawGrid();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-[1] opacity-70"
      style={{ width: "100vw", height: "100vh" }}
    />
  );
};


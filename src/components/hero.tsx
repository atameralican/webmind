"use client";

// Hero bileşeni — particle efekti, mouse parallax ve animasyonlu başlık
// Google WebMind sitesine benzer hafif, yavaşlatmayan mouse takip efekti

import { useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Cpu, Zap, Shield, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Particle (parçacık) yapısı
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  color: string;
}

export function Hero() {
  const t = useTranslations("hero");
  const locale = useLocale();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  // Mouse pozisyonu için spring animasyonu — yumuşak takip
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  // Parallax dönüşümü — mouse hareketi ile 3D efekt
  const rotateX = useTransform(springY, [-300, 300], [5, -5]);
  const rotateY = useTransform(springX, [-300, 300], [-5, 5]);

  const localePath = (path: string) =>
    locale === "en" ? path : `/${locale}${path}`;

  // Canvas particle sistemi başlatıcı
  const initParticles = useCallback((canvas: HTMLCanvasElement) => {
    const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 12000));
    const colors = ["rgba(99, 102, 241,", "rgba(139, 92, 246,", "rgba(59, 130, 246,", "rgba(16, 185, 129,"];

    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
  }, []);

  // Particle animasyon döngüsü
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const particles = particlesRef.current;
    const mouse = mouseRef.current;

    particles.forEach((p) => {
      // Mouse çekimi — hafif, yavaşlatmıyor
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 150) {
        const force = (150 - dist) / 150 * 0.02;
        p.vx += dx * force * 0.01;
        p.vy += dy * force * 0.01;
      }

      // Hız sınırı
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > 0.8) {
        p.vx = (p.vx / speed) * 0.8;
        p.vy = (p.vy / speed) * 0.8;
      }

      p.x += p.vx;
      p.y += p.vy;

      // Sınırlardan sekme
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      // Particle'ı çiz
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `${p.color}${p.opacity})`;
      ctx.fill();
    });

    // Yakın parçacıklar arasında çizgi çek
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 100) {
          const opacity = (1 - dist / 100) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    animFrameRef.current = requestAnimationFrame(animate);
  }, []);

  // Canvas kurulumu ve cleanup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles(canvas);
    };

    resize();
    animate();

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      mouseX.set(e.clientX - window.innerWidth / 2);
      mouseY.set(e.clientY - window.innerHeight / 2);
    };

    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [animate, initParticles, mouseX, mouseY]);

  const stats = [
    { icon: <Cpu className="h-4 w-4" />, value: "9+", label: t("statModels") },
    { icon: <Zap className="h-4 w-4" />, value: "12+", label: t("statTasks") },
    { icon: <Shield className="h-4 w-4" />, value: t("statPrivacy"), label: "" },
    { icon: <Globe className="h-4 w-4" />, value: "Chrome/Edge", label: t("statBrowsers") },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      />

      {/* Arka plan gradient */}
      <div className="absolute inset-0 bg-grid opacity-30" aria-hidden="true" />
      <div className="absolute inset-0 bg-radial-gradient opacity-40" aria-hidden="true" />

      {/* Ana içerik */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Badge
            variant="outline"
            className="mb-6 gap-1.5 px-4 py-1.5 text-sm border-primary/30 bg-primary/5 text-primary"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            {t("badge")}
          </Badge>
        </motion.div>

        {/* Ana başlık — 3D parallax efekti */}
        <motion.div
          style={{ rotateX, rotateY, perspective: 1000 }}
          className="mb-6"
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-tight"
          >
            {t("title")}{" "}
            <span className="gemini-text">{t("titleHighlight")}</span>
          </motion.h1>
        </motion.div>

        {/* Açıklama */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          {t("description")}
        </motion.p>

        {/* CTA butonları */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link
            href={localePath("/webllm")}
            className="group inline-flex items-center gap-2 px-8 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium shadow-lg hover:bg-primary/90 transition-all duration-200"
          >
            <Cpu className="h-4 w-4" />
            {t("ctaWebLLM")}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href={localePath("/transformers")}
            className="group inline-flex items-center gap-2 px-8 py-2.5 rounded-lg border border-border/60 bg-background text-foreground text-sm font-medium hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
          >
            <Zap className="h-4 w-4" />
            {t("ctaTransformers")}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {/* İstatistikler */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05, y: -2 }}
              className="glass rounded-xl p-4 text-center"
            >
              <div className="flex items-center justify-center gap-1.5 text-primary mb-1">
                {stat.icon}
              </div>
              <div className="text-xl font-bold">{stat.value}</div>
              {stat.label && (
                <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Alt scroll göstergesi */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-5 h-8 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-2 bg-muted-foreground/50 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}

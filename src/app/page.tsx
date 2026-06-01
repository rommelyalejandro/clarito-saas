'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, Variants } from 'framer-motion';
import { ArrowRight, Activity, Target, Zap, Shield, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import MantaBackground from '@/components/landing/MantaBackground';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
};

export default function LandingPage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-bg-main selection:bg-accent-primary/30">
      
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-matrix opacity-[0.03] pointer-events-none z-0"></div>
      <div className="absolute inset-0 premium-noise z-50"></div>
      <MantaBackground />
      
      <div className="max-w-[1200px] mx-auto px-6 pt-32 pb-24 relative z-10">
        
        {/* HERO SECTION */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-4xl mx-auto mb-32"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-primary/10 border border-accent-primary/20 text-accent-primary text-xs font-mono font-bold mb-8 shadow-[0_0_20px_rgba(129,140,248,0.2)] backdrop-blur-md">
            <Sparkles className="w-4 h-4" />
            V1.0 YA DISPONIBLE PARA CREADORES
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl font-sans font-extrabold tracking-tight mb-8 leading-[1.05]">
            Crece en Substack con <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-primary via-status-purple to-status-teal animate-gradient-x">
              precisión milimétrica
            </span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-lg md:text-xl text-text-soft max-w-2xl mx-auto mb-10 leading-relaxed">
            Convierte tus exportaciones CSV crudas en métricas de nivel empresarial. Predice tu crecimiento, aniquila la deserción y descubre exactamente qué canales traen suscriptores leales.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login" className="group relative px-8 py-4 bg-white text-black font-bold rounded-2xl transition-all hover:scale-105 overflow-hidden flex items-center justify-center gap-2 text-lg w-full sm:w-auto shadow-[0_0_30px_rgba(255,255,255,0.2)]">
              <div className="absolute inset-0 bg-gradient-to-r from-accent-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              Empezar ahora <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#bento" className="px-8 py-4 glass-btn text-white font-bold rounded-2xl transition-all text-lg w-full sm:w-auto flex items-center justify-center">
              Explorar funciones
            </a>
          </motion.div>
        </motion.div>

        {/* SOCIAL PROOF SECTION */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-40"
        >
          <p className="text-center text-text-muted text-sm font-mono tracking-widest uppercase mb-8">Confiado por los mejores creadores del mundo</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-40 grayscale">
            <div className="text-2xl font-bold font-serif">The Pragmatic Engineer</div>
            <div className="text-2xl font-black tracking-tighter">Lenny's Newsletter</div>
            <div className="text-2xl font-medium font-sans">Platformer</div>
            <div className="text-2xl font-bold italic">Sinocism</div>
          </div>
        </motion.div>

        {/* 3D FLOATING DASHBOARD PREVIEW */}
        <motion.div 
          initial={{ opacity: 0, y: 100, rotateX: 10 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, type: 'spring' }}
          className="relative max-w-5xl mx-auto mb-40 perspective-[2000px]"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-accent-primary via-status-teal to-status-purple rounded-[32px] blur-2xl opacity-20 animate-pulse"></div>
          <div className="glass-panel p-2 rounded-[32px] border border-white/10 shadow-2xl bg-black/40 relative overflow-hidden backdrop-blur-3xl">
            {/* Fake UI Header */}
            <div className="h-10 border-b border-white/5 flex items-center px-6 gap-2 bg-white/[0.02]">
              <div className="w-3 h-3 rounded-full bg-status-red/80"></div>
              <div className="w-3 h-3 rounded-full bg-status-yellow/80"></div>
              <div className="w-3 h-3 rounded-full bg-status-green/80"></div>
            </div>
            {/* Fake UI Content */}
            <div className="p-8 grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="col-span-1 md:col-span-1 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 rounded-2xl bg-white/5 border border-white/5 p-4 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div className="w-8 h-8 rounded-lg bg-white/10"></div>
                      <div className="w-12 h-4 rounded bg-status-green/20"></div>
                    </div>
                    <div className="h-2 w-1/2 bg-white/20 rounded"></div>
                  </div>
                ))}
              </div>
              <div className="col-span-1 md:col-span-3 h-full min-h-[300px] rounded-2xl bg-white/5 border border-white/5 p-6 flex flex-col justify-end">
                <div className="flex items-end gap-3 h-full w-full opacity-60">
                  {[20, 30, 25, 40, 50, 45, 60, 70, 85, 100].map((h, i) => (
                    <motion.div 
                      key={i}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${h}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + (i * 0.1), duration: 0.8, type: 'spring' }}
                      className="flex-1 bg-gradient-to-t from-accent-primary/80 to-status-teal/80 rounded-t-sm"
                    ></motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* BENTO GRID SECTION */}
        <div id="bento" className="mb-40">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-sans font-bold mb-4">Todo el poder en una cuadrícula</h2>
            <p className="text-text-soft text-lg max-w-2xl mx-auto">Nuestra arquitectura procesa miles de filas localmente en milisegundos.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
            <motion.div whileHover={{ scale: 1.02 }} className="md:col-span-2 glass-panel rounded-3xl p-8 relative overflow-hidden group border border-white/10 transition-all">
              <div className="absolute top-0 right-0 -mr-10 -mt-10 w-64 h-64 bg-accent-primary/20 rounded-full blur-3xl group-hover:bg-accent-primary/30 transition-colors"></div>
              <Activity className="w-10 h-10 text-accent-primary mb-6" />
              <h3 className="text-2xl font-bold mb-3 text-white">Análisis Retrospectivo Instantáneo</h3>
              <p className="text-text-soft text-sm md:text-base max-w-md">Compara cualquier CSV antiguo con tu estado actual. Detectamos matemáticamente quiénes se fueron, quiénes llegaron y quiénes se quedaron, línea por línea.</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} className="glass-panel rounded-3xl p-8 relative overflow-hidden group border border-white/10 transition-all">
              <Shield className="w-10 h-10 text-status-red mb-6" />
              <h3 className="text-xl font-bold mb-3 text-white">Auditoría de Deserción</h3>
              <p className="text-text-soft text-sm">Descubre si un canal específico solo trae suscriptores que se dan de baja rápido.</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} className="glass-panel rounded-3xl p-8 relative overflow-hidden group border border-white/10 transition-all">
              <Target className="w-10 h-10 text-status-green mb-6" />
              <h3 className="text-xl font-bold mb-3 text-white">Proyecciones de Run Rate</h3>
              <p className="text-text-soft text-sm">Calculamos tu velocidad de crecimiento anualizada basándonos en tu impulso actual.</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} className="md:col-span-2 glass-panel rounded-3xl p-8 relative overflow-hidden group border border-white/10 transition-all">
              <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-64 h-64 bg-status-teal/20 rounded-full blur-3xl group-hover:bg-status-teal/30 transition-colors"></div>
              <Zap className="w-10 h-10 text-status-teal mb-6" />
              <h3 className="text-2xl font-bold mb-3 text-white">Seguridad 100% Client-Side</h3>
              <p className="text-text-soft text-sm md:text-base max-w-md">No guardamos correos. Todo el análisis pesado ocurre en la memoria RAM de tu navegador garantizando privacidad total.</p>
            </motion.div>
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div className="mb-40">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-sans font-bold mb-4">La Magia en 3 Pasos</h2>
            <p className="text-text-soft text-lg max-w-2xl mx-auto">Tan fácil que parece magia.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent hidden md:block -translate-y-1/2 z-0"></div>
            {[
              { step: "01", title: "Exporta", desc: "Ve a tu panel de Substack y descarga tu archivo 'subscribers.csv' actual y uno antiguo." },
              { step: "02", title: "Arrastra", desc: "Sube ambos archivos a nuestra bóveda segura en el navegador." },
              { step: "03", title: "Alucina", desc: "Observa cómo se generan dashboards instantáneos con retención, fuentes y más." }
            ].map((s, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="glass-panel p-8 rounded-3xl relative z-10 text-center flex flex-col items-center"
              >
                <div className="w-16 h-16 rounded-full bg-accent-primary/20 border border-accent-primary/30 flex items-center justify-center text-2xl font-bold text-accent-primary mb-6 shadow-[0_0_20px_rgba(129,140,248,0.2)]">
                  {s.step}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{s.title}</h3>
                <p className="text-text-soft text-sm">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* PRICING */}
        <div className="mb-40 max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-sans font-bold mb-4">Inversión Transparente</h2>
            <p className="text-text-soft text-lg max-w-2xl mx-auto">Un precio simple. Sin sorpresas.</p>
          </div>
          <div className="glass-panel rounded-[40px] p-1 flex flex-col md:flex-row overflow-hidden border border-white/10 relative">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-accent-primary/10 to-transparent blur-2xl z-0"></div>
            <div className="p-12 md:w-1/2 flex flex-col justify-center relative z-10">
              <h3 className="text-3xl font-bold mb-2">Pase Vitalicio</h3>
              <p className="text-text-soft mb-8">Acceso a todas las herramientas actuales y futuras para siempre.</p>
              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-5xl font-black">$49</span>
                <span className="text-text-muted">/ único pago</span>
              </div>
              <Link href="/login" className="w-full py-4 rounded-xl bg-white text-black font-bold text-center hover:bg-gray-200 transition-colors shadow-lg">
                Comprar Ahora
              </Link>
            </div>
            <div className="p-12 md:w-1/2 bg-white/5 border-l border-white/5 relative z-10">
              <p className="font-bold mb-6 text-lg">Todo Incluido:</p>
              <ul className="space-y-4">
                {[
                  "Análisis de cohortes y deserción",
                  "Proyecciones de MRR y Run Rate",
                  "Privacidad Local-First en navegador",
                  "Actualizaciones semanales",
                  "Soporte prioritario"
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-status-green shrink-0 mt-0.5" />
                    <span className="text-text-soft">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* FOOTER CTA */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-panel rounded-[40px] p-12 md:p-20 text-center relative overflow-hidden border border-accent-primary/30"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/20 via-transparent to-status-purple/20 animate-pulse"></div>
          <h2 className="text-4xl md:text-6xl font-sans font-bold text-white mb-6 relative z-10">Toma el control hoy.</h2>
          <p className="text-xl text-text-soft max-w-xl mx-auto mb-10 relative z-10">Únete a la nueva generación de creadores que dirigen sus newsletters basándose en datos puros.</p>
          <Link href="/login" className="relative z-10 inline-flex items-center gap-2 px-10 py-5 bg-white text-black font-extrabold rounded-2xl text-lg hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.3)]">
            Crear cuenta gratis <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>

      </div>
    </div>
  );
}

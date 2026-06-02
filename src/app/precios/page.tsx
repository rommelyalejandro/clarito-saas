'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, Zap, Shield, Sparkles, Infinity, X } from 'lucide-react';
import { motion, Variants } from 'framer-motion';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-bg-main relative overflow-hidden font-sans">

      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-matrix opacity-[0.03] pointer-events-none z-0"></div>
      <div className="absolute inset-0 premium-noise z-0 pointer-events-none opacity-50"></div>
      
      <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[60vw] h-[60vw] bg-accent-primary/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

      <div className="max-w-[1200px] mx-auto px-6 pt-32 pb-24 relative z-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center mb-16"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 bg-status-teal/10 border border-status-teal/20 text-status-teal text-xs font-mono font-bold rounded-full mb-6">
            <Sparkles className="w-4 h-4" /> EMPIEZA TOTALMENTE GRATIS
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-tight">
            Precios <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-primary to-status-teal">Transparentes</span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-lg md:text-xl text-text-soft max-w-2xl mx-auto font-mono">
            Analiza tu audiencia de Substack sin fricción. Escala solo cuando lo necesites.
          </motion.p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[1100px] mx-auto"
        >
          {/* FREE TIER */}
          <motion.div variants={itemVariants} className="glass-panel p-8 rounded-3xl relative border border-white/10 hover:border-accent-primary/40 transition-colors flex flex-col group mt-4 md:mt-0">
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-2 font-sans">Plan Básico</h3>
              <p className="text-sm text-text-muted font-mono mb-6">Perfecto para newsletters emergentes que quieren probar el servicio.</p>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-5xl font-black text-white">$0</span>
                <span className="text-text-muted font-mono">/ mes</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3 text-sm text-text-soft">
                <CheckCircle2 className="w-5 h-5 text-status-green shrink-0 mt-0.5" />
                <span>Auditoría de Retención básica</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-text-soft">
                <CheckCircle2 className="w-5 h-5 text-status-green shrink-0 mt-0.5" />
                <span>Hasta 1,000 suscriptores por reporte</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-text-soft">
                <CheckCircle2 className="w-5 h-5 text-status-green shrink-0 mt-0.5" />
                <span>Análisis de desertores (Churn)</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-text-muted opacity-50">
                <X className="w-5 h-5 shrink-0 mt-0.5" />
                <span>Guardado de CSVs en la nube</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-text-muted opacity-50">
                <X className="w-5 h-5 shrink-0 mt-0.5" />
                <span>Análisis Geográfico y de Fuentes</span>
              </li>
            </ul>

            <Link href="/login" className="w-full py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-center transition-colors border border-white/10 group-hover:border-white/30">
              Comenzar Gratis
            </Link>
          </motion.div>

          {/* PRO TIER */}
          <motion.div variants={itemVariants} className="glass-panel p-8 rounded-3xl relative border-2 border-accent-primary shadow-[0_0_30px_rgba(129,140,248,0.2)] flex flex-col transform md:-translate-y-4">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-accent-primary text-white text-[10px] font-black uppercase tracking-widest py-1.5 px-4 rounded-full">
              Más Popular
            </div>
            
            <div className="mb-8 mt-2">
              <h3 className="text-xl font-bold text-white mb-2 font-sans flex items-center gap-2">
                <Zap className="w-5 h-5 text-accent-primary" /> Plan Creador
              </h3>
              <p className="text-sm text-text-muted font-mono mb-6">Para newsletters establecidos que buscan optimizar su crecimiento.</p>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-5xl font-black text-white">$19</span>
                <span className="text-text-muted font-mono">/ mes</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3 text-sm text-text-soft">
                <CheckCircle2 className="w-5 h-5 text-status-green shrink-0 mt-0.5" />
                <span className="text-white font-bold">Suscriptores Ilimitados</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-text-soft">
                <CheckCircle2 className="w-5 h-5 text-status-green shrink-0 mt-0.5" />
                <span>Auditoría Retención Substack Completa</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-text-soft">
                <CheckCircle2 className="w-5 h-5 text-status-green shrink-0 mt-0.5" />
                <span>Retención por Fuente de Adquisición</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-text-soft">
                <CheckCircle2 className="w-5 h-5 text-status-green shrink-0 mt-0.5" />
                <span>Distribución de Actividad (Estrellas)</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-text-soft">
                <CheckCircle2 className="w-5 h-5 text-status-green shrink-0 mt-0.5" />
                <span>Respaldo seguro de CSVs en la nube</span>
              </li>
            </ul>

            <Link href="/login" className="w-full py-4 rounded-xl bg-accent-primary hover:bg-accent-secondary text-white font-bold text-center transition-colors shadow-lg shadow-accent-primary/25 hover:shadow-accent-primary/40">
              Prueba Gratuita 7 Días
            </Link>
          </motion.div>

          {/* ENTERPRISE TIER */}
          <motion.div variants={itemVariants} className="glass-panel p-8 rounded-3xl relative border border-white/10 hover:border-status-purple/40 transition-colors flex flex-col group mt-4 md:mt-0">
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-2 font-sans flex items-center gap-2">
                <Shield className="w-5 h-5 text-status-purple" /> Plan Agencia
              </h3>
              <p className="text-sm text-text-muted font-mono mb-6">Maneja múltiples publicaciones y obtén soporte dedicado de nuestro equipo.</p>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-5xl font-black text-white">$49</span>
                <span className="text-text-muted font-mono">/ mes</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3 text-sm text-text-soft">
                <CheckCircle2 className="w-5 h-5 text-status-green shrink-0 mt-0.5" />
                <span className="text-white">Todo lo del Plan Creador</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-text-soft">
                <CheckCircle2 className="w-5 h-5 text-status-green shrink-0 mt-0.5" />
                <span>Múltiples Newsletters (hasta 5)</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-text-soft">
                <CheckCircle2 className="w-5 h-5 text-status-green shrink-0 mt-0.5" />
                <span>Soporte Dedicado 24/7</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-text-soft">
                <CheckCircle2 className="w-5 h-5 text-status-green shrink-0 mt-0.5" />
                <span>Reportes personalizados en PDF</span>
              </li>
            </ul>

            <Link href="/login" className="w-full py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-center transition-colors border border-white/10 group-hover:border-status-purple/40">
              Contactar Ventas
            </Link>
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-20 text-center">
          <p className="text-text-muted font-mono text-sm">
            Todos los planes están cifrados y tus datos nunca se comparten con terceros. <br/>
            Puedes cancelar en cualquier momento.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

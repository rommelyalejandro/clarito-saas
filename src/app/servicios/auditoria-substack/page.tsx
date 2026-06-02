'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { Target, TrendingUp, Users, Activity, BarChart4, ArrowRight, ShieldCheck, Globe, Star } from 'lucide-react';
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

export default function AuditoriaSubstackPage() {
  return (
    <div className="min-h-screen bg-bg-main relative overflow-hidden font-sans">
      <Navbar />

      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-matrix opacity-[0.03] pointer-events-none z-0"></div>
      <div className="absolute inset-0 premium-noise z-0 pointer-events-none opacity-50"></div>
      
      {/* Glows */}
      <div className="absolute top-[20%] left-[10%] w-[40vw] h-[40vw] bg-status-teal/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[10%] right-[10%] w-[30vw] h-[30vw] bg-accent-primary/10 rounded-full blur-[100px] pointer-events-none z-0"></div>

      <div className="max-w-[1200px] mx-auto px-6 pt-32 pb-24 relative z-10">
        
        {/* HERO SECTION */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center mb-24"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 bg-accent-primary/10 border border-accent-primary/20 text-accent-primary text-xs font-mono font-bold rounded-full mb-6">
            <Target className="w-4 h-4" /> NUEVO SERVICIO ESPECIALIZADO
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-tight max-w-4xl mx-auto">
            Auditoría Retención <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-status-teal to-accent-primary">Substack</span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-lg md:text-xl text-text-soft max-w-2xl mx-auto font-mono mb-10">
            Sube tus listas de suscriptores y descubre matemáticamente por qué se van, quiénes son los más leales y de dónde provienen tus mejores lectores.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login" className="px-8 py-4 bg-white text-black font-bold rounded-xl transition-transform hover:scale-105 flex items-center gap-2 shadow-[0_0_30px_rgba(255,255,255,0.2)] w-full sm:w-auto justify-center">
              Comenzar Totalmente Gratis <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/pricing" className="px-8 py-4 glass-btn text-white font-bold rounded-xl border border-white/10 hover:bg-white/5 transition-colors w-full sm:w-auto justify-center flex">
              Ver Precios
            </Link>
          </motion.div>
        </motion.div>

        {/* METRICS & FEATURES */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-32"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">¿Qué analizamos exactamente?</h2>
            <p className="text-text-muted font-mono">No inventamos datos. Usamos tu CSV directo de Substack para extraer KPIs 100% reales.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Feature 1: Churn */}
            <motion.div variants={itemVariants} className="glass-panel p-8 rounded-3xl border border-white/5 hover:border-status-red/30 transition-colors group">
              <div className="w-12 h-12 rounded-2xl bg-status-red/10 flex items-center justify-center text-status-red mb-6">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Detección de Desertores (Churn)</h3>
              <p className="text-sm text-text-soft leading-relaxed">
                Comparamos dos períodos exactos para decirte la cantidad precisa de correos que se dieron de baja. Calcula tu <strong>Tasa de Churn</strong> matemáticamente y aísla la lista de quienes te abandonaron.
              </p>
            </motion.div>

            {/* Feature 2: Fuentes */}
            <motion.div variants={itemVariants} className="glass-panel p-8 rounded-3xl border border-white/5 hover:border-accent-primary/30 transition-colors group">
              <div className="w-12 h-12 rounded-2xl bg-accent-primary/10 flex items-center justify-center text-accent-primary mb-6">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Retención por Fuente</h3>
              <p className="text-sm text-text-soft leading-relaxed">
                ¿Los usuarios que llegan por Twitter son más leales que los del buscador? Te mostramos el volumen de altas, bajas y retención separada por cada canal de adquisición (Directo, Social, Web).
              </p>
            </motion.div>

            {/* Feature 3: Actividad */}
            <motion.div variants={itemVariants} className="glass-panel p-8 rounded-3xl border border-white/5 hover:border-status-yellow/30 transition-colors group">
              <div className="w-12 h-12 rounded-2xl bg-status-yellow/10 flex items-center justify-center text-status-yellow mb-6">
                <Star className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Temperatura de Audiencia</h3>
              <p className="text-sm text-text-soft leading-relaxed">
                Substack califica a tus lectores de 1 a 5 estrellas. Te entregamos un gráfico de campana para que veas qué porcentaje de tu lista son lectores fantasma y cuántos son verdaderos superfans.
              </p>
            </motion.div>

            {/* Feature 4: Geo */}
            <motion.div variants={itemVariants} className="glass-panel p-8 rounded-3xl border border-white/5 hover:border-status-teal/30 transition-colors group">
              <div className="w-12 h-12 rounded-2xl bg-status-teal/10 flex items-center justify-center text-status-teal mb-6">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Mapeo Geográfico</h3>
              <p className="text-sm text-text-soft leading-relaxed">
                Identifica en qué países tienes mayor concentración de suscriptores, y si la tasa de deserción está concentrada en una región específica de tu audiencia internacional.
              </p>
            </motion.div>

            {/* Feature 5: Engagement */}
            <motion.div variants={itemVariants} className="glass-panel p-8 rounded-3xl border border-white/5 hover:border-status-purple/30 transition-colors group">
              <div className="w-12 h-12 rounded-2xl bg-status-purple/10 flex items-center justify-center text-status-purple mb-6">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Métricas de Engagement</h3>
              <p className="text-sm text-text-soft leading-relaxed">
                Consolidamos totales y promedios de aperturas de correo (6 meses y 30 días), clicks, comentarios y shares, permitiéndote medir la tracción real de tu contenido.
              </p>
            </motion.div>

            {/* Feature 6: Privacidad */}
            <motion.div variants={itemVariants} className="glass-panel p-8 rounded-3xl border border-white/5 hover:border-status-green/30 transition-colors group lg:col-start-2">
              <div className="w-12 h-12 rounded-2xl bg-status-green/10 flex items-center justify-center text-status-green mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">100% Seguro y Privado</h3>
              <p className="text-sm text-text-soft leading-relaxed">
                Tus datos se procesan en tu dispositivo. Puedes respaldar tus análisis en la nube de forma encriptada únicamente cuando tú lo decidas. Tu audiencia es tuya.
              </p>
            </motion.div>

          </div>
        </motion.div>

        {/* BOTTOM CTA */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative rounded-[2rem] overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-accent-primary/20 to-status-teal/20 mix-blend-overlay z-0"></div>
          <div className="absolute inset-0 premium-noise z-0 opacity-30"></div>
          
          <div className="glass-panel border border-white/10 p-12 md:p-20 text-center relative z-10 backdrop-blur-md bg-black/40">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Deja de adivinar. Comienza a medir.</h2>
            <p className="text-xl text-text-soft font-mono mb-10 max-w-2xl mx-auto">
              Únete a los creadores de Substack que ya optimizan sus newsletters basados en datos reales, no en intuición.
            </p>
            <Link href="/login" className="inline-flex items-center gap-3 px-10 py-5 bg-white text-black font-bold rounded-2xl transition-transform hover:scale-105 text-lg shadow-[0_0_40px_rgba(255,255,255,0.3)]">
              Audita tu Substack Gratis <BarChart4 className="w-6 h-6" />
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
}

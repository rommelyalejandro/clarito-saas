'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, BarChart2, TrendingUp, Users } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-[calc(100vh-73px)] relative overflow-hidden flex flex-col items-center justify-center pt-10 pb-20 px-6">
      
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center z-10 relative mt-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-primary/10 border border-accent-primary/20 text-accent-primary text-xs font-bold mb-8 animate-fade-in-up">
          <span className="w-2 h-2 rounded-full bg-accent-primary animate-pulse"></span>
          Nuevo: Analíticas predictivas y Crecimiento Anualizado
        </div>
        
        <h1 className="text-5xl md:text-7xl font-sans font-extrabold tracking-tight mb-6 leading-[1.1] animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          El futuro de tu <br className="hidden md:block"/>
          <span className="bg-gradient-to-r from-accent-primary via-status-teal to-status-green bg-clip-text text-transparent">
            estrategia en Substack
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-text-soft max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          Convierte datos crudos en decisiones. Descubre exactamente por qué tus suscriptores se van, cuáles canales atraen a los que pagan, y proyecta tu crecimiento con precisión quirúrgica.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <Link href="/login" className="w-full sm:w-auto px-8 py-4 bg-accent-primary hover:bg-accent-secondary text-white font-bold rounded-xl transition-all hover:shadow-[0_0_25px_rgba(45,212,191,0.5)] flex items-center justify-center gap-2 text-lg">
            Empezar Gratis <ArrowRight className="w-5 h-5" />
          </Link>
          <a href="#features" className="w-full sm:w-auto px-8 py-4 glass-btn text-white font-bold rounded-xl transition-all text-lg border border-white/10 hover:border-white/30 text-center">
            Ver cómo funciona
          </a>
        </div>
      </div>

      {/* Floating Dashboard Preview (Abstract) */}
      <div className="w-full max-w-5xl mx-auto mt-20 relative z-10 perspective-1000 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
        <div className="absolute inset-0 bg-gradient-to-t from-bg-main via-transparent to-transparent z-20 pointer-events-none rounded-2xl"></div>
        <div className="glass-panel p-2 rounded-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform rotateX-[5deg] hover:rotateX-[0deg] transition-transform duration-700">
          <div className="bg-bg-surface rounded-xl overflow-hidden border border-white/5 relative">
            <div className="h-8 bg-black/40 flex items-center px-4 gap-2 border-b border-white/5">
              <div className="w-2.5 h-2.5 rounded-full bg-status-red"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-status-yellow"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-status-green"></div>
            </div>
            
            <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6 opacity-70">
              <div className="h-24 rounded-lg bg-gradient-to-br from-accent-primary/20 to-transparent border border-accent-primary/30 p-4">
                <div className="w-8 h-8 rounded bg-accent-primary/20 mb-2"></div>
                <div className="h-2 w-1/2 bg-white/20 rounded mb-1"></div>
                <div className="h-4 w-3/4 bg-white/40 rounded"></div>
              </div>
              <div className="h-24 rounded-lg bg-gradient-to-br from-status-green/20 to-transparent border border-status-green/30 p-4">
                <div className="w-8 h-8 rounded bg-status-green/20 mb-2"></div>
                <div className="h-2 w-1/2 bg-white/20 rounded mb-1"></div>
                <div className="h-4 w-3/4 bg-white/40 rounded"></div>
              </div>
              <div className="h-24 rounded-lg bg-gradient-to-br from-status-red/20 to-transparent border border-status-red/30 p-4">
                <div className="w-8 h-8 rounded bg-status-red/20 mb-2"></div>
                <div className="h-2 w-1/2 bg-white/20 rounded mb-1"></div>
                <div className="h-4 w-3/4 bg-white/40 rounded"></div>
              </div>
              <div className="col-span-1 md:col-span-2 h-40 rounded-lg bg-white/5 border border-white/10 p-4">
                 <div className="h-3 w-1/4 bg-white/20 rounded mb-4"></div>
                 <div className="flex items-end gap-2 h-24">
                   <div className="flex-1 bg-accent-primary/40 rounded-t h-[40%]"></div>
                   <div className="flex-1 bg-accent-primary/40 rounded-t h-[70%]"></div>
                   <div className="flex-1 bg-accent-primary/40 rounded-t h-[60%]"></div>
                   <div className="flex-1 bg-accent-primary/40 rounded-t h-[90%]"></div>
                 </div>
              </div>
              <div className="col-span-1 h-40 rounded-lg bg-white/5 border border-white/10 p-4 flex items-center justify-center">
                 <div className="w-24 h-24 rounded-full border-4 border-status-teal/40 border-t-status-teal border-r-status-teal"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="w-full max-w-6xl mx-auto mt-32 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-sans font-bold mb-4">Todo lo que necesitas para escalar</h2>
          <p className="text-text-soft">Diseñado específicamente para creadores que quieren tratar su boletín como un negocio.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-panel p-8 rounded-2xl hover:border-accent-primary/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-accent-primary/20 flex items-center justify-center text-accent-primary mb-6">
              <BarChart2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Diagnóstico Automático</h3>
            <p className="text-text-soft text-sm leading-relaxed">Sube tus exportaciones CSV y nuestro motor analizará tu crecimiento, retención y deserción, alertándote de áreas críticas automáticamente con métricas precisas.</p>
          </div>

          <div className="glass-panel p-8 rounded-2xl hover:border-status-green/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-status-green/20 flex items-center justify-center text-status-green mb-6">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Proyecciones Financieras</h3>
            <p className="text-text-soft text-sm leading-relaxed">No te conformes con el pasado. Calculamos tu "Run Rate" lineal y proyectamos tu crecimiento anualizado basándonos en tus tendencias más recientes.</p>
          </div>

          <div className="glass-panel p-8 rounded-2xl hover:border-status-red/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-status-red/20 flex items-center justify-center text-status-red mb-6">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Análisis de Deserción</h3>
            <p className="text-text-soft text-sm leading-relaxed">Descubre exactamente de qué fuentes provienen los suscriptores que se dan de baja. Optimiza tu marketing cortando los canales que atraen suscriptores fantasmas.</p>
          </div>
        </div>
      </div>
      
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { Info, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface KpiCardProps {
  label: string;
  actVal: string | number;
  prevVal?: string | number;
  barColor: 'blue' | 'green' | 'red' | 'purple' | 'teal' | 'yellow' | 'pink' | 'churn';
  tooltip?: string;
  invertColor?: boolean;
  specialPanel?: React.ReactNode;
}

export default function KpiCard({
  label,
  actVal,
  prevVal = '',
  barColor,
  tooltip,
  invertColor = false,
  specialPanel
}: KpiCardProps) {
  const { analysis } = useDashboard();
  const [panelOpen, setPanelOpen] = useState(false);

  // Delta calculation
  const actNum = parseFloat(String(actVal).replace(/[$%,]/g, '')) || 0;
  const prevNum = parseFloat(String(prevVal).replace(/[$%,]/g, '')) || 0;
  
  let dPct = 0;
  let dDir = 'eq';
  let dArrow = '→';

  if (prevNum === 0) {
    dPct = actNum > 0 ? 100 : 0;
    dDir = actNum > 0 ? 'up' : 'eq';
    dArrow = actNum > 0 ? '↑' : '→';
  } else {
    dPct = ((actNum - prevNum) / Math.abs(prevNum)) * 100;
    dDir = dPct > 0 ? 'up' : dPct < 0 ? 'dn' : 'eq';
    dArrow = dPct > 0 ? '↑' : dPct < 0 ? '↓' : '→';
  }

  // Invert colors if needed (e.g. churn goes up = bad = red)
  let finalDir = dDir;
  if (invertColor) {
    finalDir = dDir === 'up' ? 'dn' : dDir === 'dn' ? 'up' : 'eq';
  }

  const sign = dPct > 0 ? '+' : '';

  // Calculate generic annualization if applicable
  let annualized = 0;
  let showAnnualized = false;
  if (analysis && analysis.diffDays > 0 && dPct !== 0 && isFinite(dPct) && prevVal !== '') {
    annualized = (dPct / analysis.diffDays) * 365;
    showAnnualized = true;
  }

  const barColorMap = {
    blue: 'bg-accent-primary shadow-[0_0_15px_rgba(129,140,248,0.5)]',
    green: 'bg-status-green shadow-[0_0_15px_rgba(52,211,153,0.5)]',
    red: 'bg-status-red shadow-[0_0_15px_rgba(248,113,113,0.5)]',
    purple: 'bg-status-purple shadow-[0_0_15px_rgba(167,139,250,0.5)]',
    teal: 'bg-status-teal shadow-[0_0_15px_rgba(45,212,191,0.5)]',
    yellow: 'bg-status-yellow shadow-[0_0_15px_rgba(250,204,21,0.5)]',
    pink: 'bg-status-pink shadow-[0_0_15px_rgba(244,114,182,0.5)]',
    churn: 'bg-churn shadow-[0_0_15px_rgba(225,29,72,0.5)]',
  };

  const deltaColorMap = {
    up: 'text-status-green bg-status-green/10 border-status-green/20',
    dn: 'text-status-red bg-status-red/10 border-status-red/20',
    eq: 'text-text-muted bg-white/5 border-white/5',
  };

  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`glass-panel rounded-2xl p-5 relative transition-colors duration-300 hover:border-white/20 group ${panelOpen ? 'z-50 !overflow-visible' : 'overflow-hidden'}`}
    >
      {/* Background premium noise */}
      <div className="absolute inset-0 premium-noise opacity-50 z-0"></div>
      
      <div className={`absolute top-0 left-0 right-0 h-[3px] ${barColorMap[barColor]} z-10 transition-all duration-500 group-hover:h-[4px]`}></div>
      
      <div className="relative z-10">
        {tooltip && (
          <div className="absolute top-0 right-0 group/tooltip cursor-help">
            <HelpCircle className="w-4 h-4 text-text-muted group-hover/tooltip:text-accent-primary transition-colors" />
            <div className="absolute hidden group-hover/tooltip:block right-0 top-6 bg-black/90 border border-white/10 rounded-lg p-3 text-[11px] text-text-soft whitespace-normal w-[220px] z-50 backdrop-blur-xl shadow-2xl font-mono leading-relaxed">
              {tooltip}
            </div>
          </div>
        )}

        {specialPanel && (
          <button 
            onClick={() => setPanelOpen(!panelOpen)}
            className="absolute top-0 right-0 z-10 hover:scale-110 transition-transform"
            title="Ver fórmula detallada"
          >
            <Info className="w-4 h-4 text-status-teal hover:text-accent-primary" />
          </button>
        )}

        <div className="text-[11px] font-mono tracking-widest text-text-muted mb-2 uppercase">{label}</div>
        <div className="font-sans text-[28px] font-black leading-none tracking-tight mb-2 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-text-soft transition-all">
          {actVal}
        </div>
        
        {prevVal !== '' && (
          <div className="flex items-center gap-3 mt-3">
            <div className="text-[12px] text-text-muted font-mono bg-black/20 px-2 py-0.5 rounded-md border border-white/5">
              ant: <span className="text-col-prev font-bold">{prevVal}</span>
            </div>
            
            <div className={`text-[11px] px-2 py-0.5 rounded-md border flex items-center gap-1 font-bold ${deltaColorMap[finalDir as keyof typeof deltaColorMap]}`}>
              {dArrow} {sign}{dPct.toFixed(1)}%
            </div>
          </div>
        )}
        
        {showAnnualized && !specialPanel && (
          <div className="mt-3">
            <span 
              className="inline-flex items-center gap-1 text-[10px] text-status-yellow font-bold cursor-help bg-status-yellow/10 border border-status-yellow/20 px-2 py-1 rounded-md"
              title={`Run rate lineal: (${dPct.toFixed(1)}% / ${analysis?.diffDays}d) × 365 = ${annualized.toFixed(1)}%/año`}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-status-yellow animate-pulse"></div>
              {annualized > 0 ? '+' : ''}{annualized.toFixed(1)}% <span className="opacity-70 font-mono font-normal">/año</span>
            </span>
          </div>
        )}
      </div>

      {/* Expandable Special Panel */}
      {specialPanel && panelOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-[100%] left-0 right-0 z-50 bg-black/95 border border-status-teal/40 rounded-xl p-5 mt-2 shadow-[0_20px_50px_rgba(0,0,0,0.9)] min-w-[320px] backdrop-blur-2xl"
        >
          {specialPanel}
        </motion.div>
      )}
    </motion.div>
  );
}

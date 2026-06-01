'use client';

import React, { useState } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { Info, HelpCircle } from 'lucide-react';

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
    blue: 'bg-accent-primary',
    green: 'bg-status-green',
    red: 'bg-status-red',
    purple: 'bg-status-purple',
    teal: 'bg-status-teal',
    yellow: 'bg-status-yellow',
    pink: 'bg-status-pink',
    churn: 'bg-churn',
  };

  const deltaColorMap = {
    up: 'text-status-green',
    dn: 'text-status-red',
    eq: 'text-text-muted',
  };

  return (
    <div className={`glass-panel rounded-xl p-4 relative transition-all duration-200 hover:-translate-y-0.5 hover:border-accent-primary/50 ${panelOpen ? 'z-50 !overflow-visible' : 'overflow-hidden'}`}>
      <div className={`absolute top-0 left-0 right-0 h-[2px] ${barColorMap[barColor]}`}></div>
      
      {tooltip && (
        <div className="absolute top-2 right-2 group cursor-help">
          <HelpCircle className="w-3 h-3 text-text-muted group-hover:text-text-soft" />
          <div className="absolute hidden group-hover:block right-0 top-5 bg-bg-surface border border-border-color rounded-md p-2 text-[9px] text-text-soft whitespace-normal w-[200px] z-50 backdrop-blur-md shadow-lg">
            {tooltip}
          </div>
        </div>
      )}

      {specialPanel && (
        <button 
          onClick={() => setPanelOpen(!panelOpen)}
          className="absolute top-2 right-2 z-10 hover:scale-110 transition-transform"
          title="Ver fórmula detallada"
        >
          <Info className="w-3.5 h-3.5 text-status-yellow hover:text-text-ink" />
        </button>
      )}

      <div className="text-[10px] uppercase tracking-wider text-text-muted mb-1.5">{label}</div>
      <div className="font-sans text-[22px] font-extrabold leading-none tracking-tight mb-1">
        {actVal}
      </div>
      
      {prevVal !== '' && (
        <div className="text-[11px] text-col-prev mt-1.5 tracking-wide">
          antes: {prevVal}
        </div>
      )}
      
      {prevVal !== '' && (
        <div className={`text-[11px] mt-1.5 flex items-center gap-1 font-semibold flex-wrap ${deltaColorMap[finalDir as keyof typeof deltaColorMap]}`}>
          {dArrow} {sign}{dPct.toFixed(1)}%
          
          {showAnnualized && !specialPanel && (
            <span 
              className="text-[9px] text-status-yellow font-bold ml-1 cursor-help bg-status-yellow/10 px-1.5 py-0.5 rounded whitespace-nowrap"
              title={`Run rate lineal: (${dPct.toFixed(1)}% / ${analysis?.diffDays}d) × 365 = ${annualized.toFixed(1)}%/año`}
            >
              {annualized > 0 ? '+' : ''}{annualized.toFixed(1)}%<span className="opacity-80 text-[8px] font-normal">/año</span>
            </span>
          )}
        </div>
      )}

      {/* Expandable Special Panel */}
      {specialPanel && panelOpen && (
        <div className="absolute top-[100%] left-0 right-0 z-50 bg-bg-surface border border-accent-primary rounded-xl p-4 mt-2 shadow-[0_8px_32px_rgba(0,0,0,0.8)] min-w-[320px] backdrop-blur-xl">
          {specialPanel}
        </div>
      )}
    </div>
  );
}

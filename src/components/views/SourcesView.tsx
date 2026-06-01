'use client';

import React from 'react';
import { useDashboard } from '@/context/DashboardContext';
import KpiCard from '../KpiCard';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { backgroundColor: '#12151c', borderColor: '#232840', borderWidth: 1, padding: 10, titleFont: { family: 'DM Mono', size: 10 }, bodyFont: { family: 'DM Mono', size: 9 } }
  },
  scales: {
    x: { ticks: { color: '#4e5572', font: { family: 'DM Mono', size: 8 } }, grid: { color: '#232840' } },
    y: { ticks: { color: '#4e5572', font: { family: 'DM Mono', size: 8 } }, grid: { color: '#232840' } }
  }
};

const horizontalOptions = {
  ...chartOptions,
  indexAxis: 'y' as const,
};

export default function SourcesView() {
  const { analysis } = useDashboard();
  if (!analysis) return null;

  const { actStats: s, prevStats: p } = analysis;

  const allSources = [...new Set([...Object.keys(s.bySource), ...Object.keys(p.bySource)])];

  const srcData = allSources.map(src => {
    const actCount = s.bySource[src] || 0;
    const prevCount = p.bySource[src] || 0;
    const churnCount = analysis.churnBySource[src] || 0;
    const newCount = analysis.newBySource[src] || 0;
    const retInfo = analysis.sourceRetention[src] || { retRate: 0, retained: 0, totalPrev: 0, churned: 0 };
    return { src, actCount, prevCount, churnCount, newCount, retRate: retInfo.retRate, delta: actCount - prevCount };
  }).sort((a,b) => b.actCount - a.actCount);

  const topSrc = srcData.slice(0, 10);
  const growingSources = srcData.filter(x => x.delta > 0).sort((a,b) => b.delta - a.delta).slice(0,5);
  const shrinkingSources = srcData.filter(x => x.delta < 0).sort((a,b) => a.delta - b.delta).slice(0,5);

  const deltaEntries = srcData.filter(x=>x.delta !== 0).sort((a,b) => b.delta - a.delta);
  const topDelta = [...deltaEntries.slice(0,5), ...deltaEntries.slice(-5)].filter((v,i,a)=>a.findIndex(x=>x.src===v.src)===i);

  const chartTopSrc = {
    labels: topSrc.map(x=>x.src.replace('www.','').replace('substack-','ss·')),
    datasets: [
      { label: 'Actual', data: topSrc.map(x=>x.actCount), backgroundColor: '#2dd4bfcc', borderRadius: 3 },
      { label: 'Anterior', data: topSrc.map(x=>x.prevCount), backgroundColor: '#818cf8cc', borderRadius: 3 }
    ]
  };

  const chartDelta = {
    labels: topDelta.map(x=>x.src.replace('www.','').replace('substack-','ss·')),
    datasets: [{
      label: 'Δ Suscriptores',
      data: topDelta.map(x=>x.delta),
      backgroundColor: topDelta.map(x=>x.delta >= 0 ? '#34d399cc' : '#fb7185cc'),
      borderRadius: 3
    }]
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      <div>
        <div className="text-sec-header flex items-center gap-3 mb-4 after:content-[''] after:flex-1 after:h-px after:bg-border-color">
          <span className="text-sm">📣</span> Análisis de Fuentes de Suscripción
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <KpiCard label="Fuentes Activas" actVal={Object.keys(s.bySource).length.toString()} prevVal={Object.keys(p.bySource).length.toString()} barColor="blue" />
          <KpiCard label="Fuentes Nuevas" actVal={allSources.filter(src => (s.bySource[src]||0)>0 && !(p.bySource[src]||0)).length.toString()} barColor="teal" />
          <KpiCard label="Fuentes Perdidas" actVal={allSources.filter(src => !(s.bySource[src]||0) && (p.bySource[src]||0)>0).length.toString()} barColor="red" invertColor={true} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-panel p-4 rounded-xl">
          <h5 className="font-sans font-bold text-[11px] mb-1">Top Fuentes · Actual vs Anterior</h5>
          <p className="text-[10px] text-text-soft mb-3">Volumen de suscriptores por fuente</p>
          <div className="h-[260px]"><Bar data={chartTopSrc} options={{...horizontalOptions, plugins: { legend: { display: true, labels: { color: '#8892aa', font: { family: 'DM Mono', size: 9 }, boxWidth: 10 }}}} as any} /></div>
        </div>
        <div className="glass-panel p-4 rounded-xl">
          <h5 className="font-sans font-bold text-[11px] mb-1">Fuentes con Mayor Cambio</h5>
          <p className="text-[10px] text-text-soft mb-3">Variación absoluta entre períodos</p>
          <div className="h-[260px]"><Bar data={chartDelta} options={horizontalOptions as any} /></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="glass-panel p-4 rounded-xl">
          <h5 className="font-sans font-bold text-[11px] mb-1">Fuentes que más Crecen</h5>
          <p className="text-[10px] text-text-soft mb-3">Top canales en expansión</p>
          <div className="h-[200px]">
            <Bar data={{
              labels: growingSources.map(x=>x.src.replace('www.','').replace('substack-','ss·')),
              datasets: [{ label: 'Nuevos subs', data: growingSources.map(x=>x.delta), backgroundColor: '#34d399cc', borderRadius: 3 }]
            }} options={chartOptions as any} />
          </div>
        </div>
        <div className="glass-panel p-4 rounded-xl">
          <h5 className="font-sans font-bold text-[11px] mb-1">Fuentes que más Pierden</h5>
          <p className="text-[10px] text-text-soft mb-3">Canales que se contraen</p>
          <div className="h-[200px]">
            <Bar data={{
              labels: shrinkingSources.map(x=>x.src.replace('www.','').replace('substack-','ss·')),
              datasets: [{ label: 'Subs perdidos', data: shrinkingSources.map(x=>Math.abs(x.delta)), backgroundColor: '#fb7185cc', borderRadius: 3 }]
            }} options={chartOptions as any} />
          </div>
        </div>
      </div>
      
      {/* Full Table */}
      <div className="glass-panel p-6 rounded-xl overflow-x-auto mt-4">
        <table className="w-full text-left border-collapse text-[11px]">
          <thead>
            <tr>
              <th className="font-mono text-[9px] uppercase tracking-wider text-text-muted p-2 border-b border-border-color min-w-[160px]">Fuente</th>
              <th className="font-mono text-[9px] uppercase tracking-wider text-text-muted p-2 border-b border-border-color">Actual</th>
              <th className="font-mono text-[9px] uppercase tracking-wider text-text-muted p-2 border-b border-border-color">Anterior</th>
              <th className="font-mono text-[9px] uppercase tracking-wider text-text-muted p-2 border-b border-border-color">Δ Abs</th>
              <th className="font-mono text-[9px] uppercase tracking-wider text-text-muted p-2 border-b border-border-color">Δ %</th>
              <th className="font-mono text-[9px] uppercase tracking-wider text-text-muted p-2 border-b border-border-color">Retención</th>
            </tr>
          </thead>
          <tbody>
            {srcData.filter(s=>s.actCount>0||s.prevCount>0).map((s, idx) => {
              const dp = s.prevCount > 0 ? ((s.delta/s.prevCount)*100).toFixed(1) : (s.actCount > 0 ? '∞' : '0');
              const dirColor = s.delta > 0 ? 'text-status-green' : s.delta < 0 ? 'text-status-red' : 'text-text-muted';
              const sign = s.delta > 0 ? '+' : '';
              return (
                <tr key={idx} className="hover:bg-white/5 border-b border-border-color/50 last:border-0 transition-colors">
                  <td className="p-2 text-text-ink truncate max-w-[200px]" title={s.src}>{s.src.replace('www.','').replace('substack-','ss·')}</td>
                  <td className="p-2 font-bold">{s.actCount}</td>
                  <td className="p-2 text-col-prev">{s.prevCount}</td>
                  <td className={`p-2 font-mono ${dirColor}`}>{sign}{s.delta}</td>
                  <td className={`p-2 font-mono ${dirColor}`}>{sign}{dp}%</td>
                  <td className="p-2">
                    {s.retRate > 0 ? (
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${s.retRate >= 80 ? 'bg-status-green/10 text-status-green' : s.retRate >= 60 ? 'bg-status-yellow/10 text-status-yellow' : 'bg-status-red/10 text-status-red'}`}>
                        {s.retRate.toFixed(0)}%
                      </span>
                    ) : '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

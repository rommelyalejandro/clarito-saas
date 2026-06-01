'use client';

import React from 'react';
import { useDashboard } from '@/context/DashboardContext';
import KpiCard from '../KpiCard';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
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

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom' as const, labels: { color: '#8892aa', font: { family: 'DM Mono', size: 9 }, boxWidth: 10, padding: 12 } },
    tooltip: { backgroundColor: '#12151c', borderColor: '#232840', borderWidth: 1, padding: 10, titleFont: { family: 'DM Mono', size: 10 }, bodyFont: { family: 'DM Mono', size: 9 } }
  }
};

export default function ChurnView() {
  const { analysis } = useDashboard();
  if (!analysis) return null;

  const pct = (v: number, t: number) => t ? +(v/t*100).toFixed(1) : 0;
  
  const churn = analysis.churnedEmails.length;
  const total = analysis.prevStats.n;
  
  const inactiveChurn = (analysis.churnActDist[0] || 0);
  const lowActChurn = (analysis.churnActDist[1] || 0) + (analysis.churnActDist[0] || 0);
  
  const churnSrcEntries = Object.entries(analysis.churnBySource).sort((a,b)=>b[1]-a[1]);
  const topChurnSrc = churnSrcEntries[0] || ['N/A', 0];

  const srcRetEntries = Object.entries(analysis.sourceRetention)
    .filter(([,v]) => v.totalPrev >= 3)
    .sort((a,b) => a[1].retRate - b[1].retRate);

  const srcLabels = churnSrcEntries.slice(0,10).map(([k])=>k.replace('www.','').replace('substack-','ss·'));
  const srcData = churnSrcEntries.slice(0,10).map(([,v])=>v);
  const chartChurnSrc = {
    labels: srcLabels,
    datasets: [{ label: 'Desertores', data: srcData, backgroundColor: '#fb7185cc', borderRadius: 3 }]
  };

  const retSrcLabels = srcRetEntries.slice(0,10).map(([k])=>k.replace('www.','').replace('substack-','ss·'));
  const retSrcData = srcRetEntries.slice(0,10).map(([,v])=>v.retRate);
  const chartRetSrc = {
    labels: retSrcLabels,
    datasets: [{
      label: '% Retención',
      data: retSrcData,
      backgroundColor: retSrcData.map(v => v >= 80 ? '#34d399cc' : v >= 60 ? '#fbbf24cc' : '#fb7185cc'),
      borderRadius: 3
    }]
  };

  const churnTypeKeys = Object.keys(analysis.churnByType);
  const PAL = ['#6366f1','#22d3ee','#34d399','#fbbf24','#a78bfa','#ff6b35','#f472b6','#94a3b8','#4f7cff','#ef4444','#818cf8','#67e8f9'];
  const chartChurnType = {
    labels: churnTypeKeys,
    datasets: [{
      data: churnTypeKeys.map(k => analysis.churnByType[k]),
      backgroundColor: PAL.slice(0, churnTypeKeys.length),
      borderWidth: 0
    }]
  };

  const aL = ['0','1','2','3','4','5'];
  const chartChurnAct = {
    labels: aL.map(l => 'Act ' + l),
    datasets: [{
      label: 'Desertores',
      data: aL.map(l => (analysis.churnActDist as any)[l] || 0),
      backgroundColor: aL.map((_, i) => i <= 1 ? '#fb7185cc' : i <= 2 ? '#fbbf24cc' : '#34d399cc'),
      borderRadius: 3
    }]
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      <div className="glass-panel p-6 rounded-xl border border-churn/30 bg-gradient-to-br from-churn/5 to-transparent">
        <h4 className="font-sans font-bold text-sm text-churn flex items-center gap-2 mb-4">⚠️ Resumen de Deserción</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          <div className="flex flex-col gap-1"><div className="font-sans text-2xl font-extrabold text-churn">{churn.toLocaleString()}</div><div className="text-[11px] text-text-soft">Suscriptores perdidos</div></div>
          <div className="flex flex-col gap-1"><div className="font-sans text-2xl font-extrabold text-churn">{analysis.churnRate.toFixed(1)}%</div><div className="text-[11px] text-text-soft">Tasa de deserción</div></div>
          <div className="flex flex-col gap-1"><div className="font-sans text-2xl font-extrabold text-churn">{analysis.retentionRate.toFixed(1)}%</div><div className="text-[11px] text-text-soft">Tasa de retención</div></div>
          <div className="flex flex-col gap-1"><div className="font-sans text-2xl font-extrabold text-churn">{(analysis.churnByType['Paid']||analysis.churnByType['paid']||0)}</div><div className="text-[11px] text-text-soft">De pago perdidos</div></div>
          <div className="flex flex-col gap-1"><div className="font-sans text-2xl font-extrabold text-churn">{pct(inactiveChurn, churn)}%</div><div className="text-[11px] text-text-soft">Inactivos (act=0)</div></div>
          <div className="flex flex-col gap-1"><div className="font-sans text-2xl font-extrabold text-churn">{(topChurnSrc[0] as string).replace('www.','')}</div><div className="text-[11px] text-text-soft">Peor fuente ({topChurnSrc[1]})</div></div>
        </div>
      </div>

      <div>
        <div className="text-sec-header flex items-center gap-3 mb-4 after:content-[''] after:flex-1 after:h-px after:bg-border-color">
          <span className="text-sm">🔴</span> Análisis de Deserción
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <KpiCard label="Total Desertores" actVal={churn.toLocaleString()} prevVal={total.toLocaleString()+' base'} barColor="red" invertColor={true} />
          <KpiCard label="Churn Rate" actVal={analysis.churnRate.toFixed(1)+'%'} barColor="churn" invertColor={true} />
          <KpiCard label="Retention Rate" actVal={analysis.retentionRate.toFixed(1)+'%'} barColor="green" />
          <KpiCard label="Paid Churn" actVal={(analysis.churnByType['Paid']||analysis.churnByType['paid']||0).toString()} barColor="red" invertColor={true} />
          <KpiCard label="Free Churn" actVal={(analysis.churnByType['Free']||analysis.churnByType['free']||0).toString()} barColor="yellow" invertColor={true} />
          <KpiCard label="Churn Inactivo" actVal={pct(lowActChurn, churn)+'%'} barColor="purple" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-panel p-4 rounded-xl">
          <h5 className="font-sans font-bold text-[11px] mb-1">Fuente de Origen de Desertores</h5>
          <p className="text-[10px] text-text-soft mb-3">De dónde vinieron los subs que se fueron</p>
          <div className="h-[260px]"><Bar data={chartChurnSrc} options={horizontalOptions as any} /></div>
        </div>
        <div className="glass-panel p-4 rounded-xl">
          <h5 className="font-sans font-bold text-[11px] mb-1">Tasa de Retención por Fuente</h5>
          <p className="text-[10px] text-text-soft mb-3">% de subs de cada fuente que se mantuvieron (mín. 3 subs)</p>
          <div className="h-[260px]"><Bar data={chartRetSrc} options={{...horizontalOptions, scales: { x: { max: 100 } }} as any} /></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="glass-panel p-4 rounded-xl">
          <h5 className="font-sans font-bold text-[11px] mb-1">Deserción por Tipo</h5>
          <p className="text-[10px] text-text-soft mb-3">Free vs Paid vs otros</p>
          <div className="h-[220px]"><Doughnut data={chartChurnType} options={doughnutOptions as any} /></div>
        </div>
        <div className="glass-panel p-4 rounded-xl">
          <h5 className="font-sans font-bold text-[11px] mb-1">Actividad de Desertores</h5>
          <p className="text-[10px] text-text-soft mb-3">Score 0–5 de quienes se fueron</p>
          <div className="h-[220px]"><Bar data={chartChurnAct} options={chartOptions as any} /></div>
        </div>
      </div>
    </div>
  );
}

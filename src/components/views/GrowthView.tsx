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
    legend: { labels: { color: '#8892aa', font: { family: 'DM Mono', size: 9 }, boxWidth: 10, padding: 12 } },
    tooltip: { backgroundColor: '#12151c', borderColor: '#232840', borderWidth: 1, padding: 10, titleFont: { family: 'DM Mono', size: 10 }, bodyFont: { family: 'DM Mono', size: 9 } }
  },
  scales: {
    x: { ticks: { color: '#4e5572', font: { family: 'DM Mono', size: 8 } }, grid: { color: '#232840' }, stacked: false },
    y: { ticks: { color: '#4e5572', font: { family: 'DM Mono', size: 8 } }, grid: { color: '#232840' }, stacked: false }
  }
};

const stackedOptions = {
  ...chartOptions,
  scales: {
    x: { ...chartOptions.scales.x, stacked: true },
    y: { ...chartOptions.scales.y, stacked: true }
  }
};

export default function GrowthView() {
  const { analysis } = useDashboard();
  if (!analysis) return null;

  const { actStats: s, prevStats: p } = analysis;
  const pct = (v: number, t: number) => t ? +(v/t*100).toFixed(1) : 0;

  const pvPerSubAct = s.n > 0 ? (s.pvTotal / s.n) : 0;
  const pvPerSubPrev = p.n > 0 ? (p.pvTotal / p.n) : 0;
  const emailClickRateAct = s.n > 0 ? (s.emailLinks / s.n) : 0;
  const emailClickRatePrev = p.n > 0 ? (p.emailLinks / p.n) : 0;
  const shrPerSubAct = s.n > 0 ? (s.shrTotal / s.n) : 0;
  const shrPerSubPrev = p.n > 0 ? (p.shrTotal / p.n) : 0;

  const renderGrowthInsights = () => {
    const ins = [];
    if(analysis.diffDays > 0) {
      const annRate = (analysis.growthRate / analysis.diffDays) * 365;
      const annSign = annRate > 0 ? '+' : '';
      const monthlyRate = (analysis.growthRate / analysis.diffDays) * 30;
      const mSign = monthlyRate > 0 ? '+' : '';
      ins.push({icon:'📅', text:`Ritmo anualizado (run rate lineal): ${annSign}${annRate.toFixed(1)}%/año (${mSign}${monthlyRate.toFixed(1)}%/mes) basado en ${analysis.diffDays} días de datos.`, color: annRate >= 0 ? 'text-status-green' : 'text-status-red'});
    }

    const ratio = analysis.churnedEmails.length > 0 ? analysis.newEmails.length / analysis.churnedEmails.length : Infinity;
    if(ratio >= 2) ins.push({icon:'🚀', text:`Ratio adquisición/deserción excelente: ${ratio.toFixed(1)}x — se ganan ${ratio.toFixed(1)} subs por cada uno que se pierde.`, color:'text-status-green'});
    else if(ratio >= 1) ins.push({icon:'📊', text:`Ratio adquisición/deserción: ${ratio.toFixed(1)}x — crecimiento lento, evaluar estrategias de retención.`, color:'text-status-yellow'});
    else ins.push({icon:'🔻', text:`Ratio adquisición/deserción: ${ratio.toFixed(1)}x — se pierden más subs de los que se ganan.`, color:'text-status-red'});

    const pvPSDelta = pvPerSubAct - pvPerSubPrev;
    if(pvPSDelta > 1) ins.push({icon:'📖', text:`Post views por suscriptor subieron: ${pvPerSubPrev.toFixed(1)} → ${pvPerSubAct.toFixed(1)}. Los subs leen más.`, color:'text-status-green'});
    else if(pvPSDelta < -1) ins.push({icon:'📉', text:`Post views por suscriptor bajaron: ${pvPerSubPrev.toFixed(1)} → ${pvPerSubAct.toFixed(1)}. Posible pérdida de interés.`, color:'text-status-red'});

    return (
      <div className="glass-panel p-5 rounded-xl border border-status-green/30 bg-gradient-to-br from-status-green/5 to-status-teal/5 mt-4">
        <h4 className="font-sans font-bold text-sm text-status-green flex items-center gap-2 mb-3">💡 Insights de Crecimiento</h4>
        <div className="flex flex-col gap-2">
          {ins.map((i, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs leading-relaxed">
              <span className="flex-shrink-0 text-sm">{i.icon}</span>
              <span className="text-text-soft">
                <span className={`font-semibold ${i.color}`}>{i.text.split(':')[0]}:</span> {i.text.substring(i.text.indexOf(':')+1)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const engData = {
    labels: ['Post Views','Shares','Comentarios','Links Email','Emails abiertos 30d'],
    datasets: [
      { label: 'Actual', data: [s.pvTotal,s.shrTotal,s.cmtTotal,s.emailLinks,s.emailOpen30d], backgroundColor: '#2dd4bfcc', borderRadius: 3 },
      { label: 'Anterior', data: [p.pvTotal,p.shrTotal,p.cmtTotal,p.emailLinks,p.emailOpen30d], backgroundColor: '#818cf8cc', borderRadius: 3 }
    ]
  };

  const engPerData = {
    labels: ['PV/sub','Shares/sub','Coment./sub','Links/sub'],
    datasets: [
      { label: 'Actual', data: [pvPerSubAct, shrPerSubAct, s.n?s.cmtTotal/s.n:0, emailClickRateAct].map(v=>+v.toFixed(2)), backgroundColor: '#2dd4bfcc', borderRadius: 3 },
      { label: 'Anterior', data: [pvPerSubPrev, shrPerSubPrev, p.n?p.cmtTotal/p.n:0, emailClickRatePrev].map(v=>+v.toFixed(2)), backgroundColor: '#818cf8cc', borderRadius: 3 }
    ]
  };

  const compositionData = {
    labels: ['Actual', 'Anterior'],
    datasets: [
      { label: 'Nuevos', data: [analysis.newEmails.length, 0], backgroundColor: '#2dd4bfcc', borderRadius: 3 },
      { label: 'Retenidos', data: [analysis.retainedEmails.length, analysis.retainedEmails.length], backgroundColor: '#34d399cc', borderRadius: 3 },
      { label: 'Perdidos', data: [0, analysis.churnedEmails.length], backgroundColor: '#fb7185cc', borderRadius: 3 }
    ]
  };

  // Special Panel for Annualized Growth
  const days = analysis.diffDays || 1;
  const prevN = analysis.prevStats.n;
  const actN = analysis.actStats.n;
  const gr = analysis.growthRate;
  const dailyRate = gr / days;
  const monthlyRate = dailyRate * 30;
  const annRate = dailyRate * 365;

  const annualizationPanel = (
    <div>
      <div className="font-sans font-bold text-xs text-text-ink mb-3 flex items-center gap-2">
        📐 Fórmula: Anualización Lineal (Run Rate Simple)
      </div>
      <div className="space-y-3">
        <div className="flex gap-3 items-start">
          <div className="bg-accent-primary text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5">1</div>
          <div>
            <strong>Growth Rate</strong> = (Actual − Anterior) / Anterior × 100<br/>
            <span className="font-mono text-status-teal text-[10px]">({actN.toLocaleString()} − {prevN.toLocaleString()}) / {prevN.toLocaleString()} × 100 = <span className="text-status-green font-bold">{gr.toFixed(1)}%</span></span><br/>
            <span className="text-text-muted text-[10px]">Crecimiento observado en el período</span>
          </div>
        </div>
        <div className="flex gap-3 items-start">
          <div className="bg-accent-primary text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5">2</div>
          <div>
            <strong>Días del período</strong> = <span className="text-status-green font-bold">{days}</span><br/>
            <span className="text-text-muted text-[10px]">Diferencia entre última fecha de suscripción de cada archivo</span>
          </div>
        </div>
        <div className="flex gap-3 items-start">
          <div className="bg-accent-primary text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5">3</div>
          <div>
            <strong>Tasa diaria</strong> = Growth Rate / Días<br/>
            <span className="font-mono text-status-teal text-[10px]">{gr.toFixed(1)}% / {days} = <span className="text-status-green font-bold">{dailyRate.toFixed(4)}%/día</span></span><br/>
            <span className="text-text-muted text-[10px]">Reparte el crecimiento uniformemente entre cada día</span>
          </div>
        </div>
        <div className="flex gap-3 items-start">
          <div className="bg-accent-primary text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5">4</div>
          <div>
            <strong>Anualización</strong> = Tasa diaria × 365<br/>
            <span className="font-mono text-status-teal text-[10px]">{dailyRate.toFixed(4)}% × 365 = <span className="text-status-green font-bold">{annRate.toFixed(1)}%/año</span></span><br/>
            <span className="text-text-muted text-[10px]">Proyecta la tasa diaria a un año completo</span>
          </div>
        </div>
      </div>
      <div className="text-[10px] text-text-muted mt-3 pt-3 border-t border-border-color leading-relaxed">
        💡 <strong>Método:</strong> Anualización lineal simple (run rate). No usa interés compuesto (CAGR), sino proyección lineal del ritmo actual. Es el estándar en informes financieros rápidos para indicar el ritmo de crecimiento. Si alguien pregunta "¿a qué ritmo estás creciendo?", la respuesta es: <strong className="text-status-green">{annRate > 0 ? '+' : ''}{annRate.toFixed(1)}% anual</strong>.
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-8 pb-12">
      <div>
        <div className="text-sec-header flex items-center gap-3 mb-4 after:content-[''] after:flex-1 after:h-px after:bg-border-color">
          <span className="text-sm">📈</span> Métricas de Crecimiento
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <KpiCard label="Crecimiento Neto" actVal={(analysis.netChange >= 0 ? '+' : '') + analysis.netChange.toLocaleString()} barColor="green" />
          <KpiCard label="Growth Rate" actVal={analysis.growthRate.toFixed(1)+'%'} barColor={analysis.growthRate >= 0 ? 'green' : 'red'} />
          
          <div className="col-span-2">
            {/* Custom card for Annualized Growth because it has the special panel */}
            <KpiCard 
              label="Crecimiento Anualizado" 
              actVal={`${annRate > 0 ? '+' : ''}${annRate.toFixed(1)}%`}
              prevVal={`${days} días`}
              barColor="yellow"
              specialPanel={annualizationPanel}
            />
          </div>
        </div>
      </div>

      <div>
        <div className="text-sec-header flex items-center gap-3 mb-4 after:content-[''] after:flex-1 after:h-px after:bg-border-color mt-4">
          <span className="text-sm">⚡</span> Velocidad de Engagement (por suscriptor)
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <KpiCard label="PV / Suscriptor" actVal={pvPerSubAct.toFixed(1)} prevVal={pvPerSubPrev.toFixed(1)} barColor="blue" />
          <KpiCard label="Shares / Suscriptor" actVal={shrPerSubAct.toFixed(2)} prevVal={shrPerSubPrev.toFixed(2)} barColor="green" />
          <KpiCard label="Email Clicks / Sub" actVal={emailClickRateAct.toFixed(2)} prevVal={emailClickRatePrev.toFixed(2)} barColor="purple" />
          <KpiCard label="% Lectores" actVal={pct(s.withPostViews,s.n)+'%'} prevVal={pct(p.withPostViews,p.n)+'%'} barColor="teal" />
          <KpiCard label="% Compartidores" actVal={pct(s.withShares,s.n)+'%'} prevVal={pct(p.withShares,p.n)+'%'} barColor="green" />
          <KpiCard label="% Comentadores" actVal={pct(s.withComments,s.n)+'%'} prevVal={pct(p.withComments,p.n)+'%'} barColor="yellow" />
        </div>
      </div>

      <div>
        <div className="text-sec-header flex items-center gap-3 mb-4 after:content-[''] after:flex-1 after:h-px after:bg-border-color mt-4">
          <span className="text-sm">📊</span> Comparación Visual de Crecimiento
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-panel p-4 rounded-xl">
            <h5 className="font-sans font-bold text-[11px] mb-1">Engagement Total</h5>
            <p className="text-[10px] text-text-soft mb-3">Actual vs Anterior</p>
            <div className="h-[260px]"><Bar data={engData} options={chartOptions as any} /></div>
          </div>
          <div className="glass-panel p-4 rounded-xl">
            <h5 className="font-sans font-bold text-[11px] mb-1">Engagement por Suscriptor</h5>
            <p className="text-[10px] text-text-soft mb-3">Normalizado por base</p>
            <div className="h-[260px]"><Bar data={engPerData} options={chartOptions as any} /></div>
          </div>
          <div className="glass-panel p-4 rounded-xl">
            <h5 className="font-sans font-bold text-[11px] mb-1">Composición de Audiencia</h5>
            <p className="text-[10px] text-text-soft mb-3">Nuevos vs Retenidos vs Perdidos</p>
            <div className="h-[260px]"><Bar data={compositionData} options={stackedOptions as any} /></div>
          </div>
        </div>
      </div>

      {renderGrowthInsights()}

    </div>
  );
}

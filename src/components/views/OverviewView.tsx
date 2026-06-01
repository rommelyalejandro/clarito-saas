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
    legend: { labels: { color: '#8892aa', font: { family: 'DM Mono', size: 9 }, boxWidth: 10, padding: 12 } },
    tooltip: { backgroundColor: '#12151c', borderColor: '#232840', borderWidth: 1, padding: 10, titleFont: { family: 'DM Mono', size: 10 }, bodyFont: { family: 'DM Mono', size: 9 } }
  },
  scales: {
    x: { ticks: { color: '#4e5572', font: { family: 'DM Mono', size: 8 } }, grid: { color: '#232840' } },
    y: { ticks: { color: '#4e5572', font: { family: 'DM Mono', size: 8 } }, grid: { color: '#232840' } }
  }
};

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom' as const, labels: { color: '#8892aa', font: { family: 'DM Mono', size: 9 }, boxWidth: 10, padding: 12 } },
    tooltip: { backgroundColor: '#12151c', borderColor: '#232840', borderWidth: 1, padding: 10, titleFont: { family: 'DM Mono', size: 10 }, bodyFont: { family: 'DM Mono', size: 9 } }
  }
};

export default function OverviewView() {
  const { analysis, prevName, actName } = useDashboard();
  if (!analysis) return null;

  const { actStats: s, prevStats: p } = analysis;

  const pct = (v: number, t: number) => t ? +(v/t*100).toFixed(1) : 0;

  // Render Health Insights (Automated Diagnosis)
  const renderHealthInsights = () => {
    const ins = [];
    const gr = analysis.growthRate;
    const nc = analysis.netChange;

    if(gr > 5) ins.push({icon:'🚀', text:`Crecimiento fuerte: +${gr.toFixed(1)}% de crecimiento neto (${nc > 0 ? '+' : ''}${nc} subs)`, color:'text-status-green'});
    else if(gr > 0) ins.push({icon:'📈', text:`Crecimiento moderado: +${gr.toFixed(1)}% (${nc > 0 ? '+' : ''}${nc} subs). La adquisición supera la deserción pero por poco.`, color:'text-status-yellow'});
    else if(gr === 0) ins.push({icon:'⚠️', text:`Estancamiento: 0% de crecimiento neto. Lo que se gana se pierde.`, color:'text-status-yellow'});
    else ins.push({icon:'🔻', text:`Decrecimiento: ${gr.toFixed(1)}% (${nc} subs netos). Se están perdiendo más suscriptores de los que se ganan.`, color:'text-status-red'});

    if(analysis.churnRate > 20) ins.push({icon:'🚨', text:`Deserción crítica: ${analysis.churnRate.toFixed(1)}% de los subs anteriores se han ido (${analysis.churnedEmails.length} personas). Requiere atención urgente.`, color:'text-status-red'});
    else if(analysis.churnRate > 10) ins.push({icon:'⚠️', text:`Deserción elevada: ${analysis.churnRate.toFixed(1)}% — ${analysis.churnedEmails.length} suscriptores se fueron.`, color:'text-status-red'});
    else if(analysis.churnRate > 5) ins.push({icon:'📊', text:`Deserción moderada: ${analysis.churnRate.toFixed(1)}% — ${analysis.churnedEmails.length} suscriptores dejaron la lista. Dentro de rangos normales.`, color:'text-status-yellow'});
    else ins.push({icon:'✅', text:`Deserción baja: ${analysis.churnRate.toFixed(1)}% — excelente retención.`, color:'text-status-green'});

    const convAct = pct(s.paidCount, s.n);
    const convPrev = pct(p.paidCount, p.n);
    const convDiff = convAct - convPrev;
    if(convDiff > 0) ins.push({icon:'💰', text:`Conversión a pago mejoró: ${convAct}% vs ${convPrev}% anterior (+${convDiff.toFixed(1)}pp)`, color:'text-status-green'});
    else if(convDiff < 0) ins.push({icon:'💸', text:`Conversión a pago cayó: ${convAct}% vs ${convPrev}% anterior (${convDiff.toFixed(1)}pp)`, color:'text-status-red'});

    const actDiff = s.avgActivity - p.avgActivity;
    if(actDiff > 0.2) ins.push({icon:'⚡', text:`Engagement mejorando: actividad promedio subió de ${p.avgActivity.toFixed(2)} a ${s.avgActivity.toFixed(2)}`, color:'text-status-green'});
    else if(actDiff < -0.2) ins.push({icon:'😴', text:`Engagement cayendo: actividad promedio bajó de ${p.avgActivity.toFixed(2)} a ${s.avgActivity.toFixed(2)}`, color:'text-status-red'});

    const churnPaid = analysis.churnByType['Paid'] || analysis.churnByType['paid'] || 0;
    if(churnPaid > 0) ins.push({icon:'💔', text:`Se perdieron ${churnPaid} suscriptores de pago. Impacto directo en revenue.`, color:'text-status-red'});

    return (
      <div className="glass-panel p-5 rounded-xl border border-accent-primary/30 bg-gradient-to-br from-accent-primary/5 to-status-teal/5 mt-4">
        <h4 className="font-sans font-bold text-sm text-accent-primary flex items-center gap-2 mb-3">🧠 Diagnóstico Automático</h4>
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

  // Chart Data
  const tKeys = [...new Set([...Object.keys(s.byType), ...Object.keys(p.byType)])];
  const typeData = {
    labels: tKeys,
    datasets: [
      { label: 'Actual', data: tKeys.map(k => s.byType[k] || 0), backgroundColor: '#2dd4bfcc', borderRadius: 3 },
      { label: 'Anterior', data: tKeys.map(k => p.byType[k] || 0), backgroundColor: '#818cf8cc', borderRadius: 3 }
    ]
  };

  const aL = ['0','1','2','3','4','5'];
  const actData = {
    labels: aL,
    datasets: [
      { label: 'Actual', data: aL.map(l => (s.actDist as any)[l] || 0), backgroundColor: '#2dd4bfcc', borderRadius: 3 },
      { label: 'Anterior', data: aL.map(l => (p.actDist as any)[l] || 0), backgroundColor: '#818cf8cc', borderRadius: 3 }
    ]
  };

  const flowData = {
    labels: ['Nuevos', 'Retenidos', 'Desertores'],
    datasets: [{
      data: [analysis.newEmails.length, analysis.retainedEmails.length, analysis.churnedEmails.length],
      backgroundColor: ['#2dd4bf', '#34d399', '#fb7185'],
      borderWidth: 0
    }]
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Banner */}
      <div className="glass-panel p-4 rounded-xl border border-border-color bg-gradient-to-br from-col-prev-bg to-col-act-bg flex items-center flex-wrap gap-4">
        <div className="flex gap-4 items-center flex-wrap">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 rounded-full bg-col-act"></div>
            <strong className="text-text-ink">Actual</strong> · <span className="text-text-soft">{s.n.toLocaleString()} subs · {actName}</span>
          </div>
          <div className="w-px h-4 bg-border-color hidden sm:block"></div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 rounded-full bg-col-prev"></div>
            <strong className="text-text-ink">Anterior</strong> · <span className="text-text-soft">{p.n.toLocaleString()} subs · {prevName}</span>
          </div>
        </div>
      </div>

      <div>
        <div className="text-sec-header flex items-center gap-3 mb-4 after:content-[''] after:flex-1 after:h-px after:bg-border-color">
          <span className="text-sm">📊</span> Resumen Ejecutivo
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          <KpiCard label="Total Suscriptores" actVal={s.n.toLocaleString()} prevVal={p.n.toLocaleString()} barColor="blue" />
          <KpiCard label="Crecimiento Neto" actVal={(analysis.netChange >= 0 ? '+' : '') + analysis.netChange.toLocaleString()} barColor="green" />
          <KpiCard label="Tasa Deserción" actVal={analysis.churnRate.toFixed(1) + '%'} barColor="churn" invertColor={true} />
          <KpiCard label="Retención" actVal={analysis.retentionRate.toFixed(1) + '%'} barColor="green" />
          <KpiCard label="Nuevos Subs" actVal={analysis.newEmails.length.toLocaleString()} barColor="teal" />
          <KpiCard label="Desertores" actVal={analysis.churnedEmails.length.toLocaleString()} barColor="red" />
          <KpiCard label="De Pago" actVal={s.paidCount.toLocaleString()} prevVal={p.paidCount.toLocaleString()} barColor="green" />
          <KpiCard label="Conversión Pago" actVal={pct(s.paidCount, s.n)+'%'} prevVal={pct(p.paidCount, p.n)+'%'} barColor="purple" />
          <KpiCard label="Revenue" actVal={'$'+s.totalRev.toFixed(0)} prevVal={'$'+p.totalRev.toFixed(0)} barColor="green" />
          <KpiCard label="Activos" actVal={s.withActive.toLocaleString()} prevVal={p.withActive.toLocaleString()} barColor="teal" />
          <KpiCard label="% Activos" actVal={pct(s.withActive, s.n)+'%'} prevVal={pct(p.withActive, p.n)+'%'} barColor="blue" />
          <KpiCard label="Actividad Prom." actVal={s.avgActivity.toFixed(2)} prevVal={p.avgActivity.toFixed(2)} barColor="purple" />
        </div>
      </div>

      {renderHealthInsights()}

      <div>
        <div className="text-sec-header flex items-center gap-3 mb-4 after:content-[''] after:flex-1 after:h-px after:bg-border-color mt-4">
          <span className="text-sm">📈</span> Engagement Comparado
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <KpiCard label="Post Views" actVal={s.pvTotal.toLocaleString()} prevVal={p.pvTotal.toLocaleString()} barColor="blue" />
          <KpiCard label="PV 30d" actVal={s.pv30d.toLocaleString()} prevVal={p.pv30d.toLocaleString()} barColor="teal" />
          <KpiCard label="Shares" actVal={s.shrTotal.toLocaleString()} prevVal={p.shrTotal.toLocaleString()} barColor="green" />
          <KpiCard label="Comentarios" actVal={s.cmtTotal.toLocaleString()} prevVal={p.cmtTotal.toLocaleString()} barColor="yellow" />
          <KpiCard label="Links Email" actVal={s.emailLinks.toLocaleString()} prevVal={p.emailLinks.toLocaleString()} barColor="purple" />
          <KpiCard label="Tasa Apertura" actVal={s.emailOpenRate.toFixed(1)+'%'} prevVal={p.emailOpenRate.toFixed(1)+'%'} barColor="pink" />
        </div>
      </div>

      <div>
        <div className="text-sec-header flex items-center gap-3 mb-4 after:content-[''] after:flex-1 after:h-px after:bg-border-color mt-4">
          <span className="text-sm">📊</span> Distribución Comparada
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-panel p-4 rounded-xl">
            <h5 className="font-sans font-bold text-[11px] mb-1">Tipo de Suscripción</h5>
            <p className="text-[10px] text-text-soft mb-3">Actual vs Anterior</p>
            <div className="h-[220px]"><Bar data={typeData} options={chartOptions as any} /></div>
          </div>
          <div className="glass-panel p-4 rounded-xl">
            <h5 className="font-sans font-bold text-[11px] mb-1">Score de Actividad</h5>
            <p className="text-[10px] text-text-soft mb-3">Distribución 0–5</p>
            <div className="h-[220px]"><Bar data={actData} options={chartOptions as any} /></div>
          </div>
          <div className="glass-panel p-4 rounded-xl">
            <h5 className="font-sans font-bold text-[11px] mb-1">Flujo de Suscriptores</h5>
            <p className="text-[10px] text-text-soft mb-3">Nuevos · Retenidos · Desertores</p>
            <div className="h-[220px]"><Doughnut data={flowData} options={doughnutOptions as any} /></div>
          </div>
        </div>
      </div>

    </div>
  );
}

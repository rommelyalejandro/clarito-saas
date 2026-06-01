'use client';

import React, { useState, useEffect } from 'react';
import { DashboardProvider, useDashboard } from '@/context/DashboardContext';
import UploadZone from '@/components/UploadZone';
import OverviewView from '@/components/views/OverviewView';
import ChurnView from '@/components/views/ChurnView';
import GrowthView from '@/components/views/GrowthView';
import SourcesView from '@/components/views/SourcesView';
import { Save, Clock } from 'lucide-react';

function DashboardContent() {
  const { analysis, prevName, actName, prevRows, actRows, saveReport, isSaving, history, loadFromHistory } = useDashboard();
  const [currentTab, setCurrentTab] = useState<'upload' | 'overview' | 'churn' | 'growth' | 'sources' | 'history'>('upload');

  // Auto-switch to overview when analysis completes if currently on upload
  useEffect(() => {
    if (analysis && currentTab === 'upload') {
      setCurrentTab('overview');
    }
  }, [analysis]);

  return (
    <div className="pb-24">
      {/* Header Info & Tabs */}
      <div className="glass-surface sticky top-[68px] z-40 py-3 px-10 flex flex-wrap gap-4 items-center justify-between shadow-xl shadow-black/20">
        
        {/* Left Side: Badge and Dates */}
        <div className="flex items-center gap-6">
          <div className="glass-panel px-3 py-1 rounded-full text-[10px] text-text-soft font-mono tracking-wider flex items-center gap-2">
            {analysis 
              ? <>{analysis.actStats.n} act · {analysis.prevStats.n} prev · {analysis.churnedEmails?.length || analysis.churnRate} desertores</>
              : 'Sin datos'}
          </div>
          
          {analysis && analysis.diffDays > 0 && (
            <div className="flex items-center gap-3 text-[10px] font-mono">
              <div className="text-col-prev"><span className="text-text-muted uppercase text-[9px] mr-1">Anterior:</span>{prevName}</div>
              <div className="w-px h-3 bg-border-color"></div>
              <div className="text-col-act"><span className="text-text-muted uppercase text-[9px] mr-1">Actual:</span>{actName}</div>
              <div className="w-px h-3 bg-border-color"></div>
              <div className="text-status-yellow font-bold"><span className="text-text-muted uppercase text-[9px] mr-1">Días:</span>{analysis.diffDays}</div>
              
              {prevRows.length > 0 && (
                <button 
                  onClick={saveReport} 
                  disabled={isSaving}
                  className="ml-4 flex items-center gap-1 bg-status-teal/20 hover:bg-status-teal/40 text-status-teal px-3 py-1 rounded border border-status-teal/30 transition-colors"
                >
                  <Save className="w-3 h-3" /> {isSaving ? 'Guardando...' : 'Guardar Reporte'}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right Side: Tabs */}
        <div className="glass-panel p-1 flex gap-1 rounded-xl">
          {[
            { id: 'upload', label: '📂 Cargar' },
            { id: 'overview', label: 'Vista General' },
            { id: 'churn', label: '🔴 Deserción' },
            { id: 'growth', label: '📈 Crecimiento' },
            { id: 'sources', label: '📣 Fuentes' },
            { id: 'history', label: '⏳ Historial' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id as any)}
              disabled={(tab.id !== 'upload' && tab.id !== 'history') && !analysis}
              className={`px-4 py-2 rounded-lg text-[11px] font-mono transition-all duration-300
                ${currentTab === tab.id 
                  ? 'bg-accent-primary text-white shadow-lg shadow-accent-primary/20 font-bold' 
                  : 'text-text-soft hover:text-text-ink hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-[1600px] mx-auto mt-6 px-6 relative z-10">
        {currentTab === 'upload' && (
          <UploadZone onAnalyze={() => {
            if (prevRows.length && actRows.length && !analysis) {
               // Analysis is auto-triggered via useMemo
            }
            if (analysis) setCurrentTab('overview');
          }} />
        )}
        
        {currentTab === 'history' && (
          <div className="glass-panel p-8 rounded-2xl max-w-4xl mx-auto mt-10">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Clock className="w-5 h-5 text-accent-primary" /> Tu Historial de Análisis</h2>
            {history.length === 0 ? (
              <p className="text-text-soft">Aún no has guardado ningún reporte.</p>
            ) : (
              <div className="space-y-4">
                {history.map((h) => (
                  <div key={h.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                    <div>
                      <div className="font-bold text-sm mb-1">{h.prevName} <span className="text-text-muted mx-2">vs</span> {h.actName}</div>
                      <div className="text-xs text-text-muted font-mono">{h.createdAt?.toDate ? h.createdAt.toDate().toLocaleString() : 'Reciente'}</div>
                    </div>
                    <button 
                      onClick={() => {
                        loadFromHistory(h);
                        setCurrentTab('overview');
                      }}
                      className="px-4 py-2 bg-accent-primary/20 text-accent-primary hover:bg-accent-primary/40 font-bold text-xs rounded-lg transition-colors"
                    >
                      Cargar Reporte
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {currentTab === 'overview' && analysis && <OverviewView />}
        {currentTab === 'churn' && analysis && <ChurnView />}
        {currentTab === 'growth' && analysis && <GrowthView />}
        {currentTab === 'sources' && analysis && <SourcesView />}
        
        {!analysis && currentTab !== 'upload' && (
          <div className="text-center py-20 text-text-muted">
            <h3 className="font-sans text-xl font-bold text-text-soft mb-2">Primero carga los dos archivos</h3>
            <p>Ve a la pestaña Cargar para subir el período anterior y el actual.</p>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 py-3 text-center text-[10px] text-text-muted font-mono tracking-widest bg-bg-main/80 backdrop-blur-md border-t border-border-color z-40">
        Suscriptores · Comparativo v10 · {analysis ? `${prevName} vs ${actName} · Deserción: ${analysis.churnRate.toFixed(1)}%` : 'Carga un CSV anterior y uno actual para comenzar'}
      </footer>
    </div>
  );
}

export default function DashboardClient() {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
}

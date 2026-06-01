'use client';

import React, { useRef, useState } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { UploadCloud, CheckCircle2, X } from 'lucide-react';

export default function UploadZone({ onAnalyze }: { onAnalyze: () => void }) {
  const { prevRows, actRows, prevName, actName, loadPrevFile, loadActFile, resetPrevFile, resetActFile, analysis } = useDashboard();
  
  const [dragActivePrev, setDragActivePrev] = useState(false);
  const [dragActiveAct, setDragActiveAct] = useState(false);
  
  const prevRef = useRef<HTMLInputElement>(null);
  const actRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent, setDrag: (val: boolean) => void) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDrag(true);
    } else if (e.type === "dragleave") {
      setDrag(false);
    }
  };

  const handleDrop = (e: React.DragEvent, which: 'prev' | 'act', setDrag: (val: boolean) => void) => {
    e.preventDefault();
    e.stopPropagation();
    setDrag(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith('.csv')) {
        which === 'prev' ? loadPrevFile(file) : loadActFile(file);
      }
    }
  };

  return (
    <div className="max-w-[1100px] mx-auto mt-10 px-6">
      <div className="flex items-center justify-center gap-4 mb-8">
        <div className={`flex items-center gap-2 text-xs ${prevRows.length > 0 ? 'text-status-green' : 'text-accent-primary'}`}>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold border-2 ${prevRows.length > 0 ? 'bg-status-green border-status-green text-black' : 'bg-accent-primary border-accent-primary text-white'}`}>1</div>
          <span>Período Anterior</span>
        </div>
        <div className="w-8 h-[1px] bg-border-color"></div>
        <div className={`flex items-center gap-2 text-xs ${actRows.length > 0 ? 'text-status-green' : prevRows.length > 0 ? 'text-accent-primary' : 'text-text-muted'}`}>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold border-2 ${actRows.length > 0 ? 'bg-status-green border-status-green text-black' : prevRows.length > 0 ? 'bg-accent-primary border-accent-primary text-white' : 'border-border-color text-text-muted'}`}>2</div>
          <span>Período Actual</span>
        </div>
        <div className="w-8 h-[1px] bg-border-color"></div>
        <div className={`flex items-center gap-2 text-xs ${analysis ? 'text-status-green' : 'text-text-muted'}`}>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold border-2 ${analysis ? 'bg-status-green border-status-green text-black' : 'border-border-color text-text-muted'}`}>3</div>
          <span>Analizar</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Prev Upload */}
        <div 
          className={`glass-panel rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 relative overflow-hidden group
            ${dragActivePrev ? 'border-col-prev bg-col-prev-bg/30' : 'border-dashed hover:border-col-prev hover:bg-col-prev-bg'}
            ${prevRows.length > 0 ? '!border-solid border-col-prev/50 cursor-default' : ''}`}
          onClick={() => !prevRows.length && prevRef.current?.click()}
          onDragEnter={(e) => handleDrag(e, setDragActivePrev)}
          onDragLeave={(e) => handleDrag(e, setDragActivePrev)}
          onDragOver={(e) => handleDrag(e, setDragActivePrev)}
          onDrop={(e) => handleDrop(e, 'prev', setDragActivePrev)}
        >
          {prevRows.length > 0 ? (
            <div className="text-left text-xs z-10 relative">
              <CheckCircle2 className="w-8 h-8 text-status-green mb-2" />
              <div className="font-sans font-bold text-sm text-text-ink mb-1">{prevName}</div>
              <div className="text-text-soft mb-3">{prevRows.length.toLocaleString()} suscriptores · Período Anterior</div>
              <button 
                onClick={(e) => { e.stopPropagation(); resetPrevFile(); }}
                className="glass-btn px-4 py-2 rounded-lg text-[10px] text-text-soft flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Cambiar archivo
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full z-10 relative">
              <UploadCloud className="w-10 h-10 text-col-prev mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-sans font-bold text-base text-col-prev mb-1">Período Anterior</h3>
              <p className="text-text-soft text-xs leading-relaxed">CSV del período más antiguo<br/>Arrastra aquí o haz clic</p>
            </div>
          )}
          <input type="file" ref={prevRef} className="hidden" accept=".csv" onChange={(e) => e.target.files?.[0] && loadPrevFile(e.target.files[0])} />
        </div>

        {/* Act Upload */}
        <div 
          className={`glass-panel rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 relative overflow-hidden group
            ${dragActiveAct ? 'border-col-act bg-col-act-bg/30' : 'border-dashed hover:border-col-act hover:bg-col-act-bg'}
            ${actRows.length > 0 ? '!border-solid border-col-act/50 cursor-default' : ''}`}
          onClick={() => !actRows.length && actRef.current?.click()}
          onDragEnter={(e) => handleDrag(e, setDragActiveAct)}
          onDragLeave={(e) => handleDrag(e, setDragActiveAct)}
          onDragOver={(e) => handleDrag(e, setDragActiveAct)}
          onDrop={(e) => handleDrop(e, 'act', setDragActiveAct)}
        >
          {actRows.length > 0 ? (
            <div className="text-left text-xs z-10 relative">
              <CheckCircle2 className="w-8 h-8 text-status-green mb-2" />
              <div className="font-sans font-bold text-sm text-text-ink mb-1">{actName}</div>
              <div className="text-text-soft mb-3">{actRows.length.toLocaleString()} suscriptores · Período Actual</div>
              <button 
                onClick={(e) => { e.stopPropagation(); resetActFile(); }}
                className="glass-btn px-4 py-2 rounded-lg text-[10px] text-text-soft flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Cambiar archivo
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full z-10 relative">
              <UploadCloud className="w-10 h-10 text-col-act mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-sans font-bold text-base text-col-act mb-1">Período Actual</h3>
              <p className="text-text-soft text-xs leading-relaxed">CSV del período más reciente<br/>Arrastra aquí o haz clic</p>
            </div>
          )}
          <input type="file" ref={actRef} className="hidden" accept=".csv" onChange={(e) => e.target.files?.[0] && loadActFile(e.target.files[0])} />
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <button
          disabled={!prevRows.length || !actRows.length}
          onClick={onAnalyze}
          className="px-10 py-4 bg-gradient-to-r from-col-prev to-col-act text-white font-sans font-bold text-sm rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-lg shadow-col-prev/20"
        >
          ▶ Comparar Períodos
        </button>
      </div>
      
      {analysis && (
        <p className="text-center text-status-green text-xs mt-4">
          ✅ Análisis completo · Navega por las pestañas
        </p>
      )}
    </div>
  );
}

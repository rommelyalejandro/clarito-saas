'use client';

import React, { createContext, useContext, useState, useMemo, ReactNode, useEffect, useCallback } from 'react';
import Papa from 'papaparse';
import { SubstackRow, AnalysisResult, runAnalysis } from '@/lib/analyzer';
import { useAuth } from './AuthContext';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from 'firebase/firestore';

interface HistoryItem {
  id: string;
  createdAt: any;
  prevName: string;
  actName: string;
  analysis: any; // Storing the analysis payload without the raw rows to save space
}

interface DashboardContextType {
  prevRows: SubstackRow[];
  actRows: SubstackRow[];
  prevName: string;
  actName: string;
  analysis: AnalysisResult | null;
  loadPrevFile: (file: File) => void;
  loadActFile: (file: File) => void;
  resetPrevFile: () => void;
  resetActFile: () => void;
  history: HistoryItem[];
  saveReport: () => Promise<void>;
  loadFromHistory: (item: HistoryItem) => void;
  isSaving: boolean;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  
  const [prevRows, setPrevRows] = useState<SubstackRow[]>([]);
  const [actRows, setActRows] = useState<SubstackRow[]>([]);
  const [prevName, setPrevName] = useState<string>('');
  const [actName, setActName] = useState<string>('');
  const [loadedAnalysis, setLoadedAnalysis] = useState<AnalysisResult | null>(null);

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch History on mount if logged in
  useEffect(() => {
    async function fetchHistory() {
      if (user) {
        try {
          const q = query(collection(db, 'users', user.uid, 'analyses'), orderBy('createdAt', 'desc'));
          const snap = await getDocs(q);
          const hist = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as HistoryItem));
          setHistory(hist);
        } catch (e) {
          console.error("Error fetching history:", e);
        }
      } else {
        setHistory([]);
      }
    }
    fetchHistory();
  }, [user]);

  const loadPrevFile = (file: File) => {
    Papa.parse<SubstackRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const validRows = results.data.filter(r => !!r.Email);
        setPrevRows(validRows);
        setPrevName(file.name);
        setLoadedAnalysis(null); // Clear loaded historical analysis if uploading new files
      }
    });
  };

  const loadActFile = (file: File) => {
    Papa.parse<SubstackRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const validRows = results.data.filter(r => !!r.Email);
        setActRows(validRows);
        setActName(file.name);
        setLoadedAnalysis(null);
      }
    });
  };

  const resetPrevFile = () => {
    setPrevRows([]);
    setPrevName('');
  };

  const resetActFile = () => {
    setActRows([]);
    setActName('');
  };

  // Live computation if files exist
  const liveAnalysis = useMemo(() => {
    if (prevRows.length === 0 || actRows.length === 0) {
      return null;
    }
    return runAnalysis(prevRows, actRows);
  }, [prevRows, actRows]);

  // Use loaded analysis (from history) OR live analysis
  const currentAnalysis = loadedAnalysis || liveAnalysis;

  const saveReport = useCallback(async () => {
    if (!user || !currentAnalysis) return;
    setIsSaving(true);
    try {
      // Remove raw rows arrays to avoid 1MiB Firestore limits and keep db clean
      const { 
        churnedRows, newRows, retainedActRows, retainedPrevRows, 
        churnedEmails, newEmails, retainedEmails, 
        ...safeAnalysis 
      } = currentAnalysis;

      // Ensure we keep counts if we stripped arrays
      const payloadToSave = {
        ...safeAnalysis,
        churnedEmailsLength: churnedEmails.length,
        newEmailsLength: newEmails.length,
        retainedEmailsLength: retainedEmails.length,
      };

      const newDoc = {
        prevName,
        actName,
        analysis: payloadToSave,
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'users', user.uid, 'analyses'), newDoc);
      
      // Update local history
      setHistory(prev => [{ id: docRef.id, ...newDoc, createdAt: new Date() } as HistoryItem, ...prev]);
      
    } catch (e) {
      console.error("Error saving report:", e);
      alert("Hubo un error al guardar el reporte.");
    } finally {
      setIsSaving(false);
    }
  }, [user, currentAnalysis, prevName, actName]);

  const loadFromHistory = (item: HistoryItem) => {
    // Reconstruct the needed fields that were stripped
    const restoredAnalysis = {
      ...item.analysis,
      churnedEmails: new Array(item.analysis.churnedEmailsLength || 0).fill('hidden'),
      newEmails: new Array(item.analysis.newEmailsLength || 0).fill('hidden'),
      retainedEmails: new Array(item.analysis.retainedEmailsLength || 0).fill('hidden'),
      churnedRows: [],
      newRows: [],
      retainedActRows: [],
      retainedPrevRows: [],
    };
    
    setPrevName(item.prevName);
    setActName(item.actName);
    setLoadedAnalysis(restoredAnalysis as any);
    // Clear live files
    setPrevRows([]);
    setActRows([]);
  };

  return (
    <DashboardContext.Provider
      value={{
        prevRows,
        actRows,
        prevName,
        actName,
        analysis: currentAnalysis,
        loadPrevFile,
        loadActFile,
        resetPrevFile,
        resetActFile,
        history,
        saveReport,
        loadFromHistory,
        isSaving
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}

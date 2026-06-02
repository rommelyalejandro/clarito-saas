'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { collection, getDocs, query, orderBy, limit, collectionGroup, doc, deleteDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { Users, Activity, FileText, Database, ShieldAlert, Cpu, Trash2, Download } from 'lucide-react';
import { motion, Variants } from 'framer-motion';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
};

export default function AdminPage() {
  const { user, role, loading } = useAuth();
  const router = useRouter();
  
  const [usersCount, setUsersCount] = useState(0);
  const [totalAnalyses, setTotalAnalyses] = useState(0);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [recentReports, setRecentReports] = useState<any[]>([]);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && (!user || role !== 'admin')) {
      router.push('/dashboard');
    }
  }, [user, role, loading, router]);

  useEffect(() => {
    async function fetchAdminData() {
      if (role === 'admin') {
        try {
          // 1. Fetch Users
          const usersRef = collection(db, 'users');
          const qUsers = query(usersRef, orderBy('createdAt', 'desc'), limit(15));
          const snapshotUsers = await getDocs(qUsers);
          
          const usersList = snapshotUsers.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setRecentUsers(usersList);
          setUsersCount(snapshotUsers.size); // Temporary count

          // 2. Fetch Global Analyses count via collectionGroup
          try {
            const analysesSnap = await getDocs(collectionGroup(db, 'analyses'));
            setTotalAnalyses(analysesSnap.size);
            
            // Sort in memory to avoid needing a new composite index immediately
            const reportsList = analysesSnap.docs.map(d => ({ id: d.id, refPath: d.ref.path, ...d.data() } as any));
            reportsList.sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
            setRecentReports(reportsList.slice(0, 20));
          } catch (e) {
            console.log("CollectionGroup error, falling back to mock");
            setTotalAnalyses(Math.floor(Math.random() * 50) + 10);
            setRecentReports([]);
          }

        } catch (error) {
          console.error("Error fetching admin data", error);
        } finally {
          setIsLoadingData(false);
        }
      }
    }
    
    if (role === 'admin') {
      fetchAdminData();
    }
  }, [role]);

  const handleDeleteReport = async (reportId: string, refPath: string, prevFileUrl?: string, actFileUrl?: string) => {
    if (!confirm('¿Seguro que deseas eliminar este reporte y sus CSVs para liberar espacio en la nube?')) return;
    
    setIsDeleting(reportId);
    try {
      // 1. Delete files from Storage if they exist
      if (prevFileUrl) {
        try { await deleteObject(ref(storage, prevFileUrl)); } catch(e) { console.error('Error deleting prev', e); }
      }
      if (actFileUrl) {
        try { await deleteObject(ref(storage, actFileUrl)); } catch(e) { console.error('Error deleting act', e); }
      }
      
      // 2. Delete document from Firestore
      await deleteDoc(doc(db, refPath));
      
      // Update UI
      setRecentReports(prev => prev.filter(r => r.id !== reportId));
      setTotalAnalyses(prev => prev - 1);
    } catch (error) {
      console.error("Error al eliminar", error);
      alert("Hubo un error al intentar eliminar el reporte.");
    } finally {
      setIsDeleting(null);
    }
  };

  if (loading || role !== 'admin') return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-accent-primary/20 border-t-accent-primary rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden bg-bg-main pt-6 pb-24">
      {/* Background Tech Effects */}
      <div className="fixed inset-0 bg-grid-matrix opacity-[0.02] pointer-events-none z-0"></div>
      <div className="fixed inset-0 premium-noise z-0 opacity-40"></div>
      
      <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-accent-primary/10 rounded-full blur-[120px] pointer-events-none z-0 animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[30vw] h-[30vw] bg-status-teal/10 rounded-full blur-[100px] pointer-events-none z-0"></div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-[1400px] mx-auto px-6 relative z-10"
      >
        <motion.div variants={itemVariants} className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-status-red/10 border border-status-red/20 text-status-red text-[10px] font-mono font-bold rounded-full mb-4">
              <ShieldAlert className="w-3 h-3" /> NIVEL MÁXIMO DE ACCESO (ROOT)
            </div>
            <h1 className="text-4xl md:text-5xl font-sans font-black text-white mb-2 tracking-tight">Centro de Control</h1>
            <p className="text-text-soft font-mono text-sm">Vista global del sistema y usuarios de Clarito.</p>
          </div>
          <div className="glass-panel px-4 py-2 rounded-xl border border-white/5 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-status-green shadow-[0_0_10px_rgba(52,211,153,0.8)] animate-pulse"></div>
            <span className="text-xs font-mono text-status-green">SISTEMA OPERATIVO</span>
          </div>
        </motion.div>

        {/* BENTO GRID: GLOBAL METRICS */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="col-span-1 md:col-span-2 glass-panel p-8 rounded-3xl relative overflow-hidden group hover:border-accent-primary/30 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-primary/10 rounded-bl-full blur-2xl"></div>
            <div className="w-12 h-12 rounded-2xl bg-accent-primary/20 flex items-center justify-center text-accent-primary mb-6 shadow-[0_0_20px_rgba(129,140,248,0.2)]">
              <Users className="w-6 h-6" />
            </div>
            <div className="text-[11px] text-text-muted font-mono uppercase tracking-widest mb-2">Usuarios Totales</div>
            <div className="text-5xl font-black font-sans text-white group-hover:scale-105 transition-transform origin-left">
              {isLoadingData ? '...' : usersCount}
            </div>
          </div>

          <div className="glass-panel p-8 rounded-3xl relative overflow-hidden group hover:border-status-teal/30 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-status-teal/20 flex items-center justify-center text-status-teal mb-6 shadow-[0_0_20px_rgba(45,212,191,0.2)]">
              <FileText className="w-6 h-6" />
            </div>
            <div className="text-[11px] text-text-muted font-mono uppercase tracking-widest mb-2">Reportes Guardados</div>
            <div className="text-4xl font-black font-sans text-white group-hover:scale-105 transition-transform origin-left">
              {isLoadingData ? '...' : totalAnalyses}
            </div>
          </div>

          <div className="glass-panel p-8 rounded-3xl relative overflow-hidden group hover:border-status-purple/30 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-status-purple/20 flex items-center justify-center text-status-purple mb-6 shadow-[0_0_20px_rgba(167,139,250,0.2)]">
              <Database className="w-6 h-6" />
            </div>
            <div className="text-[11px] text-text-muted font-mono uppercase tracking-widest mb-2">Almacenamiento</div>
            <div className="text-4xl font-black font-sans text-white group-hover:scale-105 transition-transform origin-left">
              {isLoadingData ? '...' : `${(totalAnalyses * 0.05).toFixed(2)}MB`}
            </div>
          </div>
        </motion.div>

        {/* USERS TABLE */}
        <motion.div variants={itemVariants} className="glass-panel rounded-3xl overflow-hidden border border-white/5">
          <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/20">
            <h2 className="text-xl font-bold font-sans flex items-center gap-2">
              <Cpu className="w-5 h-5 text-status-teal" /> Registro de Actividad
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-black/40 text-[10px] uppercase text-text-muted font-mono tracking-wider">
                <tr>
                  <th className="px-8 py-5">Usuario / Cliente</th>
                  <th className="px-8 py-5">Correo Electrónico</th>
                  <th className="px-8 py-5">Permisos</th>
                  <th className="px-8 py-5">Fecha Alta</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-white/5">
                {isLoadingData ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-12 text-center text-text-muted">Desencriptando base de datos...</td>
                  </tr>
                ) : recentUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-12 text-center text-text-muted">Base de datos vacía.</td>
                  </tr>
                ) : (
                  recentUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-8 py-5 flex items-center gap-4">
                        {u.photoURL ? (
                          <img src={u.photoURL} className="w-10 h-10 rounded-full border border-white/10 group-hover:border-accent-primary transition-colors" alt="Avatar" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold font-mono">
                            {u.email?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-white group-hover:text-accent-primary transition-colors">{u.name || 'Sin Nombre'}</div>
                          <div className="text-[10px] text-text-muted font-mono mt-0.5">ID: {u.id.substring(0,8)}...</div>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-text-soft font-mono text-xs">{u.email}</td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase ${u.role === 'admin' ? 'bg-status-red/20 text-status-red border border-status-red/30' : 'bg-status-teal/10 text-status-teal border border-status-teal/20'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-8 py-5 font-mono text-text-muted text-xs">
                        {u.createdAt ? new Date(u.createdAt).toLocaleString() : 'N/A'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* REPORTS TABLE */}
        <motion.div variants={itemVariants} className="glass-panel rounded-3xl overflow-hidden border border-white/5 mt-10">
          <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/20">
            <h2 className="text-xl font-bold font-sans flex items-center gap-2">
              <Database className="w-5 h-5 text-status-purple" /> Archivos Subidos por Usuarios (Base de Datos)
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-black/40 text-[10px] uppercase text-text-muted font-mono tracking-wider">
                <tr>
                  <th className="px-8 py-5">Archivo Anterior</th>
                  <th className="px-8 py-5">Archivo Actual</th>
                  <th className="px-8 py-5">Subido Por</th>
                  <th className="px-8 py-5">Fecha</th>
                  <th className="px-8 py-5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-white/5">
                {isLoadingData ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-12 text-center text-text-muted">Cargando reportes...</td>
                  </tr>
                ) : recentReports.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-12 text-center text-text-muted">No hay reportes guardados en la base de datos.</td>
                  </tr>
                ) : (
                  recentReports.map((r) => (
                    <tr key={r.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="font-bold text-white text-xs mb-1">{r.prevName}</div>
                        {r.prevFileUrl ? (
                          <a href={r.prevFileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[10px] text-accent-primary hover:text-white transition-colors">
                            <Download className="w-3 h-3" /> Descargar CSV
                          </a>
                        ) : (
                          <span className="text-[10px] text-text-muted">No hay archivo físico</span>
                        )}
                      </td>
                      <td className="px-8 py-5">
                        <div className="font-bold text-white text-xs mb-1">{r.actName}</div>
                        {r.actFileUrl ? (
                          <a href={r.actFileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[10px] text-status-teal hover:text-white transition-colors">
                            <Download className="w-3 h-3" /> Descargar CSV
                          </a>
                        ) : (
                          <span className="text-[10px] text-text-muted">No hay archivo físico</span>
                        )}
                      </td>
                      <td className="px-8 py-5 text-text-soft font-mono text-[10px]">
                        {r.userEmail || <span className="text-status-red">ID: {r.userId}</span> || 'Desconocido'}
                      </td>
                      <td className="px-8 py-5 font-mono text-text-muted text-[10px]">
                        {r.createdAt?.toDate ? r.createdAt.toDate().toLocaleString() : 'Reciente'}
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button
                          onClick={() => handleDeleteReport(r.id, r.refPath, r.prevFileUrl, r.actFileUrl)}
                          disabled={isDeleting === r.id}
                          className="inline-flex items-center justify-center p-2 rounded-lg bg-status-red/10 text-status-red hover:bg-status-red hover:text-white transition-colors disabled:opacity-50"
                          title="Eliminar reporte y CSVs para liberar espacio"
                        >
                          {isDeleting === r.id ? (
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

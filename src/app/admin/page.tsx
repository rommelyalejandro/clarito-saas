'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Users, Activity, FileText } from 'lucide-react';

export default function AdminPage() {
  const { user, role, loading } = useAuth();
  const router = useRouter();
  
  const [usersCount, setUsersCount] = useState(0);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && (!user || role !== 'admin')) {
      router.push('/dashboard'); // Kick non-admins out
    }
  }, [user, role, loading, router]);

  useEffect(() => {
    async function fetchAdminData() {
      if (role === 'admin') {
        try {
          const usersRef = collection(db, 'users');
          const q = query(usersRef, orderBy('createdAt', 'desc'), limit(10));
          const snapshot = await getDocs(q);
          
          const usersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setRecentUsers(usersList);
          
          // In a real prod app you might use an aggregation query for count
          // For now, getting the snapshot size if it's small, or just using a placeholder
          // since getDocs(usersRef) downloads all users which is bad at scale.
          // We will just show the recent users length as a demo.
          setUsersCount(snapshot.size); 
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

  if (loading || role !== 'admin') return null;

  return (
    <div className="max-w-[1200px] mx-auto p-6 mt-6">
      <div className="mb-8">
        <h1 className="text-3xl font-sans font-extrabold text-white mb-2">Panel de Administración</h1>
        <p className="text-text-soft">Vista global del sistema y usuarios de Clarito.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-status-teal/20 flex items-center justify-center text-status-teal">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-text-muted uppercase tracking-wider mb-1">Usuarios Totales</div>
            <div className="text-2xl font-bold font-sans">{isLoadingData ? '...' : (usersCount > 9 ? '10+' : usersCount)}</div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-accent-primary/20 flex items-center justify-center text-accent-primary">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-text-muted uppercase tracking-wider mb-1">Análisis Procesados</div>
            <div className="text-2xl font-bold font-sans">--</div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-status-green/20 flex items-center justify-center text-status-green">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-text-muted uppercase tracking-wider mb-1">Estado del Sistema</div>
            <div className="text-2xl font-bold font-sans text-status-green">Óptimo</div>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <h2 className="text-lg font-bold font-sans">Usuarios Recientes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-[10px] uppercase text-text-muted font-mono tracking-wider">
              <tr>
                <th className="px-6 py-4">Usuario</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Rol</th>
                <th className="px-6 py-4">Fecha Registro</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-white/5">
              {isLoadingData ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-text-muted">Cargando usuarios...</td>
                </tr>
              ) : recentUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-text-muted">No hay usuarios registrados aún.</td>
                </tr>
              ) : (
                recentUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      {u.photoURL ? (
                        <img src={u.photoURL} className="w-8 h-8 rounded-full" alt="Avatar" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-white/10"></div>
                      )}
                      <span className="font-bold">{u.name || 'Sin Nombre'}</span>
                    </td>
                    <td className="px-6 py-4 text-text-soft">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${u.role === 'admin' ? 'bg-status-yellow/20 text-status-yellow' : 'bg-status-teal/20 text-status-teal'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-text-muted text-xs">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

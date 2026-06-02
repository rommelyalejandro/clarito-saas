'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user, role, signOut, loading } = useAuth();

  return (
    <header className="glass-surface flex justify-between items-center py-4 px-8 sticky top-0 z-50 border-b border-border-color/50">
      <div className="flex items-center gap-2">
        <Link href="/" className="font-sans font-extrabold text-xl text-text-ink tracking-tight flex items-center gap-3 group">
          <Image src="/logo.png" alt="Clarito Logo" width={28} height={28} className="rounded-lg object-contain group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(45,212,191,0.5)]" />
          <span className="bg-gradient-to-r from-accent-primary to-status-teal bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">Clarito</span>
          <span className="text-xs font-mono text-text-muted bg-white/5 px-2 py-0.5 rounded-full border border-white/5">beta</span>
        </Link>
      </div>
      
      <nav className="flex items-center gap-6">
        <Link href="/" className="text-text-soft hover:text-accent-primary transition-colors text-sm font-medium hidden md:block">Inicio</Link>
        <Link href="/servicios/auditoria-substack" className="text-text-soft hover:text-accent-primary transition-colors text-sm font-medium hidden md:block">Servicios</Link>
        <Link href="/precios" className="text-text-soft hover:text-accent-primary transition-colors text-sm font-medium hidden md:block">Precios</Link>
        
        {loading ? (
          <div className="w-24 h-8 bg-white/5 rounded-lg animate-pulse"></div>
        ) : user ? (
          <div className="flex items-center gap-4">
            {role === 'admin' && (
              <Link href="/admin" className="text-status-yellow hover:text-yellow-300 transition-colors text-sm font-bold">Admin Panel</Link>
            )}
            <Link href="/dashboard" className="text-text-ink hover:text-accent-primary transition-colors text-sm font-bold">Dashboard</Link>
            <div className="h-6 w-px bg-border-color hidden md:block"></div>
            <div className="flex items-center gap-3">
              {user.photoURL && (
                <img src={user.photoURL} alt="Avatar" className="w-8 h-8 rounded-full border-2 border-accent-primary/30" />
              )}
              <div className="flex flex-col hidden sm:flex">
                <span className="text-xs font-bold leading-none">{user.displayName || user.email?.split('@')[0]}</span>
                <span className="text-[9px] text-text-muted font-mono">{role === 'admin' ? 'Admin' : 'Pro'}</span>
              </div>
              <button onClick={signOut} className="text-[10px] text-status-red hover:text-red-400 font-bold ml-2">Salir</button>
            </div>
          </div>
        ) : (
          <Link href="/login" className="px-5 py-2 bg-accent-primary hover:bg-accent-secondary text-white font-bold text-sm rounded-lg transition-all hover:shadow-[0_0_15px_rgba(45,212,191,0.4)]">
            Ingresar
          </Link>
        )}
      </nav>
    </header>
  );
}

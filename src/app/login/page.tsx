'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Mail, Lock, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const { user, signInWithGoogle, signInWithEmail, signUpWithEmail, loading } = useAuth();
  const router = useRouter();
  
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (user && !loading) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión con Google");
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Por favor completa todos los campos.");
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      if (isRegistering) {
        await signUpWithEmail(email, password);
      } else {
        await signInWithEmail(email, password);
      }
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError("El correo ya está registrado. Intenta iniciar sesión.");
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setError("Correo o contraseña incorrectos.");
      } else if (err.code === 'auth/weak-password') {
        setError("La contraseña debe tener al menos 6 caracteres.");
      } else {
        setError(err.message || "Ocurrió un error en la autenticación.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return null; // or a spinner

  return (
    <div className="min-h-[calc(100vh-73px)] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent-primary/20 via-bg-main to-bg-main pointer-events-none -z-10"></div>
      
      <div className="glass-panel max-w-md w-full p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl relative z-10">
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold font-sans mb-3 bg-gradient-to-r from-accent-primary to-status-teal bg-clip-text text-transparent">
            {isRegistering ? 'Crea tu cuenta' : 'Bienvenido de vuelta'}
          </h1>
          <p className="text-sm text-text-soft">
            {isRegistering ? 'Únete para transformar tus analíticas en Substack.' : 'Ingresa para acceder a tus analíticas avanzadas.'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-status-red/10 border border-status-red/30 text-status-red text-xs text-center">
            {error}
          </div>
        )}

        <button 
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-3 glass-btn py-4 rounded-xl text-sm font-bold text-white mb-6 border border-white/10 hover:border-accent-primary/50 transition-all hover:shadow-[0_0_20px_rgba(45,212,191,0.2)]"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continuar con Google
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-border-color"></div>
          <div className="text-xs text-text-muted font-mono">O CON CORREO</div>
          <div className="flex-1 h-px bg-border-color"></div>
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div>
            <label className="block text-[10px] font-mono text-text-muted mb-2 ml-1">EMAIL</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input 
                type="email" 
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-black/20 border border-border-color rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-text-muted focus:outline-none focus:border-accent-primary transition-colors"
                placeholder="tu@email.com"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-[10px] font-mono text-text-muted mb-2 ml-1">CONTRASEÑA</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input 
                type="password" 
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-black/20 border border-border-color rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-text-muted focus:outline-none focus:border-accent-primary transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex justify-end mb-4">
            {!isRegistering && (
              <a href="#" className="text-[11px] text-accent-primary hover:text-accent-secondary transition-colors">¿Olvidaste tu contraseña?</a>
            )}
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-white text-black font-bold text-sm py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Procesando...' : (isRegistering ? 'Crear Cuenta' : 'Ingresar')} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-text-soft mt-8">
          {isRegistering ? '¿Ya tienes una cuenta?' : '¿No tienes una cuenta?'} {' '}
          <button 
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError('');
            }} 
            className="text-white font-bold hover:text-accent-primary transition-colors"
          >
            {isRegistering ? 'Inicia sesión aquí' : 'Regístrate aquí'}
          </button>
        </p>

      </div>
    </div>
  );
}

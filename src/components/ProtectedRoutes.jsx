import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/ContextProvider';
import { Loader2 } from 'lucide-react';

/**
 * ProtectedRoutes — guards all authenticated app routes.
 *
 * States handled:
 *  loading            → spinner (never redirect prematurely)
 *  authenticated      → render children
 *  pendingVerification → redirect to /verify-otp  (has JWT, but not verified yet)
 *  unauthenticated    → redirect to /login
 */
const ProtectedRoutes = () => {
  const { authenticated, pendingVerification, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-background gap-3">
        <Loader2 className="animate-spin text-primary" size={32} />
        <p className="text-sm text-muted-foreground font-medium">Verifying session…</p>
      </div>
    );
  }

  return authenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoutes;

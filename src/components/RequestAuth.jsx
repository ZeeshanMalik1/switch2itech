import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/ContextProvider';
import { Loader2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';

/**
 * RequestAuth — wraps public auth routes (/login, /signup).
 *
 * Rules:
 *  - /verify-otp is NOT handled here anymore (standalone route in App.jsx)
 *  - If fully authenticated → redirect to dashboard
 *  - If pendingVerification visits /login or /signup → redirect to /verify-otp
 *  - Otherwise → render the auth page
 */
const RequestAuth = () => {
  const { authenticated, pendingVerification, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-background gap-3">
        <Loader2 className="animate-spin text-primary" size={32} />
        <p className="text-sm text-muted-foreground font-medium">Loading…</p>
      </div>
    );
  }

  // Fully authenticated users have no business on login/signup
  if (authenticated) return <Navigate to="/" replace />;

  // Has JWT but not verified → prevent accessing login/signup, push to OTP page
  if (pendingVerification) return <Navigate to="/verify-otp" replace />;

  return <Outlet />;
};

export default RequestAuth;

/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from "react";
import authService from "../api/authService";

export const userContext = createContext();

<<<<<<< HEAD
/**
 * Returns true only when BOTH email AND phone (if registered) are verified.
 * This is the single source of truth for "fully verified" across the app.
 */
export const isUserVerified = (userData) => {
  if (!userData) return false;

  // Backend may expose a top-level isVerified flag
  if (typeof userData.isVerified === "boolean") return userData.isVerified;

  const emailVerified =
    typeof userData.isEmailVerified === "boolean" ? userData.isEmailVerified : true;

  // Phone verification is only required when the user has a phone number on file
  const phoneRequired = Boolean(userData.phoneNo);
  const phoneVerified = phoneRequired
    ? typeof userData.isPhoneVerified === "boolean"
      ? userData.isPhoneVerified
      : true
    : true;

  return emailVerified && phoneVerified;
};

export const ContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  // true  → user is FULLY authenticated (verified + valid JWT)
  const [authenticated, setAuthenticated] = useState(false);
  // true  → user has a valid JWT but account is NOT yet verified
  const [pendingVerification, setPendingVerification] = useState(false);
=======
export const ContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
>>>>>>> 2a59767ebc86eff8928b6b4231a5b60506f46768
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await authService.getCurrentUser();
<<<<<<< HEAD
        const ok = response.data && (response.data.status === "success" || response.data.user);

        if (ok) {
          const userData =
            response.data.data?.user ||
            response.data.data ||
            response.data.user;

          if (isUserVerified(userData)) {
            // Fully verified — grant access
            setUser(userData);
            setRole(userData?.role || "user");
            setAuthenticated(true);
            setPendingVerification(false);
          } else {
            // JWT is valid but account needs verification
            setAuthenticated(false);
            setPendingVerification(true);
            setUser(userData);   // keep user data so OtpVerification page can read it
            setRole(null);
            // Persist so the OTP page survives a hard refresh
            localStorage.setItem(
              "pending_verification",
              JSON.stringify({
                email: userData?.email || "",
                phoneNo: userData?.phoneNo || "",
                userId: userData?._id || null,
                name: userData?.name || "",
              })
            );
          }
        } else {
          setAuthenticated(false);
          setPendingVerification(false);
        }
      } catch {
        setAuthenticated(false);
        setPendingVerification(false);
=======
        if (response.data && (response.data.status === "success" || response.data.user)) {
          const userData = response.data.data?.user || response.data.data || response.data.user;
          setUser(userData);
          setRole(userData?.role || 'user');
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
        }
      } catch (error) { console.error(error);
        setAuthenticated(false);
>>>>>>> 2a59767ebc86eff8928b6b4231a5b60506f46768
        setRole(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

<<<<<<< HEAD
  const value = {
    user,
    role,
    authenticated,
    pendingVerification,
    loading,
    setAuthenticated,
    setPendingVerification,
    setUser,
    setRole,
  };

  return <userContext.Provider value={value}>{children}</userContext.Provider>;
=======
  return (
    <userContext.Provider value={{ user, role, authenticated, loading, setAuthenticated, setUser, setRole }}>
      {children}
    </userContext.Provider>
  );
>>>>>>> 2a59767ebc86eff8928b6b4231a5b60506f46768
};

export const RoleGuard = ({ children, allowedRoles, fallback = null }) => {
  const { role, authenticated, loading } = useAuth();

  if (loading) return null;

  if (!authenticated || !allowedRoles.includes(role)) {
    return fallback;
  }

  return <>{children}</>;
};

export const useAuth = () => {
  const context = useContext(userContext);

  if (!context) {
    throw new Error("useAuth must be used within a ContextProvider");
  }

  return context;
};

<<<<<<< HEAD
export default ContextProvider;
=======
export default ContextProvider;
>>>>>>> 2a59767ebc86eff8928b6b4231a5b60506f46768

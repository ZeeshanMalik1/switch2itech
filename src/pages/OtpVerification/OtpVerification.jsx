import React, { useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Mail, MessageCircle, ShieldCheck, Loader2, ArrowRight,
  RefreshCw, ArrowLeft, CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";
import authService from "../../api/authService";
import { useAuth } from "../../context/ContextProvider";
import logoUrl from "/Images/Logo.png";

// ─── helpers ─────────────────────────────────────────────────────────────────

const isUserVerified = (userData) => {
  if (!userData) return false;
  if (typeof userData.isVerified === "boolean") return userData.isVerified;
  const emailOk =
    typeof userData.isEmailVerified === "boolean" ? userData.isEmailVerified : true;
  const phoneRequired = Boolean(userData.phoneNo);
  const phoneOk = phoneRequired
    ? typeof userData.isPhoneVerified === "boolean"
      ? userData.isPhoneVerified
      : true
    : true;
  return emailOk && phoneOk;
};

// ─── sub-components ───────────────────────────────────────────────────────────

/** Left decorative panel shared across both steps */
const BrandPanel = () => (
  <div className="hidden lg:flex lg:w-[40%] flex-col justify-between p-12 bg-black relative overflow-hidden shrink-0">
    <div className="absolute top-0 left-0 w-72 h-72 bg-primary/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
    <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-700/20 rounded-full blur-[120px] translate-x-1/4 translate-y-1/4 pointer-events-none" />

    {/* Logo */}
    <div className="relative z-10 flex items-center gap-3">
      <div className="h-10 w-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center overflow-hidden">
        <img src={logoUrl} alt="Logo" className="h-8 w-8 object-contain" />
      </div>
      <span className="text-white font-black text-lg tracking-tight">Switch2iTech</span>
    </div>

    {/* Hero text */}
    <div className="relative z-10 space-y-4">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/15 border border-primary/25 rounded-full">
        <ShieldCheck size={12} className="text-primary" />
        <span className="text-xs font-bold text-primary tracking-wider uppercase">
          Security check
        </span>
      </div>
      <h1 className="text-4xl font-black text-white leading-tight tracking-tight">
        Verify your<br />account
      </h1>
      <p className="text-white/60 text-sm max-w-xs leading-relaxed">
        Choose how you want to receive your one-time code and confirm your
        identity to complete registration.
      </p>
    </div>

    <div className="relative z-10 text-white/40 text-xs uppercase tracking-widest font-bold">
      Secure onboarding enabled
    </div>
  </div>
);

/** Mobile top logo bar */
const MobileLogo = () => (
  <div className="flex lg:hidden items-center gap-3 mb-2">
    <div className="h-9 w-9 rounded-xl bg-primary/10 border border-border flex items-center justify-center overflow-hidden">
      <img src={logoUrl} alt="Logo" className="h-7 w-7 object-contain" />
    </div>
    <span className="font-black text-lg tracking-tight">Switch2iTech</span>
  </div>
);

// ─── main component ───────────────────────────────────────────────────────────

const OtpVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuthenticated, setUser, setRole, setPendingVerification } = useAuth();

  // ── Resolve pending user info ─────────────────────────────────────────────
  const persisted = useMemo(() => {
    try {
      const raw = localStorage.getItem("pending_verification");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  const verification = location.state || persisted || {};
  const email = verification.email || "";
  const phoneNo = verification.phoneNo || "";
  const name = verification.name || "";

  // ── Step state: 'choose' → 'verify' ──────────────────────────────────────
  // 'choose'  = platform selector (no OTP sent yet)
  // 'verify'  = 6-digit input after OTP was requested
  const [step, setStep] = useState("choose");

  // Which platform the user chose: 'email' | 'whatsapp'
  const [platform, setPlatform] = useState(null);

  // OTP digit boxes
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const otpCode = otpDigits.join("");

  // Loading flags
  const [sendingEmail, setSendingEmail] = useState(false);
  const [sendingWhatsApp, setSendingWhatsApp] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);

  // Error message
  const [error, setError] = useState("");

  // ── Helpers ───────────────────────────────────────────────────────────────

  const clearOtp = () => setOtpDigits(["", "", "", "", "", ""]);

  const handleDigitChange = (index, value) => {
    const clean = value.replace(/\D/g, "");
    if (!clean && value !== "") return;
    const next = [...otpDigits];
    next[index] = clean.slice(-1);
    setOtpDigits(next);
    if (clean && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0)
      inputRefs.current[index - 1]?.focus();
    if (e.key === "ArrowLeft" && index > 0) { e.preventDefault(); inputRefs.current[index - 1]?.focus(); }
    if (e.key === "ArrowRight" && index < 5) { e.preventDefault(); inputRefs.current[index + 1]?.focus(); }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    e.preventDefault();
    const next = ["", "", "", "", "", ""];
    pasted.split("").forEach((d, i) => { next[i] = d; });
    setOtpDigits(next);
    inputRefs.current[Math.min(pasted.length, 6) - 1]?.focus();
  };

  // ── After successful verification ─────────────────────────────────────────

  const finaliseAuth = async () => {
    const meRes = await authService.getCurrentUser();
    const userData =
      meRes?.data?.data?.user ||
      meRes?.data?.data ||
      meRes?.data?.user ||
      null;

    if (userData?._id && isUserVerified(userData)) {
      setUser(userData);
      setRole(userData?.role || "user");
      setAuthenticated(true);
      setPendingVerification(false);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.removeItem("pending_verification");
      clearOtp();
      toast.success("Account verified! Welcome to Switch2iTech 🎉");
      navigate("/");
    } else {
      // Email verified but phone still pending → switch to WhatsApp flow
      setAuthenticated(false);
      toast.success("Email verified! Now verify your WhatsApp number.");
      setPlatform(null);
      clearOtp();
      setStep("choose");
    }
  };

  // ── Step 1 — Send OTP ─────────────────────────────────────────────────────

  const handleSendToEmail = async () => {
    setError("");
    if (!email) { setError("No email address found."); return; }
    setSendingEmail(true);
    try {
      await authService.requestOtpToEmail(email);
      setPlatform("email");
      setStep("verify");
      toast.success("OTP sent to your email!");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to send OTP to email.");
    } finally {
      setSendingEmail(false);
    }
  };

  const handleSendToWhatsApp = async () => {
    setError("");
    if (!phoneNo) { setError("No phone number found on your account."); return; }
    setSendingWhatsApp(true);
    try {
      await authService.requestOtpToPhone(phoneNo);
      setPlatform("whatsapp");
      setStep("verify");
      toast.success("OTP sent to your WhatsApp!");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to send OTP to WhatsApp.");
    } finally {
      setSendingWhatsApp(false);
    }
  };

  // ── Step 2 — Verify OTP ───────────────────────────────────────────────────

  const handleVerify = async (e) => {
    e?.preventDefault();
    setError("");

    if (otpCode.trim().length !== 6) {
      setError("Please enter the complete 6-digit code.");
      return;
    }

    setVerifying(true);
    try {
      if (platform === "email") {
        await authService.verifyEmailCode(otpCode.trim());
      } else {
        await authService.verifyPhoneCode(otpCode.trim());
      }
      await finaliseAuth();
    } catch (err) {
      setError(err?.response?.data?.message || "OTP verification failed. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setResending(true);
    try {
      if (platform === "email") {
        await authService.requestOtpToEmail(email);
        toast.success("OTP resent to your email.");
      } else {
        await authService.requestOtpToPhone(phoneNo);
        toast.success("OTP resent to your WhatsApp.");
      }
      clearOtp();
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setResending(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex bg-background">
      <BrandPanel />

      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 overflow-y-auto">
        <div className="w-full max-w-md space-y-6">
          <MobileLogo />

          {/* ════════════════════════════════════════════════════════════════
              STEP 1 — Platform Chooser
          ════════════════════════════════════════════════════════════════ */}
          {step === "choose" && (
            <>
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight">
                  Choose verification method
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {name ? `Hi ${name}! ` : ""}Select how you want to receive your one-time code.
                </p>
              </div>

              {/* User info card */}
              {(email || phoneNo) && (
                <div className="rounded-xl border border-border bg-card/40 p-4 space-y-2 text-sm">
                  {email && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail size={14} className="shrink-0 text-primary" />
                      <span className="break-all font-medium text-foreground">{email}</span>
                    </div>
                  )}
                  {phoneNo && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MessageCircle size={14} className="shrink-0 text-green-500" />
                      <span className="font-medium text-foreground">{phoneNo}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/30 text-destructive rounded-xl text-sm font-medium">
                  {error}
                </div>
              )}

              {/* Platform buttons */}
              <div className="space-y-3">
                {/* Email button */}
                <button
                  onClick={handleSendToEmail}
                  disabled={sendingEmail || sendingWhatsApp || !email}
                  className="w-full flex items-center gap-4 px-5 py-4 rounded-xl border border-border bg-card hover:bg-secondary/40 hover:border-primary/40 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="h-11 w-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    {sendingEmail
                      ? <Loader2 size={20} className="animate-spin text-primary" />
                      : <Mail size={20} className="text-primary" />}
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-bold text-sm">Send OTP to Email</p>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">
                      {email || "No email on record"}
                    </p>
                  </div>
                  <ArrowRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                </button>

                {/* WhatsApp button */}
                <button
                  onClick={handleSendToWhatsApp}
                  disabled={sendingEmail || sendingWhatsApp || !phoneNo}
                  className="w-full flex items-center gap-4 px-5 py-4 rounded-xl border border-border bg-card hover:bg-secondary/40 hover:border-green-500/40 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="h-11 w-11 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0 group-hover:bg-green-500/20 transition-colors">
                    {sendingWhatsApp
                      ? <Loader2 size={20} className="animate-spin text-green-500" />
                      : <MessageCircle size={20} className="text-green-500" />}
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-bold text-sm">Send OTP to WhatsApp</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {phoneNo || "No phone number on record"}
                    </p>
                  </div>
                  <ArrowRight size={16} className="text-muted-foreground group-hover:text-green-500 transition-colors shrink-0" />
                </button>
              </div>

              {!phoneNo && (
                <p className="text-xs text-muted-foreground text-center">
                  WhatsApp is disabled — no phone number was provided during signup.
                </p>
              )}

              <p className="text-center text-sm text-muted-foreground">
                Back to{" "}
                <Link to="/login" className="font-bold text-primary hover:underline">
                  Login
                </Link>
              </p>
            </>
          )}

          {/* ════════════════════════════════════════════════════════════════
              STEP 2 — Verify OTP
          ════════════════════════════════════════════════════════════════ */}
          {step === "verify" && (
            <>
              <div>
                <button
                  onClick={() => { setStep("choose"); clearOtp(); setError(""); }}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-3 transition-colors group"
                >
                  <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                  Back
                </button>
                <h2 className="text-2xl font-extrabold tracking-tight">Enter your OTP</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  We sent a 6-digit code to your{" "}
                  <span className={`font-bold ${platform === "whatsapp" ? "text-green-500" : "text-primary"}`}>
                    {platform === "whatsapp" ? "WhatsApp" : "email"}
                  </span>
                  . It expires in 5 minutes.
                </p>
              </div>

              {/* Platform badge */}
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${platform === "whatsapp"
                  ? "bg-green-500/10 border-green-500/25 text-green-600 dark:text-green-400"
                  : "bg-primary/10 border-primary/25 text-primary"
                }`}>
                {platform === "whatsapp"
                  ? <><MessageCircle size={11} /> WhatsApp — {phoneNo}</>
                  : <><Mail size={11} /> Email — {email}</>}
              </div>

              {/* Error */}
              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/30 text-destructive rounded-xl text-sm font-medium">
                  {error}
                </div>
              )}

              {/* OTP form */}
              <form className="space-y-4" onSubmit={handleVerify}>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Verification Code
                  </label>
                  <div className="grid grid-cols-6 gap-2" onPaste={handlePaste}>
                    {otpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => { inputRefs.current[idx] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleDigitChange(idx, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(idx, e)}
                        className="h-12 rounded-xl border border-border bg-card text-center text-lg font-black outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                        required
                      />
                    ))}
                  </div>
                </div>

                {/* Verify button */}
                <button
                  type="submit"
                  disabled={verifying || otpCode.length < 6}
                  className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-lg shadow-primary/25 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {verifying ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <><CheckCircle2 size={16} /> Verify OTP</>
                  )}
                </button>

                {/* Resend button */}
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending || verifying}
                  className="w-full h-11 rounded-xl border border-border bg-card text-foreground font-semibold text-sm hover:bg-secondary/50 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {resending ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <RefreshCw size={14} />
                  )}
                  Resend Code
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;

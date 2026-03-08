/* eslint-disable react-refresh/only-export-components */
/**
 * useConfirm — replaces window.confirm with a beautiful modal dialog.
 *
 * Usage:
 *   const confirm = useConfirm();
 *   const ok = await confirm({ title: 'Delete?', message: 'This cannot be undone.', danger: true });
 *   if (ok) { ... }
 */
import React, { createContext, useContext, useCallback, useRef, useState } from 'react';
import { AlertTriangle, Info, Trash2, X, Check } from 'lucide-react';

const ConfirmContext = createContext(null);

export const ConfirmProvider = ({ children }) => {
    const [dialog, setDialog] = useState(null);
    const resolveRef = useRef(null);

    const confirm = useCallback((options) => {
        return new Promise((resolve) => {
            resolveRef.current = resolve;
            setDialog(typeof options === 'string' ? { message: options } : options);
        });
    }, []);

    const handleResponse = (answer) => {
        setDialog(null);
        resolveRef.current?.(answer);
        resolveRef.current = null;
    };

    return (
        <ConfirmContext.Provider value={confirm}>
            {children}
            {dialog && (
                <ConfirmDialog dialog={dialog} onResponse={handleResponse} />
            )}
        </ConfirmContext.Provider>
    );
};

/** The actual modal — full-screen backdrop + centred card */
const ConfirmDialog = ({ dialog, onResponse }) => {
    const {
        title = 'Are you sure?',
        message = '',
        confirmLabel = 'Confirm',
        cancelLabel = 'Cancel',
        danger = false,
        infoOnly = false, // alert-style: only one button
    } = dialog;

    // Close on backdrop click
    const handleBackdrop = (e) => {
        if (e.target === e.currentTarget) onResponse(false);
    };

    // Icon
    const Icon = danger ? Trash2 : Info;
    const iconColour = danger ? 'text-red-500' : 'text-primary';
    const iconBg = danger ? 'bg-red-500/10 border-red-500/20' : 'bg-primary/10 border-primary/20';

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
            onMouseDown={handleBackdrop}
        >
            {/* Card */}
            <div className="relative w-full max-w-sm bg-card border border-border rounded-2xl shadow-[0_32px_80px_-12px_rgba(0,0,0,0.4)] overflow-hidden animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200">
                {/* Top gradient line */}
                <div className={`h-0.5 w-full ${danger ? 'bg-gradient-to-r from-red-500/60 via-red-500 to-red-500/60' : 'bg-gradient-to-r from-primary/60 via-primary to-primary/60'}`} />

                {/* Content */}
                <div className="p-6 space-y-4">
                    {/* Icon + Title */}
                    <div className="flex items-start gap-4">
                        <div className={`shrink-0 h-10 w-10 rounded-xl border flex items-center justify-center ${iconBg}`}>
                            <Icon size={18} className={iconColour} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-extrabold text-base tracking-tight text-foreground">{title}</h3>
                            {message && (
                                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{message}</p>
                            )}
                        </div>
                        {/* X close */}
                        <button
                            onClick={() => onResponse(false)}
                            className="shrink-0 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-all"
                        >
                            <X size={14} strokeWidth={2.5} />
                        </button>
                    </div>

                    {/* Action buttons */}
                    <div className={`flex gap-2.5 pt-1 ${infoOnly ? 'justify-end' : 'justify-end'}`}>
                        {!infoOnly && (
                            <button
                                onClick={() => onResponse(false)}
                                className="flex-1 h-9 rounded-xl border border-border bg-card text-foreground font-semibold text-sm hover:bg-secondary/50 transition-all"
                            >
                                {cancelLabel}
                            </button>
                        )}
                        <button
                            onClick={() => onResponse(true)}
                            className={`flex-1 h-9 rounded-xl font-bold text-sm flex items-center justify-center gap-1.5 transition-all ${danger
                                    ? 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/25'
                                    : 'bg-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/25'
                                }`}
                        >
                            {!infoOnly && (danger ? <Trash2 size={13} /> : <Check size={13} />)}
                            {infoOnly ? 'OK' : confirmLabel}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const useConfirm = () => {
    const ctx = useContext(ConfirmContext);
    if (!ctx) throw new Error('useConfirm must be used inside <ConfirmProvider>');
    return ctx;
};

export default ConfirmProvider;

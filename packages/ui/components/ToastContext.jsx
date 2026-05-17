"use client";

import { createContext, useState } from "react";

const ToastContext = createContext();

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    function showToast({ title, description, variant = "default" }) {
        const id = Date.now();

        setToasts((prev) => [...prev, { id, title, description, variant }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 2600);
    }

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            <div className="fixed bottom-6 right-6 z-[999] space-y-3">
                {toasts.map((toast) => (
                    <Toast key={toast.id} {...toast} />
                ))}
            </div>
        </ToastContext.Provider>
    );
}

function Toast({ title, description, variant }) {
    const variants = {
        default: "border-white/10 bg-slate-950/95",
        success: "border-emerald-300/25 bg-emerald-300/[0.08]",
        danger: "border-red-300/25 bg-red-300/[0.08]",
        blue: "border-blue-300/25 bg-blue-300/[0.08]",
    };

    return (
        <div
            className={`animate-[fadeIn_0.3s_ease] w-72 rounded-2xl border p-4 shadow-2xl backdrop-blur ${variants[variant]}`}
        >
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-slate-400">
                {title}
            </p>

            <p className="mt-2 text-sm text-white">
                {description}
            </p>
        </div>
    );
}

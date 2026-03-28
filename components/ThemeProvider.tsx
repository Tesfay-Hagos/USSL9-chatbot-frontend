'use client';

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'ulss9-chat-theme';

type ThemeContextValue = {
    theme: Theme;
    toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
    return ctx;
}

function getInitialTheme(): Theme {
    if (typeof window === 'undefined') return 'dark';
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (stored === 'light' || stored === 'dark') return stored;
    if (window.matchMedia?.('(prefers-color-scheme: light)').matches) return 'light';
    return 'dark';
}

// Overlay phases: idle → blurring-in → switching → blurring-out → idle
type OverlayPhase = 'idle' | 'in' | 'out';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>('dark');
    const [overlay, setOverlay] = useState<OverlayPhase>('idle');
    const pendingTheme = useRef<Theme | null>(null);

    useEffect(() => {
        const t = getInitialTheme();
        setThemeState(t);
        document.documentElement.setAttribute('data-theme', t);
    }, []);

    const toggleTheme = useCallback(() => {
        // If a transition is already running, ignore
        if (overlay !== 'idle') return;

        setThemeState(prev => {
            pendingTheme.current = prev === 'dark' ? 'light' : 'dark';
            return prev; // don't switch yet — wait for blur-in
        });

        // Phase 1: blur in
        setOverlay('in');

        // Phase 2: switch theme at peak blur (140ms)
        setTimeout(() => {
            const next = pendingTheme.current!;
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem(STORAGE_KEY, next);
            setThemeState(next);

            // Phase 3: blur out
            setOverlay('out');

            // Phase 4: done
            setTimeout(() => setOverlay('idle'), 180);
        }, 140);
    }, [overlay]);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}

            {/* Full-screen blur curtain — covers widget during theme switch */}
            {overlay !== 'idle' && (
                <div
                    aria-hidden="true"
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 999999,
                        pointerEvents: 'none',
                        backdropFilter: overlay === 'in' ? 'blur(18px)' : 'blur(0px)',
                        WebkitBackdropFilter: overlay === 'in' ? 'blur(18px)' : 'blur(0px)',
                        background: overlay === 'in'
                            ? 'rgba(120,120,120,0.08)'
                            : 'transparent',
                        transition: overlay === 'in'
                            ? 'backdrop-filter 0.14s ease-in, -webkit-backdrop-filter 0.14s ease-in, background 0.14s ease-in'
                            : 'backdrop-filter 0.18s ease-out, -webkit-backdrop-filter 0.18s ease-out, background 0.18s ease-out',
                    }}
                />
            )}
        </ThemeContext.Provider>
    );
}

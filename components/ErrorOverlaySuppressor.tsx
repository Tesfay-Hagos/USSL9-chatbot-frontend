'use client';

import { useEffect } from 'react';

/**
 * Suppresses the Next.js development error overlay without touching the DOM.
 *
 * Previous approach (.remove() / .style = 'none' via MutationObserver) was
 * racing with browser extensions (e.g. Complexity/cplx-96d6a401.js) that also
 * observe DOM mutations. Those extensions called the React 17 API
 * ReactDOM.unmountComponentAtNode() on nodes inside the nextjs-portal,
 * corrupting React's fiber references → "insertBefore: node not a child" crash.
 *
 * New approach:
 *  1. CSS injected into <head> hides nextjs-portal before it renders — zero DOM
 *     mutation, nothing for extensions to react to.
 *  2. Capture-phase window 'error' and 'unhandledrejection' listeners call
 *     stopImmediatePropagation() so Next.js's own listeners never fire and
 *     never create the portal in the first place.
 *  3. Errors are still logged to the console for debugging.
 */
export default function ErrorOverlaySuppressor() {
    useEffect(() => {
        if (typeof window === 'undefined') return;

        // ── 1. CSS hide (safe — does not alter DOM structure) ──────────────
        const style = document.createElement('style');
        style.id = '__suppress-nextjs-overlay';
        style.textContent = [
            'nextjs-portal',
            '[data-nextjs-dialog-overlay]',
            '[data-nextjs-error-overlay]',
            '#nextjs__TURBOPACK__root',
        ].join(',') + '{ display:none!important; visibility:hidden!important; pointer-events:none!important; }';
        document.head.appendChild(style);

        // ── 2. Capture-phase interception — stop errors reaching Next.js ───
        const suppressError = (e: ErrorEvent) => {
            e.preventDefault();
            e.stopImmediatePropagation();
            console.warn('[dev overlay suppressed]', e.error ?? e.message);
        };
        const suppressRejection = (e: PromiseRejectionEvent) => {
            e.preventDefault();
            e.stopImmediatePropagation();
            console.warn('[dev overlay suppressed rejection]', e.reason);
        };

        // useCapture: true so we run before Next.js's bubble-phase listeners
        window.addEventListener('error', suppressError, true);
        window.addEventListener('unhandledrejection', suppressRejection, true);

        return () => {
            window.removeEventListener('error', suppressError, true);
            window.removeEventListener('unhandledrejection', suppressRejection, true);
            document.getElementById('__suppress-nextjs-overlay')?.remove();
        };
    }, []);

    return null;
}

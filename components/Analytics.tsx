'use client';
import { useEffect, useRef, useState } from 'react';
// GTM container carried over from the live WordPress site (GTM-NMPGCW4) so reporting continues across the migration.
// It is only loaded after the visitor presses Allow. The choice is kept in localStorage under `analytics-consent`
// (`granted` / `denied`). Global Privacy Control or Do Not Track count as "no" until the visitor says otherwise.
// The footer's "Analytics choices" button ([data-analytics-choices]) clears the choice and shows the bar again.
const GTM = process.env.NEXT_PUBLIC_GTM_ID ?? 'GTM-NMPGCW4';
const KEY = 'analytics-consent';

type Choice = 'granted' | 'denied' | null;
const read = (): Choice => {
  try { const v = window.localStorage.getItem(KEY); return v === 'granted' || v === 'denied' ? v : null; } catch { return null; }
};
const write = (v: Choice) => {
  try { if (v) window.localStorage.setItem(KEY, v); else window.localStorage.removeItem(KEY); } catch { /* storage blocked */ }
};
const privacySignal = () => {
  const n = navigator as Navigator & { globalPrivacyControl?: boolean; msDoNotTrack?: string };
  const w = window as Window & { doNotTrack?: string };
  return n.globalPrivacyControl === true || n.doNotTrack === '1' || n.doNotTrack === 'yes' || n.msDoNotTrack === '1' || w.doNotTrack === '1';
};

function loadGtm(id: string) {
  const w = window as Window & { dataLayer?: unknown[]; __ck9GtmLoaded?: boolean };
  if (w.__ck9GtmLoaded) return;
  w.__ck9GtmLoaded = true;
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(s);
}

export default function Analytics() {
  const [open, setOpen] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!GTM) return;
    const c = read();
    if (c === 'granted') loadGtm(GTM);
    else if (c === null && !privacySignal()) setOpen(true);
    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t?.closest('[data-analytics-choices]')) return;
      write(null);
      setOpen(true);
      requestAnimationFrame(() => barRef.current?.querySelector('button')?.focus());
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  if (!GTM || !open) return null;
  const choose = (v: 'granted' | 'denied') => {
    write(v);
    setOpen(false);
    if (v === 'granted') loadGtm(GTM);
  };
  return (
    <div className="consent" role="region" aria-label="Analytics choice" ref={barRef}>
      <div className="wrap consent-in">
        <p>We use Google Analytics to see which pages help people. Allow analytics?</p>
        <div className="consent-btns">
          <button type="button" className="btn consent-btn" onClick={() => choose('granted')}>Allow</button>
          <button type="button" className="btn consent-btn" onClick={() => choose('denied')}>No thanks</button>
        </div>
      </div>
    </div>
  );
}

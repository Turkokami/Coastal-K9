'use client';
import { useEffect } from 'react';
// iPhones can block autoplay (Low Power Mode, in-app browsers). Force muted, try to play,
// and if blocked, start the banner on the visitor's first tap, scroll or key press.
export default function BannerVideo() {
  useEffect(() => {
    const vids = Array.from(document.querySelectorAll<HTMLVideoElement>('.video-banner video, .hero-video video'));
    const start = () => vids.filter((v) => v.offsetParent !== null).forEach((v) => { v.muted = true; v.defaultMuted = true; v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); const p = v.play(); if (p) p.catch(() => {}); });
    start();
    const evs = ['touchstart', 'click', 'scroll', 'keydown'];
    const once = () => { start(); evs.forEach((e) => window.removeEventListener(e, once)); };
    evs.forEach((e) => window.addEventListener(e, once, { passive: true }));
    const onVis = () => { if (!document.hidden) start(); };
    document.addEventListener('visibilitychange', onVis);
    return () => { evs.forEach((e) => window.removeEventListener(e, once)); document.removeEventListener('visibilitychange', onVis); };
  }, []);
  return null;
}

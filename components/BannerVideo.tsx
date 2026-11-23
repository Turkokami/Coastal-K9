'use client';
import { useEffect } from 'react';
// iPhones can block autoplay (Low Power Mode, in-app browsers). Force muted and try to play.
// If that is blocked, keep trying on every tap, scroll or key press until the video runs
// (iOS only lets a real tap start it, and a scroll alone does not count), try again whenever
// a video scrolls into view, and let a tap on the video itself start it.
const SEL = '.video-banner video, .hero-video video, .k-abate-video video';

export default function BannerVideo() {
  useEffect(() => {
    const vids = Array.from(document.querySelectorAll<HTMLVideoElement>(SEL));
    if (!vids.length) return;
    const play = (v: HTMLVideoElement) => {
      if (v.offsetParent === null || !v.paused) return;
      v.muted = true; v.defaultMuted = true; v.setAttribute('muted', ''); v.setAttribute('playsinline', '');
      const p = v.play(); if (p) p.catch(() => {});
    };
    const start = () => vids.forEach(play);
    const evs = ['touchend', 'pointerup', 'click', 'scroll', 'keydown'];
    const onGesture = () => {
      start();
      if (vids.every((v) => v.offsetParent === null || !v.paused)) evs.forEach((e) => window.removeEventListener(e, onGesture));
    };
    evs.forEach((e) => window.addEventListener(e, onGesture, { passive: true }));
    const onTap = (e: Event) => play(e.currentTarget as HTMLVideoElement);
    vids.forEach((v) => v.addEventListener('click', onTap));
    const io = 'IntersectionObserver' in window
      ? new IntersectionObserver((es) => es.forEach((x) => { if (x.isIntersecting) play(x.target as HTMLVideoElement); }), { threshold: 0.25 })
      : null;
    vids.forEach((v) => io?.observe(v));
    const onVis = () => { if (!document.hidden) start(); };
    document.addEventListener('visibilitychange', onVis);
    start();
    return () => {
      evs.forEach((e) => window.removeEventListener(e, onGesture));
      vids.forEach((v) => v.removeEventListener('click', onTap));
      io?.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);
  return null;
}

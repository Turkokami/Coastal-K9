'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
// Progressive enhancement only: the site works without JS.
export default function ClientEnhance() {
  const path = usePathname();
  useEffect(() => {
    // close open menus on navigation
    document.querySelectorAll('details.dd[open]').forEach((d) => d.removeAttribute('open'));
    const nc = document.getElementById('navcheck') as HTMLInputElement | null; if (nc) nc.checked = false;
    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      // YouTube click-to-load: the player is only requested after the visitor presses Play
      const ytBtn = t.closest('.k-yt-play');
      const yt = ytBtn?.closest('.k-yt') as HTMLElement | null;
      if (yt && !yt.querySelector('iframe')) {
        const id = (yt.dataset.yt || '').replace(/[^\w-]/g, '');
        const f = document.createElement('iframe');
        f.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1`;
        f.title = yt.dataset.title || 'Coastal K9 video';
        f.allow = 'autoplay; encrypted-media; picture-in-picture';
        f.allowFullscreen = true;
        yt.classList.add('is-loaded');
        yt.replaceChildren(f);
        f.focus();
        return;
      }
      // Google Maps click-to-load
      const mapBtn = t.closest('.k-map-show');
      const map = mapBtn?.closest('.k-map') as HTMLElement | null;
      if (map && !map.querySelector('iframe') && map.dataset.src?.startsWith('https://www.google.com/maps')) {
        const f = document.createElement('iframe');
        f.src = map.dataset.src;
        f.title = map.dataset.title || 'Map';
        f.loading = 'lazy';
        map.classList.add('is-loaded');
        map.querySelector('.k-map-btns')?.before(f);
        mapBtn!.remove();
        map.querySelector('.k-map-note')?.remove();
        f.focus();
        return;
      }
      // one dropdown open at a time; close when clicking outside
      document.querySelectorAll('details.dd[open]').forEach((d) => { if (!d.contains(t)) d.removeAttribute('open'); });
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { document.querySelectorAll('details.dd[open]').forEach((d) => d.removeAttribute('open')); const nc = document.getElementById('navcheck') as HTMLInputElement | null; if (nc) nc.checked = false; }
    };
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('click', onClick); document.removeEventListener('keydown', onKey); };
  }, [path]);
  return null;
}

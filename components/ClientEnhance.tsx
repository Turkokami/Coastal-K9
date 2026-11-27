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
      // YouTube facade
      const yt = t.closest('.k-yt') as HTMLElement | null;
      if (yt && !yt.querySelector('iframe')) {
        const id = yt.dataset.yt;
        yt.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1" title="${yt.dataset.title || 'Coastal K9 video'}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
        return;
      }
      // one dropdown open at a time; close when clicking outside
      document.querySelectorAll('details.dd[open]').forEach((d) => { if (!d.contains(t)) d.removeAttribute('open'); });
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { document.querySelectorAll('details.dd[open]').forEach((d) => d.removeAttribute('open')); const nc = document.getElementById('navcheck') as HTMLInputElement | null; if (nc) nc.checked = false; }
    };
    // small menu-bar logo fades in only once the big logo band has scrolled away
    const mast = document.querySelector('.masthead');
    const hdr = document.querySelector('.site-header');
    let io: IntersectionObserver | null = null;
    if (mast && hdr && 'IntersectionObserver' in window) {
      io = new IntersectionObserver(([en]) => hdr.classList.toggle('mast-on', en.isIntersecting), { threshold: 0 });
      io.observe(mast);
    }
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    return () => { io?.disconnect(); document.removeEventListener('click', onClick); document.removeEventListener('keydown', onKey); };
  }, [path]);
  return null;
}

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
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('click', onClick); document.removeEventListener('keydown', onKey); };
  }, [path]);
  return null;
}

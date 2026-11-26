{
  const btn = document.querySelector('.menu-btn'), nav = document.getElementById('nav');
  if (btn && nav) btn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  // Home page: "What can we help you with?" picker
  const picks = document.querySelectorAll('[data-pick]');
  picks.forEach(b => b.addEventListener('click', () => {
    picks.forEach(x => x.setAttribute('aria-pressed', x === b ? 'true' : 'false'));
    document.querySelectorAll('[data-show]').forEach(d => { d.hidden = d.dataset.show !== b.dataset.pick; });
  }));

  // Nationwide: detection vs abatement tabs
  const tabs = document.querySelectorAll('[role=tab]');
  tabs.forEach(t => t.addEventListener('click', () => {
    tabs.forEach(x => {
      const on = x === t;
      x.setAttribute('aria-selected', on ? 'true' : 'false');
      const p = document.getElementById(x.getAttribute('aria-controls'));
      if (p) p.hidden = !on;
    });
  }));

  // SC counties search
  const q = document.getElementById('q'), list = document.getElementById('list');
  if (q && list) {
    const items = [...list.children], n = document.getElementById('n'), none = document.getElementById('none');
    q.addEventListener('input', () => {
      const v = q.value.trim().toLowerCase();
      let shown = 0;
      items.forEach(li => { const hit = !v || li.dataset.k.includes(v); li.hidden = !hit; if (hit) shown++; });
      n.textContent = shown;
      none.hidden = shown !== 0;
    });
  }
}

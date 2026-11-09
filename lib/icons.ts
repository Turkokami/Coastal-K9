// Small inline icon set (stroke icons, 24x24). Legacy Font Awesome names map onto these.
const check = '<path d="M20 6 9 17l-5-5"/>';
const circleCheck = '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>';
const pin = '<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>';
const arrow = '<path d="M5 12h14M13 6l6 6-6 6"/>';
const shield = '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/>';
const shieldCheck = shield + '<path d="m9 12 2 2 4-4"/>';
const paw = '<circle cx="7" cy="9" r="1.8"/><circle cx="12" cy="6.5" r="1.8"/><circle cx="17" cy="9" r="1.8"/><path d="M8 17c0-2.5 1.8-5 4-5s4 2.5 4 5c0 1.7-1.6 2.5-4 2.5S8 18.7 8 17z"/>';
const building = '<path d="M4 21V5l8-2v18M12 8h8v13M8 8h.01M8 12h.01M8 16h.01M16 12h.01M16 16h.01M2 21h20"/>';
const leaf = '<path d="M5 20c0-9 6-15 15-15 0 9-6 15-15 15zM5 20l7-7"/>';
const wrench = '<path d="M14.7 6.3a4 4 0 0 0 5 5L21 13l-8 8-3-3 8-8-1.3-1.3a4 4 0 0 1-5-5L14 5z"/>';
const clipboard = '<rect x="6" y="4" width="12" height="17" rx="2"/><path d="M9 4h6v3H9zM9 12l2 2 4-4"/>';
const bug = '<rect x="8" y="7" width="8" height="12" rx="4"/><path d="M12 7V4M8 11H4M8 15H4M16 11h4M16 15h4M9 4l1.5 2M15 4l-1.5 2"/>';
const bird = '<path d="M3 13c3 0 5-2 7-5 1.5-2 4-3 6-2l3 1-3 1c0 5-4 9-10 9l-3 2 1-4z"/>';
const search = '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/>';
const bed = '<path d="M3 18V7M3 13h18v5M21 18v-3a3 3 0 0 0-3-3h-7v1"/><circle cx="7" cy="10.5" r="1.5"/>';
const phone = '<path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z"/>';
const ext = '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>';
const cal = '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4M9 15l2 2 4-4"/>';
const award = '<circle cx="12" cy="9" r="5.5"/><path d="m8.5 13.5-1.5 7.5 5-3 5 3-1.5-7.5"/>';
const target = '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>';
const flag = '<path d="M5 21V4M5 4h12l-2 4 2 4H5"/>';
const news = '<rect x="3" y="5" width="18" height="15" rx="2"/><path d="M7 9h10M7 13h6M7 17h10"/>';
const diagram = '<rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="15" width="6" height="6" rx="1"/><rect x="15" y="3" width="6" height="6" rx="1"/><path d="M9 6h6M18 9v6"/>';
const mic = '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>';
const chart = '<path d="M3 3v18h18M7 15l4-4 3 3 6-7"/>';
const tag = '<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="7.5" r="1.3"/>';
const house = '<path d="M3 11 12 4l9 7M5 10v10h14V10"/><rect x="10" y="14" width="4" height="6"/>';
const star = '<path d="m12 3 2.8 5.8 6.2.9-4.5 4.4 1 6.2L12 17.4 6.5 20.3l1-6.2L3 9.7l6.2-.9z"/>';
const people = '<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M15 14.5c3 0 6 1.8 6 5"/>';
const video = '<rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3z"/>';
const ban = '<circle cx="12" cy="12" r="9"/><path d="m5.6 5.6 12.8 12.8"/>';
const file = '<path d="M14 3H6v18h12V7z"/><path d="M14 3v4h4M9 13h6M9 17h6"/>';
const globe = '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18"/>';
const tree = '<path d="M12 3 6 11h3l-4 6h14l-4-6h3zM12 17v4"/>';
const route = '<circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M8 19h8a3 3 0 0 0 0-6H8a3 3 0 0 1 0-6h8"/>';
const repeat = '<path d="M17 2l4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4M21 13v2a3 3 0 0 1-3 3H3"/>';
const layers = '<path d="m12 3 9 5-9 5-9-5zM3 13l9 5 9-5"/>';
const percent = '<path d="M19 5 5 19"/><circle cx="7" cy="7" r="2"/><circle cx="17" cy="17" r="2"/>';
const hat = '<path d="m2 9 10-5 10 5-10 5zM6 11v5c3 2 9 2 12 0v-5"/>';
const utensils = '<path d="M5 3v8a2 2 0 0 0 4 0V3M7 11v10M17 21V3c-2 0-4 3-4 7h4"/>';
const factory = '<path d="M3 21V10l6 4v-4l6 4V5h4v16zM3 21h18"/>';
const id = '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2"/><path d="M6 16c.6-1.5 1.7-2 3-2s2.4.5 3 2M14 10h4M14 14h3"/>';
const helmet = '<path d="M4 16a8 8 0 0 1 16 0v2H4zM12 8V5"/>';
const spray = '<rect x="7" y="9" width="8" height="12" rx="1"/><path d="M9 9V6h4v3M13 6h3M18 4l1-1M18 7h2M18 10l1 1"/>';
const city = '<path d="M3 21V9h6v12M9 21V4h8v17M17 21v-8h4v8M2 21h20"/>';
const bridge = '<path d="M2 18h20M4 18v-6M20 18v-6M2 12c4 0 6-4 10-4s6 4 10 4M8 18v-4M16 18v-4"/>';
const hammer = '<path d="m14 7 3-3 4 4-3 3zM14 7l-10 10 3 3 10-10"/>';

export const ICONS: Record<string, string> = {
  check, 'circle-check': circleCheck, 'location-dot': pin, 'map-location-dot': pin, 'location-crosshairs': target,
  'arrow-right': arrow, 'shield-halved': shield, 'file-shield': shieldCheck, 'shield-dog': shieldCheck, 'house-lock': house,
  dog: paw, paw, building, hotel: building, warehouse: building, hospital: building, industry: factory, leaf,
  'screwdriver-wrench': wrench, hammer, 'clipboard-check': clipboard, 'clipboard-list': clipboard, bug, bugs: bug, spider: bug,
  crow: bird, feather: bird, 'feather-pointed': bird, 'magnifying-glass': search, 'magnifying-glass-location': search,
  bed, phone, 'phone-volume': phone, 'arrow-up-right-from-square': ext, 'calendar-check': cal, award, certificate: award,
  bullseye: target, 'flag-usa': flag, newspaper: news, 'diagram-project': diagram, 'microphone-lines': mic, microphone: mic,
  'chart-line': chart, tag, star, 'people-group': people, 'chalkboard-user': people, video, ban, 'file-lines': file, globe,
  tree, route, repeat, 'layer-group': layers, percent, 'graduation-cap': hat, utensils, 'id-card': id, 'helmet-safety': helmet,
  'spray-can-sparkles': spray, city, bridge, 'house-chimney': house, 'house-chimney-crack': house, circle: target,
};

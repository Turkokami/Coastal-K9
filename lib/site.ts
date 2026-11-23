// Single source of truth for business facts (client-attested — see GUARDRAILS.md).
export const SITE = {
  url: 'https://ck9ps.com',
  name: 'Coastal K9 and Pest Solutions',
  shortName: 'Coastal K9',
  legalName: 'Coastal K9 and Pest Solutions',
  // Former name (rebrand). Shown in the footer, the About page and /ucpaws/, and as schema alternateName.
  formerName: 'Urban Canine Pest & Wildlife Solutions (UCPaWS)',
  alternateNames: ['Urban Canine Pest & Wildlife Solutions', 'Urban Canine Pest and Wildlife Solutions', 'UCPaWS'],
  renamePath: '/ucpaws/',
  tagline: 'Detection Before Treatment. Every Time.',
  phone: '803-226-3155',
  phoneHref: 'tel:+18032263155',
  email: 'Kim@ck9ps.com',
  address: { street: '320 Wendy Lane', city: 'Windsor', region: 'SC', zip: '29856', country: 'US' },
  hours: [
    { label: 'Mon–Fri', value: '8:00 AM – 6:00 PM', days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:00', closes: '18:00' },
    { label: 'Saturday', value: '8:00 AM – 4:00 PM', days: ['Saturday'], opens: '08:00', closes: '16:00' },
    { label: 'Sunday', value: 'Closed', days: [], opens: '', closes: '' },
  ],
  rating: { value: '5.0', count: '22+' },
  // Google reviews. Replace leaveReviewUrl with the Google Business Profile "Ask for reviews" link (g.page/r/...) when Kim sends it.
  readReviewsUrl: 'https://www.google.com/maps/search/?api=1&query=Coastal+K9+and+Pest+Solutions+Windsor+SC',
  leaveReviewUrl: 'https://www.google.com/maps/search/?api=1&query=Coastal+K9+and+Pest+Solutions+Windsor+SC',
  founder: {
    name: 'Kimberly Camera',
    jobTitle: 'Founder & Operations Field Director',
    url: '/about/',
    image: 'kim1',
    summary:
      'FEMA US&R-trained canine handler with 28+ years handling working dogs, 15 of them in detection; CPDA and ICRWDA certified; licensed pest control technician.',
    sameAs: ['https://www.linkedin.com/in/kimberly-camera-7bb49b259/'],
  },
  social: [
    { name: 'Facebook', url: 'https://www.facebook.com/kim.camera.386027' },
    { name: 'Instagram', url: 'https://www.instagram.com/ucpaws.k9.rodent.detection/' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/kimberly-camera-7bb49b259/' },
  ],
  credentials: [
    { abbr: 'CPDA', name: 'Canine Pest Detection Association', url: 'https://www.caninepestdetection.org/' },
    { abbr: 'ICRWDA', name: 'International Casino Resort Working Dogs Association', url: 'https://icrwda.org/' },
  ],
  logo: '/brand/logo.webp',
  areaServed: [
    'Aiken', 'North Augusta', 'Graniteville', 'Warrenville', 'New Ellenton', 'Beech Island', 'Jackson', 'Wagener', 'Windsor',
    'Salley', 'Edgefield', 'Trenton', 'Johnston', 'Barnwell', 'Williston', 'Blackville', 'Lexington', 'Cayce', 'West Columbia',
    'Columbia', 'Irmo', 'Batesburg-Leesville', 'Gilbert', 'Orangeburg', 'Augusta, GA', 'Martinez, GA', 'Evans, GA', 'Grovetown, GA',
    'Hephzibah, GA', 'Harlem, GA', 'Thomson, GA', 'Waynesboro, GA',
  ],
} as const;

export type NavItem = { label: string; href: string; children?: { label: string; href: string }[] };

export const NAV: NavItem[] = [
  {
    label: 'Residential', href: '/services/', children: [
      { label: 'K9 Bed Bug Detection', href: '/bed-bug-control/' },
      { label: 'Bed Bug Treatment', href: '/bed-bug-treatment/' },
      { label: 'K9 Rodent Detection', href: '/rodent-control/' },
      { label: 'Rat & Mouse Control', href: '/rat-mouse-control/' },
      { label: 'Repairs & Exclusion', href: '/repairs/' },
      { label: 'Rodent Smoke Testing', href: '/rodent-smoke-testing/' },
      { label: 'Canada Goose Management', href: '/goose-control/' },
      { label: 'Bird Control & Exclusion', href: '/bird-exclusion/' },
      { label: 'Integrated Pest Management', href: '/pest-control/' },
      { label: 'Spider Control', href: '/spider-control/' },
      { label: 'Cockroach Control', href: '/cockroach-control/' },
      { label: 'Mosquito Control (No Fogging)', href: '/mosquito-control/' },
      { label: 'Bat Removal & Exclusion', href: '/bat-removal/' },
      { label: 'All Services', href: '/services/' },
    ],
  },
  {
    label: 'Commercial', href: '/commercial-pest-control/', children: [
      { label: 'Commercial Programs', href: '/commercial-pest-control/' },
      { label: 'Hotels & Hospitality', href: '/hotels-hospitality-pest-control/' },
      { label: 'Multifamily & Property Mgmt', href: '/multifamily-property-management-pest-control/' },
      { label: 'Restaurants & Food Service', href: '/restaurant-food-service-pest-control/' },
      { label: 'Warehouses & Distribution', href: '/warehouse-distribution-pest-control/' },
      { label: 'Healthcare & Senior Living', href: '/healthcare-senior-living-pest-control/' },
      { label: 'Food Processing & Manufacturing', href: '/food-processing-manufacturing-pest-control/' },
      { label: 'Schools & Student Housing', href: '/schools-student-housing-pest-control/' },
      { label: 'HOAs, Golf Courses & Campuses', href: '/hoa-golf-course-goose-management/' },
      { label: 'Falconry Bird Abatement', href: '/falconry-bird-abatement/' },
    ],
  },
  {
    label: 'Nationwide Rodent', href: '/nationwide-k9-rodent-detection/', children: [
      { label: 'Nationwide K9 Rodent Detection', href: '/nationwide-k9-rodent-detection/' },
      { label: 'Food Processing Plants', href: '/nationwide-k9-rodent-detection/food-processing/' },
      { label: 'Agriculture & Grain', href: '/nationwide-k9-rodent-detection/agriculture-grain/' },
      { label: 'Norway Rat Burrow Mitigation', href: '/nationwide-k9-rodent-detection/norway-rat-burrow-mitigation/' },
      { label: 'Multi-Site Programs', href: '/nationwide-k9-rodent-detection/multi-site-programs/' },
      { label: 'Audit-Ready Documentation', href: '/nationwide-k9-rodent-detection/audit-documentation/' },
      { label: 'Independent K9 Detection', href: '/independent-canine-detection/' },
      { label: 'K9 Detection Accuracy', href: '/canine-scent-detection-accuracy/' },
    ],
  },
  {
    label: 'Offshore Oil Rigs', href: '/offshore-oil-rig-bed-bug-inspections/', children: [
      { label: 'Offshore & Oil Rig Inspections', href: '/offshore-oil-rig-bed-bug-inspections/' },
      { label: 'Credentials You Can Trust', href: '/awards-and-recognition/' },
    ],
  },
  {
    label: 'Service Areas', href: '/service-areas/', children: [
      { label: 'Aiken, SC', href: '/pest-control-aiken-south-carolina/' },
      { label: 'North Augusta, SC', href: '/pest-control-north-augusta-sc/' },
      { label: 'Graniteville, SC', href: '/pest-control-graniteville-sc/' },
      { label: 'Columbia, SC', href: '/columbia-sc-pest-control/' },
      { label: 'Lexington, SC', href: '/pest-control-lexington-sc/' },
      { label: 'West Columbia, SC', href: '/pest-control-west-columbia-sc/' },
      { label: 'Cayce, SC', href: '/pest-control-cayce-sc/' },
      { label: 'Irmo, SC', href: '/pest-control-irmo-sc/' },
      { label: 'Edgefield, SC', href: '/pest-control-edgefield-sc/' },
      { label: 'Augusta, GA', href: '/pest-control-augusta-ga/' },
      { label: 'Evans & Martinez, GA', href: '/pest-control-evans-ga/' },
      { label: 'All Service Areas', href: '/service-areas/' },
    ],
  },
  {
    label: 'About', href: '/about/', children: [
      { label: 'About Us', href: '/about/' },
      { label: 'Credentials You Can Trust', href: '/awards-and-recognition/' },
      { label: 'Media & Press', href: '/media-and-press/' },
      { label: 'Image Gallery', href: '/coastal-k9-image-gallery/' },
      { label: 'Video Library', href: '/k9-detection-video-library/' },
    ],
  },
  {
    label: 'Resources', href: '/coastal-k9-blog/', children: [
      { label: 'Blog', href: '/coastal-k9-blog/' },
      { label: 'Pest Library', href: '/pest-library/' },
      { label: 'Offers & Coupons', href: '/pest-control-coupons/' },
      { label: 'Contact', href: '/contact/' },
    ],
  },
];

export const FOOTER_GROUPS = [
  { title: 'Residential', links: NAV[0].children!.slice(0, 12) },
  { title: 'Commercial & Nationwide', links: [...NAV[1].children!.slice(1, 8), { label: 'Nationwide K9 Rodent Detection', href: '/nationwide-k9-rodent-detection/' }] },
  { title: 'Service Areas', links: NAV[4].children! },
  { title: 'Company', links: [...NAV[5].children!, ...NAV[6].children!] },
];

// Breadcrumb parent per page kind
export const KIND_PARENT: Record<string, { label: string; href: string } | null> = {
  service: { label: 'Services', href: '/services/' },
  commercial: { label: 'Commercial', href: '/commercial-pest-control/' },
  nationwide: { label: 'Nationwide Rodent', href: '/nationwide-k9-rodent-detection/' },
  'city-service': { label: 'Service Areas', href: '/service-areas/' },
  city: { label: 'Service Areas', href: '/service-areas/' },
  neighborhood: { label: 'Aiken', href: '/pest-control-aiken-south-carolina/' },
  pest: { label: 'Pest Library', href: '/pest-library/' },
  post: { label: 'Blog', href: '/coastal-k9-blog/' },
  rename: { label: 'About', href: '/about/' },
};

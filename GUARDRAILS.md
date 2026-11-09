# Guardrails — client-attested facts (Keystone v3 "client-attested standard")
Source: live ck9ps.com as published by the client, captured 2026-11-08. Not independently verified.

| Fact | Value | Where it renders |
|---|---|---|
| NAP | Coastal K9 & Pest Solutions, 320 Wendy Lane, Windsor, SC 29856, 803-226-3155, Kim@ck9ps.com | header, footer, contact, LocalBusiness schema |
| Hours | Mon–Fri 8–6, Sat 8–4, Sun closed | footer, contact, schema |
| Rating | 5.0 · 22+ reviews | header/hero badge only — NOT marked up as AggregateRating |
| Founder | Kimberly Camera — FEMA US&R canine handler, 28+ yrs K9 detection, NESDCA/WDDO/CPDA/ICRWDA, licensed technician | bylines, about, Person schema |
| Nationwide | "more than 15 companies" supported | homepage, nationwide pages |
| Socials | facebook.com/kim.camera.386027, instagram ucpaws.k9.rodent.detection, LinkedIn kimberly-camera-7bb49b259 | footer, sameAs |
| GTM | GTM-NMPGCW4 (from live site) | components/Analytics.tsx |

Excluded from the build on purpose: two images that look AI-generated presented as real scenes
(office reception, truck at house) and one photo of what appears to be a personal ID/document (IMG_0581).

## Service scope (confirmed by Kristofer, 8 Nov 2026)
| Service | In scope? | How the site says it |
|---|---|---|
| Wildlife removal + exclusion (raccoon, opossum, squirrel, armadillo; bat one-way exclusion) | Yes | Humane removal, then sealing entry points |
| Mosquito & tick treatment | Yes | Seasonal yard/perimeter treatment under IPM |
| Lawn pests — fire ants & moles | Yes | Whole-yard fire ant baiting; mole removal + grub treatment |
| Termites (treatment, bonds, CL-100 / wood infestation reports) | Subcontracted | "Coordinated through a licensed termite partner" — never claimed as in-house |

The legacy city/neighborhood pages said the opposite in ~69 places ("we do not offer mosquito programs or lawn work",
"we do not trap … a raccoon", "we do not subcontract termites"). Those sentences are rewritten at build time from
`content/scope-fixes.json` (applied to body text and FAQ answers before schema is generated).

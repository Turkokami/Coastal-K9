#!/usr/bin/env python3
"""Builds the new Coastal K9 and Pest Solutions website into ./site.

Every page is plain HTML with relative links, so the site works on Vercel,
on any static host, or opened straight from a folder.
Run:  python3 build.py
"""
import html, json, os, re

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'site')
PHONE = '803-226-3155'
TEL = 'tel:+18032263155'
EMAIL = 'kim@ck9ps.com'
NAME = 'Coastal K9 and Pest Solutions'

NAV = [
    ('Commercial', 'commercial/'),
    ('Residential', 'residential/'),
    ('Nationwide', 'nationwide/', [
        ('Rodent Detection', 'nationwide/rodent-detection/'),
        ('Rodent Abatement', 'nationwide/rodent-abatement/'),
        ('Rodent Exclusion', 'nationwide/rodent-exclusion/'),
        ('Rodent Control', 'nationwide/rodent-control/'),
    ]),
    ('Bed Bugs', 'bed-bugs/', [
        ('K9 Bed Bug Detection', 'bed-bugs/'),
        ('South Carolina Counties & Cities', 'bed-bugs/south-carolina/'),
        ('Bed Bug Treatment', 'bed-bug-treatment/'),
    ]),
    ('Bed Bug Treatment', 'bed-bug-treatment/'),
    ('Goose Management', 'goose-management/', [
        ('K9 Goose Management', 'goose-management/'),
        ('Nest Treatment', 'goose-management/nest-treatment/'),
    ]),
]

# ---------------------------------------------------------------- SC data
SC = [
    ('Abbeville', ['Abbeville', 'Due West']),
    ('Aiken', ['Aiken', 'North Augusta', 'Graniteville', 'New Ellenton', 'Wagener', 'Windsor']),
    ('Allendale', ['Allendale', 'Fairfax']),
    ('Anderson', ['Anderson', 'Belton', 'Honea Path', 'Williamston', 'Powdersville']),
    ('Bamberg', ['Bamberg', 'Denmark']),
    ('Barnwell', ['Barnwell', 'Blackville', 'Williston']),
    ('Beaufort', ['Beaufort', 'Hilton Head Island', 'Bluffton', 'Port Royal']),
    ('Berkeley', ['Goose Creek', 'Moncks Corner', 'Hanahan']),
    ('Calhoun', ['St. Matthews', 'Cameron']),
    ('Charleston', ['Charleston', 'North Charleston', 'Mount Pleasant', 'James Island', 'Johns Island']),
    ('Cherokee', ['Gaffney', 'Blacksburg']),
    ('Chester', ['Chester', 'Great Falls']),
    ('Chesterfield', ['Cheraw', 'Chesterfield', 'Pageland']),
    ('Clarendon', ['Manning', 'Summerton']),
    ('Colleton', ['Walterboro', 'Edisto Beach']),
    ('Darlington', ['Darlington', 'Hartsville', 'Lamar']),
    ('Dillon', ['Dillon', 'Latta']),
    ('Dorchester', ['Summerville', 'St. George', 'Ridgeville']),
    ('Edgefield', ['Edgefield', 'Johnston', 'Trenton']),
    ('Fairfield', ['Winnsboro', 'Ridgeway']),
    ('Florence', ['Florence', 'Lake City', 'Timmonsville']),
    ('Georgetown', ['Georgetown', 'Pawleys Island', 'Andrews']),
    ('Greenville', ['Greenville', 'Greer', 'Mauldin', 'Simpsonville', 'Fountain Inn', 'Travelers Rest']),
    ('Greenwood', ['Greenwood', 'Ninety Six']),
    ('Hampton', ['Hampton', 'Estill']),
    ('Horry', ['Myrtle Beach', 'Conway', 'North Myrtle Beach', 'Surfside Beach', 'Loris']),
    ('Jasper', ['Ridgeland', 'Hardeeville']),
    ('Kershaw', ['Camden', 'Elgin', 'Lugoff']),
    ('Lancaster', ['Lancaster', 'Indian Land']),
    ('Laurens', ['Laurens', 'Clinton']),
    ('Lee', ['Bishopville']),
    ('Lexington', ['Lexington', 'West Columbia', 'Cayce', 'Irmo', 'Batesburg-Leesville', 'Chapin']),
    ('McCormick', ['McCormick']),
    ('Marion', ['Marion', 'Mullins']),
    ('Marlboro', ['Bennettsville']),
    ('Newberry', ['Newberry', 'Prosperity']),
    ('Oconee', ['Seneca', 'Walhalla', 'Westminster']),
    ('Orangeburg', ['Orangeburg', 'Santee', 'Holly Hill']),
    ('Pickens', ['Easley', 'Clemson', 'Pickens', 'Liberty']),
    ('Richland', ['Columbia', 'Forest Acres', 'Blythewood']),
    ('Saluda', ['Saluda']),
    ('Spartanburg', ['Spartanburg', 'Boiling Springs', 'Duncan', 'Inman', 'Woodruff']),
    ('Sumter', ['Sumter']),
    ('Union', ['Union', 'Jonesville']),
    ('Williamsburg', ['Kingstree', 'Hemingway']),
    ('York', ['Rock Hill', 'Fort Mill', 'York', 'Tega Cay', 'Clover']),
]
assert len(SC) == 46

# ---------------------------------------------------------------- helpers
def rel(depth, href):
    return '../' * depth + href


def fix_links(body, depth):
    """Pages are written with site-root links like href="/nationwide/".
    Turn them into relative links so the site works from any folder."""
    def sub(m):
        attr, path = m.group(1), m.group(2)
        target = path.lstrip('/')
        if target == '':
            target = 'index.html'
        elif target.endswith('/'):
            target += 'index.html'
        return f'{attr}="{rel(depth, target)}"'
    return re.sub(r'(href|src)="(/[^"]*)"', sub, body)


def nav_html(depth, current):
    items = []
    for item in NAV:
        label, href = item[0], item[1]
        cur = ' aria-current="page"' if href == current else ''
        if len(item) == 3:
            subs = ''.join(f'<li><a href="/{h}">{l}</a></li>' for l, h in item[2])
            items.append(f'<li class="has-sub"><a href="/{href}"{cur}>{label}</a><ul>{subs}</ul></li>')
        else:
            items.append(f'<li><a href="/{href}"{cur}>{label}</a></li>')
    return '<ul class="menu">' + ''.join(items) + '</ul>'


def page(path, title, desc, hero, body, depth):
    head_title = f'{title} | {NAME}' if path else f'{NAME} | K9 Detection & Pest Solutions'
    doc = f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{html.escape(head_title)}</title>
<meta name="robots" content="noindex">
<meta name="description" content="{html.escape(desc)}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@600;800&family=Source+Sans+3:wght@400;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/site.css">
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="top">
  <div class="top-in">
    <a class="brand" href="/"><svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="19" fill="var(--accent)"/><path d="M11 25c2-6 5-9 9-9s7 3 9 9" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/><circle cx="14" cy="14" r="2.6" fill="#fff"/><circle cx="20" cy="11" r="2.6" fill="#fff"/><circle cx="26" cy="14" r="2.6" fill="#fff"/></svg><span>Coastal K9<small>and Pest Solutions</small></span></a>
    <button class="menu-btn" aria-expanded="false" aria-controls="nav">Menu</button>
    <nav id="nav" aria-label="Main">{nav_html(depth, path)}</nav>
    <a class="call" href="{TEL}">Call or text {PHONE}</a>
  </div>
</header>
<main id="main">
{hero}
{body}
</main>
<footer class="foot">
  <div class="foot-in">
    <div><strong>{NAME}</strong><br>320 Wendy Lane, Windsor, SC 29856<br><a href="{TEL}">{PHONE}</a> · call or text<br><a href="mailto:{EMAIL}">{EMAIL}</a></div>
    <div><strong>Services</strong><br><a href="/commercial/">Commercial</a><br><a href="/residential/">Residential</a><br><a href="/nationwide/">Nationwide rodent programs</a><br><a href="/bed-bugs/">K9 bed bug detection</a><br><a href="/bed-bug-treatment/">Bed bug treatment</a><br><a href="/goose-management/">Goose management</a></div>
    <div><strong>About us</strong><br>Family-owned and fully licensed in South Carolina. Certified K9 detection teams working across the state and nationwide.</div>
  </div>
  <p class="fine">© 2026 {NAME}</p>
</footer>
<script src="/assets/site.js"></script>
</body>
</html>
'''
    return fix_links(doc, depth)


def hero(eyebrow, h1, lead, img, alt, ctas=True, small=False):
    btns = f'<p class="ctas"><a class="btn" href="{TEL}">Call or text {PHONE}</a><a class="btn ghost" href="mailto:{EMAIL}">Email us</a></p>' if ctas else ''
    cls = 'hero small' if small else 'hero'
    return f'''<section class="{cls}">
  <div class="hero-txt">
    <p class="eyebrow">{eyebrow}</p>
    <h1>{h1}</h1>
    <p class="lead">{lead}</p>
    {btns}
  </div>
  <figure class="hero-pic"><img src="/img/{img}.webp" alt="{html.escape(alt)}" width="960" height="1280"><svg class="trail" viewBox="0 0 400 120" aria-hidden="true"><path d="M5 100 C 80 20, 160 120, 230 50 S 360 30, 395 10" fill="none" stroke="var(--accent)" stroke-width="4" stroke-dasharray="2 14" stroke-linecap="round"/></svg></figure>
</section>'''


def cta(title='Ready when you are', text='Call or text and we will tell you what we would do first.'):
    return f'<section class="band dark cta"><h2>{title}</h2><p>{text}</p><p><a class="btn" href="{TEL}">Call or text {PHONE}</a></p><p class="num">{PHONE} · {EMAIL}</p></section>'


def cards(items):
    out = ''.join(f'<a class="card" href="{h}"><h3>{t}</h3><p>{d}</p><span class="go">Learn more</span></a>' for t, d, h in items)
    return f'<div class="cards">{out}</div>'


def steps(items):
    out = ''.join(f'<li><h3>{t}</h3><p>{d}</p></li>' for t, d in items)
    return f'<ol class="steps">{out}</ol>'


def bullets(items):
    return '<ul class="ticks">' + ''.join(f'<li>{i}</li>' for i in items) + '</ul>'


def faq(items):
    return '<div class="faq">' + ''.join(f'<details><summary>{q}</summary><p>{a}</p></details>' for q, a in items) + '</div>'


RODENT_SUB = cards([
    ('Rodent detection', 'Certified dogs find active harborage, runways and entry points that traps and visual inspection miss.', '/nationwide/rodent-detection/'),
    ('Rodent abatement', 'Dogs that alert only on live animals, working with our team to remove rodents on site.', '/nationwide/rodent-abatement/'),
    ('Rodent exclusion', 'We seal the gaps rodents use, with materials they cannot chew through.', '/nationwide/rodent-exclusion/'),
    ('Rodent control', 'Trapping, monitoring and follow-up that clear what is inside while the building is sealed.', '/nationwide/rodent-control/'),
])

# ---------------------------------------------------------------- pages
PAGES = {}

PAGES[''] = dict(
    title='Home',
    desc='Certified K9 detection for rodents and bed bugs, bed bug treatment and humane goose management. Family-owned in Windsor, SC, working statewide and nationwide.',
    hero=hero('Family-owned · Windsor, South Carolina',
              'Our dogs find what others miss.',
              'Certified K9 teams for rodent and bed bug detection, backed by treatment, exclusion and humane goose management. Homes and businesses across South Carolina, and commercial programs nationwide.',
              'dog-insp', 'A Coastal K9 detection dog on an orange lead searching a stack of pallets'),
    body='''
<section class="band">
  <h2>What can we help you with?</h2>
  <p class="sub">Pick what you are dealing with and we will point you to the right service.</p>
  <div class="picker" role="group" aria-label="Choose a problem">
    <button type="button" data-pick="rodents" aria-pressed="true">Rats or mice</button>
    <button type="button" data-pick="bedbugs" aria-pressed="false">Bed bugs</button>
    <button type="button" data-pick="geese" aria-pressed="false">Canada geese</button>
    <button type="button" data-pick="facility" aria-pressed="false">A commercial facility</button>
  </div>
  <div class="pick-out" aria-live="polite">
    <div data-show="rodents"><h3>Rats or mice</h3><p>We start by finding where they live and how they get in. Our detection dogs map the activity, our abatement dogs work live animals, and our crew seals the building so they stay out.</p><p><a href="/nationwide/rodent-detection/">Rodent detection</a> · <a href="/nationwide/rodent-abatement/">Abatement</a> · <a href="/nationwide/rodent-exclusion/">Exclusion</a> · <a href="/nationwide/rodent-control/">Control</a></p></div>
    <div data-show="bedbugs" hidden><h3>Bed bugs</h3><p>A certified bed bug dog checks room by room and finds live bugs and eggs in places a visual check cannot reach. If we find them, we treat with heat, steam, conventional products or Aprehend, and a follow-up inspection is always included.</p><p><a href="/bed-bugs/">K9 bed bug detection</a> · <a href="/bed-bug-treatment/">Bed bug treatment</a> · <a href="/bed-bugs/south-carolina/">Find your county</a></p></div>
    <div data-show="geese" hidden><h3>Canada geese</h3><p>Trained herding dogs make your property feel unsafe to geese without harming a bird. In spring, nest treatment stops the flock from growing.</p><p><a href="/goose-management/">Goose management</a> · <a href="/goose-management/nest-treatment/">Nest treatment</a></p></div>
    <div data-show="facility" hidden><h3>A commercial facility</h3><p>Documented, audit-ready K9 detection for food processing, warehouses, hotels, apartments, restaurants and casinos, with programs that run across multiple sites nationwide.</p><p><a href="/commercial/">Commercial</a> · <a href="/nationwide/">Nationwide programs</a></p></div>
  </div>
</section>
<section class="band alt">
  <h2>Services</h2>
  ''' + cards([
        ('Commercial', 'Audit-ready detection and pest programs for food, hospitality, multifamily and industry.', '/commercial/'),
        ('Residential', 'Rodents, bed bugs and everyday pests, handled discreetly by a family company.', '/residential/'),
        ('Nationwide', 'K9 rodent detection, abatement, exclusion and control for facilities across the country.', '/nationwide/'),
        ('Bed bugs', 'Certified K9 bed bug detection across all 46 South Carolina counties.', '/bed-bugs/'),
        ('Bed bug treatment', 'Heat, steam, conventional and Aprehend treatment, with follow-up always included.', '/bed-bug-treatment/'),
        ('Goose management', 'Humane K9 goose hazing and spring nest treatment.', '/goose-management/'),
    ]) + '''
</section>
<section class="band split">
  <div>
    <h2>Why a dog?</h2>
    <p>A trained nose covers a room, a wall void or a warehouse aisle faster than any flashlight, and it does not depend on a rodent wandering into a trap or a bed bug showing itself. That means treatment goes exactly where the problem is, with less guesswork and fewer chemicals.</p>
    ''' + bullets(['Certified detection teams, with every handler certified through at least one K9 detection organization',
                   'Every alert confirmed by the handler and documented',
                   'Fully licensed South Carolina pest control company',
                   'Family-owned and operated']) + '''
  </div>
  <figure class="pic"><img src="/img/dogs-brush-search.webp" alt="Jack Russell terrier and golden retriever searching the brush" loading="lazy" width="960" height="1280"></figure>
</section>
''' + cta())

PAGES['commercial/'] = dict(
    title='Commercial',
    desc='Commercial K9 detection and pest management: documented, audit-ready programs for food processing, warehouses, hotels, multifamily, restaurants and casinos.',
    hero=hero('Commercial', 'Detection-first pest programs for businesses.',
              'Discreet, documented, audit-ready service built around your operation, from a single restaurant to multi-site facilities across the country.',
              'dog-insp2', 'A small detection dog checking a wall unit in a medical exam room', small=True),
    body='''
<section class="band">
  <h2>Industries we work in</h2>
  <div class="grid3">
    <div class="tile"><h3>Food processing & manufacturing</h3><p>Rodent detection that supports GFSI and AIB audits, with findings mapped against your device program.</p></div>
    <div class="tile"><h3>Warehouses & distribution</h3><p>Large-footprint rodent detection through product, racking and dock areas.</p></div>
    <div class="tile"><h3>Hotels & hospitality</h3><p>Quiet, guest-friendly K9 bed bug inspections that protect your reviews.</p></div>
    <div class="tile"><h3>Apartments & property management</h3><p>Unit-by-unit bed bug and rodent detection with a written report for every building.</p></div>
    <div class="tile"><h3>Restaurants & casinos</h3><p>Our dogs find how rodents are getting in, which is where most lasting fixes start.</p></div>
    <div class="tile"><h3>HOAs, golf courses & campuses</h3><p>Humane goose management with trained herding dogs.</p></div>
  </div>
</section>
<section class="band alt">
  <h2>How a commercial program works</h2>
  ''' + steps([
        ('Review', 'We look at your site, your current program and any audit findings before we arrive.'),
        ('K9 sweep', 'Our teams work interior and exterior systematically, including areas a technician cannot see into.'),
        ('Confirm and document', 'Every alert is confirmed by the handler, photographed and mapped.'),
        ('Fix the cause', 'Treatment, exclusion and follow-up target exactly what the dogs found.'),
    ]) + '''
</section>
<section class="band">
  <h2>Commercial services</h2>
  ''' + cards([
        ('Nationwide rodent programs', 'Detection, abatement, exclusion and control for facilities anywhere in the country.', '/nationwide/'),
        ('K9 bed bug detection', 'Room-by-room screening for hotels, apartments, offices and care settings.', '/bed-bugs/'),
        ('Bed bug treatment', 'Heat, steam, conventional and Aprehend, with follow-up inspections included.', '/bed-bug-treatment/'),
        ('Goose management', 'Humane hazing and nest treatment for grounds and ponds.', '/goose-management/'),
    ]) + '''
</section>
''' + cta('Tell us about your facility', 'Call or text and we will set up a site assessment.'))

PAGES['residential/'] = dict(
    title='Residential',
    desc='Residential K9 bed bug and rodent detection, bed bug treatment, rodent exclusion and general pest control from a family-owned South Carolina company.',
    hero=hero('Residential', 'Pest help for your home, from a family business.',
              'We know a pest problem at home is stressful and private. We arrive discreetly, find the source, fix it, and come back to make sure it worked.',
              'dogs-goldens', 'Two golden retrievers resting on the lawn', small=True),
    body='''
<section class="band">
  <h2>What we handle at home</h2>
  <div class="grid3">
    <div class="tile"><h3>Bed bugs</h3><p>A certified dog checks every room and finds live bugs and eggs. If they are there, we treat and follow up. <a href="/bed-bugs/">Bed bug detection</a></p></div>
    <div class="tile"><h3>Rats and mice</h3><p>We find where they live and how they get in, clear them out and seal the house. <a href="/nationwide/rodent-control/">Rodent control</a></p></div>
    <div class="tile"><h3>Sealing your home</h3><p>Our crew closes gaps around pipes, vents, rooflines and foundations with rodent-proof materials. <a href="/nationwide/rodent-exclusion/">Rodent exclusion</a></p></div>
    <div class="tile"><h3>Everyday pests</h3><p>General pest control for ants, spiders and cockroaches.</p></div>
    <div class="tile"><h3>Geese in the neighborhood</h3><p>Humane K9 goose management for HOAs and ponds. <a href="/goose-management/">Goose management</a></p></div>
    <div class="tile"><h3>Moving or buying</h3><p>A K9 bed bug check before you move furniture in gives you peace of mind.</p></div>
  </div>
</section>
<section class="band alt">
  <h2>What to expect</h2>
  ''' + steps([
        ('Call or text', 'Tell us what you are seeing. We will ask a few questions and set a time.'),
        ('Inspection', 'Our dog and technician find where the problem is, not just where you noticed it.'),
        ('Treatment and repair', 'We treat what we found and seal the way in.'),
        ('Follow-up', 'We come back to confirm the problem is gone.'),
    ]) + '''
</section>
''' + cta())

PAGES['nationwide/'] = dict(
    title='Nationwide Rodent Programs',
    desc='Nationwide K9 rodent programs: rodent detection, rodent abatement, rodent exclusion and rodent control for food processing, agriculture, warehouses and multi-site operators.',
    hero=hero('Nationwide · Commercial & industrial', 'Rodent programs that travel to you.',
              'Certified K9 teams for food processing, agriculture, warehousing and multi-site operators anywhere in the country. Four services that work together: detection, abatement, exclusion and control.',
              'dog-insp', 'A detection dog searching pallets in a warehouse', small=True),
    body='''
<section class="band">
  <h2>Four services, one program</h2>
  <p class="sub">Most rodent programs only catch what wanders into a device. Ours finds where rodents live, removes them, seals them out and keeps watch.</p>
  ''' + RODENT_SUB + '''
</section>
<section class="band alt">
  <h2>Two kinds of rodent dogs</h2>
  <div class="toggle" role="tablist" aria-label="Dog types">
    <button role="tab" id="t-det" aria-selected="true" aria-controls="p-det">Detection dogs</button>
    <button role="tab" id="t-aba" aria-selected="false" aria-controls="p-aba">Abatement dogs</button>
  </div>
  <div class="tabpanel" role="tabpanel" id="p-det" aria-labelledby="t-det"><p><strong>Detection dogs alert on all rodent activity, old and new.</strong> They show us the full picture: where rodents have been, where they travel and how they get into the building. That map guides exclusion and tells us where to set traps.</p></div>
  <div class="tabpanel" role="tabpanel" id="p-aba" aria-labelledby="t-aba" hidden><p><strong>Abatement dogs alert only on live animals.</strong> They focus our team on rodents that are there right now, so removal is fast and targeted.</p></div>
</section>
<section class="band">
  <h2>Who we work with</h2>
  ''' + bullets(['Food processing and manufacturing plants under GFSI and AIB audit',
                 'Agriculture, grain and feed facilities',
                 'Warehouses and distribution centers',
                 'Restaurants, hotels and casinos',
                 'Multi-site operators who need the same standard at every location',
                 'Pest control companies who bring us in as a K9 partner']) + '''
</section>
''' + cta('Plan a nationwide program', 'Call or text and we will scope a site assessment.'))

PAGES['nationwide/rodent-detection/'] = dict(
    title='Rodent Detection',
    desc='K9 rodent detection: certified dogs locate active harborage, runways, burrows and entry points, with every alert confirmed and documented. Nationwide.',
    hero=hero('Nationwide · Rodents', 'Rodent detection',
              'Certified detection dogs find active harborage, nesting, runways and entry points inside walls, under slabs, behind product and along the property line, where traps and flashlights cannot reach.',
              'dogs-malinois-trail', 'Belgian Malinois detection dog on a wooded trail', small=True),
    body='''
<section class="band split">
  <div>
    <h2>Why detection comes first</h2>
    <p>Traps and bait stations only record a rodent after it is caught. A detection dog shows where rodents are living and how they are getting in, so every step after that is aimed at the cause.</p>
    <p>Our detection dogs alert on all activity, old and new, which gives us the full history of a site. That is a big part of why our work in restaurants, casinos and food plants holds: the dogs find the way in.</p>
  </div>
  <div class="tile"><h3>What you receive</h3>''' + bullets(['A map of confirmed activity and likely entry points',
                                                         'Photos of what was found at each alert',
                                                         'Findings set against your existing device map',
                                                         'Clear recommendations for exclusion and control']) + '''</div>
</section>
<section class="band alt">
  <h2>On site</h2>
  ''' + steps([
        ('Pre-visit review', 'We study your device map, recent trend data and any open audit items.'),
        ('Canine sweep', 'Interior, exterior, production and non-production areas, voids, utility penetrations and the property line.'),
        ('Handler confirmation', 'Each alert is confirmed and documented. Anything unconfirmed is logged as unconfirmed, not counted.'),
        ('Report', 'A written report you can hand to an auditor.'),
    ]) + '''
</section>
<section class="band"><h2>Related rodent services</h2>''' + RODENT_SUB + '</section>' + cta())

PAGES['nationwide/rodent-abatement/'] = dict(
    title='Rodent Abatement',
    desc='K9 rodent abatement: abatement dogs alert only on live rodents and work with our team to remove them on site, for facilities nationwide.',
    hero=hero('Nationwide · Rodents', 'Rodent abatement',
              'Our abatement dogs alert only on live animals. Working alongside our team, they put direct pressure on an active population so rodents are removed quickly and on the spot.',
              'rats', 'Rats removed from an apartment property by a Coastal K9 abatement team', small=True),
    body='''
<section class="band split">
  <div>
    <h2>When abatement fits</h2>
    <p>Abatement is for sites with heavy, active populations: apartment grounds with roof rats, Norway rat burrow systems around a facility, farms and barns, and outdoor areas where trapping alone cannot keep up.</p>
    <p>Because these dogs alert only on live animals, our team spends its time where rodents are right now. Detection tells us the full history; abatement deals with today.</p>
  </div>
  <div class="tile"><h3>How our dogs are raised</h3><p>Our rodent dogs start as puppies with barn hunt work, nose work and exposure to all kinds of environments, alongside everyday family skills. Responsibilities are added as they mature. We choose well-rounded dogs, not overly aggressive ones.</p></div>
</section>
<section class="band alt">
  <h2>What abatement includes</h2>
  ''' + steps([
        ('Assessment', 'We look at burrows, runways and harborage to plan the work.'),
        ('K9 abatement', 'Dogs and handlers work the active areas and remove rodents on site.'),
        ('Seal and trap', 'Exclusion and trapping keep numbers down after the visit.'),
        ('Return visits', 'We come back on a schedule until activity stops.'),
    ]) + '''
</section>
<section class="band"><h2>Related rodent services</h2>''' + RODENT_SUB + '</section>' + cta())

PAGES['nationwide/rodent-exclusion/'] = dict(
    title='Rodent Exclusion',
    desc='Rodent exclusion: we find and seal the gaps rodents use with steel mesh, hardware cloth, metal and concrete work, for homes and facilities.',
    hero=hero('Nationwide · Rodents', 'Rodent exclusion',
              'A mouse fits through a gap about a quarter inch wide, and a rat through about a half inch. Exclusion closes those gaps for good, so the rodents you remove are not replaced next season.',
              'dogs-beagle-smile', 'A happy beagle sitting in the woods', small=True),
    body='''
<section class="band split">
  <div>
    <h2>The step that makes it last</h2>
    <p>Trapping and baiting deal with the rodents already inside. Leave the way in open and you pay for the same problem every year. Our detection dogs show us where rodents travel, and our crew seals those points to a standard rodents cannot chew through.</p>
    <p>Our exclusion crew includes metal work and concrete specialists, and our handlers have OSHA fall protection training for lift work on large buildings.</p>
  </div>
  <div class="tile"><h3>What we seal</h3>''' + bullets(['Foundation gaps and cracks',
                                                     'Pipe, wire and utility penetrations',
                                                     'Rooflines, soffits and vents',
                                                     'Crawl space access and vent screens',
                                                     'Garage and dock door gaps',
                                                     'Dryer and exhaust vents']) + '''</div>
</section>
<section class="band alt">
  <h2>How exclusion works</h2>
  ''' + steps([
        ('Find', 'Dogs and technicians locate every active entry point.'),
        ('Seal', 'Steel mesh, hardware cloth, sheet metal, concrete and durable sealants, chosen for each opening.'),
        ('Repair', 'We fix damage rodents leave behind.'),
        ('Verify', 'We check the seal holds and activity has stopped.'),
    ]) + '''
</section>
<section class="band"><h2>Related rodent services</h2>''' + RODENT_SUB + '</section>' + cta())

PAGES['nationwide/rodent-control/'] = dict(
    title='Rodent Control',
    desc='Rodent control: targeted trapping, monitoring and follow-up guided by K9 detection, with minimal rodenticide, for homes and facilities.',
    hero=hero('Nationwide · Rodents', 'Rodent control',
              'Rodent control clears what is already inside while the building is being sealed. We place every trap where the dogs found activity, so control is fast, targeted and uses as little poison as possible.',
              'kim-rats-4', 'Detection dogs with rats removed from a site', small=True),
    body='''
<section class="band split">
  <div>
    <h2>Targeted, not scattered</h2>
    <p>Scattering bait and hoping is how rodents end up dying inside walls. We set traps on the runways the dogs mapped, check them on a schedule and adjust as activity moves.</p>
    <p>For mice we prefer unbaited snap traps set on runways. Rodenticide is used only where it is truly needed, which protects pets and wildlife from secondary poisoning.</p>
  </div>
  <div class="tile"><h3>Signs you need rodent control</h3>''' + bullets(['Droppings along walls, in cabinets or pantries',
                                                                   'Gnaw marks on wood, wiring or packaging',
                                                                   'Scratching in walls or ceilings at night',
                                                                   'Greasy rub marks along baseboards',
                                                                   'Nests of shredded paper or insulation',
                                                                   'A musky, ammonia-like smell']) + '''</div>
</section>
<section class="band alt">
  <h2>A control program</h2>
  ''' + steps([
        ('Detect', 'Dogs show where rodents live and travel.'),
        ('Trap and monitor', 'Traps and stations go exactly where activity is.'),
        ('Exclude', 'We seal the way in at the same time.'),
        ('Follow up', 'We keep checking until the building stays clear.'),
    ]) + '''
</section>
<section class="band"><h2>Related rodent services</h2>''' + RODENT_SUB + '</section>' + cta())

PAGES['bed-bugs/'] = dict(
    title='K9 Bed Bug Detection',
    desc='Certified K9 bed bug detection for homes, apartments, hotels and businesses across all 46 South Carolina counties. Discreet, fast and accurate.',
    hero=hero('Bed bugs · South Carolina', 'K9 bed bug detection',
              'Our certified detection dogs find live bed bugs and eggs room by room, including in wall voids, behind outlets and under carpet edges, where a visual check cannot reach.',
              'bed-bugs-jar', 'Live bed bugs, eggs and fecal spots in a training vial', small=True),
    body='''
<section class="band split">
  <div>
    <h2>Signs of bed bugs</h2>
    ''' + bullets(['Small rusty or dark spots on sheets, mattress seams or the box spring',
                   'Itchy welts in a line or cluster that appear overnight',
                   'Tiny pale eggs or shed skins in mattress piping, headboards and baseboards',
                   'A faint, sweet, musty smell in a room',
                   'Bites that keep coming back after you have washed everything']) + '''
    <p>Any one of these is reason enough for an inspection.</p>
  </div>
  <figure class="pic"><img src="/img/bed-bug-signs.webp" alt="Bed bug signs: fecal spots, cast skins, a live adult in a mattress zipper and a freshly fed nymph" loading="lazy" width="960" height="1132"></figure>
</section>
<section class="band alt">
  <h2>Who we inspect for</h2>
  <div class="grid3">
    <div class="tile"><h3>Homes</h3><p>Discreet visits for worried families, and checks before you move furniture in.</p></div>
    <div class="tile"><h3>Apartments</h3><p>Unit-by-unit screening with a written report for property managers.</p></div>
    <div class="tile"><h3>Hotels</h3><p>Quiet room checks that protect guests and reviews.</p></div>
    <div class="tile"><h3>Offices, schools & care settings</h3><p>Fast screening with little disruption.</p></div>
    <div class="tile"><h3>Theaters & public spaces</h3><p>Seat-by-seat searches.</p></div>
    <div class="tile"><h3>Offshore crews</h3><p>Searches of bags, buses, helicopters and crew housing.</p></div>
  </div>
</section>
<section class="band">
  <h2>Statewide coverage</h2>
  <p>We inspect in every South Carolina county, from the Upstate to the coast. <a href="/bed-bugs/south-carolina/">Find your county and city</a>.</p>
  <p>Found bed bugs? See <a href="/bed-bug-treatment/">bed bug treatment</a>.</p>
</section>
''' + cta('Book a K9 bed bug inspection', 'Call or text and we will set up a discreet visit.'))

# SC page with interactive search
county_rows = ''.join(
    f'<li data-k="{html.escape((c + " " + " ".join(cs)).lower())}"><h3>{c} County</h3><p>{", ".join(cs)}</p></li>'
    for c, cs in SC)
PAGES['bed-bugs/south-carolina/'] = dict(
    title='Bed Bug Detection in South Carolina',
    desc='K9 bed bug detection in all 46 South Carolina counties, including Columbia, Charleston, Greenville, Aiken, Myrtle Beach, Rock Hill, Spartanburg and more.',
    hero=hero('Bed bugs · All 46 counties', 'Bed bug detection across South Carolina',
              'Our certified K9 teams inspect homes, apartments, hotels and businesses in every county in the state. Search for your county or city below.',
              'dogs-brush-search', 'Jack Russell terrier and golden retriever searching the brush', small=True),
    body=f'''
<section class="band">
  <label class="search-l" for="q">Search your county or city</label>
  <input id="q" class="search" type="search" placeholder="Try Columbia, Horry or Rock Hill" autocomplete="off">
  <p class="count" aria-live="polite"><span id="n">46</span> counties shown</p>
  <ul class="counties" id="list">{county_rows}</ul>
  <p class="empty" id="none" hidden>No match. We still cover every county in South Carolina, so call or text {PHONE}.</p>
</section>
''' + cta('Bed bugs in your county?', 'Call or text and tell us where you are.'))

PAGES['bed-bug-treatment/'] = dict(
    title='Bed Bug Treatment',
    desc='Bed bug treatment with heat, steam, conventional products and Aprehend, with a follow-up inspection always included. Homes and businesses in South Carolina.',
    hero=hero('Bed bugs · Treatment', 'Bed bug treatment that gets the eggs.',
              'Killing adult bed bugs is the easy part. Treatment works when the eggs die too, so we match the method to the job and always confirm it worked with a follow-up inspection.',
              'bed-bug-signs', 'Bed bug signs in a mattress zipper', small=True),
    body='''
<section class="band">
  <h2>Treatment methods</h2>
  <div class="grid3">
    <div class="tile"><h3>Heat</h3><p>Rooms are brought up to temperature and held there. Adults die quickly, but eggs need about 118°F held for well over an hour, so we monitor temperatures throughout.</p></div>
    <div class="tile"><h3>Steam</h3><p>High-temperature steam on seams, furniture joints, baseboards and cracks kills bugs and eggs on contact, without chemicals.</p></div>
    <div class="tile"><h3>Conventional treatment</h3><p>Targeted products applied where bugs hide, chosen with resistance in mind. Many bed bugs resist the sprays sold in stores.</p></div>
    <div class="tile"><h3>Aprehend</h3><p>A biological treatment that bed bugs pick up as they walk across it and carry back to where they hide.</p></div>
  </div>
</section>
<section class="band alt">
  <h2>How a treatment runs</h2>
  ''' + steps([
        ('Confirm', 'A K9 or technician inspection confirms bed bugs and shows exactly which rooms are affected.'),
        ('Prepare', 'We tell you exactly what to do before treatment. For apartment residents who cannot do it themselves, we offer prep service.'),
        ('Treat', 'Heat, steam, conventional, Aprehend or a combination, chosen for your space.'),
        ('Follow up', 'A follow-up inspection is always included, about two weeks later, to make sure nothing hatched.'),
    ]) + '''
</section>
<section class="band">
  <h2>Questions</h2>
  ''' + faq([
        ('Why is a follow-up included?', 'A single missed egg can restart an infestation in about five weeks. Checking again is the only way to know a treatment worked.'),
        ('Do bug bombs or store sprays work?', 'Usually not. Most bed bug populations carry resistance to common store products, and foggers do not reach where bed bugs hide.'),
        ('Where do you treat?', 'Homes, apartments, hotels and businesses across South Carolina, including Columbia, Greenville and Charleston.'),
    ]) + '''
</section>
''' + cta('Get rid of bed bugs', 'Call or text and we will plan your treatment.'))

PAGES['goose-management/'] = dict(
    title='Goose Management',
    desc='Humane Canada goose management with trained herding dogs for HOAs, golf courses, parks, schools and commercial properties, plus spring nest treatment.',
    hero=hero('Geese · Humane', 'Goose management with working dogs',
              'Trained herding dogs make your property feel unsafe to Canada geese, the way a natural predator would, without ever harming a bird.',
              'goose', 'A Coastal K9 border collie goose dog at the edge of a pond', small=True),
    body='''
<section class="band split">
  <div>
    <h2>Why geese stay</h2>
    <p>Resident Canada geese no longer migrate. A pond with short grass and clear sightlines is perfect for them, and they return to the same nesting spots year after year. Each goose leaves one to two pounds of droppings a day on walkways, docks and lawns, and nesting geese will charge people.</p>
    <p>Decoys and noise makers stop working within days because geese learn they are harmless. A dog moving with purpose is a real predator to a goose, and they never get used to it.</p>
  </div>
  <figure class="pic"><img src="/img/goose.webp" alt="A Coastal K9 border collie goose dog at the edge of a pond" loading="lazy" width="960" height="1280"></figure>
</section>
<section class="band alt">
  <h2>How it works</h2>
  ''' + steps([
        ('Assessment', 'We map where geese land, feed and nest on your property.'),
        ('K9 hazing', 'Trained dogs move the flock along humanely.'),
        ('Consistency', 'Repeat visits break the habit so geese stop coming back.'),
        ('Maintenance', 'An ongoing program keeps the property clear season after season.'),
    ]) + '''
</section>
<section class="band">
  <h2>Stop the flock from growing</h2>
  <p>Hazing moves geese along. In spring, <a href="/goose-management/nest-treatment/">nest treatment</a> keeps new goslings from hatching on your property, so next year's flock is not bigger than this year's.</p>
  <p>We work with HOAs, golf courses, parks, schools, corporate campuses and commercial properties.</p>
</section>
''' + cta('Take back your grounds', 'Call or text and we will assess your property.'))

PAGES['goose-management/nest-treatment/'] = dict(
    title='Goose Nest Treatment',
    desc='Humane Canada goose nest treatment in spring to stop flock growth, done under the required federal registration, paired with K9 goose management.',
    hero=hero('Geese · Spring', 'Goose nest treatment',
              'Geese return to where they hatched and raised young. Treating nests in spring stops new goslings, so your flock stops growing and the property becomes less attractive year after year.',
              'goose', 'A border collie goose dog watching the water', small=True),
    body='''
<section class="band split">
  <div>
    <h2>What nest treatment is</h2>
    <p>During nesting season we locate goose nests on your property and treat the eggs so they do not hatch. The adults keep sitting on the nest instead of laying again, which is why this works better than removing a nest.</p>
    <p>Canada geese are federally protected. Nest and egg treatment must be done under the U.S. Fish and Wildlife Service registration for resident Canada geese, and we help you complete it before any work begins.</p>
  </div>
  <div class="tile"><h3>Why it matters</h3>''' + bullets(['Stops the flock from growing each year',
                                                       'Fewer goslings means fewer geese that learn your pond is home',
                                                       'Fewer aggressive nesting geese near walkways',
                                                       'Works hand in hand with K9 hazing']) + '''</div>
</section>
<section class="band alt">
  <h2>How the season runs</h2>
  ''' + steps([
        ('Before nesting', 'We complete the federal registration with you and map likely nest sites.'),
        ('Nest search', 'We find nests early in the season.'),
        ('Treatment', 'Eggs are treated humanely and each nest is logged.'),
        ('Follow-up', 'We check back through the season and continue K9 hazing.'),
    ]) + '''
</section>
<section class="band"><p>See also: <a href="/goose-management/">K9 goose management</a>.</p></section>
''' + cta('Plan your nesting season', 'Call or text before spring to get on the schedule.'))


def write(path, html_text):
    full = os.path.join(OUT, path, 'index.html') if path else os.path.join(OUT, 'index.html')
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, 'w') as f:
        f.write(html_text)


for path, p in PAGES.items():
    depth = path.count('/')
    write(path, page(path, p['title'], p['desc'], p['hero'], p['body'], depth))

# sitemap + robots for Search Console
base = 'https://ck9ps.com/'
urls = ''.join(f'<url><loc>{base}{p}</loc></url>' for p in PAGES)
open(os.path.join(OUT, 'sitemap.xml'), 'w').write(
    f'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">{urls}</urlset>')
open(os.path.join(OUT, 'robots.txt'), 'w').write(f'User-agent: *\nAllow: /\nSitemap: {base}sitemap.xml\n')
print('built', len(PAGES), 'pages')

#!/usr/bin/env python3
"""Generate the Georgia service-area pages (client confirmed GA coverage, Nov 2026).
Facts are limited to well-documented public ones, with sources listed on each page."""
import json
from pathlib import Path
OUT = Path(__file__).resolve().parent.parent / 'content/new-pages'

SERVICES = '''<ul class="ck9s-svclist">
<li><a href="/bed-bug-control/">K9 bed bug detection</a> and <a href="/bed-bug-treatment/">bed bug treatment</a> for homes, rentals, hotels and senior living</li>
<li><a href="/rodent-control/">K9 rodent detection</a>, <a href="/rat-mouse-control/">rat and mouse control</a> and Norway rat burrow work</li>
<li><a href="/repairs/">Exclusion and repairs</a>, plus humane wildlife removal — raccoons, opossums, squirrels, armadillos and bats</li>
<li><a href="/goose-control/">Canada goose management</a> with working dogs and <a href="/bird-exclusion/">bird control and exclusion</a></li>
<li><a href="/pest-control/">General pest control</a>: ants and fire ants, cockroaches, spiders, stinging insects, mosquitoes, ticks and moles</li>
<li><a href="/commercial-pest-control/">Commercial programs</a> for restaurants, warehouses, healthcare, schools and multifamily</li>
</ul>
<p>Termite treatment, bonds and wood infestation reports are not done in-house; we coordinate them through a licensed termite partner.</p>'''

GA_RULES = '''<h2>Who regulates pest control on the Georgia side?</h2>
<p>Crossing the Savannah River changes the rulebook. In South Carolina, structural pest control is licensed through Clemson University's Department of Pesticide Regulation; in Georgia it runs through the <a href="https://agr.georgia.gov/licensing-certification-and-employee-registration">Georgia Department of Agriculture's Structural Pest Control program</a> and the Structural Pest Control Commission. Our Georgia work is done under Georgia credentials, and you can ask any company — us included — to show its Georgia company license before work starts.</p>'''

TOWNS = [
 dict(slug='augusta', name='Augusta', county='Richmond County', eyebrow='AUGUSTA, GEORGIA · K9 DETECTION & PEST CONTROL',
  lead='Certified K9 bed bug and rodent detection, wildlife exclusion, goose management and general pest control across Augusta — from downtown and the Medical District to Summerville, West Augusta and south Richmond County.',
  intro='<p>Augusta is the hub of the CSRA, and the pest pressure here follows the city’s shape. A consolidated city-county government since 1996, it stretches from the historic downtown on the Savannah River out to suburban neighborhoods and Fort Eisenhower’s edge. That means three very different jobs: older brick and frame buildings near the river and the Augusta Canal, a large hospital and university district, and post-war and newer subdivisions to the west and south.</p>',
  local='''<h2>What drives pest problems in Augusta?</h2>
<p><strong>The river and the canal.</strong> The Augusta Canal and the Savannah River corridor give Norway rats exactly what they need — soft banks, storm drains and food from the restaurants and dumpsters of downtown and Broad Street. Burrow systems under dumpster pads and along retaining walls are the source of most of the rats people see inside. Our detection dogs map which burrows are active before anything is treated.</p>
<p><strong>Travel and turnover.</strong> Augusta fills up every April for the Masters, and the city sees steady traffic from the medical campuses, Fort Eisenhower moves and apartment turnover the rest of the year. All of that moves bed bugs. A certified canine screen tells a hotel manager, landlord or homeowner exactly which rooms have live activity, so treatment goes where it is needed.</p>
<p><strong>Older housing stock.</strong> Neighborhoods such as Summerville, Harrisburg and the areas around downtown have crawlspaces, old foundations and mature trees — roof rats on the rooflines, squirrels in attics and American cockroaches coming up from crawlspaces and drains.</p>''',
  faqs=[('Do you serve all of Augusta-Richmond County?','Yes — from downtown and the Medical District out to West Augusta, south Augusta and Hephzibah. Call to confirm scheduling for your address.'),
        ('Can you inspect a hotel or apartment building before a big event?','Yes. Pre-event and between-guest K9 screens let hotels and property managers clear rooms before guests arrive, and pinpoint any that need treatment.')],
  near=['martinez','evans','hephzibah','grovetown'],
  sources=[('https://www.georgiaencyclopedia.org/articles/counties-cities-neighborhoods/richmond-county/','New Georgia Encyclopedia — Richmond County'),('https://en.wikipedia.org/wiki/Richmond_County,_Georgia','Richmond County, Georgia (overview)')]),
 dict(slug='martinez', name='Martinez', county='Columbia County', eyebrow='MARTINEZ, GEORGIA · K9 DETECTION & PEST CONTROL',
  lead='K9 bed bug and rodent detection, exclusion, wildlife removal, goose management and general pest control for Martinez homes, HOAs and businesses in Columbia County.',
  intro='<p>Martinez is the established side of Columbia County: an unincorporated community just west of Augusta, built out largely from the 1970s onward along Washington Road and the neighborhoods around it. Mature trees, wooded lots, golf communities and the Savannah River and canal headwaters nearby shape the pest problems here.</p>',
  local='''<h2>What drives pest problems in Martinez?</h2>
<p><strong>Mature canopy.</strong> Decades-old oaks and pines give roof rats and gray squirrels a highway onto rooflines. Attic noise is the classic sign — the fix is the roofline and the limbs, plus sealing every entry once the animals are out.</p>
<p><strong>Water and lawns.</strong> Neighborhood ponds, golf courses and open lawns near the river draw resident Canada geese. Our dogs move geese off HOA ponds and common areas without harming them, timed around nesting season.</p>
<p><strong>Aging construction.</strong> Homes from the 1970s and 1980s often have crawlspaces, settled slabs and worn door sweeps — easy entry for mice, American cockroaches and moisture pests like silverfish.</p>''',
  faqs=[('Do you handle geese for Martinez HOAs?','Yes. We run scheduled dog hazing on HOA ponds and common areas, with more frequent visits around spring nesting.'),
        ('Is Martinez part of Augusta?','No — Martinez is an unincorporated community in Columbia County, though it borders Augusta. We cover both.')],
  near=['evans','augusta','grovetown','harlem'],
  sources=[('https://en.wikipedia.org/wiki/Martinez,_Georgia','Martinez, Georgia (overview)')]),
 dict(slug='evans', name='Evans', county='Columbia County', eyebrow='EVANS, GEORGIA · K9 DETECTION & PEST CONTROL',
  lead='Certified K9 detection, rodent and wildlife exclusion, Canada goose management and general pest control for Evans neighborhoods, HOAs and businesses.',
  intro='<p>Evans is one of the fastest-growing parts of the Augusta area — an unincorporated Columbia County community of newer subdivisions, golf neighborhoods, schools and retail around Evans Towne Center. New construction and lots carved out of woods and farmland bring their own pest pattern.</p>',
  local='''<h2>What drives pest problems in Evans?</h2>
<p><strong>Building into habitat.</strong> When woods and fields become subdivisions, the rodents, fire ants, armadillos and moles that lived there don’t leave — they move to the new lawns and foundations. Fire ant mounds in fresh sod and armadillo rooting in new beds are typical in new subdivisions; both are handled across the whole yard, not one hole at a time.</p>
<p><strong>Ponds and golf communities.</strong> Stormwater ponds and courses throughout Evans attract resident Canada geese, and nesting pairs can make common areas unusable in spring. Dog hazing moves them on humanely.</p>
<p><strong>Families and pets.</strong> Ticks and mosquitoes along wooded edges and stormwater ponds are a common summer problem in Evans. Seasonal yard treatments plus removing standing water make the yard usable again.</p>''',
  faqs=[('Why do new Evans homes get pests?','New construction disturbs the habitat around it, and gaps around utilities, garage doors and slabs are often left unsealed. Exclusion work early saves trouble later.'),
        ('Do you treat fire ants across the whole yard?','Yes — broadcast baiting across the property plus direct treatment of mounds near play areas and doors.')],
  near=['martinez','grovetown','harlem','augusta'],
  sources=[('https://en.wikipedia.org/wiki/Evans,_Georgia','Evans, Georgia (overview)')]),
 dict(slug='grovetown', name='Grovetown', county='Columbia County', eyebrow='GROVETOWN, GEORGIA · K9 DETECTION & PEST CONTROL',
  lead='K9 bed bug and rodent detection, exclusion, wildlife removal and general pest control for Grovetown homes, rentals and military families near Fort Eisenhower.',
  intro='<p>Grovetown is a small city in Columbia County that has grown fast alongside Fort Eisenhower (formerly Fort Gordon). Much of the housing is newer subdivisions and rentals, with a lot of families moving in and out on military orders — which shapes the pest problems here.</p>',
  local='''<h2>What drives pest problems in Grovetown?</h2>
<p><strong>Moves and turnover.</strong> Households arriving and leaving on PCS orders, plus rental turnover, move furniture and luggage — the way bed bugs travel. A K9 screen before you move in, or before you hand back keys, gives a clear answer room by room.</p>
<p><strong>New construction on the edge of woods.</strong> Subdivisions backing onto pine woods see mice in garages, fire ants in new lawns, ticks along the tree line and occasional wildlife under decks and in crawlspaces.</p>
<p><strong>Summer pressure.</strong> Stormwater ponds and shaded yards breed Asian tiger mosquitoes; seasonal treatment and dumping standing water weekly keep them down.</p>''',
  faqs=[('Can you inspect a rental for bed bugs before we move in?','Yes. A certified canine screen of a house or apartment is fast and gives you a room-by-room answer before your furniture arrives.'),
        ('Do you serve homes near Fort Eisenhower?','Yes — Grovetown and the surrounding Columbia County neighborhoods.')],
  near=['evans','martinez','augusta','harlem'],
  sources=[('https://www.wikipedia.org/wiki/Grovetown','Grovetown, Georgia (overview)')]),
 dict(slug='hephzibah', name='Hephzibah', county='Richmond County', eyebrow='HEPHZIBAH, GEORGIA · K9 DETECTION & PEST CONTROL',
  lead='Rodent detection and exclusion, wildlife removal, K9 bed bug screening and general pest control for Hephzibah and south Richmond County.',
  intro='<p>Hephzibah is a small city in southern Richmond County, with a more rural feel than the rest of Augusta — larger lots, wooded land, farm and outbuildings, and homes on crawlspaces and piers mixed with newer subdivisions.</p>',
  local='''<h2>What drives pest problems in Hephzibah?</h2>
<p><strong>Outbuildings and feed.</strong> Barns, sheds, feed rooms and workshops are where rats and mice build up. Our detection dogs find active harborage in hay, walls and stored equipment so trapping and sealing go to the right places.</p>
<p><strong>Wildlife at the edge of the woods.</strong> Raccoons, opossums and armadillos den under decks, porches and sheds. We remove them humanely and close the space so it can’t be reused.</p>
<p><strong>Widows and woodpiles.</strong> Black widows favor woodpiles, meter boxes and outbuildings; web and egg-sac removal plus clearing harborage keeps them away from where people reach.</p>''',
  faqs=[('Do you work on farms and rural properties?','Yes — barns, feed rooms, workshops and outbuildings are a big part of our rodent and wildlife work.'),
        ('Is Hephzibah part of Augusta?','Hephzibah is its own city within Richmond County, south of Augusta. We cover both.')],
  near=['augusta','waynesboro','martinez','grovetown'],
  sources=[('https://en.wikipedia.org/wiki/Hephzibah,_Georgia','Hephzibah, Georgia (overview)'),('https://www.georgiaencyclopedia.org/articles/counties-cities-neighborhoods/richmond-county/','New Georgia Encyclopedia — Richmond County')]),
 dict(slug='harlem', name='Harlem', county='Columbia County', eyebrow='HARLEM, GEORGIA · K9 DETECTION & PEST CONTROL',
  lead='Rodent detection and exclusion, wildlife removal, goose management and general pest control for Harlem and western Columbia County.',
  intro='<p>Harlem is a small city in western Columbia County, best known as the birthplace of Oliver Hardy of Laurel and Hardy — the town keeps a museum and holds a festival in his honor every fall. Around the historic downtown it’s a mix of older homes, newer subdivisions and open rural land.</p>',
  local='''<h2>What drives pest problems in Harlem?</h2>
<p><strong>Rural edges.</strong> Fields, woods and farm buildings mean mice and rats in sheds and garages in the fall, armadillos rooting lawns, and raccoons and opossums under porches.</p>
<p><strong>Older downtown buildings.</strong> Historic storefronts and older homes have gaps at foundations, rooflines and utility entries — rodent, bat and squirrel entry points that need proper exclusion.</p>
<p><strong>Ticks and fire ants.</strong> Wooded edges and pasture land bring lone star ticks into yards, and fire ants build fast in open lawns. Both are handled with seasonal, whole-property treatments.</p>''',
  faqs=[('Do you remove bats from older buildings?','Yes, with humane one-way exclusion timed outside the season when young are in the roost, followed by sealing and clean-up.'),
        ('How far out of town do you go?','We cover Harlem and the rural parts of western Columbia County; call to confirm your address.')],
  near=['grovetown','evans','thomson','martinez'],
  sources=[('https://en.wikipedia.org/wiki/Harlem,_Georgia','Harlem, Georgia (overview)'),('https://exploregeorgia.org/things-to-do/list/see-where-oliver-hardy-grew-up-in-georgia','Explore Georgia — Laurel &amp; Hardy in Harlem')]),
 dict(slug='thomson', name='Thomson', county='McDuffie County', eyebrow='THOMSON, GEORGIA · K9 DETECTION & PEST CONTROL',
  lead='K9 rodent and bed bug detection, exclusion, wildlife removal and general pest control for Thomson and McDuffie County homes and businesses.',
  intro='<p>Thomson is the county seat of McDuffie County, west of Augusta along I-20. It has a historic downtown, established neighborhoods, industrial and distribution sites along the interstate, and plenty of rural land around it — including Hickory Hill, the historic home of Thomas E. Watson.</p>',
  local='''<h2>What drives pest problems in Thomson?</h2>
<p><strong>Commercial and industrial sites.</strong> Plants, warehouses and distribution buildings near I-20 deal with rodents, birds roosting in the steel and audit requirements. Our K9 rodent detection and bird exclusion programs are built for exactly that, with documentation for audits.</p>
<p><strong>Historic homes.</strong> Older houses in and around downtown have crawlspaces and roofline gaps — rodents, squirrels and bats find them.</p>
<p><strong>Rural land.</strong> Farms and wooded lots bring wildlife, ticks and fire ants to the edge of the yard.</p>''',
  faqs=[('Do you work with manufacturers and warehouses in Thomson?','Yes — K9 rodent detection, exclusion and bird control with audit-ready documentation. See our commercial programs.'),
        ('Is Thomson inside your service area?','Yes, Thomson and McDuffie County are on the western edge of our Georgia coverage. Call to schedule.')],
  near=['harlem','grovetown','evans','augusta'],
  sources=[('https://en.wikipedia.org/wiki/Thomson,_Georgia','Thomson, Georgia (overview)'),('https://www.georgiaencyclopedia.org/articles/counties-cities-neighborhoods/thomson/','New Georgia Encyclopedia — Thomson')]),
 dict(slug='waynesboro', name='Waynesboro', county='Burke County', eyebrow='WAYNESBORO, GEORGIA · K9 DETECTION & PEST CONTROL',
  lead='Rodent detection and exclusion, wildlife removal, goose and bird management, K9 bed bug screening and general pest control for Waynesboro and Burke County.',
  intro='<p>Waynesboro is the county seat of Burke County, south of Augusta — farm country known locally as the “Bird Dog Capital of the World” for its field-trial and hunting-dog heritage. Agriculture, hunting land and an older downtown define most properties around here.</p>',
  local='''<h2>What drives pest problems in Waynesboro?</h2>
<p><strong>Agriculture.</strong> Grain, feed, equipment sheds and barns are where rats and mice multiply. Norway rat burrow systems around grain and feed storage are a specialty of ours — the dogs find the active burrows and harborage before anything is treated.</p>
<p><strong>Kennels and working dogs.</strong> Kennel buildings and feed rooms attract rodents and flies; we work around animals with targeted, documented treatments.</p>
<p><strong>Older downtown and homes.</strong> Historic buildings have the roofline and foundation gaps that let in bats, squirrels and rodents.</p>''',
  faqs=[('Do you handle rodents around grain and feed?','Yes — detection-led rodent programs for farms, grain and feed storage, including Norway rat burrow mitigation.'),
        ('Can you work around kennels and livestock?','Yes. Treatments are targeted and placed with animals in mind.')],
  near=['hephzibah','augusta','grovetown','martinez'],
  sources=[('https://en.wikipedia.org/wiki/Waynesboro,_Georgia','Waynesboro, Georgia (overview)'),('https://en.wikipedia.org/wiki/Burke_County,_Georgia','Burke County, Georgia (overview)')]),
]
NAMES = {t['slug']: t['name'] for t in TOWNS}

for t in TOWNS:
    faqs = ''.join(f'<details><summary>{q}</summary><p>{a}</p></details>' for q, a in t['faqs'] + [
        (f'Does Coastal K9 really work in {t["name"]}, Georgia?', f'Yes. {t["name"]} is part of our Georgia coverage across the Savannah River from our base in Windsor, SC. Call 803-226-3155 to confirm scheduling for your address.')])
    near = ' · '.join(f'<a href="/pest-control-{n}-ga/">{NAMES[n]}, GA</a>' for n in t['near'])
    src = ''.join(f'<li><a href="{u}">{l}</a></li>' for u, l in t['sources'])
    html = f'''<div class="ck9s"><div class="ck9s-hero"><span class="ck9s-eyebrow">{t["eyebrow"]}</span>
<h1>Pest Control &amp; K9 Detection in {t["name"]}, GA</h1>
<p class="ck9s-lead">{t["lead"]}</p>
<div class="ck9s-badges"><span class="ck9s-badge">Certified K9 teams</span><span class="ck9s-badge">Family-owned</span><span class="ck9s-badge">{t["county"]}, GA</span><span class="ck9s-badge">Detection before treatment</span></div>
<div class="ck9s-cta"><a class="ck9s-btn p" href="tel:8032263155">Call 803-226-3155</a><a class="ck9s-btn s" href="/contact/">Request an Inspection</a></div></div>
<div class="ck9s-intro">{t["intro"]}</div>
<h2>What we handle in {t["name"]}</h2>
{SERVICES}
{t["local"]}
<h2>How a Coastal K9 visit works</h2>
<ol class="ck9s-proc"><li><h3>Inspect</h3><p>A certified detection dog and handler find where the problem actually is — inside walls, under slabs, in specific rooms.</p></li><li><h3>Pinpoint and document</h3><p>The handler confirms what the dog found and writes it up, so you know exactly what is being treated and why.</p></li><li><h3>Treat, seal and verify</h3><p>Targeted treatment only where activity is confirmed, exclusion so it doesn’t come back, and follow-up to prove it.</p></li></ol>
{GA_RULES}
<h2>Frequently asked questions</h2>
<div class="ck9s-faq">{faqs}</div>
<h2>Nearby Georgia communities</h2>
<p>{near} · <a href="/pest-control-north-augusta-sc/">North Augusta, SC</a> · <a href="/service-areas/">All service areas</a></p>
<h2>Sources</h2><ul>{src}</ul></div>'''
    (OUT / f'pest-control-{t["slug"]}-ga.html').write_text(html)
    meta = {'title': f'Pest Control & K9 Detection in {t["name"]}, GA', 'description': (t['lead'][:150].rsplit(' ', 1)[0] + '…') if len(t['lead']) > 155 else t['lead']}
    (OUT / f'pest-control-{t["slug"]}-ga.json').write_text(json.dumps(meta))
print('wrote', len(TOWNS))

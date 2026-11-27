"""Generate Mice of SC / Rats of SC overview pages and native species entries for content/pages.json."""
import json, re, sys

REPO = sys.argv[1]
DATE = '2026-11-27T18:30:00'
PHONE = '<a href="tel:8032263155">803-226-3155</a>'

ADW = lambda sci: f'https://animaldiversity.org/accounts/{sci.replace(" ", "_")}/'
NCM = 'https://auth1.dpr.ncparks.gov/mammals/'
CDC_HANTA = ('https://www.cdc.gov/hantavirus/prevention/index.html', 'CDC — Preventing Hantavirus: safe rodent cleanup')
SCDNR_WOODRAT = ('https://dnr.sc.gov/marine/mrri/acechar/speciesgallery/Mammals/EasternWoodrat/index.html', 'SCDNR — Eastern Woodrat (ACE Basin species gallery)')
PB = ('https://palmettobluff.com/wp-content/uploads/2024/06/ConservancyWebsite_Rodents_V2.pdf', 'Palmetto Bluff Conservancy — Common Native Rodents')
EDISTO = ('https://edisto.org/hispid-cotton-rat/', 'Edisto Island Open Land Trust — Hispid Cotton Rat')
UCIPM = ('https://ipm.ucanr.edu/home-and-landscape/rats/', 'University of California IPM — Pest Notes: Rats')
UF = ('https://edis.ifas.ufl.edu/publication/dh044', 'UF/IFAS Extension — Rat and Mouse Control')
EPA = ('https://www.epa.gov/rodenticides/about-rats-and-mice', 'U.S. EPA — About Rats and Mice')
SCSTATE = ('https://dc.statelibrary.sc.gov/server/api/core/bitstreams/7d629b9f-0b55-4878-8ca5-285dfa7a3cf0/content', 'South Carolina State Library — Eastern Woodrat species account')


def facts_table(rows, head=True):
    h = '<thead><tr><th>Feature</th><th>What to look for</th></tr></thead>' if head else ''
    return f'<table class="k-cmp k-facts">{h}<tbody>\n' + '\n'.join(f'<tr><th>{a}</th><td>{b}</td></tr>' for a, b in rows) + '\n</tbody></table>'


def faq_html(faqs):
    return '<div class="k-faq">\n' + '\n'.join(f'<details><summary>{q}</summary>{a}</details>' for q, a in faqs) + '\n</div>'


def sources_html(srcs):
    return '<ul>\n' + '\n'.join(f'<li><a href="{u}" rel="noopener">{t.replace("&", "&amp;")}</a></li>' for u, t in srcs) + '\n</ul>'


def toc_from(body):
    return [{'id': i, 'text': re.sub('<[^>]+>', '', t)} for i, t in re.findall(r'<h2 id="([^"]+)">(.*?)</h2>', body) if i != 'not-sure']


def page(slug, title, description, h1, lead, body, faqs):
    words = len(re.sub('<[^>]+>', ' ', body).split())
    return {'path': f'/pest-library/{slug}/', 'slug': slug, 'wpType': 'page', 'kind': 'pest', 'title': title,
            'description': description, 'h1': h1, 'hero': {'h1': h1, 'lead': lead}, 'heroImage': None,
            'faqs': [{'q': q, 'a': a} for q, a in faqs], 'toc': toc_from(body), 'citations': [], 'images': [],
            'date': DATE, 'modified': DATE, 'excerpt': lead[:200], 'words': words, 'noindex': False,
            'fixedScript': False, 'rewritten': True, 'body': body}


def species(slug, name, sci, group_page, group_label, origin, quick, lead, id_rows, life, indoors, prevention, handle, faqs, srcs, xref=None):
    lower = name[0].lower() + name[1:]
    body = ''
    body += f'<p class="k-xref">Part of <a href="/pest-library/{group_page}/">{group_label}</a>.' + (f' {xref}' if xref else '') + '</p>\n'
    body += f'<div class="k-intro"><p><strong>Quick answer:</strong> {quick}</p></div>\n'
    body += f'<h2 id="quick-facts">{name} quick facts</h2>\n'
    body += facts_table([('Scientific name', f'<em>{sci}</em>'), ('Group', 'Rodents'), ('Origin', origin)], head=False) + '\n'
    body += f'<h2 id="how-to-identify">How to identify the {lower}</h2>\n' + facts_table(id_rows) + '\n'
    body += f'<h2 id="life-history">Life history and habits</h2>\n<p>{life}</p>\n'
    body += f'<h2 id="does-it-come-indoors">Does it come indoors?</h2>\n<p>{indoors}</p>\n'
    body += '<h2 id="prevention-you-can-do">Prevention you can do</h2>\n<ul class="k-list">\n' + '\n'.join(f'<li>{x}</li>' for x in prevention) + '\n</ul>\n'
    body += f'<h2 id="how-we-handle-them">How Coastal K9 handles them</h2>\n<p>{handle} Call {PHONE}.</p>\n'
    body += '<h2 id="frequently-asked-questions">Frequently asked questions</h2>\n' + faq_html(faqs) + '\n'
    body += '<h2 id="sources">Sources</h2>\n' + sources_html(srcs) + '\n'
    title = f'{name}: ID, Life History & Control in SC'
    desc = f'{name} identification and life history in South Carolina: how to spot it, where it lives, whether it comes indoors, and when to call Coastal K9.'
    return page(slug, title, desc, f'{name}: Identification & Life History', lead, body, faqs)


MOUSE_HANDLE = ('Wild native mice outdoors are part of a healthy yard and woods, and we leave them alone. When they get into a home, cabin, barn or business, we find where they are nesting and how they get in, remove them, seal the entry points and clean up. '
                'See <a href="/rat-mouse-control/">rat and mouse control</a>.')

SP = []

# ---------------- MICE ----------------
SP.append(species(
    'deer-mouse', 'Deer Mouse', 'Peromyscus maniculatus', 'mice-of-south-carolina', 'Mice of South Carolina',
    'Native to South Carolina',
    'a mouse with a sharp two-tone tail (dark on top, white underneath), white feet and big eyes, found in a mountain cabin or shed, is likely a deer mouse. Clean up after it carefully.',
    'The deer mouse is a native mouse with a brown back, a bright white belly and feet, big dark eyes and large ears. In South Carolina it lives mainly in the mountains of the Upstate, where it moves into cabins, sheds and outbuildings in cold weather.',
    [('Size', 'About 3 inches in the body, with a tail almost as long'), ('Color', 'Gray-brown to reddish brown on top, crisp white belly and feet'),
     ('Tail', 'Sharply two-toned, dark on top and white below, with a small tuft at the tip'), ('Eyes and ears', 'Large, bulging dark eyes and big ears'),
     ('Look-alikes', 'White-footed mouse (tail less sharply two-toned) and house mouse (gray all over, no white belly)')],
    'Deer mice live in forests, field edges and rocky slopes. They are active at night, climb well, and cache seeds, nuts and insects for winter. They nest in hollow logs, under rocks and in stored items, and breed most of the year.',
    'Yes, especially in fall and winter. Deer mice move into cabins, garages, sheds, campers and stored vehicles. They are a known carrier of hantavirus in parts of the U.S., so droppings and nests should be cleaned with a wet method, never swept or vacuumed dry.',
    ['Seal gaps of 1/4 inch and larger around doors, vents and pipes.', 'Store seed, pet food and birdseed in sealed metal or hard plastic containers.',
     'Keep cabins, campers and sheds closed up and check them before reopening for the season.', 'Air out closed buildings before cleaning, then spray droppings with disinfectant and wipe them up.'],
    MOUSE_HANDLE,
    [('Is it safe to sweep up deer mouse droppings?', '<p>No. Sweeping or vacuuming can stir up dust from droppings and urine. Wet them first with disinfectant or a bleach solution, let it soak, then wipe up with paper towels while wearing gloves.</p>'),
     ('Do deer mice live in the Aiken area?', '<p>In South Carolina, deer mice are mainly a mountain species. Around Aiken and the Midlands, the white-footed-type mice you see are usually white-footed mice, cotton mice or oldfield mice.</p>')],
    [CDC_HANTA, (ADW('Peromyscus maniculatus'), 'Animal Diversity Web — Peromyscus maniculatus')],
    xref='Look-alike: <a href="/pest-library/white-footed-mouse/">White-Footed Mouse</a>.'))

SP.append(species(
    'white-footed-mouse', 'White-Footed Mouse', 'Peromyscus leucopus', 'mice-of-south-carolina', 'Mice of South Carolina',
    'Native to South Carolina',
    'a reddish-brown mouse with a clean white belly and feet in a shed, garage or seed bag in the Upstate or Midlands is most likely a white-footed mouse.',
    'The white-footed mouse is a native woodland mouse with a reddish-brown back and a white belly and feet. It is common in the Upstate and Piedmont, and it moves into sheds, garages, barns and homes when the weather turns cold.',
    [('Size', 'About 3.5–4 inches in the body, with a slightly shorter tail'), ('Color', 'Reddish brown to brown on top, white belly and feet'),
     ('Tail', 'Darker on top and lighter below, but not as sharply split as a deer mouse'), ('Eyes and ears', 'Large dark eyes and big ears'),
     ('Look-alikes', 'Cotton mouse (larger, darker, in the coastal plain) and deer mouse (mountains, sharper two-tone tail)')],
    'White-footed mice live in hardwood forests, brushy edges and fence rows. They climb well, nest in tree cavities, stone walls, logs and buildings, and store seeds and nuts for winter. They are an important host for young blacklegged (deer) ticks and the bacteria that cause Lyme disease.',
    'Yes. In fall they move into sheds, garages, barns, cabins and wall voids, and they often cache seeds in drawers, boots and stored boxes. Clean up droppings with a wet method rather than sweeping.',
    ['Seal gaps of 1/4 inch and larger, especially around garage doors and utility lines.', 'Store birdseed, grass seed and pet food in sealed containers.',
     'Keep firewood and brush piles away from the house.', 'Keep grass trimmed along foundations to cut down on ticks and cover.'],
    MOUSE_HANDLE,
    [('Why do I find seeds stashed in my boots or drawers?', '<p>White-footed mice cache food for winter. Stashes of seeds, acorns or dog food in odd places are a classic sign one is living nearby.</p>'),
     ('Are white-footed mice linked to Lyme disease?', '<p>They are one of the main hosts for young blacklegged ticks and the bacteria behind Lyme disease. Keeping mice out of the house and ticks off the yard both help.</p>')],
    [(ADW('Peromyscus leucopus'), 'Animal Diversity Web — Peromyscus leucopus'), ('https://www.cdc.gov/lyme/about/index.html', 'CDC — About Lyme Disease'), CDC_HANTA],
    xref='Look-alikes: <a href="/pest-library/cotton-mouse/">Cotton Mouse</a>, <a href="/pest-library/deer-mouse/">Deer Mouse</a>.'))

SP.append(species(
    'cotton-mouse', 'Cotton Mouse', 'Peromyscus gossypinus', 'mice-of-south-carolina', 'Mice of South Carolina',
    'Native to South Carolina',
    'a large, dark brown mouse with a white belly and feet near swamps, river bottoms or the coast is likely a cotton mouse.',
    'The cotton mouse is the biggest of our white-bellied native mice. It lives in swamps, bottomland forests, hammocks and coastal woods across the coastal plain of South Carolina, and it will move into sheds and buildings nearby.',
    [('Size', 'About 4 inches in the body, with a tail a little shorter'), ('Color', 'Dark brown on top, white belly and feet'),
     ('Tail', 'Dark on top, lighter below'), ('Look-alikes', 'White-footed mouse (smaller and redder, more common inland) and house mouse (gray, no white belly)')],
    'Cotton mice are found in forested areas throughout the Southeast and also turn up around wetlands and sandy dune areas. They are omnivores that eat seeds, nuts, fruit and insects. They nest in logs, stumps and tree cavities and climb well.',
    'Sometimes. Cotton mice will nest in sheds, barns, boathouses and homes close to wooded wetlands, especially in cool weather.',
    ['Seal gaps of 1/4 inch and larger around the foundation, doors and pipes.', 'Store feed, seed and pet food in sealed containers.',
     'Keep woodpiles and debris away from buildings.', 'Clean up droppings with a wet method, not a broom.'],
    MOUSE_HANDLE,
    [('How is a cotton mouse different from a white-footed mouse?', '<p>They look very much alike. Cotton mice are larger and darker and live mostly in the coastal plain. Where the two overlap, even experts sometimes need measurements to tell them apart.</p>')],
    [PB, (ADW('Peromyscus gossypinus'), 'Animal Diversity Web — Peromyscus gossypinus'), ('https://eaglehill.us/SENAonline/articles/SENA-9-4/20-Fernandes.shtml', 'Southeastern Naturalist — White-footed and cotton mouse identification in SC')]))

SP.append(species(
    'oldfield-mouse', 'Oldfield Mouse', 'Peromyscus polionotus', 'mice-of-south-carolina', 'Mice of South Carolina',
    'Native to South Carolina',
    'a small, pale, sandy-colored mouse with a white belly living in burrows in sandy, open ground is likely an oldfield mouse. It rarely comes indoors.',
    'The oldfield mouse is a small, pale native mouse of open, sandy ground: old fields, road edges, pastures and the Sandhills, including around Aiken. It lives in burrows it digs itself and rarely bothers people.',
    [('Size', 'Small, about 2.5–3 inches in the body, with a short tail'), ('Color', 'Pale sandy brown to gray-brown on top, white belly and feet'),
     ('Tail', 'Short and two-toned'), ('Burrows', 'Small holes in sandy soil, often at the base of a plant, with an escape tunnel')],
    'Oldfield mice dig burrows with an entrance tunnel, a nest chamber and an escape tunnel that runs close to the surface. They come out at night to eat seeds and insects and often plug the burrow entrance with sand during the day.',
    'Rarely. Oldfield mice stay in open sandy fields. If you are finding mice in the house, it is much more likely to be a house mouse or a white-footed mouse.',
    ['Nothing special is needed outdoors; they are a harmless part of sandy fields.', 'Seal gaps of 1/4 inch and larger on buildings near open fields.',
     'Store feed and seed in sealed containers in barns and sheds.'],
    'We leave oldfield mice alone outdoors. If mice are getting into a building, we identify which mouse it really is, then remove them and seal the entry points.',
    [('Do oldfield mice live near Aiken?', '<p>Yes. Sandy, open ground like the Sandhills around Aiken is just the kind of place they live.</p>')],
    [(ADW('Peromyscus polionotus'), 'Animal Diversity Web — Peromyscus polionotus')]))

SP.append(species(
    'golden-mouse', 'Golden Mouse', 'Ochrotomys nuttalli', 'mice-of-south-carolina', 'Mice of South Carolina',
    'Native to South Carolina',
    'a mouse with rich golden-orange fur, living up in vines and thickets, is a golden mouse. It almost never comes indoors.',
    'The golden mouse is a striking native mouse with golden-orange fur and a creamy belly. It lives in woods and swampy thickets across South Carolina and spends much of its life up off the ground in vines.',
    [('Size', 'About 3–3.5 inches in the body, with a tail about as long'), ('Color', 'Rich golden to orange-brown on top, creamy white to pale yellow belly'),
     ('Tail', 'Long, used for gripping as it climbs'), ('Nests', 'Round nests of shredded leaves and bark woven into greenbrier, honeysuckle and other vines')],
    'Golden mice prefer woodlands and swampy areas with thick vines such as greenbrier and honeysuckle. They eat mostly seeds, build round nests above the ground, and use separate feeding platforms in the vines.',
    'Almost never. Golden mice stay in vines and thickets. A mouse inside a building is almost always a house mouse or one of the white-footed mice.',
    ['No control is needed outdoors.', 'Seal gaps of 1/4 inch and larger on buildings next to thick woods.'],
    'We leave golden mice alone. If you have mice in a building, we identify the species, then remove them and seal the entry points.',
    [('Are golden mice rare?', '<p>They are found across the state but are seldom seen, because they live up in thick vines and come out at night.</p>')],
    [PB, (ADW('Ochrotomys nuttalli'), 'Animal Diversity Web — Ochrotomys nuttalli'), ('https://www.dnr.sc.gov/marine/mrri/acechar/biological/mammals.html', 'SCDNR — Mammals of the ACE Basin')]))

SP.append(species(
    'eastern-harvest-mouse', 'Eastern Harvest Mouse', 'Reithrodontomys humulis', 'mice-of-south-carolina', 'Mice of South Carolina',
    'Native to South Carolina',
    'a tiny brown mouse in tall grass or an overgrown field is likely an eastern harvest mouse. It does not move into homes.',
    'The eastern harvest mouse is one of the smallest mice in South Carolina. It lives in old fields, grassy roadsides and overgrown pastures, where it builds ball-shaped nests of grass.',
    [('Size', 'Tiny, about 2–2.5 inches in the body, with a tail about as long'), ('Color', 'Brown on top, gray to buff belly'),
     ('Teeth', 'A groove down the front of each upper incisor (seen up close)'), ('Look-alikes', 'House mouse (no groove on the teeth, usually indoors)')],
    'Harvest mice live in dense grass and weeds. They eat seeds and insects, climb grass stems, and weave round nests about the size of a softball in clumps of grass or low shrubs.',
    'No. Eastern harvest mice stay in fields and grassy edges. They may wander into a barn or shed at the edge of a field, but they do not set up in houses.',
    ['No control is needed outdoors.', 'Keep grass mowed close to barns and sheds if you do not want small rodents nearby.'],
    'We leave harvest mice alone. If you are seeing mice indoors, it is almost certainly a different species, and we can help you identify it.',
    [('How do I tell a harvest mouse from a house mouse?', '<p>Look closely at the front teeth: harvest mice have a groove down each upper incisor. House mice do not, and house mice are the ones that live in buildings.</p>')],
    [(ADW('Reithrodontomys humulis'), 'Animal Diversity Web — Reithrodontomys humulis'), ('https://apple.sc.edu/study/colleges_schools/artsandsciences/baruch_institute/documents/mammals.pdf', 'USC Baruch Institute — Mammal checklist')]))

# ---------------- RATS ----------------
RAT_HANDLE_NATIVE = ('Native rats outdoors are part of our fields and marshes, and we leave them alone. If one gets into a barn, shed, boathouse or home, we identify it first, because the plan for a native rat is different from the plan for a Norway or roof rat. Then we remove it and seal the way in.')

SP.append(species(
    'hispid-cotton-rat', 'Hispid Cotton Rat', 'Sigmodon hispidus', 'rats-of-south-carolina', 'Rats of South Carolina',
    'Native to South Carolina',
    'a coarse-furred, grizzled brown rat with a short tail in a grassy field, ditch or under a bird feeder is a hispid cotton rat. It does not live in houses.',
    'The hispid cotton rat is a native rat with coarse, grizzled brown-and-black fur. It is common across South Carolina in grassy fields, road edges and pastures, and it often feeds on seed under bird feeders.',
    [('Size', 'About 5–8 inches in the body, with a shorter tail'), ('Fur', 'Coarse and bristly, a grizzled mix of brown, black and buff, with a gray belly'),
     ('Tail', 'Shorter than the body, darker on top, lightly haired'), ('Signs', 'Runways worn through thick grass, with clipped grass stems and small piles of droppings'),
     ('Look-alikes', 'Norway rat (larger, lives around buildings) and marsh rice rat (lives in wet areas, longer tail)')],
    'Cotton rats live in thick grass, weedy fields and brushy edges. They eat mostly grasses, seeds and roots, plus some insects. They breed nearly year-round and are an important food source for hawks, owls, snakes, foxes and coyotes.',
    'No. Hispid cotton rats are not a species that lives in homes. They may get into a barn, feed room or shed at the edge of a field, especially where grain or seed is stored.',
    ['Store feed and seed in sealed metal bins.', 'Clean up spilled seed under bird feeders.', 'Keep grass mowed around barns and sheds.'],
    RAT_HANDLE_NATIVE,
    [('Is a cotton rat in my yard a problem?', '<p>Usually not. They live in grass and fields and do not move into houses. Keep feed sealed and grass short near buildings.</p>')],
    [EDISTO, PB, (ADW('Sigmodon hispidus'), 'Animal Diversity Web — Sigmodon hispidus')],
    xref='See also: <a href="/pest-library/norway-rat/">Norway Rat</a>.'))

SP.append(species(
    'marsh-rice-rat', 'Marsh Rice Rat', 'Oryzomys palustris', 'rats-of-south-carolina', 'Rats of South Carolina',
    'Native to South Carolina',
    'a gray-brown rat with a long, thin tail around a salt marsh, pond or wetland is likely a marsh rice rat. It is a strong swimmer and rarely comes indoors.',
    'The marsh rice rat is a native rat of salt marshes, freshwater marshes and other wet, grassy places. In South Carolina it is most common along the coast, and it is an excellent swimmer.',
    [('Size', 'About 5 inches in the body, with a tail as long or longer'), ('Fur', 'Grayish brown on top, pale gray to whitish belly'),
     ('Tail', 'Long and thin, sparsely haired, lighter underneath'), ('Feet', 'Hind feet with water-repellent fur, built for swimming'),
     ('Look-alikes', 'Roof rat (lives up high in buildings and trees) and hispid cotton rat (coarse fur, short tail, dry fields)')],
    'Marsh rice rats live in marshes and open wet areas throughout the Southeast. They swim and dive well, eat plants, seeds, insects, snails and crabs, and build woven grass nests just above the high-water line.',
    'Rarely. A rice rat may get into a dock house, boathouse or building right on the marsh, but it does not set up in homes the way Norway and roof rats do.',
    ['Seal gaps around dock houses, boathouses and buildings on the water.', 'Do not leave bait, feed or fish scraps out on docks.', 'Store feed and seed in sealed containers.'],
    RAT_HANDLE_NATIVE,
    [('Do marsh rice rats live in houses?', '<p>Not usually. They live in marshes and wet grass. A rat living in an attic or wall is almost always a roof rat or Norway rat.</p>')],
    [PB, (ADW('Oryzomys palustris'), 'Animal Diversity Web — Oryzomys palustris')]))

SP.append(species(
    'eastern-woodrat', 'Eastern Woodrat', 'Neotoma floridana', 'rats-of-south-carolina', 'Rats of South Carolina',
    'Native to South Carolina',
    'a large, soft-furred rat with big ears, big eyes and a furry tail, living in a pile of sticks in the woods or an old building, is an eastern woodrat, the "pack rat." It is uncommon in South Carolina; call us before trying to remove one.',
    'The eastern woodrat, or pack rat, is a large native rat with soft fur, big rounded ears and a furred tail. It is the only woodrat in South Carolina, where it lives in the coastal plain and the mountains.',
    [('Size', 'About 8 inches in the body, with a tail almost as long'), ('Fur', 'Soft gray-brown to rusty brown, white belly and feet'),
     ('Tail', 'Furred and two-toned, not scaly like a Norway or roof rat'), ('Eyes and ears', 'Large, dark bulging eyes and big rounded ears'),
     ('Signs', 'Large nests of sticks and debris, and collections of shiny or odd objects')],
    'Eastern woodrats live in hardwood and lowland forests, swamps and sometimes abandoned buildings. They build bulky stick houses and are famous for collecting bright, shiny objects, which is where the name "pack rat" comes from. On the South Carolina coast they breed year-round.',
    'Sometimes, in old sheds, barns, cabins and abandoned buildings near the woods. They are uncommon in South Carolina, so a woodrat in a building should be identified and moved out with care rather than treated like a Norway or roof rat.',
    ['Close up old buildings and sheds near the woods.', 'Store feed in sealed containers.', 'Do not set rodenticide out for a rat you have not identified.'],
    'We identify the animal first. A woodrat is not handled like a Norway or roof rat: we focus on getting it out of the building and sealing the way in. Wildlife trapping and removal is done in Aiken County.',
    [('Why is it called a pack rat?', '<p>Woodrats collect bright, shiny and odd objects and add them to their nests, sometimes trading something they were carrying for something new.</p>'),
     ('How can I tell a woodrat from a Norway rat?', '<p>Look at the tail and fur. A woodrat has soft fur and a furry, two-toned tail. A Norway rat has coarse fur and a scaly, nearly bare tail.</p>')],
    [SCDNR_WOODRAT, SCSTATE, PB]))


def overview(slug, title, desc, h1, lead, body, faqs):
    return page(slug, title, desc, h1, lead, body, faqs)


MICE_FAQ = [
    ('Which mice get inside houses in South Carolina?', '<p>Mostly the house mouse. White-footed, cotton and deer mice also move into sheds, garages, barns and cabins, and sometimes homes, in cool weather. Golden, harvest and oldfield mice stay outdoors.</p>'),
    ('Is it a mouse or a young rat?', '<p>A young rat has a bigger head and bigger feet for its body. A mouse has a small head, big ears and dainty feet. Droppings help too: mouse droppings are about 1/8–1/4 inch, rat droppings 1/2–3/4 inch.</p>'),
    ('How small a gap can a mouse get through?', '<p>About 1/4 inch, roughly the width of a pencil. If its head fits, the body follows.</p>'),
    ('How should I clean up mouse droppings?', '<p>Do not sweep or vacuum them dry. Wear gloves, spray droppings and nests with disinfectant or a bleach solution, let it soak, then wipe up with paper towels and bag the waste.</p>'),
]
mice_body = f'''<div class="k-intro"><p><strong>Quick answer:</strong> South Carolina has one invasive mouse, the house mouse, and several native mice. The house mouse is the one that lives in homes and businesses year-round. White-footed, cotton and deer mice move into sheds, barns, cabins and sometimes homes in cool weather. Golden, harvest and oldfield mice stay outdoors.</p></div>
<h2 id="mice-found-in-south-carolina">Mice found in South Carolina</h2>
<table class="k-cmp k-facts k-vs"><thead><tr><th>Mouse</th><th>Where in SC</th><th>Comes inside?</th></tr></thead><tbody>
<tr><th><a href="/pest-library/house-mouse/">House mouse</a></th><td>Statewide, in and around buildings. Not native.</td><td>Yes, year-round. The main indoor mouse.</td></tr>
<tr><th><a href="/pest-library/white-footed-mouse/">White-footed mouse</a></th><td>Upstate and Piedmont woods and edges</td><td>Often, in fall and winter: sheds, garages, barns, homes</td></tr>
<tr><th><a href="/pest-library/cotton-mouse/">Cotton mouse</a></th><td>Coastal plain swamps, river bottoms and coastal woods</td><td>Sometimes, near wooded wetlands</td></tr>
<tr><th><a href="/pest-library/deer-mouse/">Deer mouse</a></th><td>Mountains of the Upstate</td><td>Often, in cabins, sheds and campers</td></tr>
<tr><th><a href="/pest-library/oldfield-mouse/">Oldfield mouse</a></th><td>Sandy, open ground, including the Sandhills around Aiken</td><td>Rarely</td></tr>
<tr><th><a href="/pest-library/golden-mouse/">Golden mouse</a></th><td>Woods and swampy thickets with vines, statewide</td><td>Almost never</td></tr>
<tr><th><a href="/pest-library/eastern-harvest-mouse/">Eastern harvest mouse</a></th><td>Old fields, grassy roadsides and pastures</td><td>No</td></tr>
</tbody></table>
<h2 id="how-to-tell-them-apart">How to tell them apart</h2>
<table class="k-cmp k-facts k-vs"><thead><tr><th>Feature</th><th>House mouse</th><th>White-bellied native mice</th></tr></thead><tbody>
<tr><th>Color</th><td>Dusty gray to light brown all over, belly only a little lighter</td><td>Brown or reddish brown on top with a crisp white belly and white feet</td></tr>
<tr><th>Eyes and ears</th><td>Small eyes, medium ears</td><td>Big, dark bulging eyes and large ears</td></tr>
<tr><th>Tail</th><td>Nearly bare and scaly, one color</td><td>Two-toned: dark on top, white below</td></tr>
<tr><th>Smell</th><td>Strong, musky odor where they nest</td><td>Less odor; often leave seed stashes</td></tr>
<tr><th>Where you find them</th><td>Kitchens, pantries, walls, appliances, commercial buildings</td><td>Sheds, garages, barns, cabins, stored boxes and boots</td></tr>
</tbody></table>
<div class="k-callout"><b>Mouse, young rat or vole?</b><p>A young rat has an oversized head and big feet. A vole has a blunt face, tiny ears hidden in its fur and a very short tail, and it stays in lawns and gardens. A mouse has a pointed face, big ears and a long, thin tail.</p></div>
<h2 id="signs-of-mice">Signs of mice</h2>
<ul class="k-signs">
<li><strong>Droppings</strong> about 1/8–1/4 inch, pointed at the ends, in drawers, cabinets, along baseboards and behind appliances.</li>
<li><strong>Gnawed packaging</strong>, especially cereal, grains, pet food and birdseed.</li>
<li><strong>Nests</strong> of shredded paper, fabric or insulation in hidden spaces.</li>
<li><strong>Seed stashes</strong> in boots, drawers or boxes, a sign of white-footed-type mice.</li>
<li><strong>Scratching</strong> in walls or ceilings at night and a stale, musky smell.</li>
</ul>
<h2 id="health-and-safe-cleanup">Health risks and safe cleanup</h2>
<p>Mice contaminate food and surfaces with urine and droppings, and mouse allergens can trigger asthma. Deer mice and their relatives can carry hantavirus, and white-footed mice are a main host for the ticks and bacteria behind Lyme disease.</p>
<ul class="k-list">
<li>Air out closed sheds, cabins and campers before cleaning.</li>
<li>Wear gloves. Spray droppings and nests with disinfectant or a bleach solution and let it soak.</li>
<li>Wipe up with paper towels and bag the waste. Never sweep or vacuum droppings dry.</li>
</ul>
<h2 id="how-we-handle-mice">How we handle mice</h2>
<p>We start with our dogs. Our rodent detection dogs alert on all activity, old and new, and our abatement dogs alert only on live animals, so we know where mice have been and where they are now. Then we remove the mice, seal the entry points and clean up. Native mice outdoors are left alone. See <a href="/rat-mouse-control/">rat and mouse control</a>, or call {PHONE}.</p>
<h2 id="frequently-asked-questions">Frequently asked questions</h2>
{faq_html(MICE_FAQ)}
<h2 id="sources">Sources</h2>
{sources_html([CDC_HANTA, PB, UF, EPA, ('https://www.dnr.sc.gov/marine/mrri/acechar/biological/mammals.html', 'SCDNR — Mammals of the ACE Basin')])}
<div class="k-band"><h2 id="not-sure">Not sure which mouse you have?</h2><p>Send us a photo of the mouse or the droppings, or call, and we'll help you identify it before anyone treats.</p><a href="tel:8032263155">Call or text 803-226-3155</a></div>
'''

RATS_FAQ = [
    ('Which rats live in houses in South Carolina?', '<p>The Norway rat and the roof rat. Both came from overseas and both live with people. Our three native rats, the hispid cotton rat, marsh rice rat and eastern woodrat, live in fields, marshes and woods.</p>'),
    ('How do I tell a Norway rat from a roof rat?', '<p>Pull the tail forward over the back. A Norway rat\'s tail stops short of the nose; a roof rat\'s reaches past it. See our <a href="/pest-library/norway-rat-vs-roof-rat/">side-by-side guide</a>.</p>'),
    ('Is the rat in my yard a native rat?', '<p>It might be. A rat in a grassy field or under a bird feeder may be a cotton rat; one at the marsh may be a rice rat. A rat living in your attic, walls, crawlspace or burrowing along your foundation is a roof rat or Norway rat.</p>'),
    ('Can I just put out rat poison?', '<p>We do not recommend it before you know what you have. Poison can kill native wildlife, pets and the hawks and owls that eat rodents. We keep rodenticide to small, targeted use only when it is needed.</p>'),
]
rats_body = f'''<div class="k-intro"><p><strong>Quick answer:</strong> South Carolina has five kinds of rats. Two are invasive and live with people: the <a href="/pest-library/norway-rat/">Norway rat</a> and the <a href="/pest-library/roof-rat/">roof rat</a>. Three are native and live in fields, marshes and woods: the hispid cotton rat, the marsh rice rat and the eastern woodrat. When rats are in a home, barn or business, it is almost always a Norway or roof rat.</p></div>
<h2 id="rats-found-in-south-carolina">Rats found in South Carolina</h2>
<table class="k-cmp k-facts k-vs"><thead><tr><th>Rat</th><th>Where in SC</th><th>Lives in buildings?</th></tr></thead><tbody>
<tr><th><a href="/pest-library/norway-rat/">Norway rat</a></th><td>Statewide, around buildings, ports, farms and sewers. Not native.</td><td>Yes. Burrows along foundations, lives low: crawlspaces, ground floors.</td></tr>
<tr><th><a href="/pest-library/roof-rat/">Roof rat</a></th><td>Statewide, especially the coast and towns with trees. Not native.</td><td>Yes. Lives high: attics, upper walls, trees, rooflines.</td></tr>
<tr><th><a href="/pest-library/hispid-cotton-rat/">Hispid cotton rat</a></th><td>Statewide, in grassy fields, pastures and road edges</td><td>No. May get into barns or feed rooms.</td></tr>
<tr><th><a href="/pest-library/marsh-rice-rat/">Marsh rice rat</a></th><td>Salt and freshwater marshes, mostly coastal</td><td>Rarely. Docks and buildings on the water.</td></tr>
<tr><th><a href="/pest-library/eastern-woodrat/">Eastern woodrat</a></th><td>Coastal plain and mountain woods and swamps. Uncommon.</td><td>Sometimes, in old sheds and abandoned buildings.</td></tr>
</tbody></table>
<h2 id="how-to-tell-them-apart">How to tell them apart</h2>
<table class="k-cmp k-facts k-vs"><thead><tr><th>Feature</th><th>Norway and roof rats</th><th>Native rats</th></tr></thead><tbody>
<tr><th>Tail</th><td>Scaly and nearly bare</td><td>Cotton and rice rats: lightly haired. Woodrat: furry and two-toned.</td></tr>
<tr><th>Fur</th><td>Norway: coarse brown. Roof: smooth, dark gray to black or brown.</td><td>Cotton rat: coarse and grizzled. Rice rat: gray-brown. Woodrat: soft, with white belly and feet.</td></tr>
<tr><th>Where you find them</th><td>In and around buildings, dumpsters, feed, sewers and trees by the house</td><td>Grassy fields, marshes, woods and swamps</td></tr>
<tr><th>Signs</th><td>Burrows at foundations, rub marks, gnawing, noise overhead at night</td><td>Runways in grass, grass nests in the marsh, stick nests in the woods</td></tr>
</tbody></table>
<div class="k-callout"><b>Identify before you treat</b><p>Norway and roof rats need different plans: foundation and burrow work for Norway rats, rooflines and trees for roof rats. Native rats need a different approach again. Putting out poison for a rat you have not identified can kill native wildlife, pets and the hawks and owls that hunt rodents.</p></div>
<h2 id="signs-of-rats">Signs of rats</h2>
<ul class="k-signs">
<li><strong>Droppings</strong>: Norway rat about 3/4 inch with blunt ends; roof rat about 1/2 inch with pointed ends.</li>
<li><strong>Burrows</strong> 2–4 inches across along foundations, slabs and under shrubs, a sign of Norway rats.</li>
<li><strong>Noise overhead</strong> at night in the attic or upper walls, a sign of roof rats.</li>
<li><strong>Greasy rub marks</strong> along walls, pipes and rafters where rats travel.</li>
<li><strong>Gnawing</strong> on wood, wiring, pipes and feed bins, and hollowed-out fruit or pecans in trees.</li>
</ul>
<h2 id="health-and-damage">Health risks and damage</h2>
<p>Norway and roof rats contaminate food and feed with urine and droppings and can spread diseases such as leptospirosis, salmonellosis and rat-bite fever. Their gnawing damages wiring, plumbing and insulation, and Norway rat burrows can undermine slabs, sidewalks and retaining walls. Clean up droppings with a wet method, never by sweeping or vacuuming dry.</p>
<h2 id="how-we-handle-rats">How we handle rats</h2>
<p>We start with our dogs. Our rodent detection dogs alert on all rodent activity, old and new, so we can map where rats have been. Our abatement dogs alert only on live animals, so we know where rats are right now. Much of our success comes from the dogs showing us how rats are getting in.</p>
<p>Then our crew seals those entry points at the roofline or the foundation, depending on the rat. We keep rodenticide to small, targeted use only when it is needed, which matters around horse barns, livestock and pets. Native rats outdoors are left alone. See <a href="/rat-mouse-control/">rat and mouse control</a>, or call {PHONE}.</p>
<h2 id="frequently-asked-questions">Frequently asked questions</h2>
{faq_html(RATS_FAQ)}
<h2 id="sources">Sources</h2>
{sources_html([UCIPM, UF, EPA, EDISTO, PB, SCDNR_WOODRAT])}
<h2 id="learn-more">Learn more</h2>
<ul class="k-list"><li><a href="/pest-library/norway-rat-vs-roof-rat/">Norway Rat vs. Roof Rat: how to tell them apart</a></li><li><a href="/pest-library/mice-of-south-carolina/">Mice of South Carolina</a></li></ul>
<div class="k-band"><h2 id="not-sure">Not sure which rat you have?</h2><p>Send us a photo of the rat, the droppings or the burrow, or call, and we'll help you identify it before anyone treats.</p><a href="tel:8032263155">Call or text 803-226-3155</a></div>
'''

OV = [
    overview('mice-of-south-carolina', 'Mice of South Carolina: ID Guide & Which Ones Come Inside',
             'Mice of South Carolina: the house mouse and our native white-footed, cotton, deer, oldfield, golden and harvest mice, how to tell them apart, and which ones come inside.',
             'Mice of South Carolina',
             'South Carolina is home to the invasive house mouse and six native mice. Most of them never bother people. Here is how to tell them apart, which ones move indoors, and how to clean up safely when they do.',
             mice_body, MICE_FAQ),
    overview('rats-of-south-carolina', 'Rats of South Carolina: ID Guide to All Five Species',
             'Rats of South Carolina: the Norway rat, roof rat, hispid cotton rat, marsh rice rat and eastern woodrat, where each lives, how to tell them apart, and which ones move in.',
             'Rats of South Carolina',
             'South Carolina has five kinds of rats. Two came from overseas and live with people. Three are native and live in our fields, marshes and woods. Here is how to tell them apart, and why it matters before anyone treats.',
             rats_body, RATS_FAQ),
]

path = f'{REPO}/content/pages.json'
raw = open(path).read()
d = json.loads(raw)
new = OV + SP
slugs = {p['slug'] for p in new}
d = [p for p in d if p['slug'] not in slugs] + new

# cross-links from the existing rodent pages
XREF = {'house-mouse': '<p class="k-xref">Part of <a href="/pest-library/mice-of-south-carolina/">Mice of South Carolina</a>.</p>\n',
        'norway-rat': '<p class="k-xref">Part of <a href="/pest-library/rats-of-south-carolina/">Rats of South Carolina</a>.</p>\n',
        'roof-rat': '<p class="k-xref">Part of <a href="/pest-library/rats-of-south-carolina/">Rats of South Carolina</a>.</p>\n'}
for p in d:
    x = XREF.get(p['slug'])
    if x and x not in p['body']:
        p['body'] = x + p['body']

open(path, 'w').write(json.dumps(d, indent=0, ensure_ascii=False) + ('\n' if raw.endswith('\n') else ''))
for p in new:
    print(p['path'], p['words'])

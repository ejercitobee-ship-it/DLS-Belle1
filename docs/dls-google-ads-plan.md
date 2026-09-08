# Dunn's Luxury Selections — Google Ads Plan (High-Ticket / Bespoke)

Goal: drive qualified **consultation** leads for the bespoke and commercial funnels.
This is a high-ticket, low-volume play. Optimize for a few good leads, not clicks.
Existing Google Ads account: **AW-17833894840** (combined tag GT-55VCHDDF, GA4 G-BG9K5QSYQQ).

## The one thing to set up first: the conversion action
The site forms already fire `gtag('event','generate_lead', { form_type: ... })` on the
consultation, bespoke, and commercial pages. In Google Ads → Goals → Conversions:
1. Create/confirm a conversion action **"Consultation Request"** from the `generate_lead` event
   (import from GA4, or a Google Ads event snippet). Set it **Primary**, value ~ a sensible
   lead value (e.g. $150), count **one**.
2. Add the **call extension** conversion for (888) 431-9214 (calls ≥ 60s = conversion).
Do NOT launch spend until the conversion action reports correctly (test with a form submit).

## Campaign structure (start with ONE Search campaign)
- **Type:** Search only. No Display, no Performance Max at first — PMax wastes budget for a
  small advertiser and hides where spend goes. Add PMax later only if Search proves out.
- **Bidding:** start **Maximize Clicks with a max CPC cap** (~$4) for 2–3 weeks to gather data,
  then switch to **Maximize Conversions / Target CPA** once ~15–20 conversions exist.
- **Networks:** Search only (uncheck Search Partners + Display expansion).
- **Geo:** United States (kit model ships nationwide). Location option = "presence" not "interest".
- **Budget:** start **$30–$50/day**, concentrated on ad groups 1–3. A single bespoke close pays
  for months of spend, so judge on cost-per-consultation, not CPC.

### Ad groups (tightly themed, phrase + exact match)
**AG1 — Cigar rooms → /pages/bespoke**
"custom cigar room", "home cigar room", "cigar room design", "home cigar lounge", "build a cigar room"

**AG2 — Walk-in humidors → /pages/bespoke** (or /pages/walk-in-humidor)
"walk in humidor", "walk in humidor cost", "custom walk in humidor", "build a walk in humidor"

**AG3 — Custom / bespoke humidor cabinets → /pages/bespoke**
"custom humidor cabinet", "bespoke humidor", "custom humidor", "large humidor cabinet"

**AG4 — Commercial → /pages/commercial**
"commercial humidor", "cigar lounge design", "humidor for cigar lounge", "commercial cigar lockers"

### Negative keywords (add at campaign level)
free, cheap, diy, plans, pdf, "how to", used, second hand, amazon, ebay, wish, jobs, salary,
career, travel humidor, humidor jar, humidor bag, boveda, cigar box, wholesale (except AG4),
repair, replacement parts. Review the Search Terms report weekly for the first month and prune.

## Ad copy (Responsive Search Ads — headlines ≤30 chars, descriptions ≤90)
### Bespoke (AG1–3)
Headlines: Custom Cigar Rooms, Built · Designed To Your Space · Bespoke Humidors & Rooms ·
Your Cigar Room, Designed · Made To Your Dimensions · Shipped Ready To Install ·
Private Design Consultation · Walk-In Humidor Experts · From Cabinets To Cigar Rooms ·
Book A Free Consultation · Luxury Cigar Environments · Built Like Fine Furniture ·
Nationwide, White-Glove · Dunn's Luxury Selections · Get A Custom Quote
Descriptions:
- We design and build custom humidors and cigar rooms to your exact space. Book a consult.
- From a bespoke cabinet to a full walk-in room, shipped ready to install. Start today.
- Private consultation, no obligation. Made to your dimensions, delivered nationwide.
- Furniture-grade craft, precise climate control, a specialist from design to install.

### Commercial (AG4)
Headlines: Cigar Lounges, Designed · For Clubs, Hotels & Bars · Commercial Humidor Systems ·
Member Locker Walls · Built For Your Venue · Trade & Multi-Unit Welcome · Climate At Scale ·
Dunn's Luxury Selections
Descriptions:
- Custom cigar lounges and humidor systems for clubs, hotels, and lounges. Let's talk.
- Commercial climate control, display walls, and member lockers, built to your venue.

## Assets / extensions (add to all)
- **Sitelinks:** Dunn's Bespoke (/pages/bespoke), Commercial (/pages/commercial), Walk-In Humidors
  (/pages/walk-in-humidor), Book a Consultation (/pages/consultation).
- **Callouts:** Made To Your Dimensions · Shipped Ready To Install · Private Consultation ·
  Nationwide Delivery · Furniture-Grade Craft.
- **Call extension:** (888) 431-9214.
- **Structured snippet** (Types): Cabinets, Walk-In Rooms, Commercial Lounges, Member Lockers.

## Landing pages
- Bespoke terms → **/pages/bespoke** (tiers + manufacturing video + enquiry form). Strong LP.
- Commercial terms → **/pages/commercial** (form feeds the sales-rep lane).
- The forms already tag the lead source (formType), so Chat/Sheet shows which campaign converted.

## Success metric & read
- Target: **10 qualified consultations in 60 days**; watch **cost per consultation**, not CPC.
- A bespoke lead is worth thousands, so a $50–$150 cost per consultation is healthy.
- Week 1–2: gather data on Max Clicks. Week 3+: switch to Max Conversions once ~15–20 conv.
- Pause any keyword with 100+ clicks and 0 leads; scale the ad groups that produce consultations.

## What NOT to do
- No broad match at the start (it will burn budget on "cigar", "humidor" browsers).
- No Display/PMax until Search proves a cost-per-consultation you like.
- Do not point ads at the homepage or /collections — send high-intent clicks to the funnel pages.

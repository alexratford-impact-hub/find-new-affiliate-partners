/**
 * Multi-Brand Preset Configurations & Candidate Profiles
 * Single Source of Truth for Boots UK, Argos UK, and loveholidays.
 */

export const brandPresets = {
  boots: `# Target Parameters
- Brand: Boots UK
- Focus Category: Consumer Electronics & Personal Care
- Commercial Model: CPA
- Target AOV: £45
- Target Territory: UK (Strict ASA compliance; no unlicensed medicinal claims)

# Competitor Baselines
- currys.co.uk
- lookfantastic.com

# Disqualifications
- Exclude voucher-code aggregator directories, coupon browser extensions, and cash-back scraping portals.
- Exclude non-UK traffic sources.
- Exclude direct retail brand competitors.`,

  argos: `# Target Parameters
- Brand: Argos UK
- Focus Category: Large Domestic Appliances & Smart Tech
- Commercial Model: Hybrid (CPA + Flat Tenancy for Seasonal Exclusives)
- Target AOV: £120
- Target Territory: UK (Click & Collect delivery emphasis)

# Competitor Baselines
- currys.co.uk
- ao.com

# Disqualifications
- Exclude voucher-code aggregator directories and coupon scraping tools.
- Exclude non-UK consumer portals.
- Exclude grey-market hardware resellers.`,

  loveholidays: `# Target Parameters
- Brand: loveholidays
- Focus Category: Short-Haul Beach Package Holidays & Family Breaks
- Commercial Model: CPA (Completed Bookings)
- Target AOV: £850
- Target Territory: UK & Ireland (Strict ATOL / ABTA compliance messaging)

# Competitor Baselines
- onthebeach.co.uk
- tui.co.uk

# Disqualifications
- Exclude voucher aggregators and unverified travel deal forums.
- Exclude flight-only booking tools without package accommodation.
- Exclude lead generation portals operating outside ATOL consumer protections.`
};

export const brandProfiles = {
  boots: {
    id: 'boots',
    name: 'Boots UK',
    category: 'Personal Care & Consumer Electronics',
    aov: '£45',
    commercialModel: 'Strict CPA (Completed Online Sales)',
    territory: 'UK (Strict ASA compliance; no unlicensed medicinal claims)',
    competitors: ['currys.co.uk', 'lookfantastic.com'],
    disqualifications: [
      'Exclude voucher-code aggregator directories, coupon browser extensions, and cash-back scraping portals.',
      'Exclude non-UK traffic sources.',
      'Exclude direct retail brand competitors.'
    ],
    candidates: [
      { name: 'Sleepopolis UK', domain: 'sleepopolis.com/uk', niche: 'Mattress & Sleep Guides', r: 5, s: 4, c: 5, ev: 4.68, status: 'Tier 1 Priority', angle: 'Sleep hygiene & wellness tech' },
      { name: 'Coffee Bean Geek', domain: 'coffeebeangeek.com', niche: 'Specialist Espresso Labs', r: 5, s: 4, c: 4, ev: 4.37, status: 'Tier 1 Priority', angle: 'Premium kitchen electricals' },
      { name: 'DomesticLivingReview', domain: 'domesticlivingreview.co.uk', niche: 'Domestic Appliances', r: 4, s: 5, c: 4, ev: 4.28, status: 'Tier 1 Priority', angle: 'Consumer tech & personal care reviews' },
      { name: 'VoucherDeals Hub', domain: 'voucherdealshub.co.uk', niche: 'Coupon Aggregator', r: 0, s: 5, c: 5, ev: 0.00, status: 'Disqualified', angle: 'Zero Relevance knockout (The Zero Rule)' }
    ],
    csv: `Partner Name,Domain,Vertical Match,R,S,C,EV,Status,Outreach Angle
Sleepopolis UK,sleepopolis.com/uk,Mattress & Sleep Guides,5,4,5,4.68,Tier 1 Priority,Sleep hygiene & wellness tech
Coffee Bean Geek,coffeebeangeek.com,Specialist Espresso Labs,5,4,4,4.37,Tier 1 Priority,Premium kitchen electricals
DomesticLivingReview,domesticlivingreview.co.uk,Domestic Appliances,4,5,4,4.28,Tier 1 Priority,Consumer tech & personal care reviews
VoucherDeals Hub,voucherdealshub.co.uk,Coupon Aggregator,0,5,5,0.00,Disqualified,Zero Relevance knockout (The Zero Rule)`,
    brandMd: brandPresets.boots
  },

  argos: {
    id: 'argos',
    name: 'Argos UK',
    category: 'Home Appliances & Garden Power Tools',
    aov: '£120',
    commercialModel: 'Hybrid (CPA + Flat Tenancy for Seasonal Exclusives)',
    territory: 'UK (Click & Collect delivery emphasis)',
    competitors: ['ao.com', 'currys.co.uk', 'diy.com'],
    disqualifications: [
      'Exclude voucher-code aggregator directories and coupon scraping tools.',
      'Exclude non-UK consumer portals.',
      'Exclude grey-market hardware resellers.'
    ],
    candidates: [
      { name: 'KitchenApplianceLab', domain: 'kitchenappliancelab.co.uk', niche: 'Smart Kitchen & White Goods', r: 5, s: 4, c: 5, ev: 4.68, status: 'Tier 1 Priority', angle: 'Air fryer & appliance benchmark tests' },
      { name: 'GardeningToolsReview', domain: 'gardeningtoolsreview.co.uk', niche: 'Outdoor Power & Lawn Care', r: 5, s: 4, c: 4, ev: 4.37, status: 'Tier 1 Priority', angle: 'Cordless mower & power tool comparisons' },
      { name: 'SmartAppliancesReview', domain: 'smartappliancesreview.co.uk', niche: 'Home Tech & Smart Living', r: 4, s: 5, c: 4, ev: 4.28, status: 'Tier 1 Priority', angle: 'Seasonal gadget & white goods editorial' },
      { name: 'VoucherDealsForum', domain: 'voucherdealsforum.co.uk', niche: 'Deal Community Scraper', r: 0, s: 5, c: 5, ev: 0.00, status: 'Disqualified', angle: 'Zero Relevance knockout (The Zero Rule)' }
    ],
    csv: `Partner Name,Domain,Vertical Match,R,S,C,EV,Status,Outreach Angle
KitchenApplianceLab,kitchenappliancelab.co.uk,Smart Kitchen & White Goods,5,4,5,4.68,Tier 1 Priority,Air fryer & appliance benchmark tests
GardeningToolsReview,gardeningtoolsreview.co.uk,Outdoor Power & Lawn Care,5,4,4,4.37,Tier 1 Priority,Cordless mower & power tool comparisons
SmartAppliancesReview,smartappliancesreview.co.uk,Home Tech & Smart Living,4,5,4,4.28,Tier 1 Priority,Seasonal gadget & white goods editorial
VoucherDealsForum,voucherdealsforum.co.uk,Deal Community Scraper,0,5,5,0.00,Disqualified,Zero Relevance knockout (The Zero Rule)`,
    brandMd: brandPresets.argos
  },

  loveholidays: {
    id: 'loveholidays',
    name: 'loveholidays',
    category: 'Short-Haul Beach Breaks & Family All-Inclusive',
    aov: '£850',
    commercialModel: 'CPA (Completed Online Bookings)',
    territory: 'UK & Ireland (Strict ATOL / ABTA compliance messaging)',
    competitors: ['onthebeach.co.uk', 'tui.co.uk', 'jet2holidays.com'],
    disqualifications: [
      'Exclude voucher aggregators and unverified travel deal forums.',
      'Exclude flight-only booking tools without package accommodation.',
      'Exclude lead generation portals operating outside ATOL consumer protections.'
    ],
    candidates: [
      { name: 'FamilyTravelExpert', domain: 'familytravelexpert.co.uk', niche: 'Family Itineraries & Resorts', r: 5, s: 4, c: 5, ev: 4.68, status: 'Tier 1 Priority', angle: 'All-inclusive family hotel reviews' },
      { name: 'LuxuryBeachEscapes', domain: 'luxurybeachescapes.com', niche: 'Short-Haul Villa & Boutique Guides', r: 5, s: 4, c: 4, ev: 4.37, status: 'Tier 1 Priority', angle: 'Mediterranean summer break curation' },
      { name: 'TravelJournalUK', domain: 'traveljournaluk.co.uk', niche: 'Editorial European Travel Desks', r: 4, s: 5, c: 4, ev: 4.28, status: 'Tier 1 Priority', angle: 'European beach & island destination guides' },
      { name: 'FlightDiscountsDaily', domain: 'flightdiscounts.co.uk', niche: 'Voucher & Error-Fare Scraper', r: 0, s: 5, c: 5, ev: 0.00, status: 'Disqualified', angle: 'Zero Relevance knockout (The Zero Rule)' }
    ],
    csv: `Partner Name,Domain,Vertical Match,R,S,C,EV,Status,Outreach Angle
FamilyTravelExpert,familytravelexpert.co.uk,Family Itineraries & Resorts,5,4,5,4.68,Tier 1 Priority,All-inclusive family hotel reviews
LuxuryBeachEscapes,luxurybeachescapes.com,Short-Haul Villa & Boutique Guides,5,4,4,4.37,Tier 1 Priority,Mediterranean summer break curation
TravelJournalUK,traveljournaluk.co.uk,Editorial European Travel Desks,4,5,4,4.28,Tier 1 Priority,European beach & island destination guides
FlightDiscountsDaily,flightdiscounts.co.uk,Voucher & Error-Fare Scraper,0,5,5,0.00,Disqualified,Zero Relevance knockout (The Zero Rule)`,
    brandMd: brandPresets.loveholidays
  }
};

// Roadmap data structured exactly per SRS Section 8.
// Each track is a flat ordered sequence of days; only the first
// incomplete day is unlocked (Module 2 rule).

export const BANKING_ROADMAP = [
  { week: 1, title: 'Banking Awareness Foundation', days: [
    { day: 1, title: 'Introduction to Banking & Functions of Banks', topics: ['Introduction to Banking', 'Functions of Banks'] },
    { day: 2, title: 'Types of Banks', topics: ['Types of Banks'] },
    { day: 3, title: 'Types of Accounts', topics: ['Types of Accounts'] },
    { day: 4, title: 'Banking Products', topics: ['Banking Products'] },
    { day: 5, title: 'Loans', topics: ['Loans'] },
    { day: 6, title: 'Digital Banking', topics: ['Digital Banking', 'UPI', 'NEFT', 'RTGS', 'IMPS', 'AEPS', 'BBPS'] },
    { day: 7, title: 'Weekly Revision + Mock', topics: ['Week 1 Revision'], isRevision: true },
  ]},
  { week: 2, title: 'RBI & Monetary Policy', days: [
    { day: 1, title: 'RBI History & Functions', topics: ['RBI History', 'RBI Functions'] },
    { day: 2, title: 'Monetary Policy & MPC', topics: ['Monetary Policy', 'Monetary Policy Committee'] },
    { day: 3, title: 'CRR & SLR', topics: ['CRR', 'SLR'] },
    { day: 4, title: 'Repo & Reverse Repo', topics: ['Repo Rate', 'Reverse Repo'] },
    { day: 5, title: 'Bank Rate, MSF & SDF', topics: ['Bank Rate', 'MSF', 'SDF', 'LAF'] },
    { day: 6, title: 'Consolidation', topics: ['RBI Tools Recap'] },
    { day: 7, title: 'Revision', topics: ['Week 2 Revision'], isRevision: true },
  ]},
  { week: 3, title: 'Economy', days: [
    { day: 1, title: 'GDP & GNP', topics: ['GDP', 'GNP'] },
    { day: 2, title: 'Inflation, CPI & WPI', topics: ['Inflation', 'CPI', 'WPI'] },
    { day: 3, title: 'Union Budget', topics: ['Budget'] },
    { day: 4, title: 'Economic Survey', topics: ['Economic Survey'] },
    { day: 5, title: 'Fiscal Deficit', topics: ['Fiscal Deficit'] },
    { day: 6, title: 'Consolidation', topics: ['Economy Recap'] },
    { day: 7, title: 'Revision', topics: ['Week 3 Revision'], isRevision: true },
  ]},
  { week: 4, title: 'Financial Awareness', days: [
    { day: 1, title: 'Stock Market & Shares', topics: ['Stock Market', 'Shares'] },
    { day: 2, title: 'Bonds', topics: ['Bonds'] },
    { day: 3, title: 'Mutual Funds & SIP', topics: ['Mutual Funds', 'SIP'] },
    { day: 4, title: 'Insurance', topics: ['Insurance'] },
    { day: 5, title: 'Consolidation', topics: ['Financial Awareness Recap'] },
    { day: 6, title: 'Practice', topics: ['Financial Awareness Practice'] },
    { day: 7, title: 'Revision', topics: ['Week 4 Revision'], isRevision: true },
  ]},
  { week: 5, title: 'Financial Institutions', days: [
    { day: 1, title: 'RBI & SEBI', topics: ['RBI', 'SEBI'] },
    { day: 2, title: 'NABARD & SIDBI', topics: ['NABARD', 'SIDBI'] },
    { day: 3, title: 'EXIM Bank & NHB', topics: ['EXIM Bank', 'NHB'] },
    { day: 4, title: 'NABFID & PFRDA', topics: ['NABFID', 'PFRDA'] },
    { day: 5, title: 'IRDAI', topics: ['IRDAI'] },
    { day: 6, title: 'Consolidation', topics: ['Financial Institutions Recap'] },
    { day: 7, title: 'Revision', topics: ['Week 5 Revision'], isRevision: true },
  ]},
  { week: 6, title: 'International Organizations', days: [
    { day: 1, title: 'IMF & World Bank', topics: ['IMF', 'World Bank'] },
    { day: 2, title: 'WTO & BRICS', topics: ['WTO', 'BRICS'] },
    { day: 3, title: 'FATF & G20', topics: ['FATF', 'G20'] },
    { day: 4, title: 'AIIB & ADB', topics: ['AIIB', 'ADB'] },
    { day: 5, title: 'ASEAN', topics: ['ASEAN'] },
    { day: 6, title: 'Consolidation', topics: ['International Orgs Recap'] },
    { day: 7, title: 'Revision', topics: ['Week 6 Revision'], isRevision: true },
  ]},
  { week: 7, title: 'Government Schemes', days: [
    { day: 1, title: 'PMJDY & PM Kisan', topics: ['PMJDY', 'PM Kisan'] },
    { day: 2, title: 'PMAY & Mudra', topics: ['PMAY', 'Mudra'] },
    { day: 3, title: 'Startup & Standup India', topics: ['Startup India', 'Standup India'] },
    { day: 4, title: 'Sukanya & APY', topics: ['Sukanya', 'APY'] },
    { day: 5, title: 'NPS', topics: ['NPS'] },
    { day: 6, title: 'Consolidation', topics: ['Government Schemes Recap'] },
    { day: 7, title: 'Revision', topics: ['Week 7 Revision'], isRevision: true },
  ]},
  { week: 8, title: 'Reports & Indices', days: [
    { day: 1, title: 'HDI & Global Hunger Index', topics: ['HDI', 'Global Hunger Index'] },
    { day: 2, title: 'Global Innovation Index', topics: ['Global Innovation Index'] },
    { day: 3, title: 'World Happiness Report', topics: ['World Happiness Report'] },
    { day: 4, title: 'RBI & IMF Reports', topics: ['RBI Reports', 'IMF Reports'] },
    { day: 5, title: 'World Bank Reports', topics: ['World Bank Reports'] },
    { day: 6, title: 'Consolidation', topics: ['Reports Recap'] },
    { day: 7, title: 'Revision', topics: ['Week 8 Revision'], isRevision: true },
  ]},
  { week: 9, title: 'Static Banking GK', days: [
    { day: 1, title: 'Headquarters', topics: ['Headquarters of Banks & Institutions'] },
    { day: 2, title: 'Taglines', topics: ['Bank Taglines'] },
    { day: 3, title: 'CEOs & MDs', topics: ['CEOs'] },
    { day: 4, title: 'Mergers & Acquisitions', topics: ['Mergers'] },
    { day: 5, title: 'Important Dates', topics: ['Important Dates'] },
    { day: 6, title: 'Consolidation', topics: ['Static GK Recap'] },
    { day: 7, title: 'Revision', topics: ['Week 9 Revision'], isRevision: true },
  ]},
  { week: 10, title: 'Daily Current Affairs Cycle', days: Array.from({ length: 7 }, (_, i) => ({
    day: i + 1,
    title: i < 6 ? 'Daily Current Affairs' : 'Monthly Revision Test',
    topics: ['Banking News', 'Economy News', 'RBI Updates', 'Government Schemes', 'International News', 'Sports', 'Awards', 'Appointments'],
    isRevision: i === 6,
  })) },
];

export const COMPUTER_ROADMAP = [
  { week: 1, title: 'Computer Basics', days: [
    { day: 1, title: 'Computer History & Generations', topics: ['Computer History', 'Computer Generations'] },
    { day: 2, title: 'Characteristics & Applications', topics: ['Characteristics', 'Applications'] },
    { day: 3, title: 'Consolidation', topics: ['Computer Basics Recap'] },
    { day: 4, title: 'Revision', topics: ['Week 1 Revision'], isRevision: true },
  ]},
  { week: 2, title: 'Hardware', days: [
    { day: 1, title: 'CPU & RAM', topics: ['CPU', 'RAM'] },
    { day: 2, title: 'ROM & Motherboard', topics: ['ROM', 'Motherboard'] },
    { day: 3, title: 'Storage Devices', topics: ['Storage Devices'] },
    { day: 4, title: 'Revision', topics: ['Week 2 Revision'], isRevision: true },
  ]},
  { week: 3, title: 'Software', days: [
    { day: 1, title: 'Operating Systems', topics: ['Operating Systems'] },
    { day: 2, title: 'Windows & Linux', topics: ['Windows', 'Linux'] },
    { day: 3, title: 'Utility Software', topics: ['Utility Software'] },
    { day: 4, title: 'Revision', topics: ['Week 3 Revision'], isRevision: true },
  ]},
  { week: 4, title: 'Networking', days: [
    { day: 1, title: 'LAN, WAN, MAN', topics: ['LAN', 'WAN', 'MAN'] },
    { day: 2, title: 'Internet & TCP/IP', topics: ['Internet', 'TCP/IP'] },
    { day: 3, title: 'DNS, HTTP & HTTPS', topics: ['DNS', 'HTTP', 'HTTPS'] },
    { day: 4, title: 'Revision', topics: ['Week 4 Revision'], isRevision: true },
  ]},
  { week: 5, title: 'MS Office', days: [
    { day: 1, title: 'MS Word', topics: ['Word'] },
    { day: 2, title: 'MS Excel', topics: ['Excel'] },
    { day: 3, title: 'PowerPoint & Shortcut Keys', topics: ['PowerPoint', 'Shortcut Keys'] },
    { day: 4, title: 'Revision', topics: ['Week 5 Revision'], isRevision: true },
  ]},
  { week: 6, title: 'Cyber Security', days: [
    { day: 1, title: 'Virus & Malware', topics: ['Virus', 'Malware'] },
    { day: 2, title: 'Firewall & Encryption', topics: ['Firewall', 'Encryption'] },
    { day: 3, title: 'Cyber Attacks', topics: ['Cyber Attacks'] },
    { day: 4, title: 'Revision', topics: ['Week 6 Revision'], isRevision: true },
  ]},
  { week: 7, title: 'Cloud, AI & DBMS', days: [
    { day: 1, title: 'Cloud Computing', topics: ['Cloud Computing'] },
    { day: 2, title: 'AI & Machine Learning', topics: ['Artificial Intelligence', 'Machine Learning Basics'] },
    { day: 3, title: 'DBMS & SQL Basics', topics: ['DBMS', 'SQL Basics'] },
    { day: 4, title: 'Revision', topics: ['Week 7 Revision'], isRevision: true },
  ]},
  { week: 8, title: 'Full Revision', days: [
    { day: 1, title: 'Full Revision', topics: ['Complete Computer Awareness Recap'] },
    { day: 2, title: 'Complete Mock Test', topics: ['Full Syllabus Mock'], isRevision: true },
  ]},
];

// Flattened, ordered sequence used for unlock-progression logic.
// Each entry gets a stable id: `${track}-w${week}-d${day}`
export function flattenRoadmap(track) {
  const source = track === 'banking' ? BANKING_ROADMAP : COMPUTER_ROADMAP;
  const flat = [];
  source.forEach((wk) => {
    wk.days.forEach((d) => {
      flat.push({
        id: `${track}-w${wk.week}-d${d.day}`,
        track,
        week: wk.week,
        weekTitle: wk.title,
        day: d.day,
        title: d.title,
        topics: d.topics,
        isRevision: !!d.isRevision,
      });
    });
  });
  return flat;
}

export const ALL_LESSONS = [...flattenRoadmap('banking'), ...flattenRoadmap('computer')];

export const REVISION_INTERVALS_DAYS = [1, 2, 4, 7, 15, 30];

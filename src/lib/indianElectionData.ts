/**
 * Static Indian Election Education Data
 * Source: Election Commission of India (ECI)
 * Non-partisan, verified factual data
 * Last updated: 2024
 *
 * @see https://eci.gov.in
 * @see https://voters.eci.gov.in
 */

import type { ElectionStep, StateElectionInfo, Badge, ChecklistItem } from '@/types/india'

/**
 * The 12 valid photo ID documents accepted at polling booths across India.
 * As per ECI Notification. Voters must carry ONE original document.
 * Source: https://eci.gov.in/voter/voter-guide
 */
export const VALID_IDS_AT_BOOTH: string[] = [
  'Voter ID Card (EPIC)',
  'Aadhaar Card',
  'PAN Card',
  'Passport',
  'Driving License',
  'MNREGA Job Card',
  'Bank/Post Office Passbook with Photo',
  'Central/State Government ID Cards',
  'Pension Documents with Photo',
  'NPR Smart Card',
  'Health Insurance Smart Card (ESIC/ECHS)',
  'Student ID (Government/Aided Colleges)',
]

/**
 * Complete 7-step Lok Sabha election timeline.
 * Each step covers what ECI does and what voters should do.
 * Source: ECI official election process documentation.
 */
export const LOK_SABHA_STEPS: ElectionStep[] = [
  {
    id: 'announcement',
    stepNumber: 1,
    title: 'Election Announcement',
    titleHindi: 'चुनाव की घोषणा',
    icon: '📢',
    shortDescription: 'ECI announces election dates',
    shortDescriptionHindi: 'ईसीआई चुनाव की तारीखें घोषित करती है',
    fullDescription:
      'The Election Commission of India officially announces the election schedule. The Model Code of Conduct (MCC) comes into force immediately.',
    keyFacts: [
      'Election Commission of India (ECI) announces dates',
      'Model Code of Conduct (MCC) begins immediately',
      'No new government schemes can be announced',
      'Political parties must follow MCC rules strictly',
      'Government cannot use official machinery for campaigns',
    ],
    keyFactsHindi: [
      'भारत निर्वाचन आयोग तारीखें घोषित करता है',
      'आदर्श आचार संहिता तुरंत लागू होती है',
      'नई सरकारी योजनाओं की घोषणा नहीं हो सकती',
    ],
    whatYouShouldDo: [
      'Check if your name is in the voter list',
      'Visit voters.eci.gov.in to verify registration',
      'Note down all important election dates',
      'Follow only official ECI announcements',
    ],
    officialLinks: [
      { label: 'ECI Official Website', url: 'https://eci.gov.in' },
      { label: 'Check Voter List', url: 'https://voters.eci.gov.in' },
    ],
    typicalTimeline: '60-90 days before election day',
  },
  {
    id: 'voter-registration',
    stepNumber: 2,
    title: 'Voter Registration',
    titleHindi: 'मतदाता पंजीकरण',
    icon: '📋',
    shortDescription: 'Register to vote using Form 6',
    shortDescriptionHindi: 'फॉर्म 6 का उपयोग करके मतदाता पंजीकरण',
    fullDescription:
      'Citizens aged 18+ can register to vote. The electoral roll is updated before every election.',
    keyFacts: [
      'Minimum age to vote: 18 years',
      'Register online at nvsp.in using Form 6',
      'Booth Level Officer (BLO) can help with registration',
      'Check your name at voters.eci.gov.in',
      'Voter ID (EPIC card) is issued after registration',
      'Address change: Use Form 8A',
    ],
    keyFactsHindi: [
      'मतदान के लिए न्यूनतम आयु 18 वर्ष है',
      'nvsp.in पर फॉर्म 6 से ऑनलाइन पंजीकरण करें',
      'बूथ लेवल ऑफिसर (BLO) से सहायता लें',
    ],
    whatYouShouldDo: [
      'Go to voters.eci.gov.in to check your name',
      'If not registered, fill Form 6 on nvsp.in',
      'Contact your local BLO if you need help',
      'Apply for address change with Form 8A if needed',
    ],
    officialLinks: [
      { label: 'Check Voter List', url: 'https://voters.eci.gov.in' },
      { label: 'Register to Vote (NVSP)', url: 'https://nvsp.in' },
    ],
    typicalTimeline: '45-60 days before election day',
  },
  {
    id: 'nominations',
    stepNumber: 3,
    title: 'Candidate Nominations',
    titleHindi: 'नामांकन प्रक्रिया',
    icon: '📝',
    shortDescription: 'Candidates file nomination papers',
    shortDescriptionHindi: 'प्रत्याशी नामांकन पत्र दाखिल करते हैं',
    fullDescription:
      'Eligible citizens can contest elections by filing nomination papers with the Returning Officer.',
    keyFacts: [
      'Any Indian citizen aged 25+ can contest Lok Sabha',
      'Security deposit: Rs 25,000 (general), Rs 12,500 (SC/ST)',
      'Nomination papers filed with Returning Officer',
      'Scrutiny of nomination papers after filing',
      'Withdrawal deadline: 2 weeks before polling',
      'Criminal cases must be declared in affidavit',
    ],
    keyFactsHindi: [
      '25+ वर्ष का कोई भी भारतीय नागरिक लोक सभा चुनाव लड़ सकता है',
      'जमानत राशि: 25,000 रुपये (सामान्य), 12,500 रुपये (SC/ST)',
    ],
    whatYouShouldDo: [
      'Check candidate affidavits at affidavit.eci.gov.in',
      'Know who is contesting in your constituency',
      'Review criminal records and assets of candidates',
    ],
    officialLinks: [
      { label: 'Candidate Affidavits', url: 'https://affidavit.eci.gov.in' },
    ],
    typicalTimeline: '30-45 days before election day',
  },
  {
    id: 'campaigning',
    stepNumber: 4,
    title: 'Election Campaign',
    titleHindi: 'चुनाव प्रचार',
    icon: '📣',
    shortDescription: 'Parties campaign under MCC rules',
    shortDescriptionHindi: 'दल आदर्श आचार संहिता के अंतर्गत प्रचार करते हैं',
    fullDescription:
      'Political parties and candidates campaign to present their agenda to voters while following Model Code of Conduct.',
    keyFacts: [
      'Campaign spending limits set by ECI',
      'Lok Sabha candidates: Max Rs 95 lakh spending',
      'No cash/gifts allowed in exchange for votes',
      'Paid news is banned and monitored',
      'Campaign must stop 48 hours before polling',
      'Election observers deployed by ECI',
    ],
    keyFactsHindi: [
      'ईसीआई द्वारा प्रचार खर्च सीमा निर्धारित',
      'लोक सभा प्रत्याशी: अधिकतम 95 लाख खर्च',
    ],
    whatYouShouldDo: [
      'Report any MCC violations to 1950',
      'Do not accept money or gifts for voting',
      'Verify information from official sources',
      'Report paid news to ECI',
    ],
    officialLinks: [
      { label: 'Report MCC Violation', url: 'https://eci.gov.in' },
    ],
    typicalTimeline: '30 days before election, ends 48hrs prior',
  },
  {
    id: 'voting-day',
    stepNumber: 5,
    title: 'Voting Day',
    titleHindi: 'मतदान दिवस',
    icon: '🗳️',
    shortDescription: 'Cast your vote at polling booth',
    shortDescriptionHindi: 'मतदान केंद्र पर अपना वोट डालें',
    fullDescription:
      'The most important day in the election process. Voters cast their vote using Electronic Voting Machines (EVM).',
    keyFacts: [
      'Polling booths open from 7 AM to 6 PM',
      'Carry ONE valid original ID proof',
      'EVM has candidate name and party symbol buttons',
      'VVPAT shows your vote as paper slip for 7 seconds',
      'NOTA (None of The Above) is the last option',
      'You have the right to vote without any pressure',
      'Senior citizens and PwD voters get priority',
    ],
    keyFactsHindi: [
      'मतदान केंद्र सुबह 7 बजे से शाम 6 बजे तक खुले रहते हैं',
      'एक वैध मूल पहचान पत्र साथ लाएं',
      'ईवीएम में प्रत्याशी का नाम और दल का चिन्ह होता है',
    ],
    whatYouShouldDo: [
      'Carry your Voter ID or any valid ID from 12 options',
      'Check your booth location at voters.eci.gov.in',
      'Reach the booth before 6 PM',
      'Do not photograph your EVM vote',
      'Report any issues to Presiding Officer or call 1950',
    ],
    officialLinks: [
      { label: 'Find My Polling Booth', url: 'https://voters.eci.gov.in' },
      { label: 'Voter Helpline', url: 'tel:1950' },
    ],
    typicalTimeline: 'Election Day (7 AM - 6 PM)',
  },
  {
    id: 'counting',
    stepNumber: 6,
    title: 'Vote Counting',
    titleHindi: 'मतगणना',
    icon: '📊',
    shortDescription: 'Votes are counted at counting centers',
    shortDescriptionHindi: 'मतगणना केंद्रों पर वोटों की गिनती',
    fullDescription:
      'After polling ends, EVM votes are counted at designated counting centers under strict supervision.',
    keyFacts: [
      'Counting begins at 8 AM on counting day',
      'Agents of all candidates can observe counting',
      'EVM votes counted round by round',
      'Postal ballots counted first',
      'VVPAT slips verified if dispute arises',
      'Results declared constituency by constituency',
    ],
    keyFactsHindi: [
      'मतगणना सुबह 8 बजे शुरू होती है',
      'सभी प्रत्याशियों के प्रतिनिधि गिनती देख सकते हैं',
    ],
    whatYouShouldDo: [
      'Follow results on official ECI Results portal',
      'Check eci.gov.in for official results',
      'Avoid unverified social media result claims',
    ],
    officialLinks: [
      { label: 'ECI Results', url: 'https://results.eci.gov.in' },
    ],
    typicalTimeline: '1-2 days after polling ends',
  },
  {
    id: 'government-formation',
    stepNumber: 7,
    title: 'Government Formation',
    titleHindi: 'सरकार का गठन',
    icon: '🏛️',
    shortDescription: 'Majority party forms the government',
    shortDescriptionHindi: 'बहुमत दल सरकार बनाता है',
    fullDescription:
      'After results, the party or coalition with majority seats forms the government. The President invites them to form the government.',
    keyFacts: [
      'Need 272+ seats for majority in Lok Sabha (543 total)',
      'President invites majority party/coalition leader',
      'Coalition: Multiple parties join if no single majority',
      'Prime Minister is sworn in by President of India',
      'Cabinet ministers appointed by PM',
      'New government takes charge within 2-3 weeks',
    ],
    keyFactsHindi: [
      'लोक सभा में बहुमत के लिए 272+ सीटें चाहिए',
      'राष्ट्रपति बहुमत दल को सरकार बनाने का निमंत्रण देते हैं',
    ],
    whatYouShouldDo: [
      'Watch PM oath ceremony on DD National',
      'Track your elected MP on eci.gov.in',
      'Know your rights with the new government',
    ],
    officialLinks: [
      { label: 'ECI Official', url: 'https://eci.gov.in' },
    ],
    typicalTimeline: '2-4 weeks after counting',
  },
]

/**
 * State-specific election information for major Indian states.
 * Covers Lok Sabha seats, Vidhan Sabha seats, and upcoming elections.
 * Source: ECI delimitation orders and state CEO websites.
 */
export const INDIAN_STATES_DATA: StateElectionInfo[] = [
  {
    stateName: 'Maharashtra',
    stateNameHindi: 'महाराष्ट्र',
    lokSabhaSeats: 48,
    vidhanSabhaSeats: 288,
    nextVidhanSabhaYear: 2029,
    lastVidhanSabhaYear: 2024,
    validIDsAtBooth: VALID_IDS_AT_BOOTH,
    specialNotes: 'Mumbai has highest voter density. Check booth on voters.eci.gov.in',
    officialWebsite: 'https://ceo.maharashtra.gov.in',
    upcomingElection: 'State Assembly 2029',
  },
  {
    stateName: 'Uttar Pradesh',
    stateNameHindi: 'उत्तर प्रदेश',
    lokSabhaSeats: 80,
    vidhanSabhaSeats: 403,
    nextVidhanSabhaYear: 2027,
    lastVidhanSabhaYear: 2022,
    validIDsAtBooth: VALID_IDS_AT_BOOTH,
    specialNotes: 'Highest Lok Sabha seats (80). Election in multiple phases.',
    officialWebsite: 'https://ceouttarpradesh.nic.in',
    upcomingElection: 'State Assembly 2027',
  },
  {
    stateName: 'West Bengal',
    stateNameHindi: 'पश्चिम बंगाल',
    lokSabhaSeats: 42,
    vidhanSabhaSeats: 294,
    nextVidhanSabhaYear: 2026,
    lastVidhanSabhaYear: 2021,
    validIDsAtBooth: VALID_IDS_AT_BOOTH,
    specialNotes: 'Bengali language support available at booths.',
    officialWebsite: 'https://ceowb.nic.in',
    upcomingElection: 'State Assembly 2026',
  },
  {
    stateName: 'Bihar',
    stateNameHindi: 'बिहार',
    lokSabhaSeats: 40,
    vidhanSabhaSeats: 243,
    nextVidhanSabhaYear: 2025,
    lastVidhanSabhaYear: 2020,
    validIDsAtBooth: VALID_IDS_AT_BOOTH,
    specialNotes: 'Bihar elections typically in October-November.',
    officialWebsite: 'https://ceobihar.nic.in',
    upcomingElection: 'State Assembly 2025',
  },
  {
    stateName: 'Tamil Nadu',
    stateNameHindi: 'तमिलनाडु',
    lokSabhaSeats: 39,
    vidhanSabhaSeats: 234,
    nextVidhanSabhaYear: 2026,
    lastVidhanSabhaYear: 2021,
    validIDsAtBooth: VALID_IDS_AT_BOOTH,
    specialNotes: 'Tamil language support. High voter literacy state.',
    officialWebsite: 'https://elections.tn.gov.in',
    upcomingElection: 'State Assembly 2026',
  },
  {
    stateName: 'Karnataka',
    stateNameHindi: 'कर्नाटक',
    lokSabhaSeats: 28,
    vidhanSabhaSeats: 224,
    nextVidhanSabhaYear: 2028,
    lastVidhanSabhaYear: 2023,
    validIDsAtBooth: VALID_IDS_AT_BOOTH,
    specialNotes: 'Kannada language support available.',
    officialWebsite: 'https://ceokarnataka.kar.nic.in',
    upcomingElection: 'State Assembly 2028',
  },
  {
    stateName: 'Gujarat',
    stateNameHindi: 'गुजरात',
    lokSabhaSeats: 26,
    vidhanSabhaSeats: 182,
    nextVidhanSabhaYear: 2027,
    lastVidhanSabhaYear: 2022,
    validIDsAtBooth: VALID_IDS_AT_BOOTH,
    specialNotes: 'Gujarati language support at booths.',
    officialWebsite: 'https://www.gujaratelection.nic.in',
    upcomingElection: 'State Assembly 2027',
  },
  {
    stateName: 'Rajasthan',
    stateNameHindi: 'राजस्थान',
    lokSabhaSeats: 25,
    vidhanSabhaSeats: 200,
    nextVidhanSabhaYear: 2028,
    lastVidhanSabhaYear: 2023,
    validIDsAtBooth: VALID_IDS_AT_BOOTH,
    specialNotes: 'Largest state by area. Desert regions have mobile booths.',
    officialWebsite: 'https://ceorajasthan.nic.in',
    upcomingElection: 'State Assembly 2028',
  },
  {
    stateName: 'Delhi',
    stateNameHindi: 'दिल्ली',
    lokSabhaSeats: 7,
    vidhanSabhaSeats: 70,
    nextVidhanSabhaYear: 2030,
    lastVidhanSabhaYear: 2025,
    validIDsAtBooth: VALID_IDS_AT_BOOTH,
    specialNotes: 'National capital. High migrant voter population.',
    officialWebsite: 'https://ceodelhi.gov.in',
    upcomingElection: 'State Assembly 2030',
  },
  {
    stateName: 'Madhya Pradesh',
    stateNameHindi: 'मध्य प्रदेश',
    lokSabhaSeats: 29,
    vidhanSabhaSeats: 230,
    nextVidhanSabhaYear: 2028,
    lastVidhanSabhaYear: 2023,
    validIDsAtBooth: VALID_IDS_AT_BOOTH,
    specialNotes: 'Tribal areas have special voting arrangements.',
    officialWebsite: 'https://www.ceomadhyapradesh.nic.in',
    upcomingElection: 'State Assembly 2028',
  },
  {
    stateName: 'Andhra Pradesh',
    stateNameHindi: 'आंध्र प्रदेश',
    lokSabhaSeats: 25,
    vidhanSabhaSeats: 175,
    nextVidhanSabhaYear: 2029,
    lastVidhanSabhaYear: 2024,
    validIDsAtBooth: VALID_IDS_AT_BOOTH,
    specialNotes: 'Telugu language support available at booths.',
    officialWebsite: 'https://ceoandhra.nic.in',
    upcomingElection: 'State Assembly 2029',
  },
  {
    stateName: 'Telangana',
    stateNameHindi: 'तेलंगाना',
    lokSabhaSeats: 17,
    vidhanSabhaSeats: 119,
    nextVidhanSabhaYear: 2028,
    lastVidhanSabhaYear: 2023,
    validIDsAtBooth: VALID_IDS_AT_BOOTH,
    specialNotes: 'Youngest state. Telugu and Urdu language support.',
    officialWebsite: 'https://ceotelangana.nic.in',
    upcomingElection: 'State Assembly 2028',
  },
  {
    stateName: 'Kerala',
    stateNameHindi: 'केरल',
    lokSabhaSeats: 20,
    vidhanSabhaSeats: 140,
    nextVidhanSabhaYear: 2026,
    lastVidhanSabhaYear: 2021,
    validIDsAtBooth: VALID_IDS_AT_BOOTH,
    specialNotes: 'Highest voter literacy rate in India. Malayalam support.',
    officialWebsite: 'https://www.ceo.kerala.gov.in',
    upcomingElection: 'State Assembly 2026',
  },
  {
    stateName: 'Punjab',
    stateNameHindi: 'पंजाब',
    lokSabhaSeats: 13,
    vidhanSabhaSeats: 117,
    nextVidhanSabhaYear: 2027,
    lastVidhanSabhaYear: 2022,
    validIDsAtBooth: VALID_IDS_AT_BOOTH,
    specialNotes: 'Punjabi language support. High NRI voter interest.',
    officialWebsite: 'https://ceopunjab.nic.in',
    upcomingElection: 'State Assembly 2027',
  },
  {
    stateName: 'Haryana',
    stateNameHindi: 'हरियाणा',
    lokSabhaSeats: 10,
    vidhanSabhaSeats: 90,
    nextVidhanSabhaYear: 2029,
    lastVidhanSabhaYear: 2024,
    validIDsAtBooth: VALID_IDS_AT_BOOTH,
    specialNotes: 'High women voter turnout in recent elections.',
    officialWebsite: 'https://ceoharyana.gov.in',
    upcomingElection: 'State Assembly 2029',
  },
]

/**
 * Achievement badges for the ChunaavAI gamification system.
 * Badges are unlocked by accumulating points through learning activities.
 */
export const BADGES_DATA: Badge[] = [
  {
    id: 'naya-voter',
    name: 'Naya Voter',
    nameHindi: 'नया मतदाता',
    description: 'Completed your first learning step!',
    descriptionHindi: 'पहला सीखने का कदम पूरा किया!',
    icon: '🌱',
    pointsRequired: 30,
    isEarned: false,
  },
  {
    id: 'quiz-champion',
    name: 'Quiz Champion',
    nameHindi: 'क्विज़ चैंपियन',
    description: 'Scored 80%+ in any quiz',
    descriptionHindi: 'किसी भी क्विज़ में 80%+ अंक',
    icon: '🏆',
    pointsRequired: 150,
    isEarned: false,
  },
  {
    id: 'chunaav-gyani',
    name: 'Chunaav Gyani',
    nameHindi: 'चुनाव ज्ञानी',
    description: 'Completed the full election timeline',
    descriptionHindi: 'पूरी चुनाव टाइमलाइन पूरी की',
    icon: '🎓',
    pointsRequired: 400,
    isEarned: false,
  },
  {
    id: 'democracy-hero',
    name: 'Democracy Hero',
    nameHindi: 'लोकतंत्र नायक',
    description: 'Completed all modules and checklist',
    descriptionHindi: 'सभी मॉड्यूल और चेकलिस्ट पूरी',
    icon: '🇮🇳',
    pointsRequired: 800,
    isEarned: false,
  },
]

/**
 * Suggested starter questions for the CivicBot chat interface.
 * Written in Hinglish to match the target audience's natural language.
 */
export const CIVICBOT_STARTER_QUESTIONS: string[] = [
  'EVM kaise kaam karta hai? 🖥️',
  'NOTA kya hota hai? 🗳️',
  'Voter ID kaise banwayein? 📋',
  'Lok Sabha aur Vidhan Sabha mein fark? 🏛️',
  'Mera naam voter list mein kaise check karein?',
  'MCC kya hoti hai? ⚖️',
  'VVPAT kya hai aur kaise kaam karta hai?',
  'Phase-wise election kyun hota hai India mein?',
]

/**
 * High-level Indian election statistics for the platform dashboard.
 * Source: ECI official data, 2024 General Elections.
 */
export const INDIA_ELECTION_STATS = {
  totalVoters: '97 Crore+',
  lokSabhaSeats: 543,
  rajyaSabhaSeats: 245,
  electionTypes: 4,
  totalStates: 28,
  totalUTs: 8,
  validVoterIDs: 12,
  voterHelpline: '1950',
  officialWebsite: 'eci.gov.in',
  registrationPortal: 'voters.eci.gov.in',
  nvspPortal: 'nvsp.in',
  affidavitPortal: 'affidavit.eci.gov.in',
  resultsPortal: 'results.eci.gov.in',
} as const

/**
 * Default voter readiness checklist items.
 * Shown to all users regardless of state selection.
 * Each item awards 50 points when checked.
 */
export const READINESS_CHECKLIST: ChecklistItem[] = [
  {
    id: 'voter-registered',
    category: 'Registration',
    title: 'Registered to Vote',
    titleHindi: 'मतदाता पंजीकरण',
    description: 'Your name is active in current electoral roll',
    descriptionHindi: 'आपका नाम मतदाता सूची में है',
    actionLink: 'https://voters.eci.gov.in',
    actionLabel: 'Check Now',
    isChecked: false,
  },
  {
    id: 'voter-id-secured',
    category: 'ID',
    title: 'Voter ID (EPIC) Secured',
    titleHindi: 'मतदाता पहचान पत्र तैयार',
    description: 'Physical or digital EPIC card is ready',
    descriptionHindi: 'भौतिक या डिजिटल EPIC कार्ड तैयार है',
    isChecked: false,
  },
  {
    id: 'polling-booth',
    category: 'Booth',
    title: 'Know My Polling Booth',
    titleHindi: 'मतदान केंद्र की जानकारी',
    description: 'Know exactly where to go on election day',
    descriptionHindi: 'चुनाव के दिन कहाँ जाना है यह जानते हैं',
    actionLink: 'https://voters.eci.gov.in',
    actionLabel: 'Find Booth',
    isChecked: false,
  },
  {
    id: 'voting-date',
    category: 'Knowledge',
    title: 'Checked Voting Date & Time',
    titleHindi: 'मतदान तिथि और समय जाँचा',
    description: 'Polling booths open 7 AM to 6 PM',
    descriptionHindi: 'मतदान केंद्र सुबह 7 से शाम 6 बजे तक',
    isChecked: false,
  },
]

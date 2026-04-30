/**
 * ChunaavAI Complete TypeScript Types
 * India election education platform
 * All types strictly typed - no 'any'
 */

/** All 28 Indian states + 8 Union Territories covered by ECI */
export type IndianState =
  | 'Andhra Pradesh'
  | 'Arunachal Pradesh'
  | 'Assam'
  | 'Bihar'
  | 'Chhattisgarh'
  | 'Goa'
  | 'Gujarat'
  | 'Haryana'
  | 'Himachal Pradesh'
  | 'Jharkhand'
  | 'Karnataka'
  | 'Kerala'
  | 'Madhya Pradesh'
  | 'Maharashtra'
  | 'Manipur'
  | 'Meghalaya'
  | 'Mizoram'
  | 'Nagaland'
  | 'Odisha'
  | 'Punjab'
  | 'Rajasthan'
  | 'Sikkim'
  | 'Tamil Nadu'
  | 'Telangana'
  | 'Tripura'
  | 'Uttar Pradesh'
  | 'Uttarakhand'
  | 'West Bengal'
  | 'Delhi'
  | 'Jammu & Kashmir'
  | 'Ladakh'
  | 'Puducherry'
  | 'Chandigarh'
  | 'Andaman & Nicobar'
  | 'Lakshadweep'
  | 'Dadra & Nagar Haveli'

/** Types of elections held in India as per ECI */
export type ElectionType =
  | 'Lok Sabha'
  | 'Rajya Sabha'
  | 'Vidhan Sabha'
  | 'Local Body'

/** Available quiz topics covering Indian election education */
export type QuizTopic =
  | 'Voter Registration'
  | 'EVM & VVPAT'
  | 'Lok Sabha'
  | 'Vidhan Sabha'
  | 'Model Code of Conduct'
  | 'Election Commission of India'
  | 'NOTA'
  | 'Voting Day Process'
  | 'Government Formation'
  | 'Indian Constitution'

/** Difficulty levels for quiz questions */
export type QuizDifficulty = 'basic' | 'intermediate' | 'advanced'

/** Criminal record status for candidate affidavits */
export type RecordStatus = 'clean' | 'pending' | 'serious'

/** Categories for voter readiness checklist */
export type ChecklistCategory = 'Registration' | 'ID' | 'Booth' | 'Knowledge'

/**
 * A single step in the election timeline (e.g., Announcement, Voting Day)
 * Source: ECI official election process documentation
 */
export interface ElectionStep {
  /** Unique identifier for this step */
  id: string
  /** Sequential order of this step (1-indexed) */
  stepNumber: number
  /** English title of the step */
  title: string
  /** Hindi title of the step */
  titleHindi: string
  /** Emoji icon for visual representation */
  icon: string
  /** Brief English description shown in cards */
  shortDescription: string
  /** Brief Hindi description shown in cards */
  shortDescriptionHindi: string
  /** Full English explanation of this step */
  fullDescription: string
  /** Key factual points in English */
  keyFacts: string[]
  /** Key factual points in Hindi */
  keyFactsHindi: string[]
  /** Action items voters should take at this step */
  whatYouShouldDo: string[]
  /** Official government/ECI links relevant to this step */
  officialLinks: OfficialLink[]
  /** Approximate timeframe relative to election day */
  typicalTimeline: string
}

/**
 * Official government or ECI link
 */
export interface OfficialLink {
  /** Display label for the link */
  label: string
  /** Full URL of the official resource */
  url: string
}

/**
 * State-specific election information sourced from ECI
 */
export interface StateElectionInfo {
  /** Official Indian state or UT name */
  stateName: IndianState
  /** Hindi name of the state/UT */
  stateNameHindi: string
  /** Number of Lok Sabha constituencies in this state */
  lokSabhaSeats: number
  /** Number of Vidhan Sabha seats in this state */
  vidhanSabhaSeats: number
  /** Year of next scheduled Vidhan Sabha election */
  nextVidhanSabhaYear: number
  /** Year of most recent Vidhan Sabha election */
  lastVidhanSabhaYear: number
  /** List of valid ID documents accepted at booths in this state */
  validIDsAtBooth: string[]
  /** State-specific notes for voters */
  specialNotes: string
  /** URL of state Chief Electoral Officer website */
  officialWebsite: string
  /** Human-readable upcoming election description (optional) */
  upcomingElection?: string
}

/**
 * A single multiple-choice quiz question about Indian elections
 */
export interface QuizQuestion {
  /** Unique identifier for this question */
  id: string
  /** Question text in English */
  question: string
  /** Question text in Hindi */
  questionHindi: string
  /** Four answer options in English */
  options: string[]
  /** Four answer options in Hindi */
  optionsHindi: string[]
  /** Zero-based index of the correct option */
  correctIndex: number
  /** Explanation of the correct answer in English */
  explanation: string
  /** Explanation of the correct answer in Hindi */
  explanationHindi: string
  /** Difficulty level of this question */
  difficulty: QuizDifficulty
  /** Topic category this question belongs to */
  topic: QuizTopic
  /** Points awarded for a correct answer */
  points: number
}

/**
 * Result of a completed quiz session
 */
export interface QuizScore {
  /** Topic of the completed quiz */
  topic: QuizTopic
  /** Number of correct answers */
  score: number
  /** Total questions in the quiz */
  totalQuestions: number
  /** Points earned in this session */
  pointsEarned: number
  /** When the quiz was completed */
  completedAt: Date
}

/**
 * Achievement badge earned by a user
 */
export interface Badge {
  /** Unique badge identifier */
  id: string
  /** Badge name in English */
  name: string
  /** Badge name in Hindi */
  nameHindi: string
  /** Badge description in English */
  description: string
  /** Badge description in Hindi */
  descriptionHindi: string
  /** Emoji icon for the badge */
  icon: string
  /** Minimum points required to earn this badge */
  pointsRequired: number
  /** Whether the user has earned this badge */
  isEarned: boolean
  /** When the badge was earned (if applicable) */
  earnedAt?: Date
}

/**
 * A single message in the CivicBot conversation
 */
export interface ChatMessage {
  /** Unique message identifier */
  id: string
  /** Whether the message is from the user or CivicBot */
  role: 'user' | 'assistant'
  /** Message text content */
  content: string
  /** When the message was sent */
  timestamp: Date
  /** True while awaiting AI response */
  isLoading?: boolean
}

/**
 * A single item in the voter readiness checklist
 */
export interface ChecklistItem {
  /** Unique checklist item identifier */
  id: string
  /** Category this item belongs to */
  category: ChecklistCategory
  /** English title of this checklist item */
  title: string
  /** Hindi title of this checklist item */
  titleHindi: string
  /** English description of what to do */
  description: string
  /** Hindi description of what to do */
  descriptionHindi: string
  /** Optional URL for taking action */
  actionLink?: string
  /** Optional label for the action button */
  actionLabel?: string
  /** Whether the user has completed this item */
  isChecked: boolean
}

/**
 * Complete user profile and progress stored in Firestore
 */
export interface UserProgress {
  /** Firebase Auth UID */
  userId: string
  /** User's display name */
  displayName: string
  /** User's email address */
  email: string
  /** User's Google profile photo URL */
  photoURL?: string
  /** User's selected Indian state for personalized content */
  selectedState: IndianState | null
  /** User's preferred election type for content filtering */
  selectedElectionType: ElectionType | null
  /** IDs of election timeline steps the user has completed */
  completedSteps: string[]
  /** Total gamification points accumulated */
  totalPoints: number
  /** History of all quiz sessions */
  quizScores: QuizScore[]
  /** All badges (earned and unearned) */
  badges: Badge[]
  /** Voter readiness checklist with user's checked state */
  checklistItems: ChecklistItem[]
  /** Firestore server timestamp of account creation */
  createdAt: Date
  /** Firestore server timestamp of last update */
  updatedAt: Date
}

/**
 * Candidate affidavit data from ECI public disclosures
 */
export interface Candidate {
  /** Unique candidate identifier */
  id: string
  /** Candidate's full name */
  name: string
  /** Political party name */
  party: string
  /** Constituency the candidate is contesting from */
  constituency: string
  /** State of the constituency */
  state: IndianState
  /** Candidate's educational qualification */
  education: string
  /** Number of criminal cases declared in affidavit */
  criminalCases: number
  /** Severity classification of criminal record */
  recordStatus: RecordStatus
  /** Gemini AI generated non-partisan insight from affidavit */
  aiInsight: string
  /** URL to the official ECI affidavit PDF */
  affidavitUrl: string
}

/**
 * Standard API response wrapper for all API routes
 */
export interface ApiResponse<T> {
  /** Whether the request succeeded */
  success: boolean
  /** Response payload (present on success) */
  data?: T
  /** Error message (present on failure) */
  error?: string
}

/**
 * Request body for POST /api/chat
 */
export interface ChatRequest {
  /** User's message to CivicBot */
  message: string
  /** Previous messages in this conversation for context */
  conversationHistory: ChatMessage[]
  /** User's state for personalized answers (optional) */
  userState?: IndianState
}

/**
 * Request body for POST /api/quiz
 */
export interface QuizRequest {
  /** Topic to generate questions about */
  topic: QuizTopic
  /** Difficulty level for questions */
  difficulty: QuizDifficulty
  /** Number of questions to generate (1-10) */
  numberOfQuestions: number
}

/**
 * Request body for POST /api/state-info
 */
export interface StateInfoRequest {
  /** Indian state or UT to fetch data for */
  state: IndianState
}

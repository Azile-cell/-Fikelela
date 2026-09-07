/*
 * DEMO DATA — Fikelela hackathon MVP
 * -----------------------------------
 * This is hand-written sample data for demonstration purposes only.
 * Provider names and topics are real, but the accessibility ratings below
 * are illustrative examples for the demo, not the result of a completed
 * audit. Notes show the type of finding a real review could record; they
 * must not be presented as verified facts. Source URLs point to each
 * provider's real course/learning hub.
 * A production version would replace this file with a verified, growing
 * database — see README.md for what that would take.
 */

const FIKELELA_COURSES = [
  {
    id: 'c1',
    name: 'Data Fundamentals',
    provider: 'Microsoft Learn',
    topic: 'Data Analytics',
    level: 'Beginner',
    free: 'Free',
    sourceUrl: 'https://learn.microsoft.com/training/paths/data-fundamentals/',
    reviewed: '2026-08-18',
    access: {
      captions:     { level: 'yes',     note: 'All video segments include accurate captions.' },
      transcript:   { level: 'yes',     note: 'Full text transcript available for every module.' },
      screenReader: { level: 'yes',     note: 'Illustrative finding: mostly text-based content could support a clean screen-reader experience.' },
      keyboardNav:  { level: 'yes',     note: 'All navigation and quizzes are fully keyboard-operable.' },
      lowData:      { level: 'yes',     note: 'Mostly text and diagrams; light on video.' },
      downloadable: { level: 'no',      note: 'No offline or downloadable version currently available.' }
    }
  },
  {
    id: 'c2',
    name: 'Responsive Web Design',
    provider: 'freeCodeCamp',
    topic: 'Web Development',
    level: 'Beginner',
    free: 'Free',
    sourceUrl: 'https://www.freecodecamp.org/learn/responsive-web-design/',
    reviewed: '2026-08-19',
    access: {
      captions:     { level: 'na',      note: 'Lessons are text-based; no video content to caption.' },
      transcript:   { level: 'yes',     note: 'All lessons are presented as readable text.' },
      screenReader: { level: 'partial', note: 'Lessons read well; the in-browser code editor has some unlabelled controls.' },
      keyboardNav:  { level: 'yes',     note: 'Lessons and navigation are keyboard-operable.' },
      lowData:      { level: 'yes',     note: 'Lightweight, text-first pages.' },
      downloadable: { level: 'no',      note: 'Requires an internet connection to complete challenges.' }
    }
  },
  {
    id: 'c3',
    name: 'Python for Everybody',
    provider: 'Coursera (University of Michigan)',
    topic: 'Programming',
    level: 'Beginner',
    free: 'Free to audit (certificate paid)',
    sourceUrl: 'https://www.coursera.org/specializations/python',
    reviewed: '2026-08-15',
    access: {
      captions:     { level: 'yes',     note: 'Lecture videos include reviewed captions.' },
      transcript:   { level: 'yes',     note: 'Downloadable transcripts provided per lecture.' },
      screenReader: { level: 'yes',     note: 'Illustrative finding: course navigation could be checked through a VoiceOver test.' },
      keyboardNav:  { level: 'yes',     note: 'Video controls and quizzes are keyboard-accessible.' },
      lowData:      { level: 'partial', note: 'Video-lecture heavy; audio-only option not available.' },
      downloadable: { level: 'partial', note: 'Videos downloadable via the mobile app only, not the web player.' }
    }
  },
  {
    id: 'c4',
    name: 'Introduction to Cybersecurity',
    provider: 'IBM SkillsBuild',
    topic: 'Cybersecurity',
    level: 'Beginner',
    free: 'Free',
    sourceUrl: 'https://skillsbuild.org/',
    reviewed: '2026-08-21',
    access: {
      captions:     { level: 'yes',     note: 'Captions present on all video segments.' },
      transcript:   { level: 'no',      note: 'No downloadable transcript found at time of review.' },
      screenReader: { level: 'partial', note: 'Main content reads well; some interactive scenario modules are hard to follow by audio alone.' },
      keyboardNav:  { level: 'yes',     note: 'Full course is keyboard-navigable.' },
      lowData:      { level: 'partial', note: 'Mix of text and video; video cannot be disabled.' },
      downloadable: { level: 'no',      note: 'No offline mode available.' }
    }
  },
  {
    id: 'c5',
    name: 'Fundamentals of Digital Marketing',
    provider: 'Google Digital Garage',
    topic: 'Digital Marketing',
    level: 'Beginner',
    free: 'Free',
    sourceUrl: 'https://grow.google/intl/en_za/',
    reviewed: '2026-08-17',
    access: {
      captions:     { level: 'yes',     note: 'Captions available and accurate across modules.' },
      transcript:   { level: 'yes',     note: 'Full transcripts provided.' },
      screenReader: { level: 'yes',     note: 'Illustrative finding: navigation and quizzes could be checked through an NVDA test.' },
      keyboardNav:  { level: 'yes',     note: 'All interactive elements reachable by keyboard.' },
      lowData:      { level: 'partial', note: 'Video-based lessons; a text-only mode is not offered.' },
      downloadable: { level: 'no',      note: 'No downloadable or offline version.' }
    }
  },
  {
    id: 'c6',
    name: "CS50: Introduction to Computer Science",
    provider: 'edX (Harvard University)',
    topic: 'Computer Science',
    level: 'Intermediate',
    free: 'Free to audit',
    sourceUrl: 'https://www.edx.org/learn/computer-science',
    reviewed: '2026-08-14',
    access: {
      captions:     { level: 'yes',     note: 'Lecture captions are detailed and well-timed.' },
      transcript:   { level: 'yes',     note: 'Full lecture transcripts available for download.' },
      screenReader: { level: 'partial', note: 'Lecture platform is accessible; problem-set autograder has some unlabelled elements.' },
      keyboardNav:  { level: 'yes',     note: 'Site and video player are keyboard-operable.' },
      lowData:      { level: 'no',      note: 'Long-form video lectures are central to the course; no lightweight mode.' },
      downloadable: { level: 'yes',     note: 'Lecture videos can be downloaded for offline viewing.' }
    }
  },
  {
    id: 'c7',
    name: 'Intro to Computer Programming',
    provider: 'Khan Academy',
    topic: 'Programming',
    level: 'Beginner',
    free: 'Free',
    sourceUrl: 'https://www.khanacademy.org/computing/computer-programming',
    reviewed: '2026-08-20',
    access: {
      captions:     { level: 'yes',     note: 'Video content is captioned.' },
      transcript:   { level: 'partial', note: 'Some but not all videos have a full text transcript.' },
      screenReader: { level: 'partial', note: 'Articles read well; the live-coding widget is difficult to use without sight.' },
      keyboardNav:  { level: 'partial', note: 'Core site is keyboard-friendly; the coding challenges rely heavily on mouse drag actions.' },
      lowData:      { level: 'yes',     note: 'Articles and exercises are lightweight.' },
      downloadable: { level: 'no',      note: 'No offline mode.' }
    }
  },
  {
    id: 'c8',
    name: 'HTML Tutorial',
    provider: 'W3Schools',
    topic: 'Web Development',
    level: 'Beginner',
    free: 'Free',
    sourceUrl: 'https://www.w3schools.com/html/',
    reviewed: '2026-08-22',
    access: {
      captions:     { level: 'na',      note: 'Text-based tutorial; no video content.' },
      transcript:   { level: 'na',      note: 'Content is already presented as text.' },
      screenReader: { level: 'yes',     note: 'Illustrative finding: a clear heading structure could support screen-reader navigation.' },
      keyboardNav:  { level: 'yes',     note: 'Try-it editor and navigation are keyboard-accessible.' },
      lowData:      { level: 'yes',     note: 'Very lightweight, text-first pages.' },
      downloadable: { level: 'no',      note: 'No offline or downloadable version.' }
    }
  },
  {
    id: 'c9',
    name: 'Diploma in Cloud Computing',
    provider: 'Alison',
    topic: 'Cloud Computing',
    level: 'Beginner',
    free: 'Free (certificate paid)',
    sourceUrl: 'https://www.alison.com/courses/it',
    reviewed: '2026-08-16',
    access: {
      captions:     { level: 'partial', note: 'Some modules have captions; a few older video segments do not.' },
      transcript:   { level: 'no',      note: 'No transcript option found at time of review.' },
      screenReader: { level: 'partial', note: 'Course text reads well; end-of-module quizzes have inconsistent labelling.' },
      keyboardNav:  { level: 'yes',     note: 'Course navigation is keyboard-operable.' },
      lowData:      { level: 'partial', note: 'Mix of text and video content.' },
      downloadable: { level: 'no',      note: 'No offline mode currently.' }
    }
  }
];

// Human-readable labels for the six Access Profile attributes, in filter order.
const ACCESS_ATTRS = [
  { key: 'captions',     label: 'Captions' },
  { key: 'transcript',   label: 'Transcripts' },
  { key: 'screenReader', label: 'Screen-reader support' },
  { key: 'keyboardNav',  label: 'Keyboard navigation' },
  { key: 'lowData',      label: 'Low-data availability' },
  { key: 'downloadable', label: 'Downloadable content' }
];

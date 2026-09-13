import type { CourseSubject, SessionPackage, PartnerClub, TutorProfile, TutoringSession, PyqPaper, CampusRoom } from '../types/prepwise';

export const COURSE_SUBJECTS: CourseSubject[] = [
  {
    id: 'eng-maths-3',
    name: 'Engineering Mathematics III (PDE & Complex Variables)',
    code: 'MA301',
    category: 'engineering',
    tutorsCount: 14,
    icon: 'Calculator',
    description: 'Partial differential equations, Fourier transforms, complex integration, and residue calculus.'
  },
  {
    id: 'dsa',
    name: 'Data Structures & Algorithms in C++/Java',
    code: 'CS201',
    category: 'computer_science',
    tutorsCount: 22,
    icon: 'Code2',
    description: 'Trees, Graphs, Dynamic Programming, Heap sort, Time complexity proofs, and lab exam solutions.'
  },
  {
    id: 'digital-electronics',
    name: 'Digital Logic & Microprocessors (8086/ARM)',
    code: 'EC204',
    category: 'electronics',
    tutorsCount: 11,
    icon: 'Cpu',
    description: 'K-Maps, Combinational circuits, Assembly programming, timing diagrams, and lab simulator walkthroughs.'
  },
  {
    id: 'dbms',
    name: 'Database Management Systems & SQL Querying',
    code: 'CS302',
    category: 'computer_science',
    tutorsCount: 18,
    icon: 'Database',
    description: 'Relational algebra, ER diagrams, B+ Trees, 3NF/BCNF normalization, and complex JOIN queries.'
  },
  {
    id: 'operating-systems',
    name: 'Operating Systems & System Programming',
    code: 'CS304',
    category: 'computer_science',
    tutorsCount: 15,
    icon: 'Terminal',
    description: 'Process synchronization, Semaphores, Page replacement algorithms, and POSIX thread coding.'
  },
  {
    id: 'organic-chem',
    name: 'Engineering Chemistry & Spectroscopy',
    code: 'CH101',
    category: 'basic_sciences',
    tutorsCount: 9,
    icon: 'FlaskConical',
    description: 'NMR Spectroscopy, Phase rule, Reaction kinetics, Water treatment calculations, and lab viva prep.'
  }
];

export const SESSION_PACKAGES: SessionPackage[] = [
  {
    id: 'one_on_one',
    title: '1-on-1 Peer Exam Sprint',
    subtitle: 'Direct peer tutoring tailored to your exact syllabus & weak spots (100% Free)',
    popular: true,
    features: [
      '60 Minutes 1-on-1 Live Campus / Online Session',
      'Previous Year Questions (PYQs) Solved',
      'Custom Formula & Code Cheat Sheets Included',
      'Direct WhatsApp Peer Study Support',
      '100% Free — No Hidden Fees or Charges'
    ]
  },
  {
    id: 'group_sprint',
    title: 'Group Study Circle (3-5 Students)',
    subtitle: 'Study together with classmates and solve exam problems as a group',
    features: [
      '90 Minutes Interactive Group Peer Session',
      'Shared PYQ Problem Solving & Discussion',
      'Lab Exam & Viva Question Bank Walkthrough',
      'Open Collaborative Campus Study',
      '100% Free Community Event'
    ]
  },
  {
    id: 'subject_mastery',
    title: 'Complete Unit Review Workshop',
    subtitle: 'Full unit walkthrough + 3 mock exam review sessions with senior TAs',
    features: [
      '3 x 60-Min Intensive Peer Sessions',
      'End-to-End Syllabus Coverage',
      'Passing & Top-Grade Preparation Roadmap',
      'Handwritten Notes & Diagrams Archive Access',
      '100% Free Campus Initiative'
    ]
  }
];

export const SEED_CLUBS: PartnerClub[] = [
  {
    id: 'club-vnr-aws',
    name: 'AWS Cloud Club VNRVJIET',
    collegeName: 'VNR Vignana Jyothi Institute of Tech',
    referralCode: 'VNR_AWS_2026',
    totalAttributedSessions: 28,
    totalStudentsHelped: 84,
    leadName: 'Karthik Rao (President)',
    leadContact: '+91 98490 12345'
  },
  {
    id: 'club-cbit-csi',
    name: 'CSI Student Chapter CBIT',
    collegeName: 'Chaitanya Bharathi Institute of Tech',
    referralCode: 'CBIT_CSI_PREP',
    totalAttributedSessions: 36,
    totalStudentsHelped: 112,
    leadName: 'Ananya Sharma (Chair)',
    leadContact: '+91 97012 34567'
  },
  {
    id: 'club-mjcet-ieee',
    name: 'IEEE Student Branch MJCET',
    collegeName: 'Muffakham Jah College of Engg',
    referralCode: 'MJCET_IEEE_PRO',
    totalAttributedSessions: 19,
    totalStudentsHelped: 57,
    leadName: 'Mohammed Ahmed (Chair)',
    leadContact: '+91 91234 56789'
  }
];

export const SEED_TUTORS: TutorProfile[] = [
  {
    id: 'tutor-1',
    userId: 'user-tutor-arjun',
    name: 'Arjun Reddy',
    email: 'arjun.reddy@student.vnrvjiet.ac.in',
    phone: '+91 98765 43210',
    college: 'VNRVJIET Hyderabad',
    major: 'Computer Science & Engg (4th Year)',
    gpa: 9.4,
    subjectsHandled: ['dsa', 'operating-systems', 'dbms'],
    volunteerHours: 32,
    karmaPoints: 480,
    totalSessionsCompleted: 18,
    rating: 4.9,
    status: 'approved',
    appliedAt: '2026-08-15T10:00:00.000Z',
    badge: 'Senior TA'
  },
  {
    id: 'tutor-2',
    userId: 'user-tutor-sneha',
    name: 'Sneha Kulkarni',
    email: 'sneha.k@student.cbit.ac.in',
    phone: '+91 98123 45678',
    college: 'CBIT Hyderabad',
    major: 'Electronics & Comm Engg (3rd Year)',
    gpa: 9.6,
    subjectsHandled: ['eng-maths-3', 'digital-electronics'],
    volunteerHours: 42,
    karmaPoints: 640,
    totalSessionsCompleted: 24,
    rating: 4.95,
    status: 'approved',
    appliedAt: '2026-08-20T14:30:00.000Z',
    badge: 'Gold Peer Tutor'
  }
];

export const SEED_SESSIONS: TutoringSession[] = [
  {
    id: 'session-101',
    publicToken: 'pw-tok-78901',
    studentName: 'Rahul Verma',
    studentContact: '+91 99887 76655',
    collegeName: 'VNRVJIET Hyderabad',
    courseId: 'dsa',
    courseName: 'Data Structures & Algorithms in C++/Java',
    sessionType: 'one_on_one',
    durationMins: 60,
    isFree: true,
    tutorId: 'tutor-1',
    tutorName: 'Arjun Reddy',
    sessionStatus: 'completed',
    locationOrLink: 'Library Discussion Room B3 / Google Meet',
    partnerClubId: 'club-vnr-aws',
    partnerClubName: 'AWS Cloud Club VNRVJIET',
    rating: 5,
    reviewText: 'Arjun explained Dynamic Programming concepts super clearly before our lab exam. Solved 4 PYQs!',
    createdAt: '2026-09-12T09:30:00.000Z'
  },
  {
    id: 'session-102',
    publicToken: 'pw-tok-78902',
    studentName: 'Pooja Hegde',
    studentContact: '+91 98765 11223',
    collegeName: 'CBIT Hyderabad',
    courseId: 'eng-maths-3',
    courseName: 'Engineering Mathematics III (PDE & Complex Variables)',
    sessionType: 'group_sprint',
    durationMins: 90,
    isFree: true,
    tutorId: 'tutor-2',
    tutorName: 'Sneha Kulkarni',
    sessionStatus: 'ready',
    locationOrLink: 'CBIT Academic Block III - Room 204',
    partnerClubId: 'club-cbit-csi',
    partnerClubName: 'CSI Student Chapter CBIT',
    createdAt: '2026-09-12T11:15:00.000Z'
  }
];

export const SEED_PYQS: PyqPaper[] = [
  {
    id: 'pyq-dsa-2025',
    subjectCode: 'CS201',
    subjectName: 'Data Structures & Algorithms',
    year: '2025',
    semester: 'Semester I',
    type: 'End-Exam',
    questionsCount: 12,
    downloads: 1420,
    solutionSnippet: 'void solveGraphDFS(int u, vector<bool>& vis) { vis[u] = true; for(int v : adj[u]) if(!vis[v]) solveGraphDFS(v, vis); }',
    topics: ['Dynamic Programming', 'Graph Traversals', 'AVL Trees', 'Red-Black Rotation']
  },
  {
    id: 'pyq-math3-2025',
    subjectCode: 'MA301',
    subjectName: 'Engineering Mathematics III',
    year: '2025',
    semester: 'Semester I',
    type: 'Mid-Exam',
    questionsCount: 8,
    downloads: 980,
    solutionSnippet: 'f(z) = u(x,y) + i v(x,y) is analytic if Cauchy-Riemann equations ∂u/∂x = ∂v/∂y and ∂u/∂y = -∂v/∂x hold.',
    topics: ['Fourier Transforms', 'Complex Analysis', 'Cauchy Integral Formula', 'PDE Separation']
  },
  {
    id: 'pyq-ec204-2025',
    subjectCode: 'EC204',
    subjectName: 'Digital Logic & Microprocessors',
    year: '2025',
    semester: 'Semester II',
    type: 'Lab-Viva',
    questionsCount: 15,
    downloads: 750,
    solutionSnippet: 'MOV AX, 0005H \n MOV BX, 0003H \n ADD AX, BX \n HLT ; 8086 Assembly Sum',
    topics: ['8086 Registers', 'K-Map Minimization', 'Counters', 'Multiplexer Design']
  }
];

export const CAMPUS_ROOMS: CampusRoom[] = [
  { id: 'room-lib-b3', name: 'Library Discussion Room B3', building: 'Central Library Building', capacity: 6, status: 'available', facilities: ['Whiteboard', 'AC', 'WiFi'] },
  { id: 'room-cs-204', name: 'Academic Block III - Room 204', building: 'CSE Department Block', capacity: 15, status: 'available', facilities: ['Projector', 'Power Sockets'] },
  { id: 'room-sal-01', name: 'Student Activity Lounge', building: 'Student Union Building', capacity: 20, status: 'occupied', facilities: ['Smart Screen', 'WiFi'] }
];

import type { CourseSubject, SessionPackage, PartnerClub, TutorProfile, TutoringSession } from '../types/prepwise';

export const COURSE_SUBJECTS: CourseSubject[] = [
  {
    id: 'eng-maths-3',
    name: 'Engineering Mathematics III (PDE & Complex Variables)',
    code: 'MA301',
    category: 'engineering',
    basePricePerHour: 299,
    tutorsCount: 14,
    icon: 'Calculator',
    description: 'Partial differential equations, Fourier transforms, complex integration, and residue calculus.'
  },
  {
    id: 'dsa',
    name: 'Data Structures & Algorithms in C++/Java',
    code: 'CS201',
    category: 'computer_science',
    basePricePerHour: 349,
    tutorsCount: 22,
    icon: 'Code2',
    description: 'Trees, Graphs, Dynamic Programming, Heap sort, Time complexity proofs, and lab exam solutions.'
  },
  {
    id: 'digital-electronics',
    name: 'Digital Logic & Microprocessors (8086/ARM)',
    code: 'EC204',
    category: 'electronics',
    basePricePerHour: 299,
    tutorsCount: 11,
    icon: 'Cpu',
    description: 'K-Maps, Combinational circuits, Assembly programming, timing diagrams, and lab simulator walkthroughs.'
  },
  {
    id: 'dbms',
    name: 'Database Management Systems & SQL Querying',
    code: 'CS302',
    category: 'computer_science',
    basePricePerHour: 279,
    tutorsCount: 18,
    icon: 'Database',
    description: 'Relational algebra, ER diagrams, B+ Trees, 3NF/BCNF normalization, and complex JOIN queries.'
  },
  {
    id: 'operating-systems',
    name: 'Operating Systems & System Programming',
    code: 'CS304',
    category: 'computer_science',
    basePricePerHour: 319,
    tutorsCount: 15,
    icon: 'Terminal',
    description: 'Process synchronization, Semaphores, Page replacement algorithms, and POSIX thread coding.'
  },
  {
    id: 'organic-chem',
    name: 'Engineering Chemistry & Spectroscopy',
    code: 'CH101',
    category: 'basic_sciences',
    basePricePerHour: 249,
    tutorsCount: 9,
    icon: 'FlaskConical',
    description: 'NMR Spectroscopy, Phase rule, Reaction kinetics, Water treatment calculations, and lab viva prep.'
  }
];

export const SESSION_PACKAGES: SessionPackage[] = [
  {
    id: 'one_on_one',
    title: '1-on-1 Exam Sprint',
    subtitle: 'Direct peer tutoring tailored to your exact syllabus & weak spots',
    multiplier: 1.0,
    basePrice: 299,
    popular: true,
    features: [
      '60 Minutes 1-on-1 Live Campus / Online Session',
      'Previous Year Questions (PYQs) Solved',
      'Custom Formula & Code Cheat Sheets Included',
      'Direct WhatsApp Follow-up Support'
    ]
  },
  {
    id: 'group_sprint',
    title: 'Group Study Sprint (3-5 Students)',
    subtitle: 'Study together with classmates and split the cost',
    multiplier: 0.6,
    basePrice: 149,
    features: [
      '90 Minutes Interactive Group Session',
      'Shared PYQ Problem Solving',
      'Lab Exam / Viva Question Bank',
      'Per-Student Discounted Rate'
    ]
  },
  {
    id: 'subject_mastery',
    title: 'Complete Exam Mastery Pack',
    subtitle: 'Full unit walkthrough + 3 mock exam review sessions',
    multiplier: 2.2,
    basePrice: 649,
    features: [
      '3 x 60-Min Intensive Sessions',
      'End-to-End Syllabus Coverage',
      'Guaranteed Passing / Top-Grade Roadmap',
      'Handwritten Notes & Diagrams Archive'
    ]
  }
];

export const SEED_CLUBS: PartnerClub[] = [
  {
    id: 'club-vnr-aws',
    name: 'AWS Cloud Club VNRVJIET',
    collegeName: 'VNR Vignana Jyothi Institute of Tech',
    referralCode: 'VNR_AWS_2026',
    sharePercent: 20,
    totalAttributedOrders: 18,
    totalGmv: 5382,
    totalNetEarned: 269.1,
    totalPaid: 200,
    payableBalance: 69.1,
    payeeName: 'Karthik Rao (President)',
    payeeContact: '+91 98490 12345',
    payeeUpi: 'karthik.vnr@upi'
  },
  {
    id: 'club-cbit-csi',
    name: 'CSI Student Chapter CBIT',
    collegeName: 'Chaitanya Bharathi Institute of Tech',
    referralCode: 'CBIT_CSI_PREP',
    sharePercent: 20,
    totalAttributedOrders: 24,
    totalGmv: 7176,
    totalNetEarned: 358.8,
    totalPaid: 300,
    payableBalance: 58.8,
    payeeName: 'Ananya Sharma (Treasurer)',
    payeeContact: '+91 97012 34567',
    payeeUpi: 'ananya.cbit@upi'
  },
  {
    id: 'club-mjcet-ieee',
    name: 'IEEE Student Branch MJCET',
    collegeName: 'Muffakham Jah College of Engg',
    referralCode: 'MJCET_IEEE_PRO',
    sharePercent: 20,
    totalAttributedOrders: 12,
    totalGmv: 3588,
    totalNetEarned: 179.4,
    totalPaid: 150,
    payableBalance: 29.4,
    payeeName: 'Mohammed Ahmed (Chair)',
    payeeContact: '+91 91234 56789',
    payeeUpi: 'ahmed.mjcet@upi'
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
    hourlyRate: 349,
    totalEarned: 4710,
    payableBalance: 785,
    totalSessionsCompleted: 18,
    rating: 4.9,
    status: 'approved',
    appliedAt: '2026-08-15T10:00:00.000Z'
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
    hourlyRate: 299,
    totalEarned: 3588,
    payableBalance: 672,
    totalSessionsCompleted: 14,
    rating: 4.95,
    status: 'approved',
    appliedAt: '2026-08-20T14:30:00.000Z'
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
    totalAmount: 349,
    tutorEarnings: 261.75,
    platformNet: 87.25,
    partnerClubShare: 17.45,
    paymentStatus: 'verified',
    paymentRef: 'UPI-UTR-928374910238',
    verifiedBy: 'Admin (System)',
    verifiedAt: '2026-09-12T10:00:00.000Z',
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
    totalAmount: 299,
    tutorEarnings: 224.25,
    platformNet: 74.75,
    partnerClubShare: 14.95,
    paymentStatus: 'verified',
    paymentRef: 'UPI-UTR-882347109283',
    verifiedBy: 'Admin (System)',
    verifiedAt: '2026-09-12T12:00:00.000Z',
    tutorId: 'tutor-2',
    tutorName: 'Sneha Kulkarni',
    sessionStatus: 'ready',
    locationOrLink: 'CBIT Academic Block III - Room 204',
    partnerClubId: 'club-cbit-csi',
    partnerClubName: 'CSI Student Chapter CBIT',
    createdAt: '2026-09-12T11:15:00.000Z'
  }
];

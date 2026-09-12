export type CourseCategory = 'engineering' | 'computer_science' | 'electronics' | 'basic_sciences';

export type SessionType = 'one_on_one' | 'group_sprint' | 'subject_mastery' | 'assignment_walkthrough';

export type PaymentStatus = 'pending' | 'submitted' | 'verified' | 'rejected';

export type SessionStatus = 'unassigned' | 'assigned' | 'ready' | 'completed' | 'cancelled';

export interface CourseSubject {
  id: string;
  name: string;
  code: string;
  category: CourseCategory;
  basePricePerHour: number;
  tutorsCount: number;
  icon: string;
  description: string;
}

export interface SessionPackage {
  id: SessionType;
  title: string;
  subtitle: string;
  multiplier: number;
  basePrice: number;
  features: string[];
  popular?: boolean;
}

export interface TutoringSession {
  id: string;
  publicToken: string;
  studentName: string;
  studentContact: string;
  collegeName: string;
  courseId: string;
  courseName: string;
  sessionType: SessionType;
  durationMins: number;
  totalAmount: number;
  tutorEarnings: number; // 75% of total
  platformNet: number;   // 25% of total
  partnerClubShare: number; // 20% of platformNet if attributed
  paymentStatus: PaymentStatus;
  paymentRef?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  tutorId?: string;
  tutorName?: string;
  sessionStatus: SessionStatus;
  locationOrLink?: string;
  partnerClubId?: string;
  partnerClubName?: string;
  rating?: number;
  reviewText?: string;
  createdAt: string;
}

export interface TutorProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  college: string;
  major: string;
  gpa: number;
  subjectsHandled: string[];
  hourlyRate: number;
  totalEarned: number;
  payableBalance: number;
  totalSessionsCompleted: number;
  rating: number;
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: string;
}

export interface PartnerClub {
  id: string;
  name: string;
  collegeName: string;
  referralCode: string;
  sharePercent: number; // 20% of net platform profit
  totalAttributedOrders: number;
  totalGmv: number;
  totalNetEarned: number;
  totalPaid: number;
  payableBalance: number;
  payeeName: string;
  payeeContact: string;
  payeeUpi: string;
}

export interface PayoutRecord {
  id: string;
  payeeType: 'tutor' | 'club';
  payeeId: string;
  payeeName: string;
  amount: number;
  upiReference: string;
  timestamp: string;
  paidByAdmin: string;
  orderIds?: string[];
}

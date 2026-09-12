export type CourseCategory = 'engineering' | 'computer_science' | 'electronics' | 'basic_sciences';

export type SessionType = 'one_on_one' | 'group_sprint' | 'subject_mastery' | 'assignment_walkthrough';

export type SessionStatus = 'requested' | 'assigned' | 'ready' | 'completed' | 'cancelled';

export interface CourseSubject {
  id: string;
  name: string;
  code: string;
  category: CourseCategory;
  tutorsCount: number;
  icon: string;
  description: string;
}

export interface SessionPackage {
  id: SessionType;
  title: string;
  subtitle: string;
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
  isFree: true;
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
  volunteerHours: number;
  karmaPoints: number;
  totalSessionsCompleted: number;
  rating: number;
  status: 'approved' | 'pending';
  appliedAt: string;
}

export interface PartnerClub {
  id: string;
  name: string;
  collegeName: string;
  referralCode: string;
  totalAttributedSessions: number;
  totalStudentsHelped: number;
  leadName: string;
  leadContact: string;
}

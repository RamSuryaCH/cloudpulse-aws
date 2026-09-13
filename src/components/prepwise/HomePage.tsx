import React from 'react';
import { 
  BookOpen, 
  FileText, 
  Clock, 
  ArrowRight, 
  Users, 
  Award, 
  Sparkles,
  GraduationCap
} from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

interface HomePageProps {
  onNavigate: (tab: string) => void;
  selectedCollege: string;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, selectedCollege }) => {
  const campusNames: Record<string, string> = {
    vnrvjiet: 'VNRVJIET Hyderabad',
    cbit: 'CBIT Hyderabad',
    mjcet: 'MJCET Hyderabad',
    jntuh: 'JNTU Hyderabad',
  };

  const currentCampus = campusNames[selectedCollege] || 'Hyderabad Campuses';

  return (
    <div className="space-y-20 sm:space-y-24">
      {/* Hero Section */}
      <section className="pt-4 sm:pt-8 text-center max-w-4xl mx-auto space-y-8">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-pw-accent-subtle border border-pw-accent-border text-pw-accent text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Active for {currentCampus} • 100% Free Open Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-bold text-pw-text tracking-tight leading-[1.12]">
          Campus peer tutoring <br className="hidden sm:inline" />
          <span className="text-pw-accent font-extrabold">guided by senior TAs.</span>
        </h1>

        <p className="text-lg sm:text-xl text-pw-secondary max-w-2xl mx-auto leading-relaxed">
          Book free 1-on-1 exam prep, browse solved previous year questions (PYQs), and master tricky engineering subjects together.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
          <button
            onClick={() => {
              sounds.playClick();
              onNavigate('booking');
            }}
            className="w-full sm:w-auto pw-button-primary flex items-center justify-center space-x-2 py-3 px-6 text-sm"
          >
            <span>Book a Free Session</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onNavigate('pyq');
            }}
            className="w-full sm:w-auto pw-button-secondary flex items-center justify-center space-x-2 py-3 px-6 text-sm"
          >
            <FileText className="w-4 h-4 text-pw-secondary" />
            <span>Browse PYQ Vault</span>
          </button>
        </div>
      </section>

      {/* Metrics Ribbon */}
      <section className="bg-pw-surface border border-pw-border rounded-2xl p-6 sm:p-8 shadow-pw-card">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center divide-y lg:divide-y-0 lg:divide-x divide-pw-border">
          <div className="pt-4 lg:pt-0">
            <span className="block text-3xl sm:text-4xl font-extrabold text-pw-text font-display">100%</span>
            <span className="text-xs sm:text-sm text-pw-secondary font-medium mt-1 block">Free Open Education</span>
          </div>
          <div className="pt-4 lg:pt-0 lg:pl-6">
            <span className="block text-3xl sm:text-4xl font-extrabold text-pw-text font-display">45+</span>
            <span className="text-xs sm:text-sm text-pw-secondary font-medium mt-1 block">Verified Senior TAs</span>
          </div>
          <div className="pt-4 lg:pt-0 lg:pl-6">
            <span className="block text-3xl sm:text-4xl font-extrabold text-pw-text font-display">1,400+</span>
            <span className="text-xs sm:text-sm text-pw-secondary font-medium mt-1 block">PYQ Papers Solved</span>
          </div>
          <div className="pt-4 lg:pt-0 lg:pl-6">
            <span className="block text-3xl sm:text-4xl font-extrabold text-pw-text font-display">4 Campuses</span>
            <span className="text-xs sm:text-sm text-pw-secondary font-medium mt-1 block">VNR, CBIT, MJCET, JNTU</span>
          </div>
        </div>
      </section>

      {/* 3 Core Pillars */}
      <section className="space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-3xl font-bold text-pw-text">
            Everything you need to excel in your semester exams
          </h2>
          <p className="text-sm sm:text-base text-pw-secondary">
            Built by engineering students for engineering students. Zero commercial friction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1 */}
          <div 
            onClick={() => {
              sounds.playSwitch();
              onNavigate('booking');
            }}
            className="pw-card-interactive p-7 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-pw-accent-subtle text-pw-accent flex items-center justify-center">
                <BookOpen className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h3 className="text-xl font-bold text-pw-text">1-on-1 & Group Peer Tutoring</h3>
              <p className="text-sm text-pw-secondary leading-relaxed">
                Connect directly with high-GPA seniors who have aced your exact course and know every tricky syllabus quirk.
              </p>
            </div>
            <div className="pt-6 flex items-center text-xs font-semibold text-pw-accent">
              <span>Book session</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Pillar 2 */}
          <div 
            onClick={() => {
              sounds.playSwitch();
              onNavigate('pyq');
            }}
            className="pw-card-interactive p-7 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-pw-accent-subtle text-pw-accent flex items-center justify-center">
                <FileText className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h3 className="text-xl font-bold text-pw-text">Solved PYQ & Code Vault</h3>
              <p className="text-sm text-pw-secondary leading-relaxed">
                Step-by-step solved question papers, formula sheets, and lab exam code walk-throughs verified by senior coordinators.
              </p>
            </div>
            <div className="pt-6 flex items-center text-xs font-semibold text-pw-accent">
              <span>Explore vault</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Pillar 3 */}
          <div 
            onClick={() => {
              sounds.playSwitch();
              onNavigate('tracker');
            }}
            className="pw-card-interactive p-7 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-pw-accent-subtle text-pw-accent flex items-center justify-center">
                <Clock className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h3 className="text-xl font-bold text-pw-text">Single-Token Session Tracker</h3>
              <p className="text-sm text-pw-secondary leading-relaxed">
                Track your booked session status, view your tutor details, and leave honest peer reviews without requiring complex accounts.
              </p>
            </div>
            <div className="pt-6 flex items-center text-xs font-semibold text-pw-accent">
              <span>Track session</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-pw-subtle border border-pw-border rounded-3xl p-8 sm:p-12 space-y-10">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-semibold text-pw-accent uppercase tracking-wider">Simple Workflow</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-pw-text">How PrepWise Campus Works</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="space-y-3 bg-pw-surface p-6 rounded-2xl border border-pw-border">
            <span className="w-8 h-8 rounded-full bg-pw-accent text-white flex items-center justify-center font-bold text-sm">1</span>
            <h4 className="text-base font-bold text-pw-text">Select Subject & Format</h4>
            <p className="text-xs text-pw-secondary leading-relaxed">
              Choose from Data Structures, Maths III, Operating Systems, or other core subjects and choose 1-on-1 or group study.
            </p>
          </div>

          <div className="space-y-3 bg-pw-surface p-6 rounded-2xl border border-pw-border">
            <span className="w-8 h-8 rounded-full bg-pw-accent text-white flex items-center justify-center font-bold text-sm">2</span>
            <h4 className="text-base font-bold text-pw-text">Get Matched with Senior TA</h4>
            <p className="text-xs text-pw-secondary leading-relaxed">
              A verified peer tutor from your campus is assigned to your request and contacts you via WhatsApp / Campus Library.
            </p>
          </div>

          <div className="space-y-3 bg-pw-surface p-6 rounded-2xl border border-pw-border">
            <span className="w-8 h-8 rounded-full bg-pw-accent text-white flex items-center justify-center font-bold text-sm">3</span>
            <h4 className="text-base font-bold text-pw-text">Ace Your Semester Exams</h4>
            <p className="text-xs text-pw-secondary leading-relaxed">
              Complete the session, review solved PYQs, and award volunteer Karma points to recognize your tutor’s help.
            </p>
          </div>
        </div>
      </section>

      {/* Student Testimonial */}
      <section className="pw-card p-8 sm:p-10 max-w-3xl mx-auto space-y-6">
        <div className="flex items-center space-x-1 text-amber-500">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-base font-bold">★</span>
          ))}
        </div>
        <blockquote className="text-base sm:text-lg text-pw-text font-medium leading-relaxed italic">
          "Arjun from 4th Year explained Dynamic Programming and Graph traversals in 45 minutes right before our CS201 lab exam. I went from feeling lost to scoring 28/30."
        </blockquote>
        <div className="flex items-center justify-between pt-4 border-t border-pw-border text-xs text-pw-secondary">
          <div>
            <strong className="text-pw-text block">Rahul V.</strong>
            <span>2nd Year CSE, VNRVJIET Hyderabad</span>
          </div>
          <span className="font-mono text-pw-accent font-semibold bg-pw-accent-subtle px-3 py-1 rounded-full border border-pw-accent-border">
            1-on-1 Exam Sprint
          </span>
        </div>
      </section>

      {/* Campus Club Partners Strip */}
      <section className="text-center space-y-6 pt-4">
        <span className="text-xs font-semibold text-pw-secondary uppercase tracking-wider">
          Officially Supported by Student Chapters
        </span>
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
          <div className="px-5 py-2.5 rounded-xl bg-pw-surface border border-pw-border text-xs font-semibold text-pw-text flex items-center gap-2 shadow-pw-sm">
            <Award className="w-4 h-4 text-pw-accent" />
            <span>AWS Cloud Club VNRVJIET</span>
          </div>
          <div className="px-5 py-2.5 rounded-xl bg-pw-surface border border-pw-border text-xs font-semibold text-pw-text flex items-center gap-2 shadow-pw-sm">
            <GraduationCap className="w-4 h-4 text-pw-accent" />
            <span>CSI Student Chapter CBIT</span>
          </div>
          <div className="px-5 py-2.5 rounded-xl bg-pw-surface border border-pw-border text-xs font-semibold text-pw-text flex items-center gap-2 shadow-pw-sm">
            <Users className="w-4 h-4 text-pw-accent" />
            <span>IEEE Student Branch MJCET</span>
          </div>
        </div>
      </section>
    </div>
  );
};

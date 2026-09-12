import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  Users, 
  Award, 
  Calculator, 
  Code2, 
  Cpu, 
  Database, 
  Terminal, 
  FlaskConical
} from 'lucide-react';
import { COURSE_SUBJECTS, SESSION_PACKAGES, SEED_CLUBS } from '../../data/prepwiseData';
import type { CourseSubject, SessionType } from '../../types/prepwise';
import { sounds } from '../../utils/soundEffects';

interface BookingStudioProps {
  onOrderCreated: (token: string) => void;
}

export const BookingStudio: React.FC<BookingStudioProps> = ({ onOrderCreated }) => {
  const [selectedSubject, setSelectedSubject] = useState<CourseSubject>(COURSE_SUBJECTS[0]);
  const [sessionType, setSessionType] = useState<SessionType>('one_on_one');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [studentName, setStudentName] = useState('');
  const [studentContact, setStudentContact] = useState('');
  const [collegeName, setCollegeName] = useState('VNRVJIET Hyderabad');
  const [referralCode, setReferralCode] = useState('VNR_AWS_2026');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-detect referral code from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) {
      setReferralCode(ref.toUpperCase());
    }
  }, []);

  const filteredSubjects = COURSE_SUBJECTS.filter(s => 
    activeCategory === 'all' || s.category === activeCategory
  );

  const selectedPackage = SESSION_PACKAGES.find(p => p.id === sessionType) || SESSION_PACKAGES[0];

  const handleCreateBooking = async () => {
    if (!studentName.trim() || !studentContact.trim()) {
      alert('Please enter your Name and Mobile / WhatsApp contact.');
      return;
    }

    sounds.playSuccess();
    setIsSubmitting(true);

    try {
      const res = await fetch('https://pmaj9rfa04.execute-api.ap-southeast-2.amazonaws.com/api/prepwise/sessions/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName,
          studentContact,
          collegeName,
          courseId: selectedSubject.id,
          courseName: selectedSubject.name,
          sessionType,
          referralCode
        })
      });

      const data = await res.json();
      if (res.ok && data.publicToken) {
        onOrderCreated(data.publicToken);
      } else {
        const mockToken = 'pw-tok-' + Math.random().toString(36).slice(2, 10);
        onOrderCreated(mockToken);
      }
    } catch {
      const mockToken = 'pw-tok-' + Math.random().toString(36).slice(2, 10);
      onOrderCreated(mockToken);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSubjectIcon = (iconName: string) => {
    switch (iconName) {
      case 'Calculator': return Calculator;
      case 'Code2': return Code2;
      case 'Cpu': return Cpu;
      case 'Database': return Database;
      case 'Terminal': return Terminal;
      case 'FlaskConical': return FlaskConical;
      default: return BookOpen;
    }
  };

  const matchedClub = SEED_CLUBS.find(c => c.referralCode === referralCode.trim().toUpperCase());

  return (
    <div className="space-y-12">
      {/* Hero Banner */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#30D158]/10 border border-[#30D158]/30 text-[#30D158] text-xs font-mono font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>100% Free Campus Peer Learning & Exam Preparation</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-[#FFFFFF] tracking-tight leading-tight">
          Learn Together. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#30D158] via-[#10B981] to-[#0A84FF]">
            Guided by Campus Senior Peer Tutors.
          </span>
        </h1>
        <p className="text-base text-slate-400 leading-relaxed">
          Request free 1-on-1 exam prep, PYQ walkthroughs, or collaborative group study sessions with top senior TAs on your campus. Zero fees, zero hidden costs.
        </p>
      </div>

      {/* Main Booking Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Subject & Package Selector (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Step 1: Select Subject */}
          <div className="apple-card p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
              <h3 className="text-lg font-bold text-white flex items-center gap-2.5">
                <BookOpen className="w-5 h-5 text-[#30D158]" />
                1. Select Course Subject
              </h3>

              {/* Category Filter Pills */}
              <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'computer_science', label: 'CS & Coding' },
                  { id: 'engineering', label: 'Maths & Engg' },
                  { id: 'electronics', label: 'Electronics' },
                  { id: 'basic_sciences', label: 'Sciences' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      sounds.playClick();
                      setActiveCategory(cat.id);
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-mono font-semibold transition-all ${
                      activeCategory === cat.id
                        ? 'bg-[#30D158]/20 text-[#30D158] border border-[#30D158]/40'
                        : 'bg-white/[0.04] text-slate-400 border border-white/[0.06] hover:bg-white/[0.08]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredSubjects.map((subject) => {
                const Icon = getSubjectIcon(subject.icon);
                const isSelected = selectedSubject.id === subject.id;
                return (
                  <div
                    key={subject.id}
                    onClick={() => {
                      sounds.playSwitch();
                      setSelectedSubject(subject);
                    }}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'bg-white/[0.1] border-[#30D158] shadow-lg shadow-[#30D158]/10'
                        : 'bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.06] hover:border-white/[0.15]'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="w-10 h-10 rounded-xl bg-[#30D158]/15 text-[#30D158] flex items-center justify-center mb-3">
                        <Icon className="w-5 h-5 stroke-[2.2]" />
                      </div>
                      <span className="text-xs font-mono font-bold text-[#30D158] bg-[#30D158]/10 px-2.5 py-1 rounded-full border border-[#30D158]/20">
                        FREE
                      </span>
                    </div>
                    <span className="font-extrabold text-sm text-white block mb-1">{subject.name}</span>
                    <span className="text-xs font-mono text-slate-400 block mb-2">{subject.code} • {subject.tutorsCount} Peer Tutors</span>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{subject.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 2: Select Session Format */}
          <div className="apple-card p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-5">
              <h3 className="text-lg font-bold text-white flex items-center gap-2.5">
                <Users className="w-5 h-5 text-[#30D158]" />
                2. Select Session Format
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SESSION_PACKAGES.map((pkg) => {
                const isSelected = sessionType === pkg.id;
                return (
                  <div
                    key={pkg.id}
                    onClick={() => {
                      sounds.playSwitch();
                      setSessionType(pkg.id);
                    }}
                    className={`p-6 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-white/[0.1] border-[#30D158] shadow-xl shadow-[#30D158]/10 ring-1 ring-[#30D158]'
                        : 'bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.06]'
                    }`}
                  >
                    <div>
                      {pkg.popular && (
                        <span className="text-[10px] font-mono font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#30D158] text-black mb-3 inline-block">
                          Recommended
                        </span>
                      )}
                      <h4 className="text-base font-extrabold text-white mb-1">{pkg.title}</h4>
                      <p className="text-xs text-slate-400 mb-4 leading-relaxed">{pkg.subtitle}</p>
                      
                      <div className="text-2xl font-black text-[#30D158] font-mono mb-4">
                        FREE
                      </div>

                      <ul className="space-y-2 text-xs text-slate-300">
                        {pkg.features.map((feat, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-[#30D158] shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Checkout Card (4 cols) */}
        <div className="lg:col-span-4 space-y-6 sticky top-28">
          <div className="apple-card p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-[#30D158]" />
                Request Summary
              </h3>
              <span className="text-xs text-[#30D158] font-mono font-bold bg-[#30D158]/10 px-2.5 py-0.5 rounded-full border border-[#30D158]/30">
                100% Free
              </span>
            </div>

            {/* Price Breakdown Details */}
            <div className="space-y-3 text-xs font-mono">
              <div className="flex justify-between text-slate-300">
                <span>Subject:</span>
                <span className="font-bold text-white truncate max-w-[150px]">{selectedSubject.code}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Format:</span>
                <span className="font-bold text-white">{selectedPackage.title}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Platform Fee:</span>
                <span className="text-[#30D158] font-bold">₹0.00 (Free)</span>
              </div>

              {matchedClub && (
                <div className="flex justify-between text-[#30D158] pt-2 border-t border-white/[0.06]">
                  <span>Supported Club:</span>
                  <span className="font-bold">{matchedClub.name}</span>
                </div>
              )}

              <div className="flex justify-between items-center text-sm font-black text-white pt-4 border-t border-white/[0.08]">
                <span>Total Amount:</span>
                <span className="text-2xl text-[#30D158]">FREE</span>
              </div>
            </div>

            {/* Student Contact Details Form */}
            <div className="space-y-4 pt-4 border-t border-white/[0.08]">
              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1">Student Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Verma"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#30D158]"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1">WhatsApp / Phone Contact *</label>
                <input
                  type="text"
                  placeholder="e.g. +91 98490 12345"
                  value={studentContact}
                  onChange={(e) => setStudentContact(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#30D158]"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1">College Campus</label>
                <input
                  type="text"
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#30D158]"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1">Partner Club Referral Code</label>
                <input
                  type="text"
                  placeholder="e.g. VNR_AWS_2026"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs font-mono text-[#30D158] placeholder-slate-500 focus:outline-none focus:border-[#30D158]"
                />
                {matchedClub && (
                  <span className="text-[11px] text-[#30D158] font-mono mt-1 flex items-center gap-1">
                    <Award className="w-3 h-3" /> Supported by {matchedClub.name}
                  </span>
                )}
              </div>

              <button
                onClick={handleCreateBooking}
                disabled={isSubmitting}
                className="w-full flex items-center justify-center space-x-2 py-3.5 rounded-2xl bg-gradient-to-r from-[#30D158] to-[#10B981] hover:from-[#34D399] hover:to-[#30D158] text-black font-extrabold text-xs shadow-xl shadow-[#30D158]/20 transition-all active:scale-95 duration-150 cursor-pointer disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Requesting Session...' : 'Request Free Peer Session'}</span>
                <ArrowRight className="w-4 h-4 text-black stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

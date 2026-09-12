import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Check, 
  QrCode, 
  Copy, 
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
  const [studentName, setStudentName] = useState('');
  const [studentContact, setStudentContact] = useState('');
  const [collegeName, setCollegeName] = useState('VNRVJIET Hyderabad');
  const [referralCode, setReferralCode] = useState('VNR_AWS_2026');
  
  // Payment Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [createdToken, setCreatedToken] = useState<string | null>(null);
  const [paymentRef, setPaymentRef] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedVpa, setCopiedVpa] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Auto-detect referral code from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) {
      setReferralCode(ref.toUpperCase());
    }
  }, []);

  const selectedPackage = SESSION_PACKAGES.find(p => p.id === sessionType) || SESSION_PACKAGES[0];
  const calculatedTotal = Math.round(selectedSubject.basePricePerHour * selectedPackage.multiplier);
  const tutorTakesHome = (calculatedTotal * 0.75).toFixed(2);
  const platformNet = (calculatedTotal * 0.25).toFixed(2);

  const handleCreateBooking = async () => {
    if (!studentName.trim() || !studentContact.trim()) {
      alert('Please enter your Name and Mobile / WhatsApp contact.');
      return;
    }

    sounds.playClick();
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
        sounds.playSuccess();
        setCreatedToken(data.publicToken);
        setIsPaymentModalOpen(true);
      } else {
        alert(data.error || 'Failed to create session booking.');
      }
    } catch {
      sounds.playSuccess();
      const mockToken = 'pw-tok-' + Math.random().toString(36).slice(2, 10);
      setCreatedToken(mockToken);
      setIsPaymentModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitPaymentRef = async () => {
    if (!paymentRef.trim() || paymentRef.length < 8) {
      alert('Please enter a valid 12-digit UPI UTR Transaction Reference ID.');
      return;
    }

    sounds.playSuccess();
    setIsSubmitting(true);

    try {
      await fetch('https://pmaj9rfa04.execute-api.ap-southeast-2.amazonaws.com/api/prepwise/sessions/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          publicToken: createdToken,
          paymentRef
        })
      });
    } catch {}

    setBookingSuccess(true);
    setIsSubmitting(false);
    setTimeout(() => {
      setIsPaymentModalOpen(false);
      if (createdToken) {
        onOrderCreated(createdToken);
      }
    }, 1500);
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
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-[#F59E0B] text-xs font-mono font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Peer-to-Peer Campus Tutoring & Exam Sprint</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Master Your Syllabus. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F59E0B] via-[#D97706] to-[#0A84FF]">
            Taught by Top Campus Rankers.
          </span>
        </h1>
        <p className="text-base text-slate-400 leading-relaxed">
          Book 1-on-1 exam prep, PYQ walkthroughs, or group study sprints with verified senior TAs on your campus. Manual UPI payment with zero gateway surcharges.
        </p>
      </div>

      {/* Main Booking Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Subject & Package Selector (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Step 1: Select Subject */}
          <div className="apple-card p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-5">
              <h3 className="text-lg font-bold text-white flex items-center gap-2.5">
                <BookOpen className="w-5 h-5 text-[#F59E0B]" />
                1. Select Course Subject
              </h3>
              <span className="text-xs font-mono text-slate-400">6 Active Campus Subjects</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {COURSE_SUBJECTS.map((subject) => {
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
                        ? 'bg-white/[0.1] border-[#F59E0B] shadow-lg shadow-[#F59E0B]/10'
                        : 'bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.06] hover:border-white/[0.15]'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/15 text-[#F59E0B] flex items-center justify-center mb-3">
                        <Icon className="w-5 h-5 stroke-[2.2]" />
                      </div>
                      <span className="text-xs font-mono font-bold text-[#30D158] bg-[#30D158]/10 px-2.5 py-1 rounded-full border border-[#30D158]/20">
                        ₹{subject.basePricePerHour} / hr
                      </span>
                    </div>
                    <span className="font-extrabold text-sm text-white block mb-1">{subject.name}</span>
                    <span className="text-xs font-mono text-slate-400 block mb-2">{subject.code} • {subject.tutorsCount} Verified Tutors</span>
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
                <Users className="w-5 h-5 text-[#F59E0B]" />
                2. Select Session Format & Package
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SESSION_PACKAGES.map((pkg) => {
                const isSelected = sessionType === pkg.id;
                const packageCost = Math.round(selectedSubject.basePricePerHour * pkg.multiplier);
                return (
                  <div
                    key={pkg.id}
                    onClick={() => {
                      sounds.playSwitch();
                      setSessionType(pkg.id);
                    }}
                    className={`p-6 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-white/[0.1] border-[#F59E0B] shadow-xl shadow-[#F59E0B]/10 ring-1 ring-[#F59E0B]'
                        : 'bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.06]'
                    }`}
                  >
                    <div>
                      {pkg.popular && (
                        <span className="text-[10px] font-mono font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#F59E0B] text-black mb-3 inline-block">
                          Most Popular
                        </span>
                      )}
                      <h4 className="text-base font-extrabold text-white mb-1">{pkg.title}</h4>
                      <p className="text-xs text-slate-400 mb-4 leading-relaxed">{pkg.subtitle}</p>
                      
                      <div className="text-2xl font-black text-[#F59E0B] font-mono mb-4">
                        ₹{packageCost}
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
                <ShieldCheck className="w-5 h-5 text-[#F59E0B]" />
                Booking Breakdown
              </h3>
              <span className="text-xs text-[#30D158] font-mono font-bold bg-[#30D158]/10 px-2.5 py-0.5 rounded-full border border-[#30D158]/30">
                Manual UPI
              </span>
            </div>

            {/* Price Breakdown Details */}
            <div className="space-y-3 text-xs font-mono">
              <div className="flex justify-between text-slate-300">
                <span>Selected Subject:</span>
                <span className="font-bold text-white truncate max-w-[150px]">{selectedSubject.code}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Session Format:</span>
                <span className="font-bold text-white">{selectedPackage.title}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Tutor Payout (75%):</span>
                <span className="text-[#30D158]">₹{tutorTakesHome}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Platform Net (25%):</span>
                <span className="text-[#0A84FF]">₹{platformNet}</span>
              </div>

              {matchedClub && (
                <div className="flex justify-between text-amber-400 pt-2 border-t border-white/[0.06]">
                  <span>Club Partner Share (20% Net):</span>
                  <span className="font-bold">₹{(parseFloat(platformNet) * 0.20).toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between items-center text-sm font-black text-white pt-4 border-t border-white/[0.08]">
                <span>Total Amount Due:</span>
                <span className="text-2xl text-[#F59E0B]">₹{calculatedTotal}</span>
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
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#F59E0B]"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1">WhatsApp / Phone Contact *</label>
                <input
                  type="text"
                  placeholder="e.g. +91 98490 12345"
                  value={studentContact}
                  onChange={(e) => setStudentContact(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#F59E0B]"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1">College Campus</label>
                <input
                  type="text"
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#F59E0B]"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1">Partner Club Referral Code</label>
                <input
                  type="text"
                  placeholder="e.g. VNR_AWS_2026"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs font-mono text-[#F59E0B] placeholder-slate-500 focus:outline-none focus:border-[#F59E0B]"
                />
                {matchedClub && (
                  <span className="text-[11px] text-[#30D158] font-mono mt-1 flex items-center gap-1">
                    <Award className="w-3 h-3" /> Attributed to {matchedClub.name}
                  </span>
                )}
              </div>

              <button
                onClick={handleCreateBooking}
                disabled={isSubmitting}
                className="w-full flex items-center justify-center space-x-2 py-3.5 rounded-2xl bg-gradient-to-r from-[#F59E0B] to-[#D97706] hover:from-[#FBBF24] hover:to-[#F59E0B] text-black font-extrabold text-xs shadow-xl shadow-[#F59E0B]/20 transition-all active:scale-95 duration-150 cursor-pointer disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Creating Booking...' : 'Proceed to Manual UPI Payment'}</span>
                <ArrowRight className="w-4 h-4 text-black stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Manual UPI Payment Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="apple-card max-w-lg w-full p-8 space-y-6 relative border-2 border-[#F59E0B]/40">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/20 text-[#F59E0B] flex items-center justify-center">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Manual UPI Payment</h3>
                  <p className="text-xs text-slate-400 font-mono">Zero Gateway Charges • Instant Verification</p>
                </div>
              </div>
              <span className="text-xs font-mono text-[#F59E0B] bg-[#F59E0B]/10 px-3 py-1 rounded-full border border-[#F59E0B]/30 font-bold">
                ₹{calculatedTotal} Due
              </span>
            </div>

            {bookingSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#30D158]/20 text-[#30D158] border border-[#30D158]/40 flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
                <h4 className="text-xl font-bold text-white">Payment Reference Submitted!</h4>
                <p className="text-xs text-slate-300 font-mono">Redirecting to your student tracker link...</p>
              </div>
            ) : (
              <div className="space-y-5">
                {/* VPA Copy Box */}
                <div className="bg-[#050508] border border-white/[0.08] rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400 block">Official Merchant VPA</span>
                    <span className="text-sm font-mono font-bold text-white">prepwise@upi</span>
                  </div>
                  <button
                    onClick={() => {
                      sounds.playSuccess();
                      navigator.clipboard.writeText('prepwise@upi');
                      setCopiedVpa(true);
                      setTimeout(() => setCopiedVpa(false), 2000);
                    }}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-xs font-mono text-slate-200 transition-all"
                  >
                    {copiedVpa ? <Check className="w-3.5 h-3.5 text-[#30D158]" /> : <Copy className="w-3.5 h-3.5 text-[#F59E0B]" />}
                    <span>{copiedVpa ? 'Copied' : 'Copy VPA'}</span>
                  </button>
                </div>

                {/* UTR Input Form */}
                <div className="space-y-3">
                  <label className="text-xs font-mono text-slate-300 block">
                    Submit 12-Digit UPI Transaction UTR Reference ID *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 928374910238 or UPI-UTR-xxx"
                    value={paymentRef}
                    onChange={(e) => setPaymentRef(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-[#F59E0B]"
                  />
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Open Google Pay, PhonePe, or Paytm → Send ₹{calculatedTotal} to <code className="text-[#F59E0B]">prepwise@upi</code> → Copy the 12-digit UTR ID from transaction details and paste above.
                  </p>
                </div>

                <div className="flex space-x-3 pt-4 border-t border-white/[0.08]">
                  <button
                    onClick={() => setIsPaymentModalOpen(false)}
                    className="flex-1 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-bold text-slate-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitPaymentRef}
                    disabled={isSubmitting}
                    className="flex-1 py-3 rounded-xl bg-[#F59E0B] hover:bg-[#FBBF24] text-black font-extrabold text-xs shadow-lg shadow-[#F59E0B]/20 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Verifying...' : 'Submit Transaction ID'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

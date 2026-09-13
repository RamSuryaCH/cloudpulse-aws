import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Check, 
  ArrowRight, 
  Users, 
  Calculator, 
  Code2, 
  Cpu, 
  Database, 
  Terminal, 
  FlaskConical,
  Award
} from 'lucide-react';
import { COURSE_SUBJECTS, SESSION_PACKAGES, SEED_CLUBS } from '../../data/prepwiseData';
import type { CourseSubject, SessionType } from '../../types/prepwise';
import { sounds } from '../../utils/soundEffects';
import { API_BASE_URL } from '../../utils/apiConfig';

interface BookingStudioProps {
  onOrderCreated: (token: string) => void;
  selectedCollege?: string;
}

export const BookingStudio: React.FC<BookingStudioProps> = ({ onOrderCreated, selectedCollege }) => {
  const [selectedSubject, setSelectedSubject] = useState<CourseSubject>(COURSE_SUBJECTS[0]);
  const [sessionType, setSessionType] = useState<SessionType>('one_on_one');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [studentName, setStudentName] = useState('');
  const [studentContact, setStudentContact] = useState('');
  const [collegeName, setCollegeName] = useState('VNRVJIET Hyderabad');
  const [referralCode, setReferralCode] = useState('VNR_AWS_2026');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (selectedCollege) {
      const map: Record<string, string> = {
        vnrvjiet: 'VNRVJIET Hyderabad',
        cbit: 'CBIT Hyderabad',
        mjcet: 'MJCET Hyderabad',
        jntuh: 'JNTU Hyderabad',
      };
      if (map[selectedCollege]) {
        setCollegeName(map[selectedCollege]);
      }
    }
  }, [selectedCollege]);

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

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !studentContact.trim()) {
      alert('Please provide your name and WhatsApp/mobile number.');
      return;
    }

    sounds.playSuccess();
    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/prepwise/sessions/create`, {
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
    <div className="max-w-5xl mx-auto space-y-12">
      {/* Header */}
      <div className="space-y-3">
        <span className="text-xs font-semibold text-pw-accent uppercase tracking-wider">Step-by-Step Request</span>
        <h1 className="text-3xl sm:text-4xl font-bold text-pw-text">
          Book a Free Campus Study Session
        </h1>
        <p className="text-base text-pw-secondary leading-relaxed max-w-2xl">
          Get personalized help from top-performing senior peer tutors who know your semester syllabus inside out.
        </p>
      </div>

      <form onSubmit={handleCreateBooking} className="space-y-10">
        
        {/* Step 1: Select Subject */}
        <section className="pw-card p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-pw-border">
            <div>
              <span className="text-xs font-semibold text-pw-accent font-mono">STEP 1</span>
              <h2 className="text-xl font-bold text-pw-text">Select Course Subject</h2>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
              {[
                { id: 'all', label: 'All Subjects' },
                { id: 'computer_science', label: 'CS & Code' },
                { id: 'engineering', label: 'Maths' },
                { id: 'electronics', label: 'Electronics' },
                { id: 'basic_sciences', label: 'Sciences' }
              ].map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setActiveCategory(cat.id);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeCategory === cat.id
                      ? 'bg-pw-text text-white font-semibold'
                      : 'bg-pw-subtle text-pw-secondary hover:bg-pw-muted'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                  className={`p-5 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'pw-card-selected'
                      : 'pw-card-interactive'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-pw-accent text-white' : 'bg-pw-subtle text-pw-accent'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono text-pw-secondary font-semibold">
                      {subject.code}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-pw-text mb-1 line-clamp-1">{subject.name}</h3>
                  <p className="text-xs text-pw-secondary line-clamp-2 leading-relaxed">{subject.description}</p>
                  <span className="text-[11px] text-pw-accent font-medium mt-3 block">
                    {subject.tutorsCount} Verified Tutors
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Step 2: Select Session Format */}
        <section className="pw-card p-6 sm:p-8 space-y-6">
          <div className="pb-4 border-b border-pw-border">
            <span className="text-xs font-semibold text-pw-accent font-mono">STEP 2</span>
            <h2 className="text-xl font-bold text-pw-text">Choose Session Format</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {SESSION_PACKAGES.map((pkg) => {
              const isSelected = sessionType === pkg.id;
              return (
                <div
                  key={pkg.id}
                  onClick={() => {
                    sounds.playSwitch();
                    setSessionType(pkg.id);
                  }}
                  className={`p-6 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'pw-card-selected'
                      : 'pw-card-interactive'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isSelected ? 'bg-pw-accent text-white' : 'bg-pw-subtle text-pw-accent'
                      }`}>
                        <Users className="w-4 h-4" />
                      </div>
                      {pkg.popular && (
                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-pw-accent text-white">
                          Popular
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-base text-pw-text">{pkg.title}</h3>
                    <p className="text-xs text-pw-secondary leading-relaxed">{pkg.subtitle}</p>

                    <ul className="space-y-1.5 pt-2 border-t border-pw-border text-xs text-pw-secondary">
                      {pkg.features.slice(0, 3).map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-pw-success shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 mt-4 border-t border-pw-border text-xs font-semibold text-pw-accent">
                    {isSelected ? '✓ Selected Format' : 'Select'}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Step 3: Contact & Request Details */}
        <section className="pw-card p-6 sm:p-8 space-y-6">
          <div className="pb-4 border-b border-pw-border">
            <span className="text-xs font-semibold text-pw-accent font-mono">STEP 3</span>
            <h2 className="text-xl font-bold text-pw-text">Your Contact Details</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-pw-text mb-1.5">Your Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Rahul Verma"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full pw-input"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-pw-text mb-1.5">WhatsApp / Mobile Number *</label>
              <input
                type="tel"
                required
                placeholder="e.g. +91 98490 12345"
                value={studentContact}
                onChange={(e) => setStudentContact(e.target.value)}
                className="w-full pw-input"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-pw-text mb-1.5">Campus / College</label>
              <input
                type="text"
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                className="w-full pw-input"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-pw-text mb-1.5">Partner Club Referral Code (Optional)</label>
              <input
                type="text"
                placeholder="e.g. VNR_AWS_2026"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                className="w-full pw-input font-mono uppercase"
              />
              {matchedClub && (
                <span className="text-[11px] text-pw-accent font-medium mt-1 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" /> Supported by {matchedClub.name}
                </span>
              )}
            </div>
          </div>

          {/* Request Review & Submission */}
          <div className="pt-6 border-t border-pw-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-pw-secondary text-center sm:text-left">
              <span className="text-pw-text font-semibold block">{selectedSubject.name}</span>
              <span>{selectedPackage.title} • 100% Free Campus Initiative</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto pw-button-primary flex items-center justify-center space-x-2 py-3 px-8 text-sm"
            >
              <span>{isSubmitting ? 'Requesting Session...' : 'Request Free Session'}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </section>

      </form>
    </div>
  );
};

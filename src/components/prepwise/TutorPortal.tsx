import React, { useState } from 'react';
import { 
  UserCheck, 
  CheckCircle2, 
  Clock, 
  Star, 
  PlusCircle,
  Award,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { SEED_TUTORS, SEED_SESSIONS, COURSE_SUBJECTS } from '../../data/prepwiseData';
import type { TutoringSession, TutorProfile } from '../../types/prepwise';
import { sounds } from '../../utils/soundEffects';

export const TutorPortal: React.FC = () => {
  const [activeTutor] = useState<TutorProfile>(SEED_TUTORS[0]);
  const [sessions, setSessions] = useState<TutoringSession[]>(SEED_SESSIONS);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applySubmitted, setApplySubmitted] = useState(false);

  // Application Form State
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantCollege, setApplicantCollege] = useState('VNRVJIET Hyderabad');
  const [applicantGpa, setApplicantGpa] = useState('9.4');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(['dsa', 'eng-maths-3']);

  const handleToggleSubject = (subId: string) => {
    sounds.playClick();
    if (selectedSubjects.includes(subId)) {
      setSelectedSubjects(prev => prev.filter(s => s !== subId));
    } else {
      setSelectedSubjects(prev => [...prev, subId]);
    }
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !applicantPhone || !applicantEmail) {
      alert('Please fill out all required contact fields.');
      return;
    }
    sounds.playSuccess();
    setApplySubmitted(true);
    setTimeout(() => {
      setIsApplyModalOpen(false);
      setApplySubmitted(false);
    }, 2500);
  };

  const handleAcceptJob = (sessionId: string) => {
    sounds.playSuccess();
    setSessions(prev => prev.map(s => {
      if (s.id === sessionId) {
        return {
          ...s,
          tutorId: activeTutor.id,
          tutorName: activeTutor.name,
          sessionStatus: 'assigned'
        };
      }
      return s;
    }));
  };

  const handleMarkReady = (sessionId: string) => {
    sounds.playSuccess();
    setSessions(prev => prev.map(s => {
      if (s.id === sessionId) {
        return { ...s, sessionStatus: 'ready' };
      }
      return s;
    }));
  };

  const availableJobs = sessions.filter(s => s.sessionStatus === 'requested');
  const myAssignedJobs = sessions.filter(s => s.tutorId === activeTutor.id);

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <span className="text-xs font-semibold text-pw-accent uppercase tracking-wider">Volunteer Peer Teaching</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-pw-text">
            Volunteer Peer Tutor Hub
          </h1>
          <p className="text-base text-pw-secondary leading-relaxed max-w-xl">
            Help juniors pass tough semester exams, earn verified volunteer service hours, and build campus leadership recognition.
          </p>
        </div>

        <button
          onClick={() => {
            sounds.playClick();
            setIsApplyModalOpen(true);
          }}
          className="pw-button-primary text-xs py-2.5 px-5 flex items-center space-x-2 shrink-0 self-start sm:self-center"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Apply to Become a Tutor</span>
        </button>
      </div>

      {/* Tutor Profile Summary Card */}
      <div className="pw-card p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-pw-border">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-pw-accent text-white flex items-center justify-center font-bold text-lg">
              {activeTutor.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-pw-text">{activeTutor.name}</h3>
                <span className="text-[11px] font-semibold text-pw-accent bg-pw-accent-subtle px-2 py-0.5 rounded border border-pw-accent-border">
                  {activeTutor.badge || 'Senior TA'}
                </span>
              </div>
              <p className="text-xs text-pw-secondary">{activeTutor.college} • {activeTutor.major}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs font-semibold text-pw-success bg-pw-success-subtle px-3 py-1.5 rounded-lg border border-pw-success/30">
            <CheckCircle2 className="w-4 h-4" />
            <span>Verified Peer Tutor</span>
          </div>
        </div>

        {/* 4 Key Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="bg-pw-subtle p-4 rounded-xl border border-pw-border">
            <span className="block text-2xl font-bold text-pw-text font-display">{activeTutor.karmaPoints}</span>
            <span className="text-xs text-pw-secondary font-medium flex items-center justify-center gap-1 mt-0.5">
              <Sparkles className="w-3.5 h-3.5 text-pw-accent" /> Karma Points
            </span>
          </div>

          <div className="bg-pw-subtle p-4 rounded-xl border border-pw-border">
            <span className="block text-2xl font-bold text-pw-text font-display">{activeTutor.volunteerHours}h</span>
            <span className="text-xs text-pw-secondary font-medium flex items-center justify-center gap-1 mt-0.5">
              <Clock className="w-3.5 h-3.5 text-pw-accent" /> Service Hours
            </span>
          </div>

          <div className="bg-pw-subtle p-4 rounded-xl border border-pw-border">
            <span className="block text-2xl font-bold text-pw-text font-display">{activeTutor.totalSessionsCompleted}</span>
            <span className="text-xs text-pw-secondary font-medium flex items-center justify-center gap-1 mt-0.5">
              <Award className="w-3.5 h-3.5 text-pw-accent" /> Sessions Done
            </span>
          </div>

          <div className="bg-pw-subtle p-4 rounded-xl border border-pw-border">
            <span className="block text-2xl font-bold text-pw-text font-display">{activeTutor.rating} ★</span>
            <span className="text-xs text-pw-secondary font-medium flex items-center justify-center gap-1 mt-0.5">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-current" /> Avg Rating
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Open Student Requests vs My Active Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Open Queue */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-pw-text">Open Student Requests</h3>
            <span className="text-xs font-semibold text-pw-accent bg-pw-accent-subtle px-2.5 py-0.5 rounded-full border border-pw-accent-border">
              {availableJobs.length} Available
            </span>
          </div>

          {availableJobs.length === 0 ? (
            <div className="pw-card p-8 text-center text-pw-secondary text-xs">
              No new pending student requests right now. Great job keeping the queue clear!
            </div>
          ) : (
            availableJobs.map(job => (
              <div key={job.id} className="pw-card p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-pw-text">{job.courseName}</h4>
                    <span className="text-xs text-pw-secondary block capitalize">{job.sessionType.replace('_', ' ')} • {job.collegeName}</span>
                  </div>
                  <span className="text-[11px] font-mono text-pw-secondary bg-pw-subtle px-2 py-0.5 rounded border border-pw-border">
                    {job.studentName}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-pw-border">
                  <span className="text-xs text-pw-secondary">Reward: +20 Karma & 1.0h</span>
                  <button
                    onClick={() => handleAcceptJob(job.id)}
                    className="pw-button-primary text-xs py-1.5 px-3"
                  >
                    Accept Session
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* My Assigned Sessions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-pw-text">My Assigned Sessions</h3>
            <span className="text-xs font-semibold text-pw-secondary bg-pw-subtle px-2.5 py-0.5 rounded-full border border-pw-border">
              {myAssignedJobs.length} Active
            </span>
          </div>

          {myAssignedJobs.length === 0 ? (
            <div className="pw-card p-8 text-center text-pw-secondary text-xs">
              You have no active sessions assigned. Accept one from the open queue on the left!
            </div>
          ) : (
            myAssignedJobs.map(job => (
              <div key={job.id} className="pw-card p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-pw-text">{job.courseName}</h4>
                    <span className="text-xs text-pw-secondary block">Student: {job.studentName} ({job.studentContact})</span>
                  </div>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                    job.sessionStatus === 'completed' 
                      ? 'bg-pw-success-subtle text-pw-success border border-pw-success/30'
                      : job.sessionStatus === 'ready'
                      ? 'bg-pw-accent-subtle text-pw-accent border border-pw-accent-border'
                      : 'bg-pw-warning-subtle text-pw-warning border border-pw-warning/30'
                  }`}>
                    {job.sessionStatus.toUpperCase()}
                  </span>
                </div>

                <div className="text-xs text-pw-secondary bg-pw-subtle p-2.5 rounded-lg border border-pw-border">
                  Venue: {job.locationOrLink || 'Library Discussion Room B3'}
                </div>

                {job.sessionStatus === 'assigned' && (
                  <div className="pt-2 border-t border-pw-border flex justify-end">
                    <button
                      onClick={() => handleMarkReady(job.id)}
                      className="pw-button-secondary text-xs py-1.5 px-3 flex items-center space-x-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-pw-accent" />
                      <span>Mark Ready at Venue</span>
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

      </div>

      {/* Tutor Application Modal */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-pw-border shadow-pw-dropdown max-w-lg w-full p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-pw-border">
              <div>
                <h3 className="text-lg font-bold text-pw-text flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-pw-accent" />
                  Apply to Become a Senior Peer Tutor
                </h3>
                <span className="text-xs text-pw-secondary">Teach juniors & earn academic volunteer hours</span>
              </div>
              <button
                onClick={() => setIsApplyModalOpen(false)}
                className="text-pw-tertiary hover:text-pw-text text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            {applySubmitted ? (
              <div className="p-6 rounded-xl bg-pw-success-subtle border border-pw-success/30 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-pw-success mx-auto" />
                <h4 className="font-bold text-pw-text">Application Submitted!</h4>
                <p className="text-xs text-pw-secondary">Campus coordinators will review your GPA and contact you via WhatsApp.</p>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-pw-text mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sneha Kulkarni"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    className="w-full pw-input"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-pw-text mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="college email"
                      value={applicantEmail}
                      onChange={(e) => setApplicantEmail(e.target.value)}
                      className="w-full pw-input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-pw-text mb-1">WhatsApp Phone *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91..."
                      value={applicantPhone}
                      onChange={(e) => setApplicantPhone(e.target.value)}
                      className="w-full pw-input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-pw-text mb-1">Campus</label>
                    <input
                      type="text"
                      value={applicantCollege}
                      onChange={(e) => setApplicantCollege(e.target.value)}
                      className="w-full pw-input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-pw-text mb-1">Current CGPA (8.5+)</label>
                    <input
                      type="text"
                      value={applicantGpa}
                      onChange={(e) => setApplicantGpa(e.target.value)}
                      className="w-full pw-input font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-pw-text mb-2">Subjects you can teach:</label>
                  <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto p-1">
                    {COURSE_SUBJECTS.map(s => {
                      const isSelected = selectedSubjects.includes(s.id);
                      return (
                        <div
                          key={s.id}
                          onClick={() => handleToggleSubject(s.id)}
                          className={`p-2 rounded-lg border text-xs cursor-pointer flex items-center space-x-2 transition-colors ${
                            isSelected
                              ? 'bg-pw-accent-subtle border-pw-accent text-pw-accent font-semibold'
                              : 'bg-pw-subtle border-pw-border text-pw-secondary'
                          }`}
                        >
                          <BookOpen className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{s.code}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsApplyModalOpen(false)}
                    className="pw-button-secondary text-xs py-2 px-4"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="pw-button-primary text-xs py-2 px-5"
                  >
                    Submit Application
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

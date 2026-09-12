import React, { useState } from 'react';
import { 
  UserCheck, 
  CheckCircle2, 
  BookOpen, 
  Clock, 
  Star, 
  PlusCircle,
  Award,
  Sparkles
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

  const handleApplySubmit = () => {
    if (!applicantName || !applicantPhone || !applicantEmail) {
      alert('Please fill out all required contact fields.');
      return;
    }
    sounds.playSuccess();
    setApplySubmitted(true);
    setTimeout(() => {
      setIsApplyModalOpen(false);
      setApplySubmitted(false);
    }, 2000);
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
        return {
          ...s,
          sessionStatus: 'ready'
        };
      }
      return s;
    }));
  };

  const availableVerifiedJobs = sessions.filter(s => s.sessionStatus === 'requested');
  const myAssignedJobs = sessions.filter(s => s.tutorId === activeTutor.id);

  return (
    <div className="space-y-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#30D158]/10 border border-[#30D158]/30 text-[#30D158] text-xs font-mono font-semibold">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Campus Volunteer Peer Tutors & Senior TAs</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Peer Tutor Portal
          </h1>
          <p className="text-base text-slate-400 leading-relaxed">
            Conduct 1-on-1 exam prep and group study sessions on your campus. Earn academic Karma points, volunteer hours recognition, and campus leadership badges.
          </p>
        </div>

        <button
          onClick={() => {
            sounds.playClick();
            setIsApplyModalOpen(true);
          }}
          className="flex items-center space-x-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#30D158] to-[#10B981] text-black font-extrabold text-xs shadow-xl shadow-[#30D158]/20 transition-all active:scale-95 duration-150 cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4 stroke-[2.5]" />
          <span>Apply to Become a Peer Tutor</span>
        </button>
      </div>

      {/* Tutor Profile Summary Card */}
      <div className="apple-card p-8 bg-[#050508] border-2 border-[#30D158]/30">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-[#30D158]/20 text-[#30D158] border border-[#30D158]/40 flex items-center justify-center font-black text-xl">
              {activeTutor.name[0]}
            </div>
            <div>
              <h3 className="text-lg font-black text-white">{activeTutor.name}</h3>
              <span className="text-xs font-mono text-slate-400 block">{activeTutor.college} • GPA {activeTutor.gpa}</span>
            </div>
          </div>

          <div className="font-mono text-xs space-y-1">
            <span className="text-slate-400 uppercase tracking-wider text-[10px] block">Volunteer Recognition</span>
            <span className="text-lg font-bold text-[#30D158] flex items-center gap-1">
              <Award className="w-4 h-4" /> {activeTutor.volunteerHours} Hours
            </span>
            <span className="text-slate-400 text-[11px] block">Verified Academic Credit</span>
          </div>

          <div className="font-mono text-xs space-y-1">
            <span className="text-slate-400 uppercase tracking-wider text-[10px] block">Karma Points</span>
            <span className="text-lg font-bold text-[#0A84FF] flex items-center gap-1">
              <Sparkles className="w-4 h-4" /> {activeTutor.karmaPoints} PTS
            </span>
            <span className="text-slate-400 text-[11px] block">Top Campus Ranker</span>
          </div>

          <div className="font-mono text-xs space-y-1">
            <span className="text-slate-400 uppercase tracking-wider text-[10px] block">Student Rating</span>
            <div className="flex items-center gap-1 text-lg font-bold text-amber-400">
              <Star className="w-4 h-4 fill-current text-[#F59E0B]" />
              <span>{activeTutor.rating} / 5.0</span>
            </div>
            <span className="text-slate-400 text-[11px] block">{activeTutor.totalSessionsCompleted} Completed Sessions</span>
          </div>
        </div>
      </div>

      {/* Workspaces Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Requested Sessions Queue (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="apple-card p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2.5 font-mono">
                <BookOpen className="w-5 h-5 text-[#30D158]" />
                Requested Free Peer Sessions Queue
              </h3>
              <span className="text-xs text-[#30D158] font-mono font-bold bg-[#30D158]/10 px-2.5 py-0.5 rounded-full border border-[#30D158]/30">
                {availableVerifiedJobs.length} Available
              </span>
            </div>

            {availableVerifiedJobs.length === 0 ? (
              <div className="p-8 text-center text-slate-400 font-mono text-xs">
                No unassigned session requests currently in the queue. New student requests will appear here instantly.
              </div>
            ) : (
              <div className="space-y-4">
                {availableVerifiedJobs.map((job) => (
                  <div key={job.id} className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.15] transition-all space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-extrabold text-base text-white block mb-1">{job.courseName}</span>
                        <span className="text-xs font-mono text-slate-400 block">{job.studentName} • {job.collegeName}</span>
                      </div>
                      <span className="text-sm font-mono font-black text-[#30D158] bg-[#30D158]/10 px-3 py-1 rounded-full border border-[#30D158]/30">
                        FREE
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-2 border-t border-white/[0.06]">
                      <span>Format: <strong className="text-white capitalize">{job.sessionType.replace('_', ' ')}</strong></span>
                      <button
                        onClick={() => handleAcceptJob(job.id)}
                        className="px-4 py-2 rounded-xl bg-[#30D158] hover:bg-[#34D399] text-black font-extrabold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                      >
                        Accept Session Request
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: My Active & Assigned Sessions (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="apple-card p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2.5 font-mono">
                <Clock className="w-5 h-5 text-[#0A84FF]" />
                My Accepted Sessions
              </h3>
              <span className="text-xs font-mono text-slate-400">{myAssignedJobs.length} Sessions</span>
            </div>

            <div className="space-y-4">
              {myAssignedJobs.map((job) => (
                <div key={job.id} className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-sm text-white">{job.courseName}</span>
                    <span className="text-xs font-mono text-[#30D158] font-bold">FREE</span>
                  </div>

                  <div className="text-xs font-mono text-slate-400 space-y-1">
                    <div>Student: <span className="text-white">{job.studentName}</span> ({job.studentContact})</div>
                    <div>Status: <span className="text-[#30D158] uppercase font-bold">{job.sessionStatus}</span></div>
                  </div>

                  {job.sessionStatus === 'assigned' && (
                    <button
                      onClick={() => handleMarkReady(job.id)}
                      className="w-full py-2 rounded-xl bg-[#0A84FF] hover:bg-[#3894FF] text-white font-mono text-xs font-bold transition-all"
                    >
                      Mark Session Ready on Campus
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Become a Tutor Application Modal */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="apple-card max-w-lg w-full p-8 space-y-6 relative border-2 border-[#30D158]/40">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <h3 className="text-lg font-black text-white">Peer Tutor Application</h3>
              <span className="text-xs font-mono text-[#30D158] bg-[#30D158]/10 px-3 py-1 rounded-full border border-[#30D158]/30 font-bold">
                Volunteer Community Role
              </span>
            </div>

            {applySubmitted ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#30D158] mx-auto" />
                <h4 className="text-xl font-bold text-white">Application Submitted!</h4>
                <p className="text-xs text-slate-300 font-mono">Our campus coordinator will review your GPA and subject expertise within 24 hours.</p>
              </div>
            ) : (
              <div className="space-y-4 text-xs font-mono">
                <div>
                  <label className="text-slate-300 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Arjun Reddy"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#30D158]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 block mb-1">College Email *</label>
                    <input
                      type="email"
                      placeholder="arjun@student.vnrvjiet.ac.in"
                      value={applicantEmail}
                      onChange={(e) => setApplicantEmail(e.target.value)}
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#30D158]"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 block mb-1">WhatsApp / Phone *</label>
                    <input
                      type="text"
                      placeholder="+91 98490 12345"
                      value={applicantPhone}
                      onChange={(e) => setApplicantPhone(e.target.value)}
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#30D158]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 block mb-1">College Campus</label>
                    <input
                      type="text"
                      value={applicantCollege}
                      onChange={(e) => setApplicantCollege(e.target.value)}
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#30D158]"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 block mb-1">Current GPA *</label>
                    <input
                      type="text"
                      value={applicantGpa}
                      onChange={(e) => setApplicantGpa(e.target.value)}
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#30D158]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-300 block mb-2">Select Subjects You Can Teach:</label>
                  <div className="grid grid-cols-2 gap-2">
                    {COURSE_SUBJECTS.map((sub) => {
                      const isSel = selectedSubjects.includes(sub.id);
                      return (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => handleToggleSubject(sub.id)}
                          className={`p-2.5 rounded-xl border text-[11px] text-left transition-all ${
                            isSel
                              ? 'bg-[#30D158]/20 text-[#30D158] border-[#30D158]'
                              : 'bg-white/[0.04] text-slate-400 border-white/[0.08]'
                          }`}
                        >
                          {sub.code} • {sub.name.slice(0, 22)}...
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex space-x-3 pt-4 border-t border-white/[0.08]">
                  <button
                    onClick={() => setIsApplyModalOpen(false)}
                    className="flex-1 py-3 rounded-xl bg-white/[0.04] text-slate-400 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleApplySubmit}
                    className="flex-1 py-3 rounded-xl bg-[#30D158] text-black font-extrabold shadow-lg"
                  >
                    Submit Peer Application
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

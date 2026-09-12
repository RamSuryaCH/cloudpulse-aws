import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Clock, 
  CheckCircle2,
  Award
} from 'lucide-react';
import { SEED_SESSIONS, SEED_TUTORS, SEED_CLUBS } from '../../data/prepwiseData';
import type { TutoringSession, TutorProfile, PartnerClub } from '../../types/prepwise';
import { sounds } from '../../utils/soundEffects';

export const AdminConsole: React.FC = () => {
  const [sessions, setSessions] = useState<TutoringSession[]>(SEED_SESSIONS);
  const [tutors] = useState<TutorProfile[]>(SEED_TUTORS);
  const [clubs] = useState<PartnerClub[]>(SEED_CLUBS);

  const handleApproveSession = async (sessionId: string) => {
    sounds.playSuccess();
    setSessions(prev => prev.map(s => {
      if (s.id === sessionId) {
        return {
          ...s,
          sessionStatus: 'assigned',
          tutorId: tutors[0].id,
          tutorName: tutors[0].name
        };
      }
      return s;
    }));
  };

  const handleCompleteSession = async (sessionId: string) => {
    sounds.playSuccess();
    setSessions(prev => prev.map(s => {
      if (s.id === sessionId) {
        return {
          ...s,
          sessionStatus: 'completed'
        };
      }
      return s;
    }));

    try {
      await fetch('https://pmaj9rfa04.execute-api.ap-southeast-2.amazonaws.com/api/prepwise/admin/complete-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      });
    } catch {}
  };

  const pendingRequestedSessions = sessions.filter(s => s.sessionStatus === 'requested');
  const activeUncompletedSessions = sessions.filter(s => s.sessionStatus === 'assigned' || s.sessionStatus === 'ready');
  const completedSessions = sessions.filter(s => s.sessionStatus === 'completed');

  return (
    <div className="space-y-12">
      {/* Admin Console Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#30D158]/10 border border-[#30D158]/30 text-[#30D158] text-xs font-mono font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Campus Coordinator Operations Console</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Campus Admin Console
        </h1>
        <p className="text-base text-slate-400 leading-relaxed">
          Manage campus session requests, assign senior peer TAs, and award volunteer hours and Karma points to peer tutors.
        </p>
      </div>

      {/* Grid: Session Approvals (8 cols) vs Campus Statistics (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Queues (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Section 1: Session Requests Queue */}
          <div className="apple-card p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2.5 font-mono">
                <Clock className="w-5 h-5 text-[#30D158]" />
                Pending Free Session Requests
              </h3>
              <span className="text-xs text-[#30D158] font-mono font-bold bg-[#30D158]/10 px-3 py-1 rounded-full border border-[#30D158]/30">
                {pendingRequestedSessions.length} Pending Assignment
              </span>
            </div>

            {pendingRequestedSessions.length === 0 ? (
              <div className="p-8 text-center text-slate-400 font-mono text-xs">
                All student peer requests are assigned! No pending requests in queue.
              </div>
            ) : (
              <div className="space-y-4">
                {pendingRequestedSessions.map((sess) => (
                  <div key={sess.id} className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-extrabold text-base text-white block">{sess.courseName}</span>
                        <span className="text-xs font-mono text-slate-400 block">{sess.studentName} ({sess.studentContact}) • {sess.collegeName}</span>
                      </div>
                      <span className="text-sm font-mono font-black text-[#30D158] bg-[#30D158]/10 px-3 py-1 rounded-full border border-[#30D158]/30">
                        100% FREE
                      </span>
                    </div>

                    <div className="flex space-x-3 pt-2">
                      <button
                        onClick={() => handleApproveSession(sess.id)}
                        className="w-full py-2.5 rounded-xl bg-[#30D158] hover:bg-[#34D399] text-black font-extrabold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                      >
                        Assign Senior Peer Tutor ({tutors[0].name})
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Campus Completion Gate */}
          <div className="apple-card p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2.5 font-mono">
                <CheckCircle2 className="w-5 h-5 text-[#30D158]" />
                Campus Session Completion Gate
              </h3>
              <span className="text-xs font-mono text-slate-400">{activeUncompletedSessions.length} In Progress</span>
            </div>

            <div className="space-y-4">
              {activeUncompletedSessions.map((sess) => (
                <div key={sess.id} className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between">
                  <div>
                    <span className="font-bold text-sm text-white block">{sess.courseName}</span>
                    <span className="text-xs font-mono text-slate-400">Tutor: {sess.tutorName || 'Unassigned'} • Student: {sess.studentName}</span>
                  </div>

                  <button
                    onClick={() => handleCompleteSession(sess.id)}
                    className="px-4 py-2 rounded-xl bg-[#30D158] hover:bg-[#34D399] text-black font-extrabold text-xs shadow-md transition-all active:scale-95"
                  >
                    Confirm Campus Completed
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Campus Platform Stats (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="apple-card p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2.5 font-mono">
                <Award className="w-5 h-5 text-[#30D158]" />
                Campus Impact Summary
              </h3>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1">
                <span className="text-slate-400 block">Total Completed Sessions</span>
                <span className="text-xl font-bold text-white">{completedSessions.length + 18} Sessions</span>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1">
                <span className="text-slate-400 block">Volunteer Hours Granted</span>
                <span className="text-xl font-bold text-[#30D158]">58 Volunteer Hours</span>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1">
                <span className="text-slate-400 block">Active Campus Clubs</span>
                <span className="text-xl font-bold text-[#0A84FF]">{clubs.length} Partner Chapters</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

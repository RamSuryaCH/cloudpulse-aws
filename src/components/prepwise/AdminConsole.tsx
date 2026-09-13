import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Award,
  Users,
  BookOpen
} from 'lucide-react';
import { SEED_SESSIONS, SEED_TUTORS, SEED_CLUBS } from '../../data/prepwiseData';
import type { TutoringSession } from '../../types/prepwise';
import { sounds } from '../../utils/soundEffects';
import { API_BASE_URL } from '../../utils/apiConfig';

export const AdminConsole: React.FC = () => {
  const [sessions, setSessions] = useState<TutoringSession[]>(SEED_SESSIONS);
  const [tutors] = useState(SEED_TUTORS);
  const [clubs] = useState(SEED_CLUBS);

  const handleApproveSession = (sessionId: string) => {
    sounds.playSuccess();
    setSessions(prev => prev.map(s => {
      if (s.id === sessionId) {
        return {
          ...s,
          tutorId: tutors[0].id,
          tutorName: tutors[0].name,
          sessionStatus: 'assigned',
          locationOrLink: 'Library Discussion Room B3'
        };
      }
      return s;
    }));
  };

  const handleCompleteSession = async (sessionId: string) => {
    sounds.playSuccess();
    try {
      await fetch(`${API_BASE_URL}/api/prepwise/admin/complete-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      });
    } catch {
      // Local state fallback
    }

    setSessions(prev => prev.map(s => {
      if (s.id === sessionId) {
        return { ...s, sessionStatus: 'completed' };
      }
      return s;
    }));
  };

  const pendingRequests = sessions.filter(s => s.sessionStatus === 'requested');
  const activeSessions = sessions.filter(s => s.sessionStatus === 'assigned' || s.sessionStatus === 'ready');
  const completedSessions = sessions.filter(s => s.sessionStatus === 'completed');

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <span className="text-xs font-semibold text-pw-accent uppercase tracking-wider">Campus Coordinator Operations</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-pw-text">
            Campus Coordinator Console
          </h1>
          <p className="text-base text-pw-secondary leading-relaxed">
            Monitor peer tutoring quality, match students with senior TAs, and oversee campus study spaces.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-semibold text-pw-accent bg-pw-accent-subtle px-3 py-1.5 rounded-lg border border-pw-accent-border self-start sm:self-center">
          <ShieldCheck className="w-4 h-4" />
          <span>Coordinator Privileges</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="pw-card p-5 space-y-1">
          <span className="text-xs font-medium text-pw-secondary flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-pw-accent" /> Pending Requests
          </span>
          <span className="text-2xl font-bold text-pw-text font-display">{pendingRequests.length}</span>
        </div>

        <div className="pw-card p-5 space-y-1">
          <span className="text-xs font-medium text-pw-secondary flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-pw-accent" /> Active Sessions
          </span>
          <span className="text-2xl font-bold text-pw-text font-display">{activeSessions.length}</span>
        </div>

        <div className="pw-card p-5 space-y-1">
          <span className="text-xs font-medium text-pw-secondary flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-pw-success" /> Completed
          </span>
          <span className="text-2xl font-bold text-pw-text font-display">{completedSessions.length}</span>
        </div>

        <div className="pw-card p-5 space-y-1">
          <span className="text-xs font-medium text-pw-secondary flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-pw-accent" /> Club Partners
          </span>
          <span className="text-2xl font-bold text-pw-text font-display">{clubs.length}</span>
        </div>
      </div>

      {/* Pending Student Requests Table / List */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-pw-text">Pending Matching Queue</h3>
        
        {pendingRequests.length === 0 ? (
          <div className="pw-card p-8 text-center text-pw-secondary text-xs">
            No pending student requests waiting for tutor assignment.
          </div>
        ) : (
          <div className="space-y-3">
            {pendingRequests.map(s => (
              <div key={s.id} className="pw-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold text-pw-text">{s.publicToken}</span>
                    <span className="text-xs text-pw-secondary">• {s.collegeName}</span>
                  </div>
                  <h4 className="font-bold text-sm text-pw-text">{s.courseName}</h4>
                  <p className="text-xs text-pw-secondary">
                    Student: {s.studentName} ({s.studentContact}) • Format: {s.sessionType}
                  </p>
                </div>

                <button
                  onClick={() => handleApproveSession(s.id)}
                  className="pw-button-primary text-xs py-2 px-4 whitespace-nowrap self-start sm:self-center"
                >
                  Assign Peer Tutor & Room
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active & Ongoing Sessions */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-pw-text">Active Campus Sessions</h3>
        
        {activeSessions.length === 0 ? (
          <div className="pw-card p-8 text-center text-pw-secondary text-xs">
            No active sessions currently in progress.
          </div>
        ) : (
          <div className="space-y-3">
            {activeSessions.map(s => (
              <div key={s.id} className="pw-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold text-pw-text">{s.publicToken}</span>
                    <span className="text-xs font-semibold text-pw-accent bg-pw-accent-subtle px-2 py-0.5 rounded">
                      {s.sessionStatus.toUpperCase()}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-pw-text">{s.courseName}</h4>
                  <p className="text-xs text-pw-secondary">
                    Student: {s.studentName} | Assigned Tutor: <strong className="text-pw-text">{s.tutorName}</strong>
                  </p>
                  <p className="text-xs text-pw-secondary">
                    Venue: {s.locationOrLink || 'Library Discussion Room B3'}
                  </p>
                </div>

                <button
                  onClick={() => handleCompleteSession(s.id)}
                  className="pw-button-secondary text-xs py-2 px-4 whitespace-nowrap text-pw-success hover:bg-pw-success-subtle hover:border-pw-success/30 self-start sm:self-center"
                >
                  Confirm Completed
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

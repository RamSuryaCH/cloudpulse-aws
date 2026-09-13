import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  User, 
  MapPin, 
  Star, 
  Send, 
  Copy, 
  Check,
  Search,
  Sparkles
} from 'lucide-react';
import { SEED_SESSIONS } from '../../data/prepwiseData';
import type { TutoringSession } from '../../types/prepwise';
import { sounds } from '../../utils/soundEffects';
import { API_BASE_URL } from '../../utils/apiConfig';

interface StudentTrackerProps {
  initialToken?: string | null;
}

export const StudentTracker: React.FC<StudentTrackerProps> = ({ initialToken }) => {
  const [tokenInput, setTokenInput] = useState(initialToken || 'pw-tok-78901');
  const [session, setSession] = useState<TutoringSession | null>(SEED_SESSIONS[0]);
  const [loading, setLoading] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Review submission state
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const fetchSessionByToken = async (tok: string) => {
    if (!tok.trim()) return;
    sounds.playClick();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/prepwise/sessions/track?token=${encodeURIComponent(tok.trim())}`);
      const data = await res.json();
      if (res.ok && data.session) {
        sounds.playSuccess();
        setSession(data.session);
      } else {
        const seedMatch = SEED_SESSIONS.find(s => s.publicToken === tok.trim()) || SEED_SESSIONS[0];
        setSession(seedMatch);
      }
    } catch {
      const seedMatch = SEED_SESSIONS.find(s => s.publicToken === tok.trim()) || SEED_SESSIONS[0];
      setSession(seedMatch);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialToken) {
      setTokenInput(initialToken);
      fetchSessionByToken(initialToken);
    }
  }, [initialToken]);

  const handleCopyTrackLink = () => {
    sounds.playSuccess();
    const link = `${window.location.origin}/?token=${session?.publicToken}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playSuccess();
    setReviewSubmitted(true);
  };

  const getStatusDisplay = (sessionStatus: string) => {
    switch (sessionStatus) {
      case 'completed':
        return {
          label: 'Session Completed',
          className: 'bg-pw-success-subtle text-pw-success border-pw-success/30',
          icon: CheckCircle2
        };
      case 'ready':
        return {
          label: 'Tutor Ready at Campus Venue',
          className: 'bg-pw-accent-subtle text-pw-accent border-pw-accent-border',
          icon: Sparkles
        };
      case 'assigned':
        return {
          label: 'Senior TA Assigned',
          className: 'bg-pw-accent-subtle text-pw-accent border-pw-accent-border',
          icon: User
        };
      default:
        return {
          label: 'Matching Senior TA',
          className: 'bg-pw-warning-subtle text-pw-warning border-pw-warning/30',
          icon: Clock
        };
    }
  };

  const statusInfo = session ? getStatusDisplay(session.sessionStatus) : null;
  const StatusIcon = statusInfo?.icon;

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Header */}
      <div className="space-y-4">
        <span className="text-xs font-semibold text-pw-accent uppercase tracking-wider">Live Status Lookup</span>
        <h1 className="text-3xl sm:text-4xl font-bold text-pw-text">
          Track Your Free Study Session
        </h1>
        <p className="text-base text-pw-secondary leading-relaxed">
          Enter your session token to check assigned TA details, study venue, and post-session review status.
        </p>

        {/* Token Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-pw-tertiary absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Enter session token (e.g. pw-tok-78901)"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              className="w-full pw-input pl-10 font-mono text-xs"
            />
          </div>
          <button
            onClick={() => fetchSessionByToken(tokenInput)}
            disabled={loading}
            className="pw-button-primary text-xs py-2.5 px-6 disabled:opacity-50"
          >
            {loading ? 'Looking up...' : 'Track Session'}
          </button>
        </div>
      </div>

      {session ? (
        <div className="space-y-8">
          {/* Main Session Card */}
          <div className="pw-card p-6 sm:p-8 space-y-6">
            
            {/* Token & Status Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-pw-border">
              <div>
                <span className="text-xs text-pw-secondary block mb-1">Session Token</span>
                <div className="flex items-center space-x-3">
                  <span className="text-lg font-bold font-mono text-pw-text">{session.publicToken}</span>
                  <button
                    onClick={handleCopyTrackLink}
                    className="text-xs text-pw-accent hover:text-pw-accent-hover flex items-center gap-1 font-medium"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-pw-success" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
                  </button>
                </div>
              </div>

              {statusInfo && StatusIcon && (
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold ${statusInfo.className}`}>
                  <StatusIcon className="w-4 h-4" />
                  <span>{statusInfo.label}</span>
                </span>
              )}
            </div>

            {/* Overview Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-pw-subtle p-5 rounded-xl border border-pw-border space-y-2">
                <span className="text-xs font-semibold text-pw-secondary uppercase">Course & Format</span>
                <h3 className="font-bold text-sm text-pw-text">{session.courseName}</h3>
                <p className="text-xs text-pw-secondary capitalize">
                  {session.sessionType.replace('_', ' ')} • {session.durationMins || 60} Minutes
                </p>
                <span className="inline-block text-xs font-semibold text-pw-success bg-pw-success-subtle px-2 py-0.5 rounded border border-pw-success/20">
                  100% Free Peer Learning
                </span>
              </div>

              <div className="bg-pw-subtle p-5 rounded-xl border border-pw-border space-y-2">
                <span className="text-xs font-semibold text-pw-secondary uppercase">Student & Campus</span>
                <h3 className="font-bold text-sm text-pw-text">{session.studentName}</h3>
                <p className="text-xs text-pw-secondary">{session.collegeName}</p>
                <span className="text-xs text-pw-secondary block font-mono">Contact: {session.studentContact}</span>
              </div>
            </div>

            {/* Assigned Tutor & Venue */}
            <div className="bg-pw-surface p-5 rounded-xl border border-pw-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3.5">
                <div className="w-11 h-11 rounded-xl bg-pw-accent-subtle text-pw-accent flex items-center justify-center">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-pw-text">{session.tutorName || 'Arjun Reddy (Senior TA)'}</h4>
                  <span className="text-xs text-pw-secondary">Assigned Campus Peer Tutor • 4.9 ★ Rating</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-xs text-pw-secondary bg-pw-subtle px-3.5 py-2 rounded-lg border border-pw-border">
                <MapPin className="w-4 h-4 text-pw-accent shrink-0" />
                <span>{session.locationOrLink || 'Library Discussion Room B3 / Google Meet'}</span>
              </div>
            </div>

            {/* Progress Stepper */}
            <div className="pt-6 border-t border-pw-border space-y-4">
              <h4 className="text-xs font-semibold text-pw-secondary uppercase">Session Lifecycle</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-pw-subtle p-3 rounded-lg border border-pw-border flex items-center space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-pw-success shrink-0" />
                  <div>
                    <strong className="text-xs text-pw-text block">1. Requested</strong>
                    <span className="text-[11px] text-pw-secondary">Free session logged</span>
                  </div>
                </div>

                <div className={`p-3 rounded-lg border flex items-center space-x-2.5 ${
                  session.tutorName ? 'bg-pw-subtle border-pw-border' : 'bg-pw-accent-subtle border-pw-accent-border'
                }`}>
                  <CheckCircle2 className={`w-4 h-4 shrink-0 ${session.tutorName ? 'text-pw-success' : 'text-pw-accent'}`} />
                  <div>
                    <strong className="text-xs text-pw-text block">2. Tutor Assigned</strong>
                    <span className="text-[11px] text-pw-secondary">{session.tutorName ? 'Tutor confirmed' : 'Matching TA'}</span>
                  </div>
                </div>

                <div className={`p-3 rounded-lg border flex items-center space-x-2.5 ${
                  session.sessionStatus === 'completed' ? 'bg-pw-success-subtle border-pw-success/30' : 'bg-pw-subtle border-pw-border opacity-70'
                }`}>
                  <CheckCircle2 className={`w-4 h-4 shrink-0 ${session.sessionStatus === 'completed' ? 'text-pw-success' : 'text-pw-tertiary'}`} />
                  <div>
                    <strong className="text-xs text-pw-text block">3. Completed</strong>
                    <span className="text-[11px] text-pw-secondary">{session.sessionStatus === 'completed' ? 'Reviewed' : 'Awaiting meet'}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Post-Session Review Form */}
          {session.sessionStatus === 'completed' && (
            <div className="pw-card p-6 sm:p-8 space-y-6">
              <div className="pb-4 border-b border-pw-border">
                <h3 className="text-lg font-bold text-pw-text flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500" />
                  Leave Tutor Feedback & Academic Karma
                </h3>
                <p className="text-xs text-pw-secondary mt-1">
                  Your feedback rewards your senior TA with recognized volunteer hours and campus karma points.
                </p>
              </div>

              {reviewSubmitted ? (
                <div className="p-6 rounded-xl bg-pw-success-subtle border border-pw-success/30 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-pw-success mx-auto" />
                  <h4 className="font-bold text-pw-text">Feedback submitted successfully!</h4>
                  <p className="text-xs text-pw-secondary">Thank you for supporting student-to-student peer learning.</p>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-pw-text mb-2">Rating</label>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className={`px-3 py-2 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                            rating >= star
                              ? 'bg-amber-50 text-amber-700 border-amber-300'
                              : 'bg-pw-subtle text-pw-secondary border-pw-border'
                          }`}
                        >
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>{star} Stars</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-pw-text mb-1.5">Your Review Notes</label>
                    <textarea
                      rows={3}
                      placeholder="How did this peer session help you prepare for your exam or lab viva?"
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      className="w-full pw-input"
                    />
                  </div>

                  <button
                    type="submit"
                    className="pw-button-primary text-xs py-2.5 px-6 flex items-center space-x-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Review</span>
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="pw-card p-12 text-center text-pw-secondary text-sm">
          No session found for this token. Enter a valid token above to track your booking.
        </div>
      )}
    </div>
  );
};

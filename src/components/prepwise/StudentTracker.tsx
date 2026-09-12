import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  User, 
  MapPin, 
  Star, 
  Send, 
  ShieldCheck, 
  Sparkles, 
  Copy, 
  Check 
} from 'lucide-react';
import { SEED_SESSIONS } from '../../data/prepwiseData';
import type { TutoringSession } from '../../types/prepwise';
import { sounds } from '../../utils/soundEffects';

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
      const res = await fetch(`https://pmaj9rfa04.execute-api.ap-southeast-2.amazonaws.com/api/prepwise/sessions/track?token=${encodeURIComponent(tok)}`);
      const data = await res.json();
      if (res.ok && data.session) {
        sounds.playSuccess();
        setSession(data.session);
      } else {
        const seedMatch = SEED_SESSIONS.find(s => s.publicToken === tok) || SEED_SESSIONS[0];
        setSession(seedMatch);
      }
    } catch {
      const seedMatch = SEED_SESSIONS.find(s => s.publicToken === tok) || SEED_SESSIONS[0];
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

  const handleReviewSubmit = () => {
    sounds.playSuccess();
    setReviewSubmitted(true);
  };

  const getStatusBadge = (paymentStatus: string, sessionStatus: string) => {
    if (paymentStatus === 'pending' || paymentStatus === 'submitted') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30 font-mono text-xs font-bold">
          <Clock className="w-3.5 h-3.5 animate-spin" />
          Awaiting Admin Payment Verification
        </span>
      );
    }

    if (sessionStatus === 'completed') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#30D158]/10 text-[#30D158] border border-[#30D158]/30 font-mono text-xs font-bold">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Session Completed & Verified
        </span>
      );
    }

    if (sessionStatus === 'ready') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0A84FF]/10 text-[#0A84FF] border border-[#0A84FF]/30 font-mono text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          Tutor Ready on Campus
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#30D158]/10 text-[#30D158] border border-[#30D158]/30 font-mono text-xs font-bold">
        <ShieldCheck className="w-3.5 h-3.5" />
        Payment Verified — Assigning Tutor
      </span>
    );
  };

  return (
    <div className="space-y-12">
      {/* Search Token Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-[#F59E0B] text-xs font-mono font-semibold">
          <Clock className="w-3.5 h-3.5" />
          <span>Single-Token Secure Student Tracking</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Track Your Session
        </h1>
        <p className="text-base text-slate-400 leading-relaxed">
          Enter your 12-char session token to check manual payment verification, assigned tutor details, campus meeting venue, and post-session review.
        </p>

        {/* Token Search Bar */}
        <div className="flex space-x-3 max-w-xl">
          <input
            type="text"
            placeholder="Enter publicToken (e.g. pw-tok-78901)"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-2xl px-5 py-3 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-[#F59E0B]"
          />
          <button
            onClick={() => fetchSessionByToken(tokenInput)}
            disabled={loading}
            className="px-6 py-3 rounded-2xl bg-[#F59E0B] hover:bg-[#FBBF24] text-black font-extrabold text-xs shadow-lg shadow-[#F59E0B]/20 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Fetching...' : 'Track Session'}
          </button>
        </div>
      </div>

      {session ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Tracking Details (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="apple-card p-8 space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
                <div>
                  <span className="text-xs font-mono text-slate-400 block mb-1">Public Session Token</span>
                  <span className="text-xl font-mono font-bold text-white flex items-center gap-2">
                    {session.publicToken}
                    <button
                      onClick={handleCopyTrackLink}
                      className="text-xs text-[#F59E0B] hover:underline flex items-center gap-1 font-sans"
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5 text-[#30D158]" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
                    </button>
                  </span>
                </div>
                {getStatusBadge(session.paymentStatus, session.sessionStatus)}
              </div>

              {/* Course & Session Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
                <div className="space-y-3 bg-white/[0.03] p-5 rounded-2xl border border-white/[0.06]">
                  <span className="text-slate-400 block uppercase font-bold tracking-wider text-[10px]">Session Details</span>
                  <div className="flex justify-between text-slate-300">
                    <span>Subject:</span>
                    <span className="font-bold text-white">{session.courseName}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Format:</span>
                    <span className="font-bold text-white capitalize">{session.sessionType.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Total Paid:</span>
                    <span className="font-bold text-[#F59E0B]">₹{session.totalAmount}</span>
                  </div>
                </div>

                <div className="space-y-3 bg-white/[0.03] p-5 rounded-2xl border border-white/[0.06]">
                  <span className="text-slate-400 block uppercase font-bold tracking-wider text-[10px]">Payment Verification</span>
                  <div className="flex justify-between text-slate-300">
                    <span>Status:</span>
                    <span className="font-bold text-[#30D158] capitalize">{session.paymentStatus}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>UTR Reference:</span>
                    <span className="font-bold text-white">{session.paymentRef || 'Submitted — Pending Check'}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Verified By:</span>
                    <span className="font-bold text-white">{session.verifiedBy || 'Awaiting Admin'}</span>
                  </div>
                </div>
              </div>

              {/* Assigned Tutor Card */}
              <div className="bg-[#050508] border border-white/[0.08] p-6 rounded-2xl space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#0A84FF]/20 text-[#0A84FF] border border-[#0A84FF]/30 flex items-center justify-center font-bold text-lg">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold text-white">{session.tutorName || 'Arjun Reddy (VNRVJIET TA)'}</h4>
                    <span className="text-xs font-mono text-slate-400">Assigned Campus Peer Tutor • 4.9 ★ Rating</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-xs text-slate-300 font-mono bg-white/[0.04] p-3 rounded-xl">
                  <MapPin className="w-4 h-4 text-[#F59E0B] shrink-0" />
                  <span>Venue: {session.locationOrLink || 'Library Discussion Room B3 / Campus Academic Block'}</span>
                </div>
              </div>
            </div>

            {/* Post-Session Review Form (Unlocks after completion) */}
            {session.sessionStatus === 'completed' && (
              <div className="apple-card p-8 space-y-6">
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2.5">
                    <Star className="w-5 h-5 text-[#F59E0B]" />
                    Leave Session Rating & Review
                  </h3>
                  <span className="text-xs text-[#30D158] font-mono">Completed Session</span>
                </div>

                {reviewSubmitted ? (
                  <div className="p-6 rounded-2xl bg-[#30D158]/10 border border-[#30D158]/30 text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-[#30D158] mx-auto" />
                    <h4 className="text-base font-bold text-white">Thank you for your feedback!</h4>
                    <p className="text-xs text-slate-300">Your review helps maintain top tutoring quality across Hyderabad campuses.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-mono text-slate-300 block mb-2">Select Rating (1 to 5 Stars)</label>
                      <div className="flex space-x-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setRating(star)}
                            className={`p-2.5 rounded-xl border text-sm font-bold flex items-center gap-1 transition-all ${
                              rating >= star
                                ? 'bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]'
                                : 'bg-white/[0.04] text-slate-500 border-white/[0.08]'
                            }`}
                          >
                            <Star className="w-4 h-4 fill-current" />
                            <span>{star}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-mono text-slate-300 block mb-1">Your Review / Comments</label>
                      <textarea
                        rows={3}
                        placeholder="Explain how the session helped you prepare for your exam..."
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#F59E0B]"
                      />
                    </div>

                    <button
                      onClick={handleReviewSubmit}
                      className="flex items-center space-x-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-black font-extrabold text-xs shadow-lg shadow-[#F59E0B]/20"
                    >
                      <Send className="w-4 h-4 stroke-[2.5]" />
                      <span>Submit Tutor Review</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Status Timeline & Help Card (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="apple-card p-8 space-y-6">
              <h3 className="text-base font-bold text-white font-mono uppercase tracking-wider">Session Timeline</h3>
              
              <div className="space-y-6 relative border-l-2 border-white/[0.08] ml-3 pl-6">
                <div className="relative">
                  <span className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-[#30D158] ring-4 ring-black" />
                  <h4 className="text-xs font-bold text-white">Booking Created</h4>
                  <p className="text-[11px] text-slate-400 font-mono">Manual UPI order logged</p>
                </div>

                <div className="relative">
                  <span className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full ${session.paymentStatus === 'verified' ? 'bg-[#30D158]' : 'bg-[#F59E0B] animate-pulse'} ring-4 ring-black`} />
                  <h4 className="text-xs font-bold text-white">Manual Payment Verification</h4>
                  <p className="text-[11px] text-slate-400 font-mono">{session.paymentStatus === 'verified' ? 'Verified by Admin' : 'Awaiting Bank Match'}</p>
                </div>

                <div className="relative">
                  <span className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full ${session.sessionStatus === 'completed' ? 'bg-[#30D158]' : 'bg-slate-600'} ring-4 ring-black`} />
                  <h4 className="text-xs font-bold text-white">Campus Session & Quality Gate</h4>
                  <p className="text-[11px] text-slate-400 font-mono">{session.sessionStatus === 'completed' ? 'Completed & Confirmed' : 'Campus Handoff Pending'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="apple-card p-12 text-center text-slate-400 font-mono text-xs">
          No session found for this token. Enter a valid token above to track your booking.
        </div>
      )}
    </div>
  );
};

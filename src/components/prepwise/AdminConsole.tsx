import React, { useState } from 'react';
import { 
  ShieldCheck, 
  DollarSign, 
  Clock, 
  CheckCircle2 
} from 'lucide-react';
import { SEED_SESSIONS, SEED_TUTORS, SEED_CLUBS } from '../../data/prepwiseData';
import type { TutoringSession, TutorProfile, PartnerClub, PayoutRecord } from '../../types/prepwise';
import { sounds } from '../../utils/soundEffects';

export const AdminConsole: React.FC = () => {
  const [sessions, setSessions] = useState<TutoringSession[]>(SEED_SESSIONS);
  const [tutors] = useState<TutorProfile[]>(SEED_TUTORS);
  const [clubs] = useState<PartnerClub[]>(SEED_CLUBS);

  // Payout Form State
  const [payoutPayeeType, setPayoutPayeeType] = useState<'tutor' | 'club'>('tutor');
  const [payoutPayeeId, setPayoutPayeeId] = useState('tutor-1');
  const [payoutAmount, setPayoutAmount] = useState('500');
  const [payoutUtr, setPayoutUtr] = useState('');
  const [payoutHistory, setPayoutHistory] = useState<PayoutRecord[]>([
    {
      id: 'pay-01',
      payeeType: 'tutor',
      payeeId: 'tutor-1',
      payeeName: 'Arjun Reddy',
      amount: 500,
      upiReference: 'UPI-UTR-991238491029',
      timestamp: '2026-09-12T14:00:00.000Z',
      paidByAdmin: 'Admin System'
    },
    {
      id: 'pay-02',
      payeeType: 'club',
      payeeId: 'club-vnr-aws',
      payeeName: 'AWS Cloud Club VNRVJIET',
      amount: 200,
      upiReference: 'UPI-UTR-883719203918',
      timestamp: '2026-09-12T15:30:00.000Z',
      paidByAdmin: 'Admin System'
    }
  ]);

  const [payoutSubmitted, setPayoutSubmitted] = useState(false);

  // Admin Actions
  const handleVerifyPayment = async (sessionId: string) => {
    sounds.playSuccess();
    setSessions(prev => prev.map(s => {
      if (s.id === sessionId) {
        return {
          ...s,
          paymentStatus: 'verified',
          verifiedBy: 'Admin (Console)',
          verifiedAt: new Date().toISOString()
        };
      }
      return s;
    }));

    try {
      await fetch('https://pmaj9rfa04.execute-api.ap-southeast-2.amazonaws.com/api/prepwise/admin/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, action: 'verify' })
      });
    } catch {}
  };

  const handleRejectPayment = (sessionId: string) => {
    sounds.playDelete();
    setSessions(prev => prev.map(s => {
      if (s.id === sessionId) {
        return {
          ...s,
          paymentStatus: 'rejected'
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

  const handleRecordPayout = () => {
    if (!payoutUtr.trim() || payoutUtr.length < 8) {
      alert('Please enter a valid 12-digit UTR reference for the bank payout.');
      return;
    }

    sounds.playSuccess();
    const amountNum = parseFloat(payoutAmount);
    const payeeName = payoutPayeeType === 'tutor' 
      ? tutors.find(t => t.id === payoutPayeeId)?.name || 'Tutor Payee'
      : clubs.find(c => c.id === payoutPayeeId)?.name || 'Club Payee';

    const newRecord: PayoutRecord = {
      id: 'pay-' + Date.now().toString().slice(-4),
      payeeType: payoutPayeeType,
      payeeId: payoutPayeeId,
      payeeName,
      amount: amountNum,
      upiReference: payoutUtr,
      timestamp: new Date().toISOString(),
      paidByAdmin: 'Admin Console'
    };

    setPayoutHistory(prev => [newRecord, ...prev]);
    setPayoutUtr('');
    setPayoutSubmitted(true);
    setTimeout(() => setPayoutSubmitted(false), 2500);
  };

  const pendingVerificationSessions = sessions.filter(s => s.paymentStatus === 'submitted' || s.paymentStatus === 'pending');
  const activeUncompletedSessions = sessions.filter(s => s.paymentStatus === 'verified' && s.sessionStatus !== 'completed');

  return (
    <div className="space-y-12">
      {/* Admin Console Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-[#F59E0B] text-xs font-mono font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Operator Verification Console & Financial Ledger</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Admin Operations Hub
        </h1>
        <p className="text-base text-slate-400 leading-relaxed">
          Verify manual UPI payments against bank statement references, grant campus session completion quality gates, and record payouts to Tutors and Partner Clubs.
        </p>
      </div>

      {/* Grid: Payment Queue & Quality Gate (8 cols) vs Payout Recorder (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Queues (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Section 1: Manual Payment Verification Queue */}
          <div className="apple-card p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2.5 font-mono">
                <Clock className="w-5 h-5 text-[#F59E0B]" />
                Manual Payment Verification Queue
              </h3>
              <span className="text-xs text-[#F59E0B] font-mono font-bold bg-[#F59E0B]/10 px-3 py-1 rounded-full border border-[#F59E0B]/30">
                {pendingVerificationSessions.length} Pending Check
              </span>
            </div>

            {pendingVerificationSessions.length === 0 ? (
              <div className="p-8 text-center text-slate-400 font-mono text-xs">
                All student UPI payments are verified! No pending transactions.
              </div>
            ) : (
              <div className="space-y-4">
                {pendingVerificationSessions.map((sess) => (
                  <div key={sess.id} className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-extrabold text-base text-white block">{sess.courseName}</span>
                        <span className="text-xs font-mono text-slate-400 block">{sess.studentName} ({sess.studentContact})</span>
                      </div>
                      <span className="text-lg font-mono font-black text-[#F59E0B]">₹{sess.totalAmount}</span>
                    </div>

                    <div className="bg-[#050508] p-3 rounded-xl border border-white/[0.06] text-xs font-mono text-slate-300 flex items-center justify-between">
                      <span>Submitted UTR Reference:</span>
                      <strong className="text-white">{sess.paymentRef || 'UTR Pending'}</strong>
                    </div>

                    <div className="flex space-x-3 pt-2">
                      <button
                        onClick={() => handleRejectPayment(sess.id)}
                        className="flex-1 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-mono text-xs font-bold border border-red-500/30 transition-all"
                      >
                        Reject Payment
                      </button>
                      <button
                        onClick={() => handleVerifyPayment(sess.id)}
                        className="flex-1 py-2.5 rounded-xl bg-[#30D158] hover:bg-[#28b84c] text-black font-extrabold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                      >
                        Verify Payment Match
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Campus Completion Quality Gate */}
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
                    className="px-4 py-2 rounded-xl bg-[#30D158] hover:bg-[#28b84c] text-black font-extrabold text-xs shadow-md transition-all active:scale-95"
                  >
                    Mark Campus Completed
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Payout Recorder & Ledger (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="apple-card p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2.5 font-mono">
                <DollarSign className="w-5 h-5 text-[#F59E0B]" />
                Record Payout Ledger
              </h3>
            </div>

            {payoutSubmitted && (
              <div className="p-3 rounded-xl bg-[#30D158]/10 border border-[#30D158]/30 text-xs font-mono text-[#30D158] text-center font-bold">
                Payout recorded successfully to ledger!
              </div>
            )}

            <div className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-slate-300 block mb-1">Payee Category</label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setPayoutPayeeType('tutor')}
                    className={`flex-1 py-2 rounded-xl border text-xs font-bold ${
                      payoutPayeeType === 'tutor'
                        ? 'bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]'
                        : 'bg-white/[0.04] text-slate-400 border-white/[0.08]'
                    }`}
                  >
                    Tutor (75%)
                  </button>
                  <button
                    onClick={() => setPayoutPayeeType('club')}
                    className={`flex-1 py-2 rounded-xl border text-xs font-bold ${
                      payoutPayeeType === 'club'
                        ? 'bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]'
                        : 'bg-white/[0.04] text-slate-400 border-white/[0.08]'
                    }`}
                  >
                    Club (20% Net)
                  </button>
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Select Payee Target</label>
                <select
                  value={payoutPayeeId}
                  onChange={(e) => setPayoutPayeeId(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#F59E0B]"
                >
                  {payoutPayeeType === 'tutor'
                    ? tutors.map(t => <option key={t.id} value={t.id} className="bg-[#0C0C12]">{t.name} ({t.college})</option>)
                    : clubs.map(c => <option key={c.id} value={c.id} className="bg-[#0C0C12]">{c.name} ({c.referralCode})</option>)
                  }
                </select>
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Payout Amount (₹)</label>
                <input
                  type="number"
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#F59E0B]"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Bank Transfer UTR Reference *</label>
                <input
                  type="text"
                  placeholder="e.g. UPI-UTR-991238491029"
                  value={payoutUtr}
                  onChange={(e) => setPayoutUtr(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-[#F59E0B]"
                />
              </div>

              <button
                onClick={handleRecordPayout}
                className="w-full py-3 rounded-2xl bg-[#F59E0B] hover:bg-[#FBBF24] text-black font-extrabold text-xs shadow-lg"
              >
                Record Payout to Ledger
              </button>
            </div>

            {/* Payout History Stream */}
            <div className="pt-4 border-t border-white/[0.08] space-y-3">
              <span className="text-xs font-mono text-slate-400 block uppercase font-bold tracking-wider">Settled Payout Log</span>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {payoutHistory.map((rec) => (
                  <div key={rec.id} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs font-mono space-y-1">
                    <div className="flex justify-between text-white font-bold">
                      <span>{rec.payeeName}</span>
                      <span className="text-[#30D158]">₹{rec.amount}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 flex justify-between">
                      <span>{rec.upiReference.slice(0, 18)}...</span>
                      <span>{new Date(rec.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

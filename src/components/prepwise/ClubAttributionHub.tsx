import React, { useState } from 'react';
import { 
  Award, 
  DollarSign, 
  Copy, 
  Check, 
  TrendingUp, 
  ShieldCheck, 
  Building2 
} from 'lucide-react';
import { SEED_CLUBS } from '../../data/prepwiseData';
import type { PartnerClub } from '../../types/prepwise';
import { sounds } from '../../utils/soundEffects';

export const ClubAttributionHub: React.FC = () => {
  const [clubs] = useState<PartnerClub[]>(SEED_CLUBS);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyLink = (code: string) => {
    sounds.playSuccess();
    const link = `${window.location.origin}/?ref=${code}`;
    navigator.clipboard.writeText(link);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const totalGmvAttributed = clubs.reduce((sum, c) => sum + c.totalGmv, 0);
  const totalClubNetEarned = clubs.reduce((sum, c) => sum + c.totalNetEarned, 0);
  const totalPaidOut = clubs.reduce((sum, c) => sum + c.totalPaid, 0);

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-[#F59E0B] text-xs font-mono font-semibold">
          <Award className="w-3.5 h-3.5" />
          <span>Campus Partner Club Revenue Share</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Partner Club Attribution
        </h1>
        <p className="text-base text-slate-400 leading-relaxed">
          Student clubs earn a machine-computed <strong>20% of net platform profit</strong> for every attributed session booking via their unique campus referral link.
        </p>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="apple-card p-8">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 font-mono flex justify-between items-center">
            <span>Total Attributed GMV</span>
            <TrendingUp className="w-5 h-5 text-[#30D158]" />
          </div>
          <div className="text-4xl font-black text-white font-mono tracking-tight">
            ₹{totalGmvAttributed.toLocaleString()}
          </div>
          <div className="text-xs text-slate-400 mt-2 font-mono">From 54 Partner Bookings</div>
        </div>

        <div className="apple-card p-8">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 font-mono flex justify-between items-center">
            <span>Club Net Earnings (20%)</span>
            <DollarSign className="w-5 h-5 text-[#F59E0B]" />
          </div>
          <div className="text-4xl font-black text-[#F59E0B] font-mono tracking-tight">
            ₹{totalClubNetEarned.toFixed(2)}
          </div>
          <div className="text-xs text-slate-400 mt-2 font-mono">Computed on Platform Net</div>
        </div>

        <div className="apple-card p-8">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 font-mono flex justify-between items-center">
            <span>Settled Payouts</span>
            <ShieldCheck className="w-5 h-5 text-[#0A84FF]" />
          </div>
          <div className="text-4xl font-black text-[#0A84FF] font-mono tracking-tight">
            ₹{totalPaidOut.toFixed(2)}
          </div>
          <div className="text-xs text-slate-400 mt-2 font-mono">Paid to Office-Bearer VPAs</div>
        </div>
      </div>

      {/* Partner Clubs Table & Referral Links */}
      <div className="apple-card p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-5">
          <h3 className="text-lg font-bold text-white flex items-center gap-2.5 font-mono">
            <Building2 className="w-5 h-5 text-[#F59E0B]" />
            Active Campus Partner Clubs
          </h3>
          <span className="text-xs text-[#30D158] font-mono font-bold bg-[#30D158]/10 px-3 py-1 rounded-full border border-[#30D158]/30">
            3 Campus Partners
          </span>
        </div>

        <div className="space-y-6">
          {clubs.map((club) => (
            <div key={club.id} className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-3">
                    <span className="font-extrabold text-base text-white">{club.name}</span>
                    <span className="text-xs font-mono px-2.5 py-0.5 rounded-md bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30 font-bold">
                      {club.referralCode}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-slate-400 block mt-1">{club.collegeName}</span>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleCopyLink(club.referralCode)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-xs font-mono text-slate-200 transition-all cursor-pointer"
                  >
                    {copiedCode === club.referralCode ? (
                      <Check className="w-3.5 h-3.5 text-[#30D158]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-[#F59E0B]" />
                    )}
                    <span>{copiedCode === club.referralCode ? 'Link Copied!' : 'Copy Referral Link'}</span>
                  </button>
                </div>
              </div>

              {/* Financial Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono pt-3 border-t border-white/[0.06]">
                <div>
                  <span className="text-slate-400 block">Attributed Bookings</span>
                  <span className="text-white font-bold">{club.totalAttributedOrders} Sessions</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Gross GMV</span>
                  <span className="text-white font-bold">₹{club.totalGmv}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Net Club Earned (20%)</span>
                  <span className="text-[#30D158] font-bold">₹{club.totalNetEarned.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Current Payee VPA</span>
                  <span className="text-[#F59E0B] font-bold truncate block">{club.payeeUpi}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

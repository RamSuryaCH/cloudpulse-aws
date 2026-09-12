import React, { useState } from 'react';
import { 
  Award, 
  Copy, 
  Check, 
  TrendingUp, 
  ShieldCheck, 
  Building2,
  Users
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

  const totalSessionsAttributed = clubs.reduce((sum, c) => sum + c.totalAttributedSessions, 0);
  const totalStudentsHelped = clubs.reduce((sum, c) => sum + c.totalStudentsHelped, 0);

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#30D158]/10 border border-[#30D158]/30 text-[#30D158] text-xs font-mono font-semibold">
          <Award className="w-3.5 h-3.5" />
          <span>Campus Student Organization Partnerships</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Partner Club Campus Impact
        </h1>
        <p className="text-base text-slate-400 leading-relaxed">
          Student clubs and AWS Cloud Chapters partner with PrepWise Campus to host free peer study groups and facilitate exam preparation for their student community.
        </p>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="apple-card p-8">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 font-mono flex justify-between items-center">
            <span>Attributed Sessions</span>
            <TrendingUp className="w-5 h-5 text-[#30D158]" />
          </div>
          <div className="text-4xl font-black text-white font-mono tracking-tight">
            {totalSessionsAttributed} Sessions
          </div>
          <div className="text-xs text-slate-400 mt-2 font-mono">Facilitated Across 3 Campuses</div>
        </div>

        <div className="apple-card p-8">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 font-mono flex justify-between items-center">
            <span>Students Impacted</span>
            <Users className="w-5 h-5 text-[#0A84FF]" />
          </div>
          <div className="text-4xl font-black text-[#0A84FF] font-mono tracking-tight">
            {totalStudentsHelped} Students
          </div>
          <div className="text-xs text-slate-400 mt-2 font-mono">100% Free Peer Learning</div>
        </div>

        <div className="apple-card p-8">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 font-mono flex justify-between items-center">
            <span>Active Club Partners</span>
            <ShieldCheck className="w-5 h-5 text-[#30D158]" />
          </div>
          <div className="text-4xl font-black text-[#30D158] font-mono tracking-tight">
            {clubs.length} Chapters
          </div>
          <div className="text-xs text-slate-400 mt-2 font-mono">AWS, CSI & IEEE Student Chapters</div>
        </div>
      </div>

      {/* Partner Clubs Table & Referral Links */}
      <div className="apple-card p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-5">
          <h3 className="text-lg font-bold text-white flex items-center gap-2.5 font-mono">
            <Building2 className="w-5 h-5 text-[#30D158]" />
            Active Campus Partner Organizations
          </h3>
          <span className="text-xs text-[#30D158] font-mono font-bold bg-[#30D158]/10 px-3 py-1 rounded-full border border-[#30D158]/30">
            3 Active Partners
          </span>
        </div>

        <div className="space-y-6">
          {clubs.map((club) => (
            <div key={club.id} className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-3">
                    <span className="font-extrabold text-base text-white">{club.name}</span>
                    <span className="text-xs font-mono px-2.5 py-0.5 rounded-md bg-[#30D158]/15 text-[#30D158] border border-[#30D158]/30 font-bold">
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
                      <Copy className="w-3.5 h-3.5 text-[#30D158]" />
                    )}
                    <span>{copiedCode === club.referralCode ? 'Link Copied!' : 'Copy Referral Link'}</span>
                  </button>
                </div>
              </div>

              {/* Impact Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs font-mono pt-3 border-t border-white/[0.06]">
                <div>
                  <span className="text-slate-400 block">Attributed Sessions</span>
                  <span className="text-white font-bold">{club.totalAttributedSessions} Sessions</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Students Helped</span>
                  <span className="text-[#30D158] font-bold">{club.totalStudentsHelped} Students</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Club Leadership Contact</span>
                  <span className="text-white font-bold truncate block">{club.leadName}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

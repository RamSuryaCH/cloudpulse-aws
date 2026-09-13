import React, { useState } from 'react';
import { 
  Award, 
  Users, 
  BookOpen, 
  Check, 
  Share2
} from 'lucide-react';
import { SEED_CLUBS } from '../../data/prepwiseData';
import type { PartnerClub } from '../../types/prepwise';
import { sounds } from '../../utils/soundEffects';

export const ClubAttributionHub: React.FC = () => {
  const [clubs] = useState<PartnerClub[]>(SEED_CLUBS);
  const [copiedClubId, setCopiedClubId] = useState<string | null>(null);

  const handleCopyLink = (club: PartnerClub) => {
    sounds.playSuccess();
    const link = `${window.location.origin}/?ref=${club.referralCode}`;
    navigator.clipboard.writeText(link);
    setCopiedClubId(club.id);
    setTimeout(() => setCopiedClubId(null), 2000);
  };

  const totalSessionsAttributed = clubs.reduce((acc, c) => acc + c.totalAttributedSessions, 0);
  const totalStudentsHelped = clubs.reduce((acc, c) => acc + c.totalStudentsHelped, 0);

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <span className="text-xs font-semibold text-pw-accent uppercase tracking-wider">Campus Student Organizations</span>
        <h1 className="text-3xl sm:text-4xl font-bold text-pw-text">
          Partner Club Attribution Hub
        </h1>
        <p className="text-base text-pw-secondary leading-relaxed max-w-2xl">
          Student chapters sponsor open study circles, host peer exam sprints, and track community impact across Hyderabad colleges.
        </p>
      </div>

      {/* Aggregate Impact Stats */}
      <div className="bg-pw-surface border border-pw-border rounded-2xl p-6 sm:p-8 shadow-pw-card">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center divide-y sm:divide-y-0 sm:divide-x divide-pw-border">
          <div className="pt-2 sm:pt-0">
            <span className="block text-3xl sm:text-4xl font-extrabold text-pw-text font-display">{totalSessionsAttributed}</span>
            <span className="text-xs sm:text-sm text-pw-secondary font-medium mt-1 flex items-center justify-center gap-1.5">
              <BookOpen className="w-4 h-4 text-pw-accent" /> Sessions Attributed
            </span>
          </div>

          <div className="pt-4 sm:pt-0 sm:pl-6">
            <span className="block text-3xl sm:text-4xl font-extrabold text-pw-text font-display">{totalStudentsHelped}</span>
            <span className="text-xs sm:text-sm text-pw-secondary font-medium mt-1 flex items-center justify-center gap-1.5">
              <Users className="w-4 h-4 text-pw-accent" /> Students Impacted
            </span>
          </div>

          <div className="pt-4 sm:pt-0 sm:pl-6">
            <span className="block text-3xl sm:text-4xl font-extrabold text-pw-text font-display">{clubs.length} Chapters</span>
            <span className="text-xs sm:text-sm text-pw-secondary font-medium mt-1 flex items-center justify-center gap-1.5">
              <Award className="w-4 h-4 text-pw-accent" /> Active Club Partners
            </span>
          </div>
        </div>
      </div>

      {/* Partner Clubs List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {clubs.map(club => (
          <div key={club.id} className="pw-card p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-pw-accent-subtle text-pw-accent flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono font-bold text-pw-accent bg-pw-accent-subtle px-2 py-0.5 rounded border border-pw-accent-border">
                  {club.referralCode}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-base text-pw-text">{club.name}</h3>
                <p className="text-xs text-pw-secondary">{club.collegeName}</p>
              </div>

              <div className="bg-pw-subtle p-3 rounded-xl border border-pw-border space-y-1 text-xs">
                <div className="flex justify-between text-pw-secondary">
                  <span>Lead Coordinator:</span>
                  <span className="font-medium text-pw-text">{club.leadName}</span>
                </div>
                <div className="flex justify-between text-pw-secondary">
                  <span>Sessions Hosted:</span>
                  <span className="font-bold text-pw-text">{club.totalAttributedSessions}</span>
                </div>
                <div className="flex justify-between text-pw-secondary">
                  <span>Students Helped:</span>
                  <span className="font-bold text-pw-text">{club.totalStudentsHelped}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleCopyLink(club)}
              className="pw-button-secondary text-xs py-2 px-3.5 w-full flex items-center justify-center space-x-2"
            >
              {copiedClubId === club.id ? (
                <>
                  <Check className="w-3.5 h-3.5 text-pw-success" />
                  <span className="text-pw-success font-semibold">Share Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-pw-secondary" />
                  <span>Copy Club Invite Link</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

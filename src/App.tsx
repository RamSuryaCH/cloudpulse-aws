import { useState } from 'react';
import { PrepWiseHeader } from './components/prepwise/PrepWiseHeader';
import { BookingStudio } from './components/prepwise/BookingStudio';
import { StudentTracker } from './components/prepwise/StudentTracker';
import { TutorPortal } from './components/prepwise/TutorPortal';
import { ClubAttributionHub } from './components/prepwise/ClubAttributionHub';
import { AdminConsole } from './components/prepwise/AdminConsole';
import { PrepWiseCommandPalette } from './components/prepwise/PrepWiseCommandPalette';
import { GraduationCap } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('booking');
  const [selectedCollege, setSelectedCollege] = useState<string>('vnrvjiet');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [activeStudentToken, setActiveStudentToken] = useState<string | null>(null);

  const handleOrderCreated = (token: string) => {
    setActiveStudentToken(token);
    setActiveTab('tracker');
  };

  return (
    <div className="min-h-screen bg-[#030305] text-[#F5F5F7] flex flex-col font-sans selection:bg-[#F59E0B] selection:text-black antialiased">
      {/* Universal Command Palette Modal */}
      <PrepWiseCommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectTab={(tab) => setActiveTab(tab)}
      />

      {/* Campus Editorial Header */}
      <PrepWiseHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedCollege={selectedCollege}
        setSelectedCollege={setSelectedCollege}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      {/* Main Spacious Studio Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 sm:px-8 lg:px-10 py-12 sm:py-16">
        {activeTab === 'booking' && (
          <BookingStudio onOrderCreated={handleOrderCreated} />
        )}
        {activeTab === 'tracker' && (
          <StudentTracker initialToken={activeStudentToken} />
        )}
        {activeTab === 'tutor' && (
          <TutorPortal />
        )}
        {activeTab === 'clubs' && (
          <ClubAttributionHub />
        )}
        {activeTab === 'admin' && (
          <AdminConsole />
        )}
      </main>

      {/* Production Campus Footer */}
      <footer className="border-t border-white/[0.06] bg-black/60 py-10 mt-20 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-7 h-7 rounded-xl bg-[#F59E0B]/15 flex items-center justify-center text-[#F59E0B]">
              <GraduationCap className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-white text-sm">PrepWise Campus</span>
            <span className="text-slate-600">—</span>
            <span className="text-slate-400">Peer-to-Peer Campus Tutoring & Exam Prep Marketplace</span>
          </div>

          <div className="flex items-center space-x-5 font-mono text-xs">
            <span className="flex items-center gap-2 text-[#30D158] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#30D158] animate-pulse"></span>
              Live: Manual UPI + 75% Tutor Payout
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-200 font-bold">20% Net Club Share</span>
            <span className="text-slate-600">•</span>
            <a 
              href="https://github.com/RamSuryaCH/cloudpulse-aws" 
              target="_blank" 
              rel="noreferrer"
              className="text-[#F59E0B] hover:underline font-bold"
            >
              GitHub ↗
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

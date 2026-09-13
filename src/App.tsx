import { useState, useEffect } from 'react';
import { PrepWiseHeader } from './components/prepwise/PrepWiseHeader';
import { HomePage } from './components/prepwise/HomePage';
import { BookingStudio } from './components/prepwise/BookingStudio';
import { PyqVault } from './components/prepwise/PyqVault';
import { StudentTracker } from './components/prepwise/StudentTracker';
import { TutorPortal } from './components/prepwise/TutorPortal';
import { ClubAttributionHub } from './components/prepwise/ClubAttributionHub';
import { AdminConsole } from './components/prepwise/AdminConsole';
import { PrepWiseCommandPalette } from './components/prepwise/PrepWiseCommandPalette';
import { GraduationCap, ArrowUpRight } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedCollege, setSelectedCollege] = useState<string>('vnrvjiet');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [activeStudentToken, setActiveStudentToken] = useState<string | null>(null);

  // Deep linking and URL query parameters support
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get('token');
    const tabParam = params.get('tab');
    const refParam = params.get('ref');

    if (tokenParam) {
      setActiveStudentToken(tokenParam);
      setActiveTab('tracker');
    } else if (tabParam) {
      setActiveTab(tabParam);
    } else if (refParam) {
      setActiveTab('booking');
    }
  }, []);

  const handleOrderCreated = (token: string) => {
    setActiveStudentToken(token);
    setActiveTab('tracker');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-pw-bg text-pw-text flex flex-col font-sans selection:bg-pw-accent-subtle selection:text-pw-accent">
      {/* Universal Command Palette Modal */}
      <PrepWiseCommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectTab={handleNavigate}
      />

      {/* Campus Scholarly Header */}
      <PrepWiseHeader
        activeTab={activeTab}
        setActiveTab={handleNavigate}
        selectedCollege={selectedCollege}
        setSelectedCollege={setSelectedCollege}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      {/* Main Workspace Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {activeTab === 'home' && (
          <HomePage onNavigate={handleNavigate} selectedCollege={selectedCollege} />
        )}
        {activeTab === 'booking' && (
          <BookingStudio onOrderCreated={handleOrderCreated} selectedCollege={selectedCollege} />
        )}
        {activeTab === 'pyq' && (
          <PyqVault />
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

      {/* Production Minimal Footer */}
      <footer className="border-t border-pw-border bg-white py-10 mt-16 text-xs text-pw-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-pw-accent text-white flex items-center justify-center font-bold">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-pw-text text-sm block">PrepWise Campus</span>
              <span className="text-pw-secondary text-xs">100% Free Peer Tutoring & Solved PYQ Vault</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 font-medium">
            <button onClick={() => handleNavigate('home')} className="hover:text-pw-text">Home</button>
            <button onClick={() => handleNavigate('booking')} className="hover:text-pw-text">Book Session</button>
            <button onClick={() => handleNavigate('pyq')} className="hover:text-pw-text">PYQ Vault</button>
            <button onClick={() => handleNavigate('tracker')} className="hover:text-pw-text">Tracker</button>
            <button onClick={() => handleNavigate('tutor')} className="hover:text-pw-text">Volunteer</button>
            <a 
              href="https://github.com/RamSuryaCH/cloudpulse-aws" 
              target="_blank" 
              rel="noreferrer"
              className="text-pw-accent hover:text-pw-accent-hover font-semibold inline-flex items-center gap-0.5"
            >
              <span>GitHub</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

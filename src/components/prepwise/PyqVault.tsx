import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Search, 
  Check, 
  Copy, 
  ChevronDown,
  ChevronUp,
  Code2
} from 'lucide-react';
import { SEED_PYQS } from '../../data/prepwiseData';
import type { PyqPaper } from '../../types/prepwise';
import { sounds } from '../../utils/soundEffects';

export const PyqVault: React.FC = () => {
  const [pyqs] = useState<PyqPaper[]>(SEED_PYQS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTypeFilter, setActiveTypeFilter] = useState<string>('all');
  const [expandedPyqId, setExpandedPyqId] = useState<string | null>(SEED_PYQS[0].id);
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);

  const filteredPyqs = pyqs.filter(p => {
    const matchesQuery = 
      p.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subjectCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.topics.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = activeTypeFilter === 'all' || p.type === activeTypeFilter;
    return matchesQuery && matchesType;
  });

  const handleCopyCode = (pyq: PyqPaper) => {
    sounds.playSuccess();
    navigator.clipboard.writeText(pyq.solutionSnippet);
    setCopiedSnippetId(pyq.id);
    setTimeout(() => setCopiedSnippetId(null), 2000);
  };

  const handleDownload = (pyq: PyqPaper) => {
    sounds.playSuccess();
    alert(`Downloading verified solved PDF for ${pyq.subjectName} (${pyq.subjectCode} - ${pyq.year})...`);
  };

  const toggleExpand = (id: string) => {
    sounds.playSwitch();
    setExpandedPyqId(prev => prev === id ? null : id);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Header Banner */}
      <div className="space-y-4">
        <span className="text-xs font-semibold text-pw-accent uppercase tracking-wider">Exam Preparation Archive</span>
        <h1 className="text-3xl sm:text-4xl font-bold text-pw-text">
          Solved PYQ Papers & Viva Notes Vault
        </h1>
        <p className="text-base text-pw-secondary leading-relaxed">
          Access verified step-by-step solutions for previous semester exams, formulas, and lab viva code walkthroughs written by senior TAs.
        </p>

        {/* Search & Filter Bar */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-pw-tertiary absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by subject, code (e.g. CS201), or topic (e.g. Dynamic Programming)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pw-input pl-10"
            />
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
            {['all', 'Mid-Exam', 'End-Exam', 'Lab-Viva'].map((type) => (
              <button
                key={type}
                onClick={() => {
                  sounds.playClick();
                  setActiveTypeFilter(type);
                }}
                className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  activeTypeFilter === type
                    ? 'bg-pw-text text-white font-semibold'
                    : 'bg-pw-subtle text-pw-secondary hover:bg-pw-muted'
                }`}
              >
                {type === 'all' ? 'All Formats' : type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Papers Accordion List */}
      <div className="space-y-4">
        {filteredPyqs.length === 0 ? (
          <div className="pw-card p-12 text-center text-pw-secondary text-sm">
            No question papers found matching your search. Try another subject or keyword.
          </div>
        ) : (
          filteredPyqs.map((pyq) => {
            const isExpanded = expandedPyqId === pyq.id;
            return (
              <div key={pyq.id} className="pw-card overflow-hidden transition-all">
                {/* Main Card Summary */}
                <div 
                  onClick={() => toggleExpand(pyq.id)}
                  className="p-6 cursor-pointer hover:bg-pw-subtle/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono font-bold text-pw-accent bg-pw-accent-subtle px-2 py-0.5 rounded border border-pw-accent-border">
                        {pyq.subjectCode}
                      </span>
                      <span className="text-xs font-medium text-pw-secondary">
                        {pyq.year} • {pyq.semester} ({pyq.type})
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-pw-text flex items-center gap-2">
                      <FileText className="w-4 h-4 text-pw-accent" />
                      {pyq.subjectName}
                    </h3>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {pyq.topics.map((t, idx) => (
                        <span key={idx} className="text-[11px] font-medium px-2 py-0.5 rounded bg-pw-subtle text-pw-secondary border border-pw-border">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(pyq);
                      }}
                      className="pw-button-secondary text-xs py-2 px-3.5 flex items-center space-x-1.5"
                    >
                      <Download className="w-3.5 h-3.5 text-pw-secondary" />
                      <span>Download PDF</span>
                    </button>

                    <button
                      type="button"
                      aria-label="Toggle solution preview"
                      className="w-8 h-8 rounded-lg bg-pw-subtle hover:bg-pw-muted flex items-center justify-center text-pw-secondary"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expandable Verified Solution Snippet */}
                {isExpanded && (
                  <div className="border-t border-pw-border bg-pw-subtle p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-xs font-semibold text-pw-text">
                        <Code2 className="w-4 h-4 text-pw-accent" />
                        <span>Key Formula / Verified Code Solution:</span>
                      </div>
                      <button
                        onClick={() => handleCopyCode(pyq)}
                        className="text-xs font-medium text-pw-accent hover:text-pw-accent-hover flex items-center space-x-1"
                      >
                        {copiedSnippetId === pyq.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-pw-success" />
                            <span className="text-pw-success">Copied to Clipboard!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Snippet</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="bg-pw-surface p-4 rounded-xl border border-pw-border">
                      <pre className="font-mono text-xs text-pw-text overflow-x-auto whitespace-pre-wrap leading-relaxed">
                        {pyq.solutionSnippet}
                      </pre>
                    </div>

                    <div className="flex items-center justify-between text-xs text-pw-secondary pt-1">
                      <span>Verified by Senior Campus Coordinators • {pyq.downloads} students downloaded</span>
                      <span className="text-pw-success font-semibold">100% Free Open Resource</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

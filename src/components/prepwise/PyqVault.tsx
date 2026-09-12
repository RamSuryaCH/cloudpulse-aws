import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Search, 
  Eye, 
  Check, 
  Copy 
} from 'lucide-react';
import { SEED_PYQS } from '../../data/prepwiseData';
import type { PyqPaper } from '../../types/prepwise';
import { sounds } from '../../utils/soundEffects';

export const PyqVault: React.FC = () => {
  const [pyqs] = useState<PyqPaper[]>(SEED_PYQS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPyq, setSelectedPyq] = useState<PyqPaper>(SEED_PYQS[0]);
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  const filteredPyqs = pyqs.filter(p => 
    p.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.subjectCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.topics.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCopyCode = () => {
    sounds.playSuccess();
    navigator.clipboard.writeText(selectedPyq.solutionSnippet);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  const handleDownload = (pyqName: string) => {
    sounds.playSuccess();
    alert(`Downloading ${pyqName} solved PYQ paper PDF...`);
  };

  return (
    <div className="space-y-12">
      {/* Header Banner */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#30D158]/10 border border-[#30D158]/30 text-[#30D158] text-xs font-mono font-semibold">
          <FileText className="w-3.5 h-3.5" />
          <span>Open Campus Exam Question Bank & Solved Vault</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          PYQ & Solved Notes Vault
        </h1>
        <p className="text-base text-slate-400 leading-relaxed">
          Access free solved previous year question papers, formula cheat sheets, and verified lab code walkthroughs curated by campus senior TAs.
        </p>

        {/* Search Bar */}
        <div className="flex space-x-3 max-w-xl">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Search PYQs by subject, code, or topic (e.g. Dynamic Programming)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-2xl pl-11 pr-5 py-3 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-[#30D158]"
            />
          </div>
        </div>
      </div>

      {/* Grid: PYQ List (7 cols) vs Solution Viewer Drawer (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* PYQ Cards List (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {filteredPyqs.map((pyq) => {
            const isSelected = selectedPyq.id === pyq.id;
            return (
              <div
                key={pyq.id}
                onClick={() => {
                  sounds.playSwitch();
                  setSelectedPyq(pyq);
                }}
                className={`p-6 rounded-2xl border cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'bg-white/[0.1] border-[#30D158] shadow-lg shadow-[#30D158]/10'
                    : 'bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.06]'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="font-mono text-xs text-[#30D158] font-bold block mb-0.5">{pyq.subjectCode} • {pyq.year} ({pyq.type})</span>
                    <h3 className="text-base font-extrabold text-white">{pyq.subjectName}</h3>
                  </div>
                  <span className="text-xs font-mono text-slate-400 bg-white/[0.06] px-2.5 py-1 rounded-full border border-white/[0.08]">
                    {pyq.downloads} Downloads
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {pyq.topics.map((t, idx) => (
                    <span key={idx} className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-white/[0.04] text-slate-300 border border-white/[0.06]">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/[0.06] text-xs font-mono">
                  <span className="text-slate-400">{pyq.questionsCount} Solved Exam Questions</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(pyq.subjectName);
                    }}
                    className="flex items-center space-x-1.5 text-[#30D158] hover:underline font-bold"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Free PDF</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected PYQ Solution Previewer Drawer (5 cols) */}
        <div className="lg:col-span-5 sticky top-28">
          <div className="apple-card p-8 space-y-6 border-2 border-[#30D158]/30">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div>
                <span className="text-xs font-mono text-[#30D158] font-bold block mb-1">Interactive Solution Preview</span>
                <h3 className="text-base font-bold text-white">{selectedPyq.subjectName}</h3>
              </div>
              <Eye className="w-5 h-5 text-[#30D158]" />
            </div>

            <div className="space-y-3 font-mono text-xs">
              <span className="text-slate-400 uppercase tracking-wider text-[10px] block font-bold">Key Formula / Code Solution:</span>
              <div className="bg-[#050508] p-4 rounded-xl border border-white/[0.08] relative group">
                <pre className="text-emerald-400 overflow-x-auto whitespace-pre-wrap font-mono text-xs leading-relaxed">
                  {selectedPyq.solutionSnippet}
                </pre>
                <button
                  onClick={handleCopyCode}
                  className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.15] text-slate-300 transition-colors"
                >
                  {copiedSnippet ? <Check className="w-3.5 h-3.5 text-[#30D158]" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2 pt-3 border-t border-white/[0.08] font-mono text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Exam Format:</span>
                <strong className="text-white">{selectedPyq.type}</strong>
              </div>
              <div className="flex justify-between">
                <span>Verified By:</span>
                <strong className="text-[#30D158]">Senior Campus TAs</strong>
              </div>
              <div className="flex justify-between">
                <span>Access:</span>
                <strong className="text-[#30D158]">100% Free</strong>
              </div>
            </div>

            <button
              onClick={() => handleDownload(selectedPyq.subjectName)}
              className="w-full flex items-center justify-center space-x-2 py-3 rounded-2xl bg-gradient-to-r from-[#30D158] to-[#10B981] text-black font-extrabold text-xs shadow-lg shadow-[#30D158]/20"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>Download Complete Solved PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

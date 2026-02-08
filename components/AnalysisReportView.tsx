
import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  ExternalLink, 
  Download, 
  Settings2,
  ChevronDown
} from 'lucide-react';
import { AnalysisReport, PlagiarismMatch } from '../types';

interface AnalysisReportViewProps {
  report: AnalysisReport;
  onBack: () => void;
}

// Professional Turnitin/Drillbit Color Palette for Highlights
const SOURCE_COLORS = [
  '#E60000', // Red
  '#A000A0', // Purple
  '#0000FF', // Blue
  '#008080', // Teal
  '#00AA00', // Green
  '#B8860B', // Dark Goldenrod
  '#8B4513', // Saddle Brown
  '#000080', // Navy
  '#FF1493', // Deep Pink
  '#2F4F4F'  // Dark Slate Gray
];

const AnalysisReportView: React.FC<AnalysisReportViewProps> = ({ report, onBack }) => {
  const [selectedMatch, setSelectedMatch] = useState<PlagiarismMatch | null>(null);
  const [ignoreQuotes, setIgnoreQuotes] = useState(false);

  const highlightedContent = useMemo(() => {
    const content = report.content;
    const matches = report.matches;
    if (!matches.length) return content;

    // Create a mapping of all occurrences of matched segments
    const occurrences: { start: number; end: number; match: PlagiarismMatch }[] = [];
    matches.forEach(m => {
      let pos = 0;
      while ((pos = content.indexOf(m.matchedText, pos)) !== -1) {
        occurrences.push({ start: pos, end: pos + m.matchedText.length, match: m });
        pos += m.matchedText.length;
      }
    });

    // Sort by start position, then by length (longest first)
    const sorted = occurrences.sort((a, b) => a.start - b.start || (b.end - b.start) - (a.end - a.start));
    
    const elements: (string | React.ReactNode)[] = [];
    let lastIndex = 0;

    sorted.forEach((occ, i) => {
      if (occ.start < lastIndex) return; // Skip overlapping segments

      if (occ.start > lastIndex) {
        elements.push(content.substring(lastIndex, occ.start));
      }

      const color = SOURCE_COLORS[(occ.match.index - 1) % SOURCE_COLORS.length];
      const isSelected = selectedMatch?.index === occ.match.index;

      elements.push(
        <span 
          key={i}
          className={`relative cursor-pointer transition-all border-b-2`}
          style={{ 
            backgroundColor: isSelected ? `${color}33` : 'transparent', 
            borderBottomColor: color,
            color: color
          }}
          onClick={() => setSelectedMatch(occ.match)}
        >
          {content.substring(occ.start, occ.end)}
          <sup className="text-[9px] font-bold text-white px-1 ml-0.5 rounded-full" style={{ backgroundColor: color }}>
            {occ.match.index}
          </sup>
        </span>
      );

      lastIndex = occ.end;
    });

    if (lastIndex < content.length) {
      elements.push(content.substring(lastIndex));
    }

    return elements;
  }, [report.content, report.matches, selectedMatch]);

  return (
    <div className="h-screen flex flex-col bg-slate-100 print:bg-white overflow-hidden print:overflow-visible font-sans">
      {/* Turnitin Style Dark Header */}
      <header className="bg-[#1A1A1A] text-white px-8 py-3 flex items-center justify-between z-30 print:hidden">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-md transition-all active:scale-95">
            <ArrowLeft className="w-5 h-5 text-slate-400" />
          </button>
          <div className="h-6 w-[1px] bg-white/20" />
          <h2 className="font-medium text-sm text-slate-300">{report.fileName}</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-white/5 px-3 py-1.5 rounded border border-white/10">
            <Settings2 className="w-3.5 h-3.5" /> Options
          </div>
          <button onClick={() => window.print()} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-1.5 rounded font-bold text-xs transition-all flex items-center gap-2">
            <Download className="w-4 h-4" /> Download Report
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden print:block flex-col lg:flex-row">
        {/* Main Content Area (Text Document) */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-12 print:p-0 bg-[#F5F5F5] print:bg-white custom-scrollbar">
          <div className="max-w-4xl mx-auto bg-white shadow-lg border border-slate-200 p-8 lg:p-24 min-h-[600px] lg:min-h-[1200px] print:shadow-none print:border-none">
            <div className="mb-8 lg:mb-12 border-b-2 border-slate-900 pb-4">
              <h1 className="text-xl lg:text-2xl font-normal text-slate-800 tracking-tight break-words">{report.fileName}</h1>
              <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest mt-2">Originality Report</p>
            </div>
            
            <div className="whitespace-pre-wrap leading-[1.8] text-[#333] text-[15px] lg:text-[17px] font-serif break-words">
              {highlightedContent}
            </div>
          </div>
        </div>

        {/* Right Sidebar (Primary Sources List - MATCHING IMAGE) */}
        <aside className="w-full lg:w-[480px] bg-white border-t lg:border-t-0 lg:border-l border-slate-200 flex flex-col overflow-hidden shadow-2xl z-20 print:hidden max-h-[50vh] lg:max-h-none">
          {/* Header Section (Stats Grid) */}
          <div className="p-6 lg:p-10 border-b border-slate-100">
            <div className="mb-4 lg:mb-6">
              <h3 className="text-xl lg:text-2xl font-normal text-slate-800 truncate">{report.fileName}</h3>
              <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest mt-1">Originality Report</p>
            </div>
            
            <div className="grid grid-cols-4 gap-0 border-t border-slate-200 pt-4 lg:pt-6">
              <StatBox label="Similarity Index" value={report.overallSimilarity} color="text-red-600" large />
              <StatBox label="Internet Sources" value={report.internetSimilarity} />
              <StatBox label="Publications" value={report.publicationSimilarity} />
              <StatBox label="Student Papers" value={report.studentSimilarity} />
            </div>
          </div>

          {/* Primary Sources List */}
          <div className="flex-1 overflow-y-auto bg-white custom-scrollbar">
            <div className="px-6 lg:px-10 py-3 lg:py-4 bg-slate-50 border-b border-slate-200">
              <h4 className="text-[10px] font-bold text-red-600 uppercase tracking-widest">Primary Sources</h4>
            </div>
            
            <div className="divide-y divide-slate-100">
              {report.matches.length === 0 ? (
                <div className="p-10 lg:p-20 text-center text-slate-400 italic text-sm">No primary sources found.</div>
              ) : (
                report.matches.sort((a, b) => a.index - b.index).map((match, i) => (
                  <div 
                    key={i} 
                    className={`px-6 lg:px-10 py-4 lg:py-6 transition-all cursor-pointer flex items-center justify-between group ${
                      selectedMatch?.index === match.index ? 'bg-slate-50' : 'hover:bg-slate-50/50'
                    }`}
                    onClick={() => setSelectedMatch(match)}
                  >
                    <div className="flex gap-3 lg:gap-5 items-start overflow-hidden flex-1 min-w-0">
                      <div 
                        className="w-8 h-8 lg:w-10 lg:h-10 shrink-0 flex items-center justify-center text-white font-bold rounded-sm text-lg lg:text-xl shadow-sm"
                        style={{ backgroundColor: SOURCE_COLORS[(match.index - 1) % SOURCE_COLORS.length] }}
                      >
                        {match.index}
                      </div>
                      <div className="min-w-0 flex flex-col justify-center">
                        <p className={`font-medium text-[13px] lg:text-[15px] truncate leading-tight ${selectedMatch?.index === match.index ? 'text-blue-700' : 'text-[#A0522D]'}`}>
                          {match.source}
                        </p>
                        <p className="text-[10px] lg:text-[11px] text-slate-400 font-medium mt-1 uppercase tracking-tight">{match.category}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end min-w-[50px] lg:min-w-[60px]">
                      <div className="text-xl lg:text-2xl font-light text-slate-800 flex items-center leading-none">
                        {match.similarity < 1 ? '<1' : match.similarity}
                        <span className="text-[12px] lg:text-[14px] ml-0.5 mt-1 font-normal text-slate-500">%</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Settings / Filters Footer */}
          <div className="p-4 lg:p-8 bg-white border-t border-slate-200">
            <div className="grid grid-cols-2 gap-x-6 lg:gap-x-12 gap-y-3 lg:gap-y-4">
              <ToggleItem label="Exclude quotes" status="Off" />
              <ToggleItem label="Exclude matches" status="Off" />
              <ToggleItem label="Exclude bibliography" status="Off" />
            </div>
          </div>
        </aside>
      </div>

      {/* Floating Source Inspector */}
      {selectedMatch && (
        <div className="fixed bottom-4 left-4 right-4 lg:bottom-10 lg:left-[400px] lg:right-[520px] bg-white rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-slate-300 z-50 animate-in slide-in-from-bottom-10 print:hidden overflow-hidden max-h-[80vh] overflow-y-auto">
           <div className="bg-slate-100 px-4 lg:px-6 py-3 border-b border-slate-200 flex justify-between items-center sticky top-0">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Source Analysis: Source {selectedMatch.index}</span>
              <button onClick={() => setSelectedMatch(null)} className="text-slate-400 hover:text-slate-600"><ChevronDown className="w-5 h-5" /></button>
           </div>
           <div className="p-4 lg:p-8">
              <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-6">
                 <div className="flex-1 min-w-0">
                    <h4 className="text-base lg:text-lg font-bold text-blue-700 hover:underline cursor-pointer flex items-center gap-2 break-words">
                       {selectedMatch.source} <ExternalLink className="w-4 h-4 shrink-0" />
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 break-all">{selectedMatch.url}</p>
                 </div>
                 <div className="bg-red-50 text-red-600 px-4 py-2 rounded font-black text-xl shrink-0">
                    {selectedMatch.similarity}%
                 </div>
              </div>
              <div className="bg-slate-50 p-4 lg:p-5 rounded border border-slate-200 text-sm italic text-slate-600 font-serif leading-relaxed break-words">
                 "...{selectedMatch.matchedText}..."
              </div>
              <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
                 <button onClick={() => setSelectedMatch(null)} className="text-xs font-bold text-slate-400 hover:text-slate-600 py-2">Dismiss</button>
                 <a 
                  href={selectedMatch.url} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="bg-blue-600 text-white px-6 py-2 rounded font-bold text-xs shadow-md active:scale-95 text-center"
                 >
                   Open Original Page
                 </a>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const StatBox = ({ label, value, color = "text-slate-800", large = false }: any) => (
  <div className="flex flex-col items-center justify-start text-center border-r last:border-r-0 border-slate-100 pb-2">
    <div className={`${large ? 'text-4xl' : 'text-3xl'} font-light ${color} leading-none mb-2`}>
      {value}<span className="text-sm font-normal ml-0.5">%</span>
    </div>
    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight leading-[1.2] px-2">
      {label}
    </div>
  </div>
);

const ToggleItem = ({ label, status }: any) => (
  <div className="flex justify-between items-center text-[11px] font-medium text-slate-600">
    <span className="tracking-tight">{label}</span>
    <span className="text-slate-400 uppercase font-bold text-[10px]">{status}</span>
  </div>
);

export default AnalysisReportView;

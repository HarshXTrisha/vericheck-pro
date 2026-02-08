
import React, { useState, useEffect, useRef } from 'react';
import { 
  FileSearch, 
  Upload, 
  ShieldCheck, 
  History, 
  Zap,
  LayoutDashboard,
  BarChart3,
  Layers,
  Clock,
  AlertCircle,
  RefreshCw,
  Search
} from 'lucide-react';
import FileUpload from './FileUpload';
import AnalysisReportView from './AnalysisReportView';
import { AnalysisReport, AnalysisStatus } from '../types';
import { analyzeText } from '../services/geminiService';

const Dashboard: React.FC = () => {
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [history, setHistory] = useState<AnalysisReport[]>([]);
  const [activeView, setActiveView] = useState<'upload' | 'report' | 'history' | 'dashboard'>('dashboard');
  const [currentProgress, setCurrentProgress] = useState(0);
  const [currentFileName, setCurrentFileName] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const progressTimer = useRef<number | null>(null);

  const startProgress = () => {
    setCurrentProgress(2);
    if (progressTimer.current) clearInterval(progressTimer.current);
    
    progressTimer.current = window.setInterval(() => {
      setCurrentProgress(prev => {
        if (prev >= 96) return prev; 
        const remaining = 98 - prev;
        const increment = remaining / 25; 
        return prev + Math.max(increment, 0.1);
      });
    }, 450);
  };

  const handleStartAnalysis = async (text: string, fileName: string) => {
    try {
      setErrorMessage(null);
      setCurrentFileName(fileName);
      setStatus(AnalysisStatus.FINGERPRINTING);
      startProgress();
      
      const result = await analyzeText(text, fileName);
      
      if (progressTimer.current) clearInterval(progressTimer.current);
      setCurrentProgress(100);
      setStatus(AnalysisStatus.COMPLETED);
      
      setReport(result);
      setHistory(prev => [result, ...prev]);
      
      setTimeout(() => {
        setActiveView('report');
        setStatus(AnalysisStatus.IDLE);
        setCurrentProgress(0);
      }, 700);
      
    } catch (error: any) {
      console.error(error);
      if (progressTimer.current) clearInterval(progressTimer.current);
      setStatus(AnalysisStatus.ERROR);
      setErrorMessage(error.message || "Internal engine failure.");
    }
  };

  const clearError = () => {
    setStatus(AnalysisStatus.IDLE);
    setErrorMessage(null);
    setCurrentProgress(0);
    // Force UI back to upload if they were trying to submit
    if (activeView === 'upload') setActiveView('upload');
  };

  useEffect(() => {
    return () => {
      if (progressTimer.current) clearInterval(progressTimer.current);
    };
  }, []);

  const stats = [
    { label: 'Total Scans', value: history.length, icon: FileSearch, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Avg. Similarity', value: history.length ? `${Math.round(history.reduce((a, b) => a + b.overallSimilarity, 0) / history.length)}%` : '0%', icon: BarChart3, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'AI Risk Profile', value: history.some(h => h.aiProbability > 70) ? 'High' : 'Low', icon: Zap, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'System Health', value: 'Active', icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  const renderContent = () => {
    if (activeView === 'report' && report) {
      return <AnalysisReportView report={report} onBack={() => setActiveView('dashboard')} />;
    }

    if (activeView === 'history') {
      return (
        <div className="max-w-6xl mx-auto py-12 px-6 animate-in fade-in duration-500">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                <History className="w-8 h-8 text-indigo-600" />
                Audit Archives
              </h2>
              <p className="text-sm text-slate-500 font-medium">Verified historical reports and submission certificates</p>
            </div>
            <button onClick={() => setActiveView('upload')} className="bg-slate-900 text-white px-8 py-3 rounded-2xl text-sm font-black hover:bg-slate-800 transition-all shadow-xl active:scale-95">
              New Integrity Check
            </button>
          </div>
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 border-b border-slate-200">
                <tr>
                  <th className="px-8 py-5 font-black text-slate-700 text-[10px] uppercase tracking-widest">Document</th>
                  <th className="px-8 py-5 font-black text-slate-700 text-[10px] uppercase tracking-widest">Analysis Date</th>
                  <th className="px-8 py-5 font-black text-slate-700 text-[10px] uppercase tracking-widest text-center">Similarity</th>
                  <th className="px-8 py-5 font-black text-slate-700 text-[10px] uppercase tracking-widest text-center">AI Confidence</th>
                  <th className="px-8 py-5 font-black text-slate-700 text-[10px] uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors cursor-pointer group" onClick={() => { setReport(item); setActiveView('report'); }}>
                    <td className="px-8 py-6">
                      <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{item.fileName}</div>
                      <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-2 font-mono uppercase font-black">
                        <Layers className="w-3 h-3" /> {item.wordCount} words | ID: {item.id}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-sm text-slate-600 font-medium flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5" /> {new Date(item.timestamp).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className={`inline-flex items-center px-4 py-1.5 rounded-xl text-xs font-black ${
                        item.overallSimilarity > 30 ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                      }`}>
                        {item.overallSimilarity}%
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className={`inline-flex items-center px-4 py-1.5 rounded-xl text-xs font-black ${
                        item.aiProbability > 50 ? 'bg-purple-50 text-purple-600 border border-purple-100' : 'bg-blue-50 text-blue-600 border border-blue-100'
                      }`}>
                        {item.aiProbability}%
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="bg-slate-100 text-slate-600 group-hover:bg-indigo-600 group-hover:text-white px-5 py-2 rounded-xl font-black text-xs transition-all">
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {history.length === 0 && (
              <div className="p-20 text-center">
                <History className="w-16 h-16 mx-auto mb-6 text-slate-200" />
                <p className="text-slate-400 font-bold italic">No submissions have been archived yet.</p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-6xl mx-auto py-12 px-6 space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">Integrity Console</h1>
            <div className="flex items-center gap-3 text-slate-500 font-bold">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm tracking-tight uppercase">Neural Analysis Core Active</span>
            </div>
          </div>
          <button onClick={() => setActiveView('upload')} className="bg-indigo-600 text-white px-10 py-4 rounded-3xl font-black text-sm hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200 active:scale-95">
            Begin New Audit
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-2xl transition-all duration-500 group hover:-translate-y-2">
              <div className={`${stat.bg} w-14 h-14 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <stat.icon className={`w-7 h-7 ${stat.color}`} />
              </div>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">{stat.label}</p>
              <h4 className="text-4xl font-black text-slate-900 mt-2">{stat.value}</h4>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            {activeView === 'upload' ? (
              <FileUpload 
                onAnalyze={handleStartAnalysis} 
                isProcessing={status !== AnalysisStatus.IDLE && status !== AnalysisStatus.COMPLETED && status !== AnalysisStatus.ERROR} 
              />
            ) : (
              <div className="bg-white border border-slate-200 rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center shadow-sm">
                 <div className="bg-indigo-50 w-24 h-24 rounded-[2rem] flex items-center justify-center mb-8">
                    <ShieldCheck className="w-12 h-12 text-indigo-600" />
                 </div>
                 <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Institutional Integrity Check</h2>
                 <p className="text-slate-500 font-medium max-w-md mb-10 leading-relaxed">
                   Upload documents for high-fidelity web-scale similarity analysis and neural AI pattern recognition.
                 </p>
                 <button 
                  onClick={() => setActiveView('upload')}
                  className="bg-indigo-600 text-white px-12 py-4 rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all shadow-xl active:scale-95"
                 >
                   Open Submission Portal
                 </button>
              </div>
            )}
            
            {status === AnalysisStatus.ERROR && (
              <div className="bg-red-50 border border-red-200 rounded-[2.5rem] p-10 flex items-start gap-8 animate-in shake duration-500 shadow-xl shadow-red-100/50">
                <div className="p-4 bg-red-100 rounded-3xl shrink-0">
                  <AlertCircle className="w-10 h-10 text-red-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-black text-2xl text-red-900 tracking-tight">Engine Stall Detected</h4>
                  <p className="text-md text-red-700/80 mt-2 font-medium leading-relaxed">{errorMessage}</p>
                  <div className="mt-8 flex gap-6">
                    <button 
                      onClick={clearError} 
                      className="text-xs font-black text-white bg-red-600 px-8 py-3.5 rounded-2xl hover:bg-red-700 transition-all flex items-center gap-2 uppercase shadow-lg active:scale-95"
                    >
                      <RefreshCw className="w-4 h-4" /> Restart Engine
                    </button>
                    <button onClick={clearError} className="text-xs font-black text-red-400 hover:text-red-600 py-3.5">Dismiss Notification</button>
                  </div>
                </div>
              </div>
            )}

            {(status !== AnalysisStatus.IDLE && status !== AnalysisStatus.COMPLETED && status !== AnalysisStatus.ERROR) && (
               <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500">
                 <div className="relative z-10">
                   <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-[1.5rem] border-4 border-slate-800 border-t-indigo-500 animate-spin" />
                        <div>
                          <h4 className="font-black text-2xl flex items-center gap-3">
                            Analyzing {currentFileName.length > 25 ? currentFileName.substring(0, 22) + '...' : currentFileName}
                          </h4>
                          <p className="text-indigo-400 font-black uppercase text-[10px] tracking-widest mt-1">
                            {currentProgress < 30 ? "Initializing Neural Fingerprints..." : 
                             currentProgress < 75 ? "Querying Global Search Repositories..." : 
                             "Performing Deep AI Pattern Identification..."}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-4xl font-black text-white font-mono">
                          {Math.floor(currentProgress)}%
                        </span>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Throughput Efficient</p>
                      </div>
                   </div>
                   
                   <div className="w-full bg-slate-800 h-4 rounded-full overflow-hidden mb-8 border border-slate-700/50">
                     <div 
                      className="bg-gradient-to-r from-indigo-600 via-blue-500 to-indigo-400 h-full transition-all duration-500 ease-out relative"
                      style={{ width: `${currentProgress}%` }}
                     >
                        <div className="absolute top-0 right-0 h-full w-24 bg-white/20 blur-xl animate-pulse" />
                     </div>
                   </div>

                   <div className="grid grid-cols-3 gap-6">
                      <StatusIndicator active={currentProgress > 10} label="Fingerprinting" />
                      <StatusIndicator active={currentProgress > 40} label="Web Search" />
                      <StatusIndicator active={currentProgress > 80} label="AI Diagnostics" />
                   </div>
                 </div>
                 <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2" />
               </div>
            )}
          </div>

          <div className="space-y-8">
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden group">
               <div className="relative z-10">
                 <h4 className="font-black text-slate-900 flex items-center gap-3 uppercase tracking-tighter mb-6">
                   <Zap className="w-5 h-5 text-indigo-600" />
                   Neural Engine v4
                 </h4>
                 <p className="text-sm text-slate-500 mb-8 leading-relaxed font-medium">
                   Current workload handled by <span className="text-indigo-600 font-bold">Gemini 3 Pro</span>. Performance is currently optimized for accuracy over speed.
                 </p>
                 <div className="space-y-4">
                   <div className="flex justify-between items-center text-[11px] font-black uppercase text-slate-400 tracking-widest">
                     <span>Model Latency</span>
                     <span className="text-emerald-500">0.8s</span>
                   </div>
                   <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                     <div className="bg-emerald-500 w-[15%] h-full" />
                   </div>
                 </div>
               </div>
            </div>

            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
               <h4 className="font-black text-slate-900 flex items-center gap-3 uppercase tracking-tighter mb-8">
                 <Clock className="w-5 h-5 text-indigo-600" />
                 Recent Audits
               </h4>
               <div className="space-y-8">
                 {history.slice(0, 5).map((h, i) => (
                   <div key={i} className="flex gap-5 group cursor-pointer" onClick={() => { setReport(h); setActiveView('report'); }}>
                     <div className={`w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center font-black text-xs border ${
                       h.overallSimilarity > 30 ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                     }`}>
                       {h.overallSimilarity}%
                     </div>
                     <div className="flex-1 min-w-0">
                       <p className="text-sm font-bold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">{h.fileName}</p>
                       <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter mt-1">{new Date(h.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} • Verified</p>
                     </div>
                   </div>
                 ))}
                 {history.length === 0 && <p className="text-sm text-slate-400 italic font-medium">Ready for first submission.</p>}
               </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <aside className="w-20 lg:w-80 bg-white border-r border-slate-200 flex flex-col items-center lg:items-start py-6 lg:py-12 px-2 lg:px-10 fixed h-full z-20 shadow-[1px_0_20px_rgba(0,0,0,0.01)]">
        <div className="flex items-center gap-5 mb-8 lg:mb-16 px-2 group cursor-pointer" onClick={() => setActiveView('dashboard')}>
          <div className="bg-gradient-to-br from-slate-900 to-indigo-900 p-3 lg:p-4 rounded-2xl lg:rounded-3xl shadow-2xl shadow-slate-200 group-hover:rotate-12 transition-all">
            <ShieldCheck className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
          </div>
          <div className="hidden lg:block">
            <span className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">VeriCheck</span>
            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] mt-0.5">Enterprise</p>
          </div>
        </div>
        <nav className="flex-1 w-full space-y-2 lg:space-y-3">
          <NavItem icon={LayoutDashboard} label="Dashboard" active={activeView === 'dashboard'} onClick={() => setActiveView('dashboard')} />
          <NavItem icon={Upload} label="New Check" active={activeView === 'upload'} onClick={() => setActiveView('upload')} />
          <NavItem icon={History} label="Audit Vault" active={activeView === 'history'} onClick={() => setActiveView('history')} />
        </nav>
        <div className="mt-auto w-full p-3 lg:p-4 bg-slate-50 rounded-2xl lg:rounded-3xl border border-slate-200 hidden lg:block">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black">L</div>
              <div className="min-w-0">
                 <p className="text-xs font-black text-slate-900 truncate">Local Instance</p>
                 <p className="text-[10px] font-bold text-slate-400">v4.2 Pro Suite</p>
              </div>
           </div>
        </div>
      </aside>
      <main className="flex-1 ml-20 lg:ml-80 bg-slate-50 min-h-screen">
        {renderContent()}
      </main>
    </div>
  );
};

const StatusIndicator = ({ active, label }: { active: boolean, label: string }) => (
  <div className={`flex flex-col items-center gap-2 transition-opacity duration-500 ${active ? 'opacity-100' : 'opacity-30'}`}>
     <div className={`w-3 h-3 rounded-full ${active ? 'bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.5)]' : 'bg-slate-700'}`} />
     <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
  </div>
);

interface NavItemProps {
  icon: any;
  label: string;
  active: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-center lg:justify-start gap-3 lg:gap-5 px-3 lg:px-6 py-3 lg:py-4 rounded-xl lg:rounded-[1.5rem] transition-all group relative ${
      active 
      ? 'bg-slate-900 text-white font-black shadow-2xl shadow-slate-200 lg:translate-x-2' 
      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
    }`}
    title={label}
  >
    <Icon className={`w-5 h-5 lg:w-6 lg:h-6 ${active ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-900'}`} />
    <span className="hidden lg:block text-sm font-bold tracking-tight">{label}</span>
    {active && <div className="absolute left-0 w-1 lg:w-2 h-6 lg:h-8 bg-indigo-500 rounded-r-full" />}
  </button>
);

export default Dashboard;

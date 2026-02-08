import React from 'react';
import { ShieldCheck } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="bg-gradient-to-br from-slate-900 to-indigo-900 p-6 rounded-3xl shadow-2xl inline-block mb-6 animate-pulse">
          <ShieldCheck className="w-16 h-16 text-white" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">VeriCheck Pro</h2>
        <p className="text-slate-500 font-medium">Loading integrity engine...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;

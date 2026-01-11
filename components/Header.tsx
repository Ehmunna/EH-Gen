
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 glass border-b border-white/5 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="text-white font-bold text-xl">EH</span>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Gen AI
            </h1>
            <p className="text-[10px] text-gray-500 font-medium tracking-widest uppercase">
              Image Synthesis Studio
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold text-gray-400 border border-white/10">
            GEMINI 2.5 FLASH IMAGE
          </span>
        </div>
      </div>
    </header>
  );
};

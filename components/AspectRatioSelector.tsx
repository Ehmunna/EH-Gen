
import React from 'react';
import { AspectRatio } from '../types';

interface AspectRatioSelectorProps {
  value: AspectRatio;
  onChange: (value: AspectRatio) => void;
}

const RATIOS: { label: string; value: AspectRatio; icon: string }[] = [
  { label: 'Square', value: '1:1', icon: 'M4 4h16v16H4z' },
  { label: 'Portrait', value: '3:4', icon: 'M6 3h12v18H6z' },
  { label: 'Landscape', value: '4:3', icon: 'M3 6h18v12H3z' },
  { label: 'Story', value: '9:16', icon: 'M7 2h10v20H7z' },
  { label: 'Cinema', value: '16:9', icon: 'M2 7h20v10H2z' },
];

export const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {RATIOS.map((ratio) => (
        <button
          key={ratio.value}
          onClick={() => onChange(ratio.value)}
          className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200 border-2 ${
            value === ratio.value
              ? 'border-blue-500 bg-blue-500/10 text-blue-400'
              : 'border-white/5 bg-white/5 text-gray-400 hover:bg-white/10'
          }`}
        >
          <svg
            className="w-5 h-5 mb-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={ratio.icon} />
          </svg>
          <span className="text-[10px] font-semibold uppercase tracking-wider">{ratio.label}</span>
          <span className="text-[10px] opacity-60">{ratio.value}</span>
        </button>
      ))}
    </div>
  );
};

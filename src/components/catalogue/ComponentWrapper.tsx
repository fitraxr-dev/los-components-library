import React from 'react';

type ComponentWrapperProps = {
  name: string;
  location: string;
  children: React.ReactNode;
};

export default function ComponentWrapper({ name, location, children }: ComponentWrapperProps) {
  return (
    <div className="flex flex-col mb-10 border border-gray-700/50 rounded-xl overflow-hidden bg-[#1e1e24] shadow-lg shadow-black/20">
      <div className="bg-[#2a2a35] px-6 py-4 border-b border-gray-700/50 flex justify-between items-center">
        <h3 className="text-xl font-semibold text-white tracking-wide font-sans">{name}</h3>
        <span className="text-sm font-mono text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">
          {location}
        </span>
      </div>
      <div className="p-8 bg-[#121216] min-h-[150px] flex items-center justify-center relative overflow-hidden">
        {/* Subtle grid background for the view area */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center justify-center gap-6">
          {children}
        </div>
      </div>
    </div>
  );
}

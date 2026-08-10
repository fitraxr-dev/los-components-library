import React from 'react';

type ComponentWrapperProps = {
  name: string;
  location: string;
  children: React.ReactNode;
};

export default function ComponentWrapper({ name, location, children }: ComponentWrapperProps) {
  return (
    <div className="flex flex-col mb-10 border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-800 tracking-wide font-sans">{name}</h3>
        <span className="text-sm font-mono text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          {location}
        </span>
      </div>
      <div className="p-8 bg-white min-h-[150px] flex items-center justify-center relative overflow-hidden">
        {/* Subtle grid background for the view area */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center justify-center gap-6">
          {children}
        </div>
      </div>
    </div>
  );
}

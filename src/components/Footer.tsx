import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/10 bg-[#0A0304] py-10">
      <div className="mx-auto flex max-w-[1200px] flex-col sm:flex-row items-start sm:items-center justify-between gap-6 px-6">
        <div>
          <p className="font-display text-base font-bold tracking-tight text-white">
            CRIMEATHON
          </p>
          <p className="mt-1 text-xs text-[#A38F8F]">
            Sentrix Cyber Club · SIMATS Engineering · 24-Hour Event Clock
          </p>
        </div>

        <nav aria-label="Footer navigation" className="flex flex-wrap items-center gap-6 text-xs font-medium text-[#CBB8B8]">
          <a href="#timer" className="hover:text-white transition-colors">
            Live Timer
          </a>
          <a href="#schedule" className="hover:text-white transition-colors">
            Schedule
          </a>
          <a href="#tracks" className="hover:text-white transition-colors">
            Tracks
          </a>
          <a href="#organizers" className="hover:text-white transition-colors">
            Organizers
          </a>
        </nav>
      </div>
    </footer>
  );
};

import React from 'react';

interface HeaderProps {
  onOpenConfig: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenConfig }) => {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0D0405]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-8 px-6 py-4">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#timer"
          className="font-display text-lg font-extrabold tracking-tight text-white whitespace-nowrap shrink-0 transition-colors hover:text-[#E05252]"
        >
          CRIMEATHON
        </a>

        {/* Zone 2: 4 concise single-line text navigation links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#CBB8B8]"
        >
          <a
            href="#timer"
            className="whitespace-nowrap shrink-0 transition-colors hover:text-white hover:underline underline-offset-4 decoration-[#D14D4D]"
          >
            Live Timer
          </a>
          <a
            href="#schedule"
            className="whitespace-nowrap shrink-0 transition-colors hover:text-white hover:underline underline-offset-4 decoration-[#D14D4D]"
          >
            Schedule
          </a>
          <a
            href="#tracks"
            className="whitespace-nowrap shrink-0 transition-colors hover:text-white hover:underline underline-offset-4 decoration-[#D14D4D]"
          >
            Tracks
          </a>
          <a
            href="#organizers"
            className="whitespace-nowrap shrink-0 transition-colors hover:text-white hover:underline underline-offset-4 decoration-[#D14D4D]"
          >
            Organizers
          </a>
        </nav>

        {/* Zone 3: Single primary action button */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onOpenConfig}
            className="rounded-lg bg-[#D14D4D] px-4 py-2 text-xs font-semibold text-white transition-colors duration-150 hover:bg-[#B83D3D] whitespace-nowrap shrink-0 cursor-pointer"
          >
            Configure Clock
          </button>
        </div>
      </div>
    </header>
  );
};

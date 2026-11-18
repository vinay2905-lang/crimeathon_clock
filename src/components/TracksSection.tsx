import React from 'react';
import { INVESTIGATION_TRACKS } from '../data/eventData';

export const TracksSection: React.FC = () => {
  return (
    <section id="tracks" className="border-t border-white/10 py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-semibold text-[#38BDF8]">Competition Scope</p>
            <h2
              className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-white"
              style={{ textWrap: 'balance' }}
            >
              Investigation Domains & Evaluation Pillars
            </h2>
          </div>
          <p className="text-sm text-[#CBB8B8] max-w-[44ch]">
            Teams correlate evidence across four forensic disciplines before the 24-hour portal closes.
          </p>
        </div>

        {/* Asymmetric 12-column Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {INVESTIGATION_TRACKS.map((track, idx) => {
            const spanClass =
              idx === 0
                ? 'lg:col-span-7'
                : idx === 1
                  ? 'lg:col-span-5'
                  : idx === 2
                    ? 'lg:col-span-5'
                    : 'lg:col-span-7';

            return (
              <article
                key={track.number}
                className={`${spanClass} flex flex-col justify-between rounded-xl border border-white/10 bg-[#140608] p-6 md:p-8`}
              >
                <div>
                  <div className="text-xs font-mono-tabular font-semibold text-[#D14D4D]">
                    {track.number}. Investigation Track
                  </div>
                  <h3 className="mt-3 font-display text-xl font-bold text-white">
                    {track.title}
                  </h3>
                  <p className="mt-3 text-sm md:text-base leading-relaxed text-[#CBB8B8] max-w-[62ch]">
                    {track.summary}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center gap-2 text-xs text-[#E4D5D5]">
                  {track.focusAreas.map((area, areaIdx) => (
                    <React.Fragment key={area}>
                      <span>{area}</span>
                      {areaIdx < track.focusAreas.length - 1 && (
                        <span aria-hidden="true" className="text-[#D14D4D]">·</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

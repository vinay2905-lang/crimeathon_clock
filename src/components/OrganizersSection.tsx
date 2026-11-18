import React, { useState } from 'react';
import { Shield } from 'lucide-react';
import { LOGOS } from '../data/eventData';

export const OrganizersSection: React.FC = () => {
  const [failedLogos, setFailedLogos] = useState<Record<string, boolean>>({});

  const markFailed = (key: string) => {
    setFailedLogos((prev) => ({ ...prev, [key]: true }));
  };

  return (
    <section id="organizers" className="border-t border-white/10 py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="mb-10">
          <p className="text-xs font-semibold text-[#D14D4D]">Host Institution & Organizers</p>
          <h2
            className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-white"
            style={{ textWrap: 'balance' }}
          >
            Presented by Sentrix Cyber Club at SIMATS Engineering
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {/* Card 1: Crimeathon Event Logo */}
          <article className="flex flex-col justify-between rounded-xl border border-[#D14D4D]/30 bg-[#140608] p-6">
            <div>
              <div className="flex h-44 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-[#130405] p-4">
                {!failedLogos.crimeathon ? (
                  <img
                    src={LOGOS.crimeathon}
                    alt="Crimeathon official event logo"
                    referrerPolicy="no-referrer"
                    onError={() => markFailed('crimeathon')}
                    className="max-h-full w-full object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center text-center">
                    <Shield className="h-8 w-8 text-[#D14D4D]" aria-hidden="true" />
                    <span className="mt-2 font-display text-lg font-bold text-white">CRIMEATHON</span>
                  </div>
                )}
              </div>
              <h3 className="mt-5 font-display text-lg font-bold text-white">
                Crimeathon Flagship Event
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#CBB8B8]">
                A 24-hour intensive cyber forensics and investigative sprint challenging teams to
                trace digital evidence under real-time pressure.
              </p>
            </div>
            <p className="mt-5 pt-4 border-t border-white/10 text-xs font-medium text-[#E05252]">
              24-Hour Continuous Competition
            </p>
          </article>

          {/* Card 2: Sentrix Cyber Club Logo */}
          <article className="flex flex-col justify-between rounded-xl border border-white/10 bg-[#140608] p-6">
            <div>
              <div className="flex h-44 items-center justify-center overflow-hidden rounded-lg border border-white/15 bg-[#F7F7F7] p-4">
                {!failedLogos.sentrix ? (
                  <img
                    src={LOGOS.sentrix}
                    alt="Sentrix Cyber Club logo"
                    referrerPolicy="no-referrer"
                    onError={() => markFailed('sentrix')}
                    className="max-h-full w-full object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center text-center text-[#133B5C]">
                    <Shield className="h-8 w-8" aria-hidden="true" />
                    <span className="mt-2 font-display text-lg font-bold">SENTRIX CYBER CLUB</span>
                  </div>
                )}
              </div>
              <h3 className="mt-5 font-display text-lg font-bold text-white">
                Sentrix Cyber Club
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#CBB8B8]">
                Student-led cybersecurity and digital forensics collective designing the case
                scenarios, forensic datasets, and technical evaluation rubrics.
              </p>
            </div>
            <p className="mt-5 pt-4 border-t border-white/10 text-xs font-medium text-[#38BDF8]">
              Event Organizing Club
            </p>
          </article>

          {/* Card 3: SIMATS Engineering Logo */}
          <article className="flex flex-col justify-between rounded-xl border border-white/10 bg-[#140608] p-6">
            <div>
              <div className="flex h-44 items-center justify-center overflow-hidden rounded-lg border border-white/15 bg-white p-5">
                {!failedLogos.simats ? (
                  <img
                    src={LOGOS.simats}
                    alt="SIMATS Engineering — Engineer to Excel logo"
                    referrerPolicy="no-referrer"
                    onError={() => markFailed('simats')}
                    className="max-h-full w-full object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center text-center text-[#1E40AF]">
                    <Shield className="h-8 w-8" aria-hidden="true" />
                    <span className="mt-2 font-display text-lg font-bold">SIMATS ENGINEERING</span>
                  </div>
                )}
              </div>
              <h3 className="mt-5 font-display text-lg font-bold text-white">
                SIMATS Engineering
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#CBB8B8]">
                Saveetha Institute of Medical and Technical Sciences — providing the academic venue,
                infrastructure, and technical mentorship for Crimeathon.
              </p>
            </div>
            <p className="mt-5 pt-4 border-t border-white/10 text-xs font-medium text-[#E4D5D5]">
              Host Institution · Engineer to Excel
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

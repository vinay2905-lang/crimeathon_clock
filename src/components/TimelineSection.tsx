import React from 'react';
import { CheckCircle2, CircleDot, Clock } from 'lucide-react';
import { EVENT_MILESTONES } from '../data/eventData';
import type { EventTimerConfig, TimerSnapshot } from '../types/timer';
import { formatEventDateTime } from '../utils/timerMath';

interface TimelineSectionProps {
  config: EventTimerConfig;
  snapshot: TimerSnapshot;
}

export const TimelineSection: React.FC<TimelineSectionProps> = ({ config, snapshot }) => {
  return (
    <section id="schedule" className="border-t border-white/10 py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-semibold text-[#D14D4D]">24-Hour Operational Schedule</p>
            <h2
              className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-white"
              style={{ textWrap: 'balance' }}
            >
              Milestones From Kickoff to Final Lock
            </h2>
          </div>
          <p className="text-sm text-[#CBB8B8] max-w-[44ch]">
            Every checkpoint timestamp updates automatically from the official event start clock.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {EVENT_MILESTONES.map((milestone, index) => {
            const milestoneTime =
              config.startTimestamp + milestone.hourOffset * 60 * 60 * 1000;
            const isCompleted =
              snapshot.status === 'completed' ||
              (snapshot.activeMilestoneIndex > index && snapshot.status !== 'scheduled');
            const isActive =
              snapshot.status !== 'scheduled' &&
              snapshot.status !== 'completed' &&
              snapshot.activeMilestoneIndex === index;

            const stateLabel = isCompleted
              ? 'Completed'
              : isActive
                ? 'Active Phase'
                : 'Upcoming';

            return (
              <article
                key={milestone.id}
                className={`flex flex-col justify-between rounded-xl border p-6 transition-colors ${
                  isActive
                    ? 'border-[#D14D4D]/65 bg-[#1B090B]'
                    : isCompleted
                      ? 'border-white/10 bg-[#140608]/80'
                      : 'border-white/10 bg-[#120507]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-3 text-xs font-medium">
                    <span className="font-mono-tabular font-semibold text-[#E05252]">
                      {milestone.hourLabel} · {formatEventDateTime(milestoneTime)}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                        isActive
                          ? 'text-white font-semibold'
                          : isCompleted
                            ? 'text-[#38BDF8]'
                            : 'text-[#A38F8F]'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                      ) : isActive ? (
                        <CircleDot className="h-3.5 w-3.5 text-[#E05252]" aria-hidden="true" />
                      ) : (
                        <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                      )}
                      <span>{stateLabel}</span>
                    </span>
                  </div>

                  <h3 className="mt-4 font-display text-lg font-bold text-white leading-snug">
                    {milestone.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-[#CBB8B8]">
                    {milestone.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-white/10 text-xs text-[#A38F8F]">
                  Deliverable: <span className="text-[#E4D5D5] font-medium">{milestone.deliverable}</span>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

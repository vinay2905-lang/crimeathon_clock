import React, { useState } from 'react';
import {
  Check,
  Clock,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  RotateCcw,
  Share2,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { EVENT_MILESTONES, LOGOS } from '../data/eventData';
import type { EventTimerConfig, TimerSnapshot } from '../types/timer';
import { formatEventDateTime } from '../utils/timerMath';

interface TimerStageProps {
  config: EventTimerConfig;
  snapshot: TimerSnapshot;
  isFullscreenStage: boolean;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onStartNow: () => void;
  onTogglePause: () => void;
  onReset: () => void;
  onToggleFullscreen: () => void;
  onOpenConfig: () => void;
}

const HOUR_TICKS = [0, 4, 8, 12, 16, 20, 24];

export const TimerStage: React.FC<TimerStageProps> = ({
  config,
  snapshot,
  isFullscreenStage,
  soundEnabled,
  onToggleSound,
  onStartNow,
  onTogglePause,
  onReset,
  onToggleFullscreen,
  onOpenConfig,
}) => {
  const [copied, setCopied] = useState(false);
  const [bannerError, setBannerError] = useState(false);

  const activeMilestone =
    snapshot.activeMilestoneIndex >= 0
      ? EVENT_MILESTONES[snapshot.activeMilestoneIndex]
      : null;

  const statusLabel = (() => {
    switch (snapshot.status) {
      case 'scheduled':
        return 'Scheduled — Countdown to Kickoff';
      case 'running':
        return 'Live — 24-Hour Event in Progress';
      case 'paused':
        return 'Paused — Stage Clock Held';
      case 'completed':
        return 'Completed — 24 Hours Elapsed';
    }
  })();

  const handleCopyShareLink = async () => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('start', String(config.startTimestamp));
      url.searchParams.set('title', config.eventTitle);
      await navigator.clipboard.writeText(url.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section
      id="timer"
      className={
        isFullscreenStage
          ? 'fixed inset-0 z-50 flex flex-col justify-between bg-[#0D0405] crimeathon-grid-bg px-6 py-6 md:px-12 md:py-10 overflow-y-auto'
          : 'relative pt-8 pb-16 md:pt-12 md:pb-24'
      }
    >
      <div className={isFullscreenStage ? 'mx-auto w-full max-w-[1320px] flex-1 flex flex-col justify-between gap-8' : 'mx-auto max-w-[1200px] px-6'}>
        {/* Institutional & Event Banner Row */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm font-medium text-[#CBB8B8]">
              <span className="text-white font-semibold">SIMATS Engineering</span>
              <span aria-hidden="true" className="text-[#D14D4D]">·</span>
              <span className="text-[#60A5FA]">Sentrix Cyber Club</span>
              <span aria-hidden="true" className="text-[#D14D4D]">·</span>
              <span>{config.venue}</span>
            </div>

            {isFullscreenStage && (
              <div className="flex items-center gap-3">
                <div className="rounded-md bg-white px-2.5 py-1">
                  <img
                    src={LOGOS.simats}
                    alt="SIMATS Engineering Logo"
                    referrerPolicy="no-referrer"
                    className="h-6 w-auto object-contain"
                  />
                </div>
                <div className="rounded-md bg-[#F7F7F7] px-2.5 py-1">
                  <img
                    src={LOGOS.sentrix}
                    alt="Sentrix Cyber Club Logo"
                    referrerPolicy="no-referrer"
                    className="h-6 w-auto object-contain"
                  />
                </div>
                <button
                  type="button"
                  onClick={onToggleFullscreen}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-[#17090B] px-3.5 py-2 text-xs font-medium text-white transition-colors hover:border-[#D14D4D] whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Minimize2 className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Exit Fullscreen</span>
                </button>
              </div>
            )}
          </div>

          {/* Crimeathon Official Banner Showcase */}
          {!isFullscreenStage && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              <div className="lg:col-span-7 flex flex-col justify-center">
                <h1
                  className="font-display font-extrabold tracking-tight text-white leading-[1.06]"
                  style={{ fontSize: 'clamp(2.25rem, 4.2vw, 3.75rem)', textWrap: 'balance' }}
                >
                  {config.eventTitle}
                </h1>
                <p className="mt-4 max-w-[60ch] text-base leading-relaxed text-[#D4C3C3]">
                  Twenty-four continuous hours of digital forensics, threat hunting, and incident
                  investigation hosted by Sentrix Cyber Club at SIMATS Engineering.
                </p>
              </div>

              <div className="lg:col-span-5 flex items-center">
                <div className="w-full overflow-hidden rounded-xl border border-[#D14D4D]/25 bg-[#130405] p-3">
                  {!bannerError ? (
                    <img
                      src={LOGOS.crimeathon}
                      alt="Crimeathon by Sentrix Cyber Club official detective emblem banner"
                      referrerPolicy="no-referrer"
                      onError={() => setBannerError(true)}
                      className="w-full h-36 md:h-40 object-contain rounded-lg"
                    />
                  ) : (
                    <div className="flex h-36 md:h-40 items-center justify-center rounded-lg bg-[#1A0709] text-center px-4">
                      <div>
                        <p className="font-display text-2xl font-extrabold tracking-wide text-white">
                          CRIMEATHON
                        </p>
                        <p className="mt-1 text-xs font-medium text-[#60A5FA]">
                          BY SENTRIX CYBER CLUB
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main 24-Hour Countdown Clock Surface */}
        <div
          className={
            isFullscreenStage
              ? 'rounded-2xl border border-[#D14D4D]/30 bg-[#140608]/95 p-8 md:p-12'
              : 'mt-8 rounded-2xl border border-[#D14D4D]/30 bg-[#140608]/95 p-6 md:p-10'
          }
        >
          {/* Stage Status Bar (Unboxed Metadata, Explicit Text & Icon) */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-6 border-b border-white/10">
            <div className="flex items-center gap-2.5 text-sm font-semibold text-white">
              <Clock
                className={`h-4 w-4 shrink-0 ${
                  snapshot.status === 'running'
                    ? 'text-[#E05252]'
                    : snapshot.status === 'completed'
                      ? 'text-[#38BDF8]'
                      : 'text-[#CBB8B8]'
                }`}
                aria-hidden="true"
              />
              <span>{statusLabel}</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-[#CBB8B8] font-mono-tabular">
              <span>Start: {formatEventDateTime(config.startTimestamp)}</span>
              <span aria-hidden="true" className="text-[#D14D4D]">/</span>
              <span>End: {formatEventDateTime(snapshot.endTimestamp)}</span>
            </div>
          </div>

          {/* Fullscreen Banner Strip */}
          {isFullscreenStage && (
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={LOGOS.crimeathon}
                  alt="Crimeathon official banner"
                  referrerPolicy="no-referrer"
                  className="h-16 w-auto rounded-lg border border-[#D14D4D]/25 bg-[#130405] object-contain p-1"
                />
                <div>
                  <h2 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                    {config.eventTitle}
                  </h2>
                  <p className="text-sm text-[#CBB8B8]">
                    {activeMilestone
                      ? `Current Phase: ${activeMilestone.hourLabel} — ${activeMilestone.title}`
                      : 'Awaiting Official 24-Hour Kickoff'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Giant Tabular Countdown Display */}
          <div className="py-8 md:py-12 text-center">
            <p className="text-xs md:text-sm font-medium text-[#CBB8B8] mb-4">
              {snapshot.status === 'scheduled'
                ? 'Time Remaining Until 24-Hour Event Begins'
                : snapshot.status === 'completed'
                  ? 'Final Event Clock Reached Zero'
                  : 'Time Remaining in 24-Hour Crimeathon'}
            </p>

            <div
              role="timer"
              aria-live="polite"
              aria-label={`Countdown timer: ${snapshot.hours} hours, ${snapshot.minutes} minutes, ${snapshot.seconds} seconds`}
              className="mx-auto inline-grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2 sm:gap-4 md:gap-6"
            >
              <div className="rounded-xl border border-white/10 bg-[#1B090B] px-4 py-4 sm:px-7 sm:py-6 md:px-10 md:py-8 min-w-[84px] sm:min-w-[140px] md:min-w-[180px]">
                <div
                  className="font-mono-tabular font-bold tracking-tight text-white leading-none"
                  style={{ fontSize: isFullscreenStage ? 'clamp(3.5rem, 9vw, 8rem)' : 'clamp(2.75rem, 7.5vw, 6.25rem)' }}
                >
                  {snapshot.hours}
                </div>
                <div className="mt-2 text-xs font-medium text-[#B8A3A3]">Hours</div>
              </div>

              <span
                aria-hidden="true"
                className="font-mono-tabular font-bold text-[#D14D4D]"
                style={{ fontSize: isFullscreenStage ? 'clamp(2.5rem, 6vw, 5.5rem)' : 'clamp(2rem, 5vw, 4.5rem)' }}
              >
                :
              </span>

              <div className="rounded-xl border border-white/10 bg-[#1B090B] px-4 py-4 sm:px-7 sm:py-6 md:px-10 md:py-8 min-w-[84px] sm:min-w-[140px] md:min-w-[180px]">
                <div
                  className="font-mono-tabular font-bold tracking-tight text-white leading-none"
                  style={{ fontSize: isFullscreenStage ? 'clamp(3.5rem, 9vw, 8rem)' : 'clamp(2.75rem, 7.5vw, 6.25rem)' }}
                >
                  {snapshot.minutes}
                </div>
                <div className="mt-2 text-xs font-medium text-[#B8A3A3]">Minutes</div>
              </div>

              <span
                aria-hidden="true"
                className="font-mono-tabular font-bold text-[#D14D4D]"
                style={{ fontSize: isFullscreenStage ? 'clamp(2.5rem, 6vw, 5.5rem)' : 'clamp(2rem, 5vw, 4.5rem)' }}
              >
                :
              </span>

              <div className="rounded-xl border border-[#D14D4D]/35 bg-[#1B090B] px-4 py-4 sm:px-7 sm:py-6 md:px-10 md:py-8 min-w-[84px] sm:min-w-[140px] md:min-w-[180px]">
                <div
                  className="font-mono-tabular font-bold tracking-tight text-[#E05252] leading-none"
                  style={{ fontSize: isFullscreenStage ? 'clamp(3.5rem, 9vw, 8rem)' : 'clamp(2.75rem, 7.5vw, 6.25rem)' }}
                >
                  {snapshot.seconds}
                </div>
                <div className="mt-2 text-xs font-medium text-[#B8A3A3]">Seconds</div>
              </div>
            </div>
          </div>

          {/* 24-Hour Progress Track & Elapsed Readout */}
          <div className="pt-2 pb-6 border-b border-white/10">
            <div className="flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm mb-3">
              <div className="flex flex-wrap items-center gap-3 text-[#CBB8B8]">
                <span>
                  Elapsed:{' '}
                  <strong className="font-mono-tabular text-white">
                    {snapshot.elapsedFormatted}
                  </strong>
                </span>
                <span aria-hidden="true" className="text-[#D14D4D]">·</span>
                <span>
                  Remaining:{' '}
                  <strong className="font-mono-tabular text-white">
                    {snapshot.remainingFormatted}
                  </strong>
                </span>
              </div>
              <div className="font-mono-tabular text-white font-semibold">
                {snapshot.progressPercent.toFixed(1)}% of 24h Complete
              </div>
            </div>

            <div
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(snapshot.progressPercent)}
              aria-label="24-hour event progress"
              className="relative h-3 w-full overflow-hidden rounded-full bg-[#241013] border border-white/10"
            >
              <div
                className="h-full bg-gradient-to-r from-[#A83232] via-[#D14D4D] to-[#38BDF8] transition-[width] duration-300 ease-out"
                style={{ width: `${snapshot.progressPercent}%` }}
              />
            </div>

            <div className="mt-2.5 flex items-center justify-between text-[11px] sm:text-xs font-mono-tabular text-[#A38F8F]">
              {HOUR_TICKS.map((hr) => (
                <span key={hr}>{String(hr).padStart(2, '0')}h</span>
              ))}
            </div>
          </div>

          {/* Active Phase Summary & Stage Controls */}
          <div className="pt-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div className="min-w-0">
              <p className="text-xs font-medium text-[#38BDF8]">
                {activeMilestone
                  ? `Active Checkpoint · ${activeMilestone.hourLabel}`
                  : 'Pre-Event Preparation'}
              </p>
              <p className="mt-1 text-sm sm:text-base font-semibold text-white truncate">
                {activeMilestone
                  ? activeMilestone.title
                  : 'Set event start time or launch the 24-hour clock immediately'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={onStartNow}
                className="inline-flex items-center gap-2 rounded-lg bg-[#D14D4D] px-4 py-2 text-xs sm:text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#B83D3D] whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Play className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Start 24h Now</span>
              </button>

              {(snapshot.status === 'running' || snapshot.status === 'paused') && (
                <button
                  type="button"
                  onClick={onTogglePause}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-[#1B090B] px-4 py-2 text-xs sm:text-sm font-medium text-white transition-colors duration-150 hover:border-white/30 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {snapshot.status === 'paused' ? (
                    <>
                      <Play className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Resume</span>
                    </>
                  ) : (
                    <>
                      <Pause className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Pause</span>
                    </>
                  )}
                </button>
              )}

              <button
                type="button"
                onClick={onReset}
                className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-[#1B090B] px-3.5 py-2 text-xs sm:text-sm font-medium text-[#E4D5D5] transition-colors duration-150 hover:border-white/30 hover:text-white whitespace-nowrap shrink-0 cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Reset</span>
              </button>

              <button
                type="button"
                onClick={onOpenConfig}
                className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-[#1B090B] px-3.5 py-2 text-xs sm:text-sm font-medium text-[#E4D5D5] transition-colors duration-150 hover:border-white/30 hover:text-white whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Set Schedule</span>
              </button>

              <button
                type="button"
                onClick={handleCopyShareLink}
                className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-[#1B090B] px-3.5 py-2 text-xs sm:text-sm font-medium text-[#E4D5D5] transition-colors duration-150 hover:border-white/30 hover:text-white whitespace-nowrap shrink-0 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-[#38BDF8]" aria-hidden="true" />
                    <span className="text-[#38BDF8]">Link Copied</span>
                  </>
                ) : (
                  <>
                    <Share2 className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Share Link</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onToggleSound}
                aria-label={soundEnabled ? 'Mute stage chime' : 'Enable stage chime'}
                title={soundEnabled ? 'Stage audio cue enabled' : 'Stage audio cue muted'}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-[#1B090B] px-3 py-2 text-xs sm:text-sm font-medium text-[#E4D5D5] transition-colors duration-150 hover:border-white/30 hover:text-white whitespace-nowrap shrink-0 cursor-pointer"
              >
                {soundEnabled ? (
                  <Volume2 className="h-3.5 w-3.5 text-[#38BDF8]" aria-hidden="true" />
                ) : (
                  <VolumeX className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                <span>{soundEnabled ? 'Audio On' : 'Audio Off'}</span>
              </button>

              {!isFullscreenStage && (
                <button
                  type="button"
                  onClick={onToggleFullscreen}
                  className="inline-flex items-center gap-2 rounded-lg border border-[#38BDF8]/35 bg-[#0F1E28] px-3.5 py-2 text-xs sm:text-sm font-medium text-[#7DD3FC] transition-colors duration-150 hover:border-[#38BDF8] hover:text-white whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Projector Mode</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

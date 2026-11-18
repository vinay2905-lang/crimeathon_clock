export type TimerPhaseStatus = 'scheduled' | 'running' | 'paused' | 'completed';

export interface EventTimerConfig {
  eventTitle: string;
  venue: string;
  /** Epoch ms when the 24-hour event starts */
  startTimestamp: number;
  /** Total event duration in milliseconds (default: 24 hours = 86,400,000 ms) */
  durationMs: number;
  /** Whether the organizer manually paused the clock */
  isPaused: boolean;
  /** Remaining ms captured at the moment of pause */
  pausedRemainingMs: number | null;
}

export interface TimerSnapshot {
  status: TimerPhaseStatus;
  /** Primary display digits (time remaining in event, or time until kickoff if scheduled) */
  hours: string;
  minutes: string;
  seconds: string;
  /** Total remaining ms during event (or 24h before start) */
  remainingMs: number;
  /** Total elapsed ms since start (0 before start, durationMs after completion) */
  elapsedMs: number;
  /** Percentage complete 0..100 */
  progressPercent: number;
  /** Formatted elapsed HH:MM:SS */
  elapsedFormatted: string;
  /** Formatted remaining HH:MM:SS */
  remainingFormatted: string;
  /** Current active milestone index (0..5), or -1 if scheduled */
  activeMilestoneIndex: number;
  endTimestamp: number;
}

export interface MilestoneItem {
  id: string;
  hourOffset: number;
  hourLabel: string;
  title: string;
  description: string;
  deliverable: string;
}

export interface InvestigationTrack {
  number: string;
  title: string;
  summary: string;
  focusAreas: string[];
  featured?: boolean;
}

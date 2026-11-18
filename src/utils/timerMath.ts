import { EVENT_MILESTONES } from '../data/eventData';
import type { EventTimerConfig, TimerSnapshot } from '../types/timer';

export function padTwo(value: number): string {
  return Math.max(0, Math.floor(value)).toString().padStart(2, '0');
}

export function formatDurationHMS(ms: number): string {
  const clamped = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(clamped / 3600);
  const minutes = Math.floor((clamped % 3600) / 60);
  const seconds = clamped % 60;
  return `${padTwo(hours)}:${padTwo(minutes)}:${padTwo(seconds)}`;
}

export function splitHMS(ms: number): { hours: string; minutes: string; seconds: string } {
  const clamped = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(clamped / 3600);
  const minutes = Math.floor((clamped % 3600) / 60);
  const seconds = clamped % 60;
  return {
    hours: padTwo(hours),
    minutes: padTwo(minutes),
    seconds: padTwo(seconds),
  };
}

export function computeTimerSnapshot(config: EventTimerConfig, nowMs: number): TimerSnapshot {
  const endTimestamp = config.startTimestamp + config.durationMs;

  if (config.isPaused && config.pausedRemainingMs !== null) {
    const remainingMs = Math.max(0, Math.min(config.durationMs, config.pausedRemainingMs));
    const elapsedMs = Math.max(0, config.durationMs - remainingMs);
    const progressPercent = Math.min(100, Math.max(0, (elapsedMs / config.durationMs) * 100));
    const { hours, minutes, seconds } = splitHMS(remainingMs);

    return {
      status: remainingMs <= 0 ? 'completed' : 'paused',
      hours,
      minutes,
      seconds,
      remainingMs,
      elapsedMs,
      progressPercent,
      elapsedFormatted: formatDurationHMS(elapsedMs),
      remainingFormatted: formatDurationHMS(remainingMs),
      activeMilestoneIndex: findActiveMilestoneIndex(elapsedMs),
      endTimestamp,
    };
  }

  // Event hasn't started yet
  if (nowMs < config.startTimestamp) {
    const untilStartMs = config.startTimestamp - nowMs;
    const { hours, minutes, seconds } = splitHMS(untilStartMs);
    return {
      status: 'scheduled',
      hours,
      minutes,
      seconds,
      remainingMs: config.durationMs,
      elapsedMs: 0,
      progressPercent: 0,
      elapsedFormatted: '00:00:00',
      remainingFormatted: formatDurationHMS(config.durationMs),
      activeMilestoneIndex: -1,
      endTimestamp,
    };
  }

  // Event finished
  if (nowMs >= endTimestamp) {
    return {
      status: 'completed',
      hours: '00',
      minutes: '00',
      seconds: '00',
      remainingMs: 0,
      elapsedMs: config.durationMs,
      progressPercent: 100,
      elapsedFormatted: formatDurationHMS(config.durationMs),
      remainingFormatted: '00:00:00',
      activeMilestoneIndex: EVENT_MILESTONES.length - 1,
      endTimestamp,
    };
  }

  // Event is live!
  const remainingMs = Math.max(0, endTimestamp - nowMs);
  const elapsedMs = Math.max(0, nowMs - config.startTimestamp);
  const progressPercent = Math.min(100, Math.max(0, (elapsedMs / config.durationMs) * 100));
  const { hours, minutes, seconds } = splitHMS(remainingMs);

  return {
    status: 'running',
    hours,
    minutes,
    seconds,
    remainingMs,
    elapsedMs,
    progressPercent,
    elapsedFormatted: formatDurationHMS(elapsedMs),
    remainingFormatted: formatDurationHMS(remainingMs),
    activeMilestoneIndex: findActiveMilestoneIndex(elapsedMs),
    endTimestamp,
  };
}

function findActiveMilestoneIndex(elapsedMs: number): number {
  const elapsedHours = elapsedMs / (60 * 60 * 1000);
  let active = 0;
  for (let i = 0; i < EVENT_MILESTONES.length; i++) {
    if (elapsedHours >= EVENT_MILESTONES[i].hourOffset) {
      active = i;
    }
  }
  return active;
}

export function formatEventDateTime(timestamp: number): string {
  return new Intl.DateTimeFormat('en-IN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(timestamp));
}

export function toLocalDateTimeInputValue(timestamp: number): string {
  const d = new Date(timestamp);
  const year = d.getFullYear();
  const month = padTwo(d.getMonth() + 1);
  const day = padTwo(d.getDate());
  const hours = padTwo(d.getHours());
  const mins = padTwo(d.getMinutes());
  return `${year}-${month}-${day}T${hours}:${mins}`;
}

export function playStageChime(type: 'start' | 'complete'): void {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const notes = type === 'complete' ? [523.25, 659.25, 783.99, 1046.5] : [440, 554.37, 659.25];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const startTime = ctx.currentTime + idx * 0.14;
      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.exponentialRampToValueAtTime(0.12, startTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.45);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.48);
    });
  } catch {
    // Audio playback safely ignored when blocked by browser autoplay policy
  }
}

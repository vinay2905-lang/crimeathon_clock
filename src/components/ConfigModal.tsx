import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { EVENT_DURATION_MS } from '../data/eventData';
import type { EventTimerConfig } from '../types/timer';
import { formatEventDateTime, toLocalDateTimeInputValue } from '../utils/timerMath';

interface ConfigModalProps {
  isOpen: boolean;
  config: EventTimerConfig;
  onClose: () => void;
  onApplyConfig: (next: EventTimerConfig) => void;
}

export const ConfigModal: React.FC<ConfigModalProps> = ({
  isOpen,
  config,
  onClose,
  onApplyConfig,
}) => {
  const [eventTitle, setEventTitle] = useState(config.eventTitle);
  const [venue, setVenue] = useState(config.venue);
  const [startInput, setStartInput] = useState(toLocalDateTimeInputValue(config.startTimestamp));
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setEventTitle(config.eventTitle);
      setVenue(config.venue);
      setStartInput(toLocalDateTimeInputValue(config.startTimestamp));
      setValidationError(null);
    }
  }, [isOpen, config]);

  if (!isOpen) return null;

  const parsedStartMs = new Date(startInput).getTime();
  const isValidDate = Number.isFinite(parsedStartMs);
  const computedEndMs = isValidDate ? parsedStartMs + EVENT_DURATION_MS : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) {
      setValidationError('Please enter an event title.');
      return;
    }
    if (!isValidDate) {
      setValidationError('Please select a valid start date and time.');
      return;
    }

    onApplyConfig({
      eventTitle: eventTitle.trim(),
      venue: venue.trim() || 'SIMATS Engineering Campus',
      startTimestamp: parsedStartMs,
      durationMs: EVENT_DURATION_MS,
      isPaused: false,
      pausedRemainingMs: null,
    });
    onClose();
  };

  const applyPresetOffset = (elapsedMs: number) => {
    const now = Date.now();
    onApplyConfig({
      eventTitle: eventTitle.trim() || config.eventTitle,
      venue: venue.trim() || config.venue,
      startTimestamp: now - elapsedMs,
      durationMs: EVENT_DURATION_MS,
      isPaused: false,
      pausedRemainingMs: null,
    });
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="config-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
    >
      <div className="w-full max-w-lg rounded-2xl border border-[#D14D4D]/35 bg-[#140608] p-6 md:p-8 text-white">
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-white/10">
          <h2 id="config-modal-title" className="font-display text-xl font-bold text-white">
            Configure 24-Hour Event Clock
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close configuration dialog"
            className="rounded-lg p-2 text-[#CBB8B8] transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label htmlFor="event-title" className="block text-xs font-semibold text-[#D4C3C3] mb-2">
              Event Title
            </label>
            <input
              id="event-title"
              type="text"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              className="w-full rounded-lg border border-white/15 bg-[#1D0A0D] px-3.5 py-2.5 text-sm text-white placeholder-[#7D6666] focus:border-[#D14D4D] focus:outline-none"
              placeholder="Crimeathon 2026"
            />
          </div>

          <div>
            <label htmlFor="event-venue" className="block text-xs font-semibold text-[#D4C3C3] mb-2">
              Venue / Location
            </label>
            <input
              id="event-venue"
              type="text"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              className="w-full rounded-lg border border-white/15 bg-[#1D0A0D] px-3.5 py-2.5 text-sm text-white placeholder-[#7D6666] focus:border-[#D14D4D] focus:outline-none"
              placeholder="SIMATS Engineering Campus"
            />
          </div>

          <div>
            <label htmlFor="event-start" className="block text-xs font-semibold text-[#D4C3C3] mb-2">
              Official Event Start (End auto-locks at +24 Hours)
            </label>
            <input
              id="event-start"
              type="datetime-local"
              value={startInput}
              onChange={(e) => {
                setStartInput(e.target.value);
                setValidationError(null);
              }}
              className="w-full rounded-lg border border-white/15 bg-[#1D0A0D] px-3.5 py-2.5 text-sm font-mono-tabular text-white focus:border-[#D14D4D] focus:outline-none"
            />
            {computedEndMs && (
              <p className="mt-2 text-xs text-[#CBB8B8] font-mono-tabular">
                24-Hour End Window: <span className="text-white">{formatEventDateTime(computedEndMs)}</span>
              </p>
            )}
          </div>

          {validationError && (
            <p role="alert" className="text-xs font-medium text-[#F87171]">
              {validationError}
            </p>
          )}

          {/* Organizer Stage Presets */}
          <div className="pt-2 border-t border-white/10">
            <p className="text-xs font-semibold text-[#D4C3C3] mb-2.5">
              Quick Stage Presets
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => applyPresetOffset(0)}
                className="rounded-lg border border-white/15 bg-[#1B090B] px-3 py-2 text-xs font-medium text-white transition-colors hover:border-[#D14D4D] cursor-pointer"
              >
                Start Fresh 24:00:00
              </button>
              <button
                type="button"
                onClick={() => applyPresetOffset(-5 * 60 * 1000)}
                className="rounded-lg border border-white/15 bg-[#1B090B] px-3 py-2 text-xs font-medium text-white transition-colors hover:border-[#D14D4D] cursor-pointer"
              >
                Kickoff in 5 Mins
              </button>
              <button
                type="button"
                onClick={() => applyPresetOffset(10 * 60 * 60 * 1000)}
                className="rounded-lg border border-white/15 bg-[#1B090B] px-3 py-2 text-xs font-medium text-white transition-colors hover:border-[#38BDF8] cursor-pointer"
              >
                Preview Hour 10
              </button>
              <button
                type="button"
                onClick={() => applyPresetOffset(EVENT_DURATION_MS - 15 * 1000)}
                className="rounded-lg border border-white/15 bg-[#1B090B] px-3 py-2 text-xs font-medium text-white transition-colors hover:border-[#38BDF8] cursor-pointer"
              >
                Test Final 15 Seconds
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-white/15 px-4 py-2 text-xs font-semibold text-[#D4C3C3] transition-colors hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#D14D4D] px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#B83D3D] cursor-pointer"
            >
              Apply Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

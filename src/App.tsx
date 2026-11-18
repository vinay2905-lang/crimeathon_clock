import { useEffect, useMemo, useRef, useState } from 'react';
import { ConfigModal } from './components/ConfigModal';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { OrganizersSection } from './components/OrganizersSection';
import { TimelineSection } from './components/TimelineSection';
import { TimerStage } from './components/TimerStage';
import { TracksSection } from './components/TracksSection';
import { EVENT_DURATION_MS } from './data/eventData';
import type { EventTimerConfig } from './types/timer';
import { computeTimerSnapshot, playStageChime } from './utils/timerMath';

const STORAGE_KEY = 'crimeathon_timer_config_v1';

function getInitialConfig(): EventTimerConfig {
  const fallback: EventTimerConfig = {
    eventTitle: 'Crimeathon — 24-Hour Cyber Investigation',
    venue: 'SIMATS Engineering Campus',
    startTimestamp: Date.now(),
    durationMs: EVENT_DURATION_MS,
    isPaused: false,
    pausedRemainingMs: null,
  };

  try {
    const params = new URLSearchParams(window.location.search);
    const paramStart = params.get('start');
    const paramTitle = params.get('title');
    if (paramStart && Number.isFinite(Number(paramStart))) {
      return {
        ...fallback,
        eventTitle: paramTitle?.trim() || fallback.eventTitle,
        startTimestamp: Number(paramStart),
      };
    }

    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<EventTimerConfig>;
      if (typeof parsed.startTimestamp === 'number' && Number.isFinite(parsed.startTimestamp)) {
        return {
          eventTitle: parsed.eventTitle || fallback.eventTitle,
          venue: parsed.venue || fallback.venue,
          startTimestamp: parsed.startTimestamp,
          durationMs: parsed.durationMs || EVENT_DURATION_MS,
          isPaused: Boolean(parsed.isPaused),
          pausedRemainingMs:
            typeof parsed.pausedRemainingMs === 'number' ? parsed.pausedRemainingMs : null,
        };
      }
    }
  } catch {
    // Ignore storage/URL parsing errors and use default live 24h clock
  }

  return fallback;
}

export default function App() {
  const [config, setConfig] = useState<EventTimerConfig>(getInitialConfig);
  const [nowMs, setNowMs] = useState<number>(() => Date.now());
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isFullscreenStage, setIsFullscreenStage] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);

  const snapshot = useMemo(() => computeTimerSnapshot(config, nowMs), [config, nowMs]);
  const prevStatusRef = useRef(snapshot.status);

  // Persist config to localStorage
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch {
      // Ignore storage quota errors
    }
  }, [config]);

  // High-precision wall-clock ticker (250ms cadence avoids missed seconds)
  useEffect(() => {
    const interval = window.setInterval(() => {
      setNowMs(Date.now());
    }, 250);
    return () => window.clearInterval(interval);
  }, []);

  // Optional audio cue on start or 24-hour completion
  useEffect(() => {
    const prevStatus = prevStatusRef.current;
    if (soundEnabled) {
      if (prevStatus === 'scheduled' && snapshot.status === 'running') {
        playStageChime('start');
      } else if (prevStatus === 'running' && snapshot.status === 'completed') {
        playStageChime('complete');
      }
    }
    prevStatusRef.current = snapshot.status;
  }, [snapshot.status, soundEnabled]);

  // Sync browser fullscreen events and Escape key exit
  useEffect(() => {
    const onFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreenStage(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreenStage) {
        setIsFullscreenStage(false);
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        }
      }
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isFullscreenStage]);

  const handleStartNow = () => {
    const now = Date.now();
    setNowMs(now);
    setConfig((prev) => ({
      ...prev,
      startTimestamp: now,
      durationMs: EVENT_DURATION_MS,
      isPaused: false,
      pausedRemainingMs: null,
    }));
  };

  const handleTogglePause = () => {
    const now = Date.now();
    setNowMs(now);
    setConfig((prev) => {
      if (prev.isPaused && prev.pausedRemainingMs !== null) {
        // Resume by shifting startTimestamp so remaining time picks up seamlessly
        const elapsedSoFar = prev.durationMs - prev.pausedRemainingMs;
        return {
          ...prev,
          startTimestamp: now - elapsedSoFar,
          isPaused: false,
          pausedRemainingMs: null,
        };
      }
      const currentSnap = computeTimerSnapshot(prev, now);
      return {
        ...prev,
        isPaused: true,
        pausedRemainingMs: currentSnap.remainingMs,
      };
    });
  };

  const handleReset = () => {
    const now = Date.now();
    setNowMs(now);
    setConfig((prev) => ({
      ...prev,
      startTimestamp: now,
      durationMs: EVENT_DURATION_MS,
      isPaused: true,
      pausedRemainingMs: EVENT_DURATION_MS,
    }));
  };

  const handleToggleFullscreen = async () => {
    if (!isFullscreenStage) {
      setIsFullscreenStage(true);
      try {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
      } catch {
        // Fallback: overlay fullscreen stage remains active even if iframe blocks Fullscreen API
      }
    } else {
      setIsFullscreenStage(false);
      try {
        if (document.fullscreenElement) {
          await document.exitFullscreen();
        }
      } catch {
        // Ignore
      }
    }
  };

  return (
    <div className="min-h-screen crimeathon-grid-bg relative text-[#F5EFEF]">
      <div className="pointer-events-none fixed inset-0 crimeathon-radial-glow" aria-hidden="true" />

      {!isFullscreenStage && <Header onOpenConfig={() => setIsConfigOpen(true)} />}

      <main className="relative z-10">
        <TimerStage
          config={config}
          snapshot={snapshot}
          isFullscreenStage={isFullscreenStage}
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled((prev) => !prev)}
          onStartNow={handleStartNow}
          onTogglePause={handleTogglePause}
          onReset={handleReset}
          onToggleFullscreen={handleToggleFullscreen}
          onOpenConfig={() => setIsConfigOpen(true)}
        />

        {!isFullscreenStage && (
          <>
            <TimelineSection config={config} snapshot={snapshot} />
            <TracksSection />
            <OrganizersSection />
          </>
        )}
      </main>

      {!isFullscreenStage && <Footer />}

      <ConfigModal
        isOpen={isConfigOpen}
        config={config}
        onClose={() => setIsConfigOpen(false)}
        onApplyConfig={(next) => {
          setNowMs(Date.now());
          setConfig(next);
        }}
      />
    </div>
  );
}

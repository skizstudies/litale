import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Mock recorder: tracks recording state and an elapsed-seconds timer.
 *
 * Phase 1 does not touch the microphone. To record real audio, start a
 * MediaRecorder in `start`, pause/resume it in `pause`/`resume`, and resolve
 * the collected Blob in `finish`. The returned API can stay exactly the same.
 *
 * status: 'idle' | 'recording' | 'paused'
 */
export function useRecorder() {
  const [status, setStatus] = useState('idle');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const intervalRef = useRef(null);

  // Tick once per second while recording.
  useEffect(() => {
    if (status !== 'recording') return undefined;
    intervalRef.current = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [status]);

  /** Begin a brand-new recording, discarding any previous one. */
  const start = useCallback(() => {
    setElapsedSeconds(0);
    setStatus('recording');
  }, []);

  const pause = useCallback(() => setStatus('paused'), []);
  const resume = useCallback(() => setStatus('recording'), []);

  /** Mic button behaviour: start → pause → resume → pause … */
  const toggle = useCallback(() => {
    setStatus((current) => (current === 'recording' ? 'paused' : 'recording'));
  }, []);

  /**
   * Stop recording and hand back what was captured.
   * Returns { durationSeconds, audioBlob } — audioBlob is null in the mock.
   */
  const finish = useCallback(() => {
    setStatus('idle');
    return { durationSeconds: elapsedSeconds, audioBlob: null };
  }, [elapsedSeconds]);

  const reset = useCallback(() => {
    setStatus('idle');
    setElapsedSeconds(0);
  }, []);

  return {
    status,
    isRecording: status === 'recording',
    hasRecording: elapsedSeconds > 0,
    elapsedSeconds,
    start,
    pause,
    resume,
    toggle,
    finish,
    reset,
  };
}

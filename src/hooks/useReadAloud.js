import { useEffect, useMemo, useRef, useState } from 'react';
import { synthesizeLolaVoice } from '../services/mockApiService';

const RATE = 0.85; // warm, unhurried pace for early readers
const SCENE_PAUSE_MS = 700; // little breath between pages
const canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window;

export const splitWords = (text) => text.trim().split(/\s+/).filter(Boolean);

// Roughly how long one word takes at RATE — drives the highlight when the
// voice doesn't report word boundaries (many Chrome/Android voices don't).
const estimateWordMs = (word) => {
  const letters = word.replace(/[^\p{L}\p{N}]/gu, '').length;
  const pause = /[.!?]$/.test(word) ? 350 : /[,;:]$/.test(word) ? 180 : 0;
  return (170 + letters * 48) / RATE + pause;
};

function pickWarmVoice() {
  const voices = window.speechSynthesis.getVoices().filter((v) => v.lang?.toLowerCase().startsWith('en'));
  const warm = /(samantha|karen|moira|tessa|serena|aria|jenny|libby|sonia|zira|female)/i;
  return voices.find((v) => warm.test(v.name)) ?? voices.find((v) => v.default) ?? voices[0] ?? null;
}

/**
 * Reads a story aloud scene by scene and reports which word is being spoken.
 *
 * Narration source, in order of preference:
 *   1. synthesizeLolaVoice() → { audioUrl, wordTimings }  (ElevenLabs, once wired)
 *   2. window.speechSynthesis + word boundary events
 *   3. an estimated word timer (also used silently if there is no speech engine)
 *
 * Remount (key) the component using this hook when the story changes.
 */
export function useReadAloud(scenes, { storyId } = {}) {
  const sceneWords = useMemo(() => scenes.map((scene) => splitWords(scene.text)), [scenes]);
  const totalWords = sceneWords.reduce((sum, words) => sum + words.length, 0);

  const [sceneIndex, setSceneIndex] = useState(0);
  const [wordIndex, setWordIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const runRef = useRef(0); // bumped on every start/stop so stale callbacks ignore themselves
  const timerRef = useRef(null);
  const frameRef = useRef(0);
  const audioRef = useRef(null);
  const narrationCache = useRef(new Map());

  const stopOutput = () => {
    runRef.current += 1;
    clearTimeout(timerRef.current);
    cancelAnimationFrame(frameRef.current);
    if (canSpeak) window.speechSynthesis.cancel();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  };

  useEffect(() => stopOutput, []); // eslint-disable-line react-hooks/exhaustive-deps

  const playScene = async (sIdx, startWord) => {
    stopOutput();
    const run = runRef.current;
    const isCurrent = () => run === runRef.current;
    const scene = scenes[sIdx];
    const words = sceneWords[sIdx];

    setSceneIndex(sIdx);
    setWordIndex(startWord);
    setIsPlaying(true);
    setIsFinished(false);

    const handleSceneEnd = () => {
      if (!isCurrent()) return;
      if (sIdx < scenes.length - 1) {
        timerRef.current = setTimeout(() => isCurrent() && playScene(sIdx + 1, 0), SCENE_PAUSE_MS);
      } else {
        runRef.current += 1;
        setIsPlaying(false);
        setIsFinished(true);
        setWordIndex(-1);
      }
    };

    // Step through words on estimated timings. Without `onDone` it simply
    // parks on the last word and waits for the voice to finish.
    const runTimer = (fromWord, onDone) => {
      let i = fromWord;
      const step = () => {
        if (!isCurrent()) return;
        setWordIndex(i);
        timerRef.current = setTimeout(() => {
          i += 1;
          if (i < words.length) step();
          else onDone?.();
        }, estimateWordMs(words[i]));
      };
      step();
    };

    // 1 · Backend narration with exact word timings
    let narration = narrationCache.current.get(scene.text);
    if (!narration) {
      narration = await synthesizeLolaVoice({ storyId, sceneId: scene.id, text: scene.text });
      narrationCache.current.set(scene.text, narration);
    }
    if (!isCurrent()) return;

    if (narration?.audioUrl && narration.wordTimings?.length) {
      const timings = narration.wordTimings;
      const audio = new Audio(narration.audioUrl);
      audioRef.current = audio;
      audio.currentTime = (timings[startWord]?.startMs ?? 0) / 1000;
      const tick = () => {
        if (!isCurrent()) return;
        const ms = audio.currentTime * 1000;
        let idx = 0;
        while (idx + 1 < timings.length && timings[idx + 1].startMs <= ms) idx += 1;
        setWordIndex(idx);
        frameRef.current = requestAnimationFrame(tick);
      };
      audio.onended = () => {
        cancelAnimationFrame(frameRef.current);
        handleSceneEnd();
      };
      audio.play().then(tick).catch(() => isCurrent() && runTimer(startWord, handleSceneEnd));
      return;
    }

    // 3 · No speech engine at all: silent read-along
    if (!canSpeak) {
      runTimer(startWord, handleSceneEnd);
      return;
    }

    // 2 · Browser voice. Chrome can drop an utterance queued right after cancel().
    await wait(80);
    if (!isCurrent()) return;

    const rest = words.slice(startWord);
    const offsets = [];
    rest.reduce((pos, word) => {
      offsets.push(pos);
      return pos + word.length + 1;
    }, 0);

    const utterance = new SpeechSynthesisUtterance(rest.join(' '));
    utterance.rate = RATE;
    const voice = pickWarmVoice();
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    }

    let gotBoundary = false;
    utterance.onstart = () => {
      if (isCurrent() && !gotBoundary) runTimer(startWord);
    };
    utterance.onboundary = (event) => {
      if (!isCurrent() || (event.name && event.name !== 'word')) return;
      if (!gotBoundary) {
        gotBoundary = true;
        clearTimeout(timerRef.current); // real boundaries beat the estimate
      }
      let idx = 0;
      while (idx + 1 < offsets.length && offsets[idx + 1] <= event.charIndex) idx += 1;
      setWordIndex(startWord + idx);
    };
    utterance.onend = () => {
      if (!isCurrent()) return;
      clearTimeout(timerRef.current);
      handleSceneEnd();
    };
    utterance.onerror = (event) => {
      if (!isCurrent() || event.error === 'interrupted' || event.error === 'canceled') return;
      clearTimeout(timerRef.current);
      runTimer(startWord, handleSceneEnd); // e.g. autoplay blocked — keep the highlight going
    };
    window.speechSynthesis.speak(utterance);
  };

  const pause = () => {
    stopOutput();
    setIsPlaying(false);
  };

  const toggle = () => {
    if (isPlaying) pause();
    else if (isFinished) playScene(0, 0);
    else playScene(sceneIndex, Math.max(wordIndex, 0));
  };

  const goToScene = (index) => {
    stopOutput();
    setIsPlaying(false);
    setIsFinished(false);
    setWordIndex(-1);
    setSceneIndex(index);
  };

  const wordsBefore = sceneWords.slice(0, sceneIndex).reduce((sum, words) => sum + words.length, 0);
  const progress = isFinished
    ? 1
    : totalWords
      ? (wordsBefore + (wordIndex >= 0 ? wordIndex + 1 : 0)) / totalWords
      : 0;

  return { sceneIndex, wordIndex, isPlaying, isFinished, progress, toggle, goToScene, sceneWords };
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

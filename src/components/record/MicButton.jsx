import { Mic } from 'lucide-react';

/**
 * The big yellow microphone. Toggles recording on and off.
 * While recording it shows a calm static mint halo (no pulsing).
 */
export default function MicButton({ isRecording, hasRecording, onToggle, disabled }) {
  const label = isRecording
    ? 'Pause recording'
    : hasRecording
      ? 'Continue recording'
      : 'Start recording';

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      aria-pressed={isRecording}
      aria-label={label}
      className={`flex h-40 w-40 items-center justify-center rounded-full border-[5px] border-litale-ink bg-litale-butter transition-colors duration-200 hover:bg-litale-butter-hover disabled:cursor-not-allowed disabled:opacity-60 sm:h-48 sm:w-48 ${
        isRecording ? 'ring-[14px] ring-litale-mint' : ''
      }`}
    >
      <Mic aria-hidden="true" className="h-20 w-20 text-litale-forest" strokeWidth={2.25} />
    </button>
  );
}

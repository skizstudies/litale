import { SENTENCE_STARTERS } from '../../constants/illustrate';

const MAX_LENGTH = 100;

/** Oversized caption box so older kids (8–9) can add a sentence of their own. */
export default function TypePanel({ sceneId, sceneNumber, text, caption, onChangeCaption }) {
  const inputId = `caption-${sceneId}`;

  const addStarter = (starter) => {
    const trimmed = caption.trimEnd();
    onChangeCaption(`${trimmed}${trimmed ? ' ' : ''}${starter} `.slice(0, MAX_LENGTH));
    document.getElementById(inputId)?.focus();
  };

  return (
    <div className="flex h-full flex-col justify-center gap-6 px-5 py-8 sm:px-10">
      <div>
        <p className="text-base font-semibold text-litale-forest-muted">Scene {sceneNumber} says</p>
        <p className="mt-1 text-2xl font-semibold leading-relaxed sm:text-3xl">{text}</p>
      </div>

      <div>
        <label htmlFor={inputId} className="text-xl font-bold">
          Now add your own sentence!
        </label>
        <input
          id={inputId}
          type="text"
          value={caption}
          onChange={(e) => onChangeCaption(e.target.value)}
          maxLength={MAX_LENGTH}
          placeholder="I see…"
          autoComplete="off"
          spellCheck
          className="mt-3 min-h-[76px] w-full rounded-2xl border-2 border-dashed border-litale-forest bg-litale-wash px-5 text-2xl font-medium text-litale-ink placeholder:text-litale-ink/40 focus:border-solid focus:bg-white focus:outline-none"
        />
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className="text-base text-litale-ink/70">Need a start?</span>
          {SENTENCE_STARTERS.map((starter) => (
            <button
              key={starter}
              type="button"
              onClick={() => addStarter(starter)}
              className="min-h-[48px] rounded-full border-2 border-litale-forest bg-litale-butter px-5 text-lg font-semibold transition-colors duration-200 hover:bg-litale-butter-hover"
            >
              {starter}…
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

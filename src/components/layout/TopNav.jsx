import { TreeDeciduous } from 'lucide-react';
import { STEPS } from '../../constants/steps';

function StepPill({ step, isActive, onSelect }) {
  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(step.id)}
        aria-current={isActive ? 'step' : undefined}
        className={`min-h-[52px] w-full whitespace-nowrap rounded-full px-5 text-lg font-semibold transition-colors duration-200 sm:px-6 ${
          isActive
            ? 'bg-litale-forest text-white'
            : 'bg-litale-mint text-litale-forest hover:bg-[#D6E9CD]'
        }`}
      >
        <span className="sr-only">Step {step.number}: </span>
        {step.label}
      </button>
    </li>
  );
}

export default function TopNav({ currentStep, onStepChange, onOpenStoryTree }) {
  return (
    <header className="border-b border-litale-border bg-litale-bg">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-4 px-5 py-5 sm:px-8">
        {/* Wordmark */}
        <button
          type="button"
          onClick={() => onStepChange('record')}
          aria-label="Litale home"
          className="rounded-lg text-3xl font-bold tracking-tight text-litale-ink"
        >
          Litale
        </button>

        {/* Stepper — sits in the centre on wide screens, its own row on small ones */}
        <nav aria-label="Story steps" className="order-3 w-full lg:order-none lg:w-auto">
          <ol className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-3 lg:justify-center">
            {STEPS.map((step) => (
              <StepPill
                key={step.id}
                step={step}
                isActive={step.id === currentStep}
                onSelect={onStepChange}
              />
            ))}
          </ol>
        </nav>

        {/* Story archive shortcut */}
        <button
          type="button"
          onClick={onOpenStoryTree}
          className="inline-flex min-h-[52px] items-center gap-2 rounded-full border-2 border-litale-forest bg-white px-5 text-lg font-semibold text-litale-forest transition-colors duration-200 hover:bg-litale-mint"
        >
          <TreeDeciduous aria-hidden="true" className="h-6 w-6" strokeWidth={2.25} />
          <span>Family Story Tree</span>
        </button>
      </div>
    </header>
  );
}

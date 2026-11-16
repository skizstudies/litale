// The four stages of turning a family story into a book.
export const STEPS = [
  { id: 'record', label: 'Record', number: 1 },
  { id: 'review', label: 'Review', number: 2 },
  { id: 'illustrate', label: 'Illustrate', number: 3 },
  { id: 'read', label: 'Read', number: 4 },
];

export const DEFAULT_STEP = 'record';

export const getStep = (id) => STEPS.find((step) => step.id === id) ?? STEPS[0];

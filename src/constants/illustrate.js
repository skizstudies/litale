import { Headphones, Keyboard, Palette, Pencil } from 'lucide-react';

// The four ways a child can join the story in Step 3.
export const ILLUSTRATE_MODES = [
  { id: 'listen', label: 'Listen', icon: Headphones, stageLabel: 'story narration' },
  { id: 'color', label: 'Color', icon: Palette, stageLabel: 'coloring canvas' },
  { id: 'draw', label: 'Draw', icon: Pencil, stageLabel: 'drawing board' },
  { id: 'type', label: 'Type words', icon: Keyboard, stageLabel: 'your words' },
];

export const DEFAULT_ILLUSTRATE_MODE = 'color';

// Big, friendly crayons. `check` is the tick colour that reads on top of each.
export const SWATCHES = [
  { name: 'Soft Leaf Green', hex: '#8EE060', check: '#1B2E20' },
  { name: 'Sunny Yellow', hex: '#FFD93D', check: '#1B2E20' },
  { name: 'Warm Peach', hex: '#F7A89A', check: '#1B2E20' },
  { name: 'Forest Green', hex: '#2B6E38', check: '#FFFFFF' },
];

// Brush widths in canvas units (the canvas is 1000 units wide).
export const COLOR_BRUSH_SIZE = 34;
export const DRAW_PEN_SIZE = 12;

// Sentence starters for the "Type words" mode.
export const SENTENCE_STARTERS = ['I see', 'I feel', 'I like'];

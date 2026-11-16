import { Fish, Hammer, HandHeart, ImageIcon, Laugh, Leaf, Sailboat, Sun, Sunset } from 'lucide-react';

// Simple glyph per scene, used for previews until real illustrations exist.
const SCENE_ICONS = {
  sun: Sun,
  leaves: Leaf,
  share: HandHeart,
  laugh: Laugh,
  build: Hammer,
  sail: Sailboat,
  fish: Fish,
  harbor: Sunset,
};

export const getSceneIcon = (sceneId) => SCENE_ICONS[sceneId] ?? ImageIcon;

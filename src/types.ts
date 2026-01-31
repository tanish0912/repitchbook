export type PitchType = "REAL_ESTATE" | "STARTUP" | "SALES";

export type ElementType = 'text-list' | 'image';

export interface BaseElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  w: number;
  h: number; // or auto if 0/undefined
  zIndex: number;
}

export interface TextElement extends BaseElement {
  type: 'text-list';
  html: string; // Rich text HTML content
  content?: string[]; // Deprecated: Legacy bullets
}

export interface ImageElement extends BaseElement {
  type: 'image';
  src: string;
}

export type SlideElement = TextElement | ImageElement;

export type Slide = {
  id: string;
  title: string;
  elements: SlideElement[];
  speakerNotes?: string;
  // Legacy support or fallback
  bullets?: string[];
};

export type Pitch = {
  id: string;
  createdAt: string;
  pitchType: PitchType;
  pitchTitle: string;
  audience: string;
  goal: string;
  location?: string;
  highlights: string[];
  notes?: string;
  slides: Slide[];
};

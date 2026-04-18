export type StimulusUiConfig = {
  minValue: number;
  maxValue: number;
};

export const STIMULI_UI_CONFIG: Record<string, StimulusUiConfig> = {
  ebbinghaus: {
    minValue: 20,
    maxValue: 70,
  },
  dumbbell: {
    minValue: 40,
    maxValue: 150,
  },
  "muller-lyer": {
    minValue: 60,
    maxValue: 170,
  },
  cup: {
    minValue: 40,
    maxValue: 130,
  },
  "perspective-lines": {
    minValue: 30,
    maxValue: 100,
  },
  "square-contrast": {
    minValue: 24,
    maxValue: 90,
  },
  "concentric-circles": {
    minValue: 18,
    maxValue: 70,
  },
  trapezoid: {
    minValue: 30,
    maxValue: 110,
  },
  "circle-context": {
    minValue: 30,
    maxValue: 100,
  },
  corridor: {
    minValue: 16,
    maxValue: 70,
  },
};

export function getStimulusUiLimits(stimulusType: string) {
  return STIMULI_UI_CONFIG[stimulusType] ?? { minValue: 0, maxValue: 500 };
}

export type StimulusConfig = {
  stepNumber: number;
  stimulusType: string;
  stimulusLabel: string;
  adjustablePartLabel: string;
  referenceValue: number;
  stepSize: number;
};

export const STIMULI_CONFIG: StimulusConfig[] = [
  {
    stepNumber: 1,
    stimulusType: "ebbinghaus",
    stimulusLabel: "Иллюзия Эббингауза",
    adjustablePartLabel: "диаметр центрального круга",
    referenceValue: 36,
    stepSize: 2,
  },
  {
    stepNumber: 2,
    stimulusType: "dumbbell",
    stimulusLabel: "Гантели",
    adjustablePartLabel: "длина горизонтальной линии",
    referenceValue: 96,
    stepSize: 2,
  },
  {
    stepNumber: 3,
    stimulusType: "muller-lyer",
    stimulusLabel: "Иллюзия Мюллера-Лайера",
    adjustablePartLabel: "длина центральной линии",
    referenceValue: 110,
    stepSize: 2,
  },
  {
    stepNumber: 4,
    stimulusType: "cup",
    stimulusLabel: "Иллюзия чаши",
    adjustablePartLabel: "ширина нижнего основания",
    referenceValue: 84,
    stepSize: 2,
  },
  {
    stepNumber: 5,
    stimulusType: "perspective-lines",
    stimulusLabel: "Линии в перспективе",
    adjustablePartLabel: "длина верхней линии",
    referenceValue: 58,
    stepSize: 2,
  },
  {
    stepNumber: 6,
    stimulusType: "square-contrast",
    stimulusLabel: "Контраст квадратов",
    adjustablePartLabel: "сторона внутреннего квадрата",
    referenceValue: 56,
    stepSize: 2,
  },
  {
    stepNumber: 7,
    stimulusType: "concentric-circles",
    stimulusLabel: "Концентрические круги",
    adjustablePartLabel: "диаметр внутреннего круга",
    referenceValue: 38,
    stepSize: 2,
  },
  {
    stepNumber: 8,
    stimulusType: "trapezoid",
    stimulusLabel: "Трапеции",
    adjustablePartLabel: "длина верхнего основания",
    referenceValue: 58,
    stepSize: 2,
  },
  {
    stepNumber: 9,
    stimulusType: "circle-context",
    stimulusLabel: "Круг в контексте",
    adjustablePartLabel: "диаметр центрального круга",
    referenceValue: 64,
    stepSize: 2,
  },
  {
    stepNumber: 10,
    stimulusType: "corridor",
    stimulusLabel: "Иллюзия Понцо",
    adjustablePartLabel: "длина вертикальной линии",
    referenceValue: 36,
    stepSize: 2,
  },
];

export function getStimulusByStep(
  stepNumber: number,
): StimulusConfig | undefined {
  return STIMULI_CONFIG.find((item) => item.stepNumber === stepNumber);
}

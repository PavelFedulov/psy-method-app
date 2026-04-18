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
    stepSize: 1,
  },
  {
    stepNumber: 2,
    stimulusType: "dumbbell",
    stimulusLabel: "Гантели",
    adjustablePartLabel: "длина горизонтальной линии",
    referenceValue: 96,
    stepSize: 1,
  },
  {
    stepNumber: 3,
    stimulusType: "muller-lyer",
    stimulusLabel: "Иллюзия Мюллера-Лайера",
    adjustablePartLabel: "длина центральной линии",
    referenceValue: 150,
    stepSize: 1,
  },
  {
    stepNumber: 4,
    stimulusType: "cup",
    stimulusLabel: "Иллюзия чаши",
    adjustablePartLabel: "ширина нижнего основания",
    referenceValue: 96,
    stepSize: 1,
  },
  {
    stepNumber: 5,
    stimulusType: "perspective-lines",
    stimulusLabel: "Линии в перспективе",
    adjustablePartLabel: "длина нижней линии",
    referenceValue: 70,
    stepSize: 1,
  },
  {
    stepNumber: 6,
    stimulusType: "square-contrast",
    stimulusLabel: "Контраст квадратов",
    adjustablePartLabel: "сторона правого внутреннего квадрата",
    referenceValue: 100,
    stepSize: 1,
  },
  {
    stepNumber: 7,
    stimulusType: "concentric-circles",
    stimulusLabel: "Концентрические круги",
    adjustablePartLabel: "диаметр правого внутреннего круга",
    referenceValue: 38,
    stepSize: 1,
  },
  {
    stepNumber: 8,
    stimulusType: "trapezoid",
    stimulusLabel: "Трапеции",
    adjustablePartLabel: "верхнее основание нижней фигуры",
    referenceValue: 70,
    stepSize: 1,
  },
  {
    stepNumber: 9,
    stimulusType: "circle-context",
    stimulusLabel: "Круг в контексте",
    adjustablePartLabel: "диаметр правого круга",
    referenceValue: 64,
    stepSize: 1,
  },
  {
    stepNumber: 10,
    stimulusType: "corridor",
    stimulusLabel: "Иллюзия Понцо",
    adjustablePartLabel: "высота правой вертикальной полосы",
    referenceValue: 36,
    stepSize: 1,
  },
];

export function getStimulusByStep(
  stepNumber: number,
): StimulusConfig | undefined {
  return STIMULI_CONFIG.find((item) => item.stepNumber === stepNumber);
}

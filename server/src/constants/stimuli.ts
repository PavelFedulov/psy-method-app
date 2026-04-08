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
    referenceValue: 60,
    stepSize: 2,
  },
  {
    stepNumber: 2,
    stimulusType: "ponzo",
    stimulusLabel: "Иллюзия Понцо",
    adjustablePartLabel: "длина горизонтальной линии",
    referenceValue: 120,
    stepSize: 4,
  },
  {
    stepNumber: 3,
    stimulusType: "muller-lyer",
    stimulusLabel: "Иллюзия Мюллера-Лайера",
    adjustablePartLabel: "длина основной линии",
    referenceValue: 140,
    stepSize: 4,
  },
  {
    stepNumber: 4,
    stimulusType: "corridor",
    stimulusLabel: "Коридорная иллюзия",
    adjustablePartLabel: "размер переднего круга",
    referenceValue: 70,
    stepSize: 2,
  },
  {
    stepNumber: 5,
    stimulusType: "contrast-squares",
    stimulusLabel: "Контраст квадратов",
    adjustablePartLabel: "сторона внутреннего квадрата",
    referenceValue: 64,
    stepSize: 2,
  },
  {
    stepNumber: 6,
    stimulusType: "boxline",
    stimulusLabel: "Иллюзия Box Line",
    adjustablePartLabel: "длина горизонтального отрезка",
    referenceValue: 130,
    stepSize: 4,
  },
  {
    stepNumber: 7,
    stimulusType: "trapezoids",
    stimulusLabel: "Трапециевидная иллюзия",
    adjustablePartLabel: "длина нижнего основания",
    referenceValue: 110,
    stepSize: 4,
  },
  {
    stepNumber: 8,
    stimulusType: "bullseye",
    stimulusLabel: "Bullseye",
    adjustablePartLabel: "радиус внутреннего круга",
    referenceValue: 34,
    stepSize: 2,
  },
  {
    stepNumber: 9,
    stimulusType: "circle-square",
    stimulusLabel: "Круг и квадрат",
    adjustablePartLabel: "диаметр круга",
    referenceValue: 74,
    stepSize: 2,
  },
  {
    stepNumber: 10,
    stimulusType: "cup",
    stimulusLabel: "Иллюзия чаши",
    adjustablePartLabel: "ширина верхней части",
    referenceValue: 100,
    stepSize: 4,
  },
];

export function getStimulusByStep(
  stepNumber: number,
): StimulusConfig | undefined {
  return STIMULI_CONFIG.find((item) => item.stepNumber === stepNumber);
}

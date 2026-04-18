type Props = {
  referenceValue: number;
  currentValue: number;
};

const STROKE = "#2f2f2f";
const MARK = "#73d216";

export function PerspectiveLinesStimulus({
  referenceValue,
  currentValue,
}: Props) {
  const cx = 180;

  // Геометрия внешней "А"-образной рамки
  const topY = 48;
  const bottomY = 228;

  const leftTopX = 165;
  const rightTopX = 193;
  const leftBottomX = 122;
  const rightBottomX = 238;

  // Позиции горизонталей внутри одной и той же фигуры
  const topLineY = 90;
  const bottomLineY = 190;

  return (
    <svg
      viewBox="0 0 360 280"
      className="h-[260px] w-[320px] md:h-[340px] md:w-[420px]"
    >
      {/* Боковые наклонные линии */}
      <line
        x1={leftTopX}
        y1={topY}
        x2={leftBottomX}
        y2={bottomY}
        stroke={STROKE}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1={rightTopX}
        y1={topY}
        x2={rightBottomX}
        y2={bottomY}
        stroke={STROKE}
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Верхняя эталонная линия */}
      <line
        x1={cx - referenceValue / 2}
        y1={topLineY}
        x2={cx + referenceValue / 2}
        y2={topLineY}
        stroke={STROKE}
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Нижняя регулируемая линия */}
      <line
        x1={cx - currentValue / 2}
        y1={bottomLineY}
        x2={cx + currentValue / 2}
        y2={bottomLineY}
        stroke={STROKE}
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Зеленые метки */}
      <circle cx={cx} cy={topLineY} r="2.5" fill={MARK} />
      <circle cx={cx} cy={bottomLineY} r="2.5" fill={MARK} />
    </svg>
  );
}

type Props = {
  referenceValue: number;
  currentValue: number;
};

const DARK = "#2f2f2f";
const LIGHT = "#f4f4f4";
const WHITE = "#ffffff";
const MARK = "#73d216";
const STROKE = "#2f2f2f";

export function SquareContrastStimulus({
  referenceValue,
  currentValue,
}: Props) {
  const outerX = 40;
  const outerY = 55;
  const outerW = 280;
  const outerH = 130;

  const halfW = outerW / 2;
  const midX = outerX + halfW;
  const cy = outerY + outerH / 2;

  const leftCx = outerX + halfW / 2;
  const rightCx = midX + halfW / 2;

  return (
    <svg
      viewBox="0 0 360 240"
      className="h-[240px] w-[320px] md:h-[300px] md:w-[420px]"
    >
      {/* Внешний общий контейнер */}
      <rect
        x={outerX}
        y={outerY}
        width={outerW}
        height={outerH}
        fill="none"
        stroke={STROKE}
        strokeWidth="2.5"
      />

      {/* Левая темная половина */}
      <rect x={outerX} y={outerY} width={halfW} height={outerH} fill={DARK} />

      {/* Правая светлая половина */}
      <rect x={midX} y={outerY} width={halfW} height={outerH} fill={LIGHT} />

      {/* Левый белый квадрат */}
      <rect
        x={leftCx - referenceValue / 2}
        y={cy - referenceValue / 2}
        width={referenceValue}
        height={referenceValue}
        fill={WHITE}
      />

      {/* Правый темный квадрат */}
      <rect
        x={rightCx - currentValue / 2}
        y={cy - currentValue / 2}
        width={currentValue}
        height={currentValue}
        fill={DARK}
      />

      {/* Зеленые маркеры */}
      <circle cx={leftCx + referenceValue / 2} cy={cy} r="2.5" fill={MARK} />
      <circle cx={rightCx - currentValue / 2} cy={cy} r="2.5" fill={MARK} />
    </svg>
  );
}

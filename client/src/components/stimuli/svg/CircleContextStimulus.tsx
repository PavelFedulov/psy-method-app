type Props = {
  referenceValue: number;
  currentValue: number;
};

const DARK = "#2f2f2f";
const STROKE = "#2f2f2f";
const WHITE = "#ffffff";
const MARK = "#73d216";

export function CircleContextStimulus({ referenceValue, currentValue }: Props) {
  const leftCx = 92;
  const rightCx = 248;
  const cy = 140;

  // Визуально корректный эталонный круг слева:
  // не даем ему схлопнуться из-за слишком большого внутреннего квадрата.
  const visualReferenceDiameter = Math.max(referenceValue, 96);

  // Правый круг должен стартовать равным левому эталону,
  // но дальше меняться на тот же delta, что и currentValue относительно referenceValue.
  const displayedCurrentDiameter =
    visualReferenceDiameter + (currentValue - referenceValue);

  const leftSquareSize = 44;
  const rightOuterSquareSize = 126;

  return (
    <svg
      viewBox="0 0 340 280"
      className="h-[250px] w-[320px] md:h-[320px] md:w-[410px]"
    >
      {/* Левая фигура: эталон */}
      <circle cx={leftCx} cy={cy} r={visualReferenceDiameter / 2} fill={DARK} />

      <rect
        x={leftCx - leftSquareSize / 2}
        y={cy - leftSquareSize / 2}
        width={leftSquareSize}
        height={leftSquareSize}
        fill={WHITE}
      />

      {/* Правая фигура: изменяемый круг */}
      <rect
        x={rightCx - rightOuterSquareSize / 2}
        y={cy - rightOuterSquareSize / 2}
        width={rightOuterSquareSize}
        height={rightOuterSquareSize}
        fill="none"
        stroke={STROKE}
        strokeWidth="2.5"
      />

      <circle
        cx={rightCx}
        cy={cy}
        r={displayedCurrentDiameter / 2}
        fill={DARK}
      />

      {/* Маркеры */}
      <circle
        cx={leftCx + visualReferenceDiameter / 2}
        cy={cy}
        r="2.5"
        fill={MARK}
      />

      <circle
        cx={rightCx - displayedCurrentDiameter / 2}
        cy={cy}
        r="2.5"
        fill={MARK}
      />
    </svg>
  );
}

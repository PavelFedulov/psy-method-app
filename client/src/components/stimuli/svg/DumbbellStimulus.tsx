type Props = {
  referenceValue: number;
  currentValue: number;
};

const STROKE = "#2f2f2f";
const FILL = "#ffffff";
const MARK = "#73d216";

function DumbbellRow({
  y,
  lineLength,
  leftSize,
  rightSize,
}: {
  y: number;
  lineLength: number;
  leftSize: number;
  rightSize: number;
}) {
  const centerX = 180;
  const leftSquareX = centerX - lineLength / 2 - leftSize;
  const rightSquareX = centerX + lineLength / 2;
  const lineStartX = leftSquareX + leftSize;
  const lineEndX = rightSquareX;

  return (
    <g>
      <rect
        x={leftSquareX}
        y={y - leftSize / 2}
        width={leftSize}
        height={leftSize}
        fill={FILL}
        stroke={STROKE}
        strokeWidth="2.5"
      />

      <rect
        x={rightSquareX}
        y={y - rightSize / 2}
        width={rightSize}
        height={rightSize}
        fill={FILL}
        stroke={STROKE}
        strokeWidth="2.5"
      />

      <line
        x1={lineStartX}
        y1={y}
        x2={lineEndX}
        y2={y}
        stroke={STROKE}
        strokeWidth="4"
        strokeLinecap="round"
      />

      <circle cx={(lineStartX + lineEndX) / 2} cy={y} r="2.5" fill={MARK} />
    </g>
  );
}

export function DumbbellStimulus({ referenceValue, currentValue }: Props) {
  return (
    <svg
      viewBox="0 0 360 260"
      className="h-[260px] w-[340px] md:h-[320px] md:w-[420px]"
    >
      <DumbbellRow
        y={95}
        lineLength={referenceValue}
        leftSize={58}
        rightSize={58}
      />

      <DumbbellRow
        y={175}
        lineLength={currentValue}
        leftSize={18}
        rightSize={18}
      />
    </svg>
  );
}

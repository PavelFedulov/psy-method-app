type Props = {
  referenceValue: number;
  currentValue: number;
};

const STROKE = "#2f2f2f";
const MARK = "#73d216";

function ArrowLine({
  y,
  length,
  mode,
}: {
  y: number;
  length: number;
  mode: "out" | "in";
}) {
  const centerX = 180;
  const startX = centerX - length / 2;
  const endX = centerX + length / 2;
  const wing = 14;
  const wingOffsetY = 8;

  const leftDirection = mode === "out" ? -1 : 1;
  const rightDirection = mode === "out" ? 1 : -1;

  return (
    <g>
      <line
        x1={startX}
        y1={y}
        x2={endX}
        y2={y}
        stroke={STROKE}
        strokeWidth="4"
        strokeLinecap="round"
      />

      <line
        x1={startX}
        y1={y}
        x2={startX + leftDirection * wing}
        y2={y - wingOffsetY}
        stroke={STROKE}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1={startX}
        y1={y}
        x2={startX + leftDirection * wing}
        y2={y + wingOffsetY}
        stroke={STROKE}
        strokeWidth="3"
        strokeLinecap="round"
      />

      <line
        x1={endX}
        y1={y}
        x2={endX + rightDirection * wing}
        y2={y - wingOffsetY}
        stroke={STROKE}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1={endX}
        y1={y}
        x2={endX + rightDirection * wing}
        y2={y + wingOffsetY}
        stroke={STROKE}
        strokeWidth="3"
        strokeLinecap="round"
      />

      <circle cx={centerX} cy={y} r="2.5" fill={MARK} />
    </g>
  );
}

export function MullerLyerStimulus({ referenceValue, currentValue }: Props) {
  return (
    <svg
      viewBox="0 0 360 260"
      className="h-[260px] w-[340px] md:h-[320px] md:w-[420px]"
    >
      <ArrowLine y={95} length={referenceValue} mode="out" />
      <ArrowLine y={175} length={currentValue} mode="in" />
    </svg>
  );
}

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
  const centerX = 190;
  const startX = centerX - length / 2;
  const endX = centerX + length / 2;
  const wing = 18;
  const wingOffsetY = 11;

  return (
    <g>
      <line
        x1={startX}
        y1={y}
        x2={endX}
        y2={y}
        stroke={STROKE}
        strokeWidth="2"
        strokeLinecap="round"
      />

      {mode === "out" ? (
        <>
          <line
            x1={startX}
            y1={y}
            x2={startX - wing}
            y2={y - wingOffsetY}
            stroke={STROKE}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1={startX}
            y1={y}
            x2={startX - wing}
            y2={y + wingOffsetY}
            stroke={STROKE}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1={endX}
            y1={y}
            x2={endX + wing}
            y2={y - wingOffsetY}
            stroke={STROKE}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1={endX}
            y1={y}
            x2={endX + wing}
            y2={y + wingOffsetY}
            stroke={STROKE}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </>
      ) : (
        <>
          <line
            x1={startX}
            y1={y}
            x2={startX + wing}
            y2={y - wingOffsetY}
            stroke={STROKE}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1={startX}
            y1={y}
            x2={startX + wing}
            y2={y + wingOffsetY}
            stroke={STROKE}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1={endX}
            y1={y}
            x2={endX - wing}
            y2={y - wingOffsetY}
            stroke={STROKE}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1={endX}
            y1={y}
            x2={endX - wing}
            y2={y + wingOffsetY}
            stroke={STROKE}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </>
      )}

      <circle cx={centerX} cy={y} r="2.5" fill={MARK} />
    </g>
  );
}

export function MullerLyerStimulus({ referenceValue, currentValue }: Props) {
  return (
    <svg
      viewBox="0 0 380 270"
      className="h-[270px] w-[340px] md:h-[330px] md:w-[440px]"
    >
      <ArrowLine y={95} length={referenceValue} mode="out" />
      <ArrowLine y={185} length={currentValue} mode="in" />
    </svg>
  );
}

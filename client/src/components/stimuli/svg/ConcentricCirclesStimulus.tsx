type Props = {
  referenceValue: number;
  currentValue: number;
};

const STROKE = "#2f2f2f";
const DARK = "#2f2f2f";
const MARK = "#73d216";

export function ConcentricCirclesStimulus({
  referenceValue,
  currentValue,
}: Props) {
  const leftCx = 80;
  const rightCx = 270;
  const cy = 140;

  const leftOuterRadius = 64;
  const rightOuterRadius = 25;

  return (
    <svg
      viewBox="0 0 360 280"
      className="h-[260px] w-[320px] md:h-[340px] md:w-[430px]"
    >
      <circle
        cx={leftCx}
        cy={cy}
        r={leftOuterRadius}
        fill="none"
        stroke={STROKE}
        strokeWidth="2.5"
      />
      <circle cx={leftCx} cy={cy} r={referenceValue / 2} fill={DARK} />

      <circle
        cx={rightCx}
        cy={cy}
        r={rightOuterRadius}
        fill="none"
        stroke={STROKE}
        strokeWidth="2.5"
      />
      <circle cx={rightCx} cy={cy} r={currentValue / 2} fill={DARK} />

      <circle cx={leftCx + referenceValue / 2} cy={cy} r="2.5" fill={MARK} />
      <circle cx={rightCx - currentValue / 2} cy={cy} r="2.5" fill={MARK} />
    </svg>
  );
}

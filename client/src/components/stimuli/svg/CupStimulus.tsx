type Props = {
  referenceValue: number;
  currentValue: number;
};

const STROKE = "#2f2f2f";
const MARK = "#73d216";

export function CupStimulus({ referenceValue, currentValue }: Props) {
  const cx = 180;
  const topCy = 78;
  const bottomCy = 208;

  const topOuterWidth = 170;
  const topInnerWidth = referenceValue;
  const flatK = 0.2;

  const topOuterRy = (topOuterWidth * flatK) / 2;
  const topInnerRy = (topInnerWidth * flatK) / 2;
  const bottomRy = (currentValue * flatK) / 2;

  const topOuterRx = topOuterWidth / 2;
  const bottomRx = currentValue / 2;

  const inset = 2;

  const topLeftX = cx - topOuterRx + inset;
  const topRightX = cx + topOuterRx - inset;
  const bottomLeftX = cx - bottomRx + inset;
  const bottomRightX = cx + bottomRx - inset;

  return (
    <svg
      viewBox="0 0 360 300"
      className="h-[260px] w-[320px] md:h-[340px] md:w-[420px]"
    >
      <ellipse
        cx={cx}
        cy={topCy}
        rx={topOuterRx}
        ry={topOuterRy}
        stroke={STROKE}
        strokeWidth="2.5"
        fill="none"
      />

      <ellipse
        cx={cx}
        cy={topCy}
        rx={topInnerWidth / 2}
        ry={topInnerRy}
        stroke={STROKE}
        strokeWidth="2.5"
        fill="none"
      />

      <line
        x1={topLeftX}
        y1={topCy}
        x2={bottomLeftX}
        y2={bottomCy}
        stroke={STROKE}
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      <line
        x1={topRightX}
        y1={topCy}
        x2={bottomRightX}
        y2={bottomCy}
        stroke={STROKE}
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      <ellipse
        cx={cx}
        cy={bottomCy}
        rx={bottomRx}
        ry={bottomRy}
        stroke={STROKE}
        strokeWidth="2.5"
        fill="none"
      />

      <circle cx={cx} cy={topCy + topInnerRy} r="2.5" fill={MARK} />
      <circle cx={cx} cy={bottomCy - bottomRy} r="2.5" fill={MARK} />
    </svg>
  );
}

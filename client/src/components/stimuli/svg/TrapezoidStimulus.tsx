type Props = {
  referenceValue: number;
  currentValue: number;
};

const STROKE = "#2f2f2f";
const MARK = "#73d216";

function polygonPoints(points: Array<[number, number]>) {
  return points.map((point) => point.join(",")).join(" ");
}

export function TrapezoidStimulus({ referenceValue, currentValue }: Props) {
  const cx = 180;

  const topY1 = 78;
  const topHeight = 48;
  const topBottomWidth = 124;

  const topX1 = cx - referenceValue / 2;
  const topX2 = cx + referenceValue / 2;
  const topBottomX1 = cx - topBottomWidth / 2;
  const topBottomX2 = cx + topBottomWidth / 2;

  const bottomY1 = 150;
  const bottomHeight = 44;
  const bottomBottomWidth = Math.max(24, currentValue - 24);

  const bottomTopX1 = cx - currentValue / 2;
  const bottomTopX2 = cx + currentValue / 2;
  const bottomBottomX1 = cx - bottomBottomWidth / 2;
  const bottomBottomX2 = cx + bottomBottomWidth / 2;

  return (
    <svg
      viewBox="0 0 360 260"
      className="h-[260px] w-[320px] md:h-[340px] md:w-[420px]"
    >
      <polygon
        points={polygonPoints([
          [topX1, topY1],
          [topX2, topY1],
          [topBottomX2, topY1 + topHeight],
          [topBottomX1, topY1 + topHeight],
        ])}
        stroke={STROKE}
        strokeWidth="2.5"
        fill="none"
        strokeLinejoin="round"
      />

      <polygon
        points={polygonPoints([
          [bottomTopX1, bottomY1],
          [bottomTopX2, bottomY1],
          [bottomBottomX2, bottomY1 + bottomHeight],
          [bottomBottomX1, bottomY1 + bottomHeight],
        ])}
        stroke={STROKE}
        strokeWidth="2.5"
        fill="none"
        strokeLinejoin="round"
      />

      <circle cx={cx} cy={topY1} r="2.5" fill={MARK} />
      <circle cx={cx} cy={bottomY1} r="2.5" fill={MARK} />
    </svg>
  );
}

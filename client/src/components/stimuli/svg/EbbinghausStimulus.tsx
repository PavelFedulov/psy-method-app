type Props = {
  value: number;
};

const STROKE = "#2f2f2f";
const FILL = "#ffffff";
const DARK_FILL = "#2f2f2f";

export function EbbinghausStimulus({ value }: Props) {
  const centerRadius = value / 2;
  const surroundingRadius = 14;
  const orbitRadius = 48;
  const centerX = 120;
  const centerY = 120;

  const surroundingCircles = Array.from({ length: 8 }, (_, index) => {
    const angle = (Math.PI * 2 * index) / 8;
    return {
      x: centerX + Math.cos(angle) * orbitRadius,
      y: centerY + Math.sin(angle) * orbitRadius,
    };
  });

  return (
    <svg
      viewBox="0 0 240 240"
      className="h-[260px] w-[260px] md:h-[320px] md:w-[320px]"
    >
      {surroundingCircles.map((circle, index) => (
        <circle
          key={index}
          cx={circle.x}
          cy={circle.y}
          r={surroundingRadius}
          fill={FILL}
          stroke={STROKE}
          strokeWidth="2.5"
        />
      ))}

      <circle
        cx={centerX}
        cy={centerY}
        r={centerRadius}
        fill={FILL}
        stroke={STROKE}
        strokeWidth="2.5"
      />

      <circle cx={centerX + centerRadius} cy={centerY} r="2.5" fill="#73d216" />
    </svg>
  );
}

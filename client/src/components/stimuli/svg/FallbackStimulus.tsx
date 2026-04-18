type Props = {
  title: string;
};

export function FallbackStimulus({ title }: Props) {
  return (
    <svg
      viewBox="0 0 320 240"
      className="h-[240px] w-[300px] md:h-[300px] md:w-[380px]"
    >
      <rect
        x="40"
        y="40"
        width="240"
        height="160"
        rx="18"
        fill="#f8fafc"
        stroke="#cbd5e1"
        strokeWidth="2"
        strokeDasharray="8 8"
      />
      <text
        x="160"
        y="110"
        textAnchor="middle"
        fontSize="18"
        fill="#475569"
        fontFamily="Arial, sans-serif"
      >
        {title}
      </text>
      <text
        x="160"
        y="140"
        textAnchor="middle"
        fontSize="14"
        fill="#64748b"
        fontFamily="Arial, sans-serif"
      >
        SVG будет добавлен следующим этапом
      </text>
    </svg>
  );
}

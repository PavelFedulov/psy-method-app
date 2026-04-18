type Props = {
  referenceValue: number;
  currentValue: number;
};

const STROKE = "#2f2f2f";
const MARK = "#73d216";

export function CorridorStimulus({ referenceValue, currentValue }: Props) {
  // Компактная сцена, ближе к твоему эталону
  const leftBlockX = 88;
  const leftBlockY = 62;
  const leftBlockW = 72;
  const leftBlockH = 118;

  const leftBarX = leftBlockX + leftBlockW;
  const leftBarCenterY = leftBlockY + leftBlockH / 2;

  const rightBarX = 228;
  const rightBarCenterY = 121;

  const rightBlockX = rightBarX + 2;
  const rightBlockY = 100;
  const rightBlockW = 34;
  const rightBlockH = 42;

  // Линии перспективы
  const tunnelTopY = rightBlockY;
  const tunnelBottomY = rightBlockY + rightBlockH;
  const tunnelUpperInnerY = rightBlockY + rightBlockH / 3;
  const tunnelLowerInnerY = rightBlockY + (2 * rightBlockH) / 3;

  const leftTopY = leftBlockY;
  const leftBottomY = leftBlockY + leftBlockH;
  const leftUpperInnerY = leftBlockY + leftBlockH / 3;
  const leftLowerInnerY = leftBlockY + (2 * leftBlockH) / 3;

  return (
    <svg
      viewBox="0 0 340 240"
      className="h-[250px] w-[320px] md:h-[320px] md:w-[420px]"
    >
      {/* Левый блок */}
      <rect
        x={leftBlockX}
        y={leftBlockY}
        width={leftBlockW}
        height={leftBlockH}
        fill="none"
        stroke={STROKE}
        strokeWidth="1"
      />

      <line
        x1={leftBlockX}
        y1={leftUpperInnerY}
        x2={leftBarX}
        y2={leftUpperInnerY}
        stroke={STROKE}
        strokeWidth="1"
      />
      <line
        x1={leftBlockX}
        y1={leftLowerInnerY}
        x2={leftBarX}
        y2={leftLowerInnerY}
        stroke={STROKE}
        strokeWidth="1"
      />

      {/* Правый маленький блок */}
      <rect
        x={rightBlockX}
        y={rightBlockY}
        width={rightBlockW}
        height={rightBlockH}
        fill="none"
        stroke={STROKE}
        strokeWidth="1"
      />

      <line
        x1={rightBlockX}
        y1={rightBlockY + rightBlockH / 3}
        x2={rightBlockX + rightBlockW}
        y2={rightBlockY + rightBlockH / 3}
        stroke={STROKE}
        strokeWidth="1"
      />
      <line
        x1={rightBlockX}
        y1={rightBlockY + (2 * rightBlockH) / 3}
        x2={rightBlockX + rightBlockW}
        y2={rightBlockY + (2 * rightBlockH) / 3}
        stroke={STROKE}
        strokeWidth="1"
      />

      {/* Внешние линии тоннеля */}
      <line
        x1={leftBarX}
        y1={leftTopY}
        x2={rightBarX}
        y2={tunnelTopY}
        stroke={STROKE}
        strokeWidth="1"
      />
      <line
        x1={leftBarX}
        y1={leftBottomY}
        x2={rightBarX}
        y2={tunnelBottomY}
        stroke={STROKE}
        strokeWidth="1"
      />

      {/* Внутренние линии тоннеля */}
      <line
        x1={leftBarX}
        y1={leftUpperInnerY}
        x2={rightBarX}
        y2={tunnelUpperInnerY}
        stroke={STROKE}
        strokeWidth="1"
      />
      <line
        x1={leftBarX}
        y1={leftLowerInnerY}
        x2={rightBarX}
        y2={tunnelLowerInnerY}
        stroke={STROKE}
        strokeWidth="1"
      />

      {/* Левая эталонная вертикаль */}
      <line
        x1={leftBarX}
        y1={leftBarCenterY - referenceValue / 2}
        x2={leftBarX}
        y2={leftBarCenterY + referenceValue / 2}
        stroke={STROKE}
        strokeWidth="3"
        strokeLinecap="square"
      />

      {/* Правая изменяемая вертикаль */}
      <line
        x1={rightBarX}
        y1={rightBarCenterY - currentValue / 2}
        x2={rightBarX}
        y2={rightBarCenterY + currentValue / 2}
        stroke={STROKE}
        strokeWidth="3"
        strokeLinecap="square"
      />

      {/* Зеленые маркеры */}
      <circle cx={leftBarX + 8} cy={leftBarCenterY} r="2.5" fill={MARK} />
      <circle cx={rightBarX - 8} cy={rightBarCenterY} r="2.5" fill={MARK} />
    </svg>
  );
}

export function getPublicErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Произошла ошибка";
}

export function clampValue(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function formatStepLabel(
  stepNumber: number,
  totalSteps: number,
): string {
  return `Шаг ${stepNumber} из ${totalSteps}`;
}

import { StimulusStage } from "./shared/StimulusStage";
import { EbbinghausStimulus } from "./svg/EbbinghausStimulus";
import { DumbbellStimulus } from "./svg/DumbbellStimulus";
import { MullerLyerStimulus } from "./svg/MullerLyerStimulus";
import { CupStimulus } from "./svg/CupStimulus";
import { PerspectiveLinesStimulus } from "./svg/PerspectiveLinesStimulus";
import { TrapezoidStimulus } from "./svg/TrapezoidStimulus";
import { CorridorStimulus } from "./svg/CorridorStimulus";
import { SquareContrastStimulus } from "./svg/SquareContrastStimulus";
import { ConcentricCirclesStimulus } from "./svg/ConcentricCirclesStimulus";
import { CircleContextStimulus } from "./svg/CircleContextStimulus";
import { FallbackStimulus } from "./svg/FallbackStimulus";

type Props = {
  stimulusType: string;
  stimulusLabel: string;
  referenceValue: number;
  currentValue: number;
};

export function StimulusRenderer({
  stimulusType,
  stimulusLabel,
  referenceValue,
  currentValue,
}: Props) {
  if (stimulusType === "ebbinghaus") {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <StimulusStage label="Эталон">
          <EbbinghausStimulus value={referenceValue} />
        </StimulusStage>

        <StimulusStage label="Регулируемая фигура">
          <EbbinghausStimulus value={currentValue} />
        </StimulusStage>
      </div>
    );
  }

  if (stimulusType === "dumbbell") {
    return (
      <div className="mx-auto max-w-4xl">
        <StimulusStage label="Стимулы">
          <DumbbellStimulus
            referenceValue={referenceValue}
            currentValue={currentValue}
          />
        </StimulusStage>
      </div>
    );
  }

  if (stimulusType === "muller-lyer") {
    return (
      <div className="mx-auto max-w-4xl">
        <StimulusStage label="Стимулы">
          <MullerLyerStimulus
            referenceValue={referenceValue}
            currentValue={currentValue}
          />
        </StimulusStage>
      </div>
    );
  }

  if (stimulusType === "cup") {
    return (
      <div className="mx-auto max-w-4xl">
        <StimulusStage label="Стимулы">
          <CupStimulus
            referenceValue={referenceValue}
            currentValue={currentValue}
          />
        </StimulusStage>
      </div>
    );
  }

  if (stimulusType === "perspective-lines") {
    return (
      <div className="mx-auto max-w-4xl">
        <StimulusStage label="Стимулы">
          <PerspectiveLinesStimulus
            referenceValue={referenceValue}
            currentValue={currentValue}
          />
        </StimulusStage>
      </div>
    );
  }

  if (stimulusType === "trapezoid") {
    return (
      <div className="mx-auto max-w-4xl">
        <StimulusStage label="Стимулы">
          <TrapezoidStimulus
            referenceValue={referenceValue}
            currentValue={currentValue}
          />
        </StimulusStage>
      </div>
    );
  }

  if (stimulusType === "corridor") {
    return (
      <div className="mx-auto max-w-4xl">
        <StimulusStage label="Стимулы">
          <CorridorStimulus
            referenceValue={referenceValue}
            currentValue={currentValue}
          />
        </StimulusStage>
      </div>
    );
  }

  if (stimulusType === "square-contrast") {
    return (
      <div className="mx-auto max-w-4xl">
        <StimulusStage label="Стимулы">
          <SquareContrastStimulus
            referenceValue={referenceValue}
            currentValue={currentValue}
          />
        </StimulusStage>
      </div>
    );
  }

  if (stimulusType === "concentric-circles") {
    return (
      <div className="mx-auto max-w-4xl">
        <StimulusStage label="Стимулы">
          <ConcentricCirclesStimulus
            referenceValue={referenceValue}
            currentValue={currentValue}
          />
        </StimulusStage>
      </div>
    );
  }

  if (stimulusType === "circle-context") {
    return (
      <div className="mx-auto max-w-4xl">
        <StimulusStage label="Стимулы">
          <CircleContextStimulus
            referenceValue={referenceValue}
            currentValue={currentValue}
          />
        </StimulusStage>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <StimulusStage label="Эталон">
        <FallbackStimulus title={stimulusLabel} />
      </StimulusStage>

      <StimulusStage label="Регулируемая фигура">
        <FallbackStimulus title={stimulusLabel} />
      </StimulusStage>
    </div>
  );
}

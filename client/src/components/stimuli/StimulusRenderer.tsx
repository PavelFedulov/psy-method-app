import { StimulusStage } from "./shared/StimulusStage";
import { EbbinghausStimulus } from "./svg/EbbinghausStimulus";
import { DumbbellStimulus } from "./svg/DumbbellStimulus";
import { MullerLyerStimulus } from "./svg/MullerLyerStimulus";
import { FallbackStimulus } from "./svg/FallbackStimulus";

type Props = {
  stimulusType: string;
  stimulusLabel: string;
  referenceValue: number;
  currentValue: number;
};

function isSingleStageStimulus(stimulusType: string) {
  return stimulusType === "dumbbell" || stimulusType === "muller-lyer";
}

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

  if (isSingleStageStimulus(stimulusType)) {
    return (
      <div className="mx-auto max-w-4xl">
        <StimulusStage label="Стимулы">
          <FallbackStimulus title={stimulusLabel} />
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

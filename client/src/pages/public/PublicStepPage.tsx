import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getPublicProgress,
  getPublicStep,
  submitPublicStep,
} from "../../api/public";
import { StimulusRenderer } from "../../components/stimuli/StimulusRenderer";
import { Card } from "../../components/ui/Card";
import { Loader } from "../../components/ui/Loader";
import { getStimulusUiLimits } from "../../config/stimuli-ui.config";
import { StepControls } from "../../features/public-flow/StepControls";
import {
  clampValue,
  formatStepLabel,
  getPublicErrorMessage,
} from "../../features/public-flow/public-flow.utils";
import type { PublicStepResponse } from "../../features/public-flow/public-flow.types";
import { PublicStatePage } from "./PublicStatePage";

export function PublicStepPage() {
  const { token = "", stepNumber = "" } = useParams();
  const navigate = useNavigate();

  const numericStepNumber = Number(stepNumber);

  const [stepData, setStepData] = useState<PublicStepResponse | null>(null);
  const [currentValue, setCurrentValue] = useState(0);
  const [clicksMore, setClicksMore] = useState(0);
  const [clicksLess, setClicksLess] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pageError, setPageError] = useState("");

  const startedAtRef = useRef<number>(Date.now());

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setIsLoading(true);
        setPageError("");

        const progress = await getPublicProgress(token);

        if (progress.state === "not_found") {
          navigate(`/r/${token}`, { replace: true });
          return;
        }

        if (progress.state === "revoked") {
          navigate(`/r/${token}`, { replace: true });
          return;
        }

        if (progress.state === "completed") {
          navigate(`/r/${token}/completed`, { replace: true });
          return;
        }

        if (progress.state === "not_started") {
          navigate(`/r/${token}`, { replace: true });
          return;
        }

        if (progress.session.currentStep !== numericStepNumber) {
          navigate(`/r/${token}/steps/${progress.session.currentStep}`, {
            replace: true,
          });
          return;
        }

        const result = await getPublicStep(token, numericStepNumber);

        if (!cancelled) {
          setStepData(result);
          setCurrentValue(result.stimulus.referenceValue);
          setClicksMore(0);
          setClicksLess(0);
          startedAtRef.current = Date.now();
        }
      } catch (error) {
        if (!cancelled) {
          setPageError(getPublicErrorMessage(error));
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [navigate, numericStepNumber, token]);

  const stepLabel = useMemo(() => {
    if (!stepData) {
      return "";
    }

    return formatStepLabel(stepData.stepNumber, stepData.totalSteps);
  }, [stepData]);

  function handleIncrease() {
    if (!stepData) {
      return;
    }

    const { maxValue } = getStimulusUiLimits(stepData.stimulus.stimulusType);

    setCurrentValue((prev) =>
      clampValue(prev + stepData.stimulus.stepSize, 0, maxValue),
    );
    setClicksMore((prev) => prev + 1);
  }

  function handleDecrease() {
    if (!stepData) {
      return;
    }

    const { minValue } = getStimulusUiLimits(stepData.stimulus.stimulusType);

    setCurrentValue((prev) =>
      clampValue(prev - stepData.stimulus.stepSize, minValue, 1000),
    );
    setClicksLess((prev) => prev + 1);
  }

  async function handleSubmit() {
    if (!stepData) {
      return;
    }

    try {
      setIsSubmitting(true);
      setPageError("");

      const elapsedSeconds = Math.max(
        0,
        Math.round((Date.now() - startedAtRef.current) / 1000),
      );

      const result = await submitPublicStep(token, numericStepNumber, {
        finalValue: currentValue,
        clicksMore,
        clicksLess,
        timeSpentSeconds: elapsedSeconds,
      });

      if (result.completed) {
        navigate(`/r/${token}/completed`, { replace: true });
        return;
      }

      if (result.nextStep) {
        navigate(`/r/${token}/steps/${result.nextStep}`, { replace: true });
      }
    } catch (error) {
      setPageError(getPublicErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <Loader />
      </div>
    );
  }

  if (pageError && !stepData) {
    return <PublicStatePage title="Ошибка" description={pageError} />;
  }

  if (!stepData) {
    return (
      <PublicStatePage title="Ошибка" description="Не удалось загрузить шаг." />
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 text-center">
        <p className="text-sm font-medium text-slate-500">{stepLabel}</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">
          {stepData.stimulus.stimulusLabel}
        </h1>

        <div className="mx-auto mt-4 max-w-2xl rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
          <p className="font-medium text-slate-900">Измените:</p>
          <p className="mt-1">
            • <strong>{stepData.stimulus.adjustablePartLabel}</strong>
          </p>
        </div>
      </div>

      <Card>
        <div className="space-y-8">
          <div className="mx-auto max-w-5xl">
            <StimulusRenderer
              stimulusType={stepData.stimulus.stimulusType}
              stimulusLabel={stepData.stimulus.stimulusLabel}
              referenceValue={stepData.stimulus.referenceValue}
              currentValue={currentValue}
            />
          </div>

          <StepControls
            onIncrease={handleIncrease}
            onDecrease={handleDecrease}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />

          {pageError ? (
            <div className="text-center text-sm text-red-600">{pageError}</div>
          ) : null}
        </div>
      </Card>
    </div>
  );
}

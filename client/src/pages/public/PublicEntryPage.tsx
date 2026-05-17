import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPublicLinkState, startPublicSession } from "../../api/public";
import { Loader } from "../../components/ui/Loader";
import { StartSessionForm } from "../../features/public-flow/StartSessionForm";
import { getPublicErrorMessage } from "../../features/public-flow/public-flow.utils";
import type { PublicLinkStateResponse } from "../../features/public-flow/public-flow.types";
import { PublicCompletedPage } from "./PublicCompletedPage";
import { PublicStatePage } from "./PublicStatePage";

export function PublicEntryPage() {
  const { token = "" } = useParams();
  const navigate = useNavigate();

  const [linkState, setLinkState] = useState<PublicLinkStateResponse | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const result = await getPublicLinkState(token);

        if (!cancelled) {
          setLinkState(result);

          if (result.state === "in_progress") {
            navigate(`/r/${token}/steps/${result.session.currentStep}`, {
              replace: true,
            });
          }

          if (result.state === "completed") {
            navigate(`/r/${token}/completed`, { replace: true });
          }
        }
      } catch (error) {
        if (!cancelled) {
          setFormError(getPublicErrorMessage(error));
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
  }, [navigate, token]);

  async function handleStart(payload: {
    participantCode: string;
    age: number;
    gender: "male" | "female";
    consentAccepted: boolean;
  }) {
    try {
      setFormError("");
      setIsSubmitting(true);

      const result = await startPublicSession(token, payload);
      navigate(`/r/${token}/steps/${result.currentStep}`, { replace: true });
    } catch (error) {
      setFormError(getPublicErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <Loader />
      </div>
    );
  }

  if (linkState?.state === "not_found") {
    return (
      <PublicStatePage
        title="Ссылка не найдена"
        description="Проверьте корректность ссылки или обратитесь к исследователю."
      />
    );
  }

  if (linkState?.state === "revoked") {
    return (
      <PublicStatePage
        title="Ссылка недействительна"
        description="Эта ссылка была отозвана исследователем и больше не может быть использована."
      />
    );
  }

  if (linkState?.state === "completed") {
    return <PublicCompletedPage />;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <StartSessionForm
        isSubmitting={isSubmitting}
        error={formError}
        onSubmit={handleStart}
      />
    </div>
  );
}

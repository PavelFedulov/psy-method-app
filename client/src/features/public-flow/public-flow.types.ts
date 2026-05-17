export type PublicLinkStateResponse =
  | { state: "ready" }
  | {
      state: "in_progress";
      session: {
        id: number;
        participantCode: string;
        currentStep: number;
        status: string;
      };
    }
  | {
      state: "completed";
      session: {
        id: number;
        participantCode: string;
        currentStep: number;
        status: string;
        completedAt: string | null;
      } | null;
    }
  | { state: "revoked" }
  | { state: "not_found" };

export type StartPublicSessionRequest = {
  participantCode: string;
  age: number;
  gender: "male" | "female";
  consentAccepted: boolean;
};

export type StartPublicSessionResponse = {
  sessionId: number;
  participantCode: string;
  currentStep: number;
  status: string;
  resumed: boolean;
};

export type PublicProgressResponse =
  | { state: "not_found" }
  | { state: "revoked" }
  | { state: "not_started" }
  | {
      state: "in_progress";
      session: {
        id: number;
        participantCode: string;
        currentStep: number;
        status: string;
      };
    }
  | {
      state: "completed";
      session: {
        id: number;
        participantCode: string;
        currentStep: number;
        status: string;
        completedAt: string | null;
      };
    };

export type PublicStepResponse = {
  stepNumber: number;
  totalSteps: number;
  participantCode: string;
  stimulus: {
    stepNumber: number;
    stimulusType: string;
    stimulusLabel: string;
    adjustablePartLabel: string;
    referenceValue: number;
    stepSize: number;
  };
};

export type SubmitPublicStepRequest = {
  finalValue: number;
  clicksMore: number;
  clicksLess: number;
  timeSpentSeconds: number;
};

export type SubmitPublicStepResponse = {
  savedStepNumber: number;
  completed: boolean;
  nextStep: number | null;
};

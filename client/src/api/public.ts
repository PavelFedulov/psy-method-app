import { http } from "./http";
import type {
  PublicLinkStateResponse,
  PublicProgressResponse,
  PublicStepResponse,
  StartPublicSessionRequest,
  StartPublicSessionResponse,
  SubmitPublicStepRequest,
  SubmitPublicStepResponse,
} from "../features/public-flow/public-flow.types";

export function getPublicLinkState(token: string) {
  return http<PublicLinkStateResponse>(`/api/public/links/${token}`);
}

export function startPublicSession(
  token: string,
  payload: StartPublicSessionRequest,
) {
  return http<StartPublicSessionResponse>(`/api/public/links/${token}/start`, {
    method: "POST",
    json: payload,
  });
}

export function getPublicProgress(token: string) {
  return http<PublicProgressResponse>(`/api/public/links/${token}/progress`);
}

export function getPublicStep(token: string, stepNumber: number) {
  return http<PublicStepResponse>(
    `/api/public/links/${token}/steps/${stepNumber}`,
  );
}

export function submitPublicStep(
  token: string,
  stepNumber: number,
  payload: SubmitPublicStepRequest,
) {
  return http<SubmitPublicStepResponse>(
    `/api/public/links/${token}/steps/${stepNumber}`,
    {
      method: "POST",
      json: payload,
    },
  );
}

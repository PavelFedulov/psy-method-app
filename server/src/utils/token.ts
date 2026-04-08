import crypto from "crypto";

export function generateParticipantToken(): string {
  return crypto.randomBytes(24).toString("hex");
}

import { Router } from "express";
import { resolveAdminByParticipantToken } from "../../services/public/public-link-resolver.service";
import {
  getPublicLinkState,
  getPublicSessionProgress,
  getPublicStep,
  startPublicSession,
  submitPublicStep,
} from "./public.service";

const router = Router();

router.get("/links/:token", async (req, res, next) => {
  try {
    const resolved = await resolveAdminByParticipantToken(req.params.token);

    if (!resolved) {
      return res.status(404).json({
        state: "not_found",
      });
    }

    const result = await getPublicLinkState(req.params.token);
    return res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post("/links/:token/start", async (req, res, next) => {
  try {
    const resolved = await resolveAdminByParticipantToken(req.params.token);

    if (!resolved) {
      return res.status(404).json({
        error: "Ссылка не найдена",
      });
    }

    const result = await startPublicSession(req.params.token, req.body);
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/links/:token/progress", async (req, res, next) => {
  try {
    const resolved = await resolveAdminByParticipantToken(req.params.token);

    if (!resolved) {
      return res.status(404).json({
        state: "not_found",
      });
    }

    const result = await getPublicSessionProgress(req.params.token);
    return res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/links/:token/steps/:stepNumber", async (req, res, next) => {
  try {
    const resolved = await resolveAdminByParticipantToken(req.params.token);

    if (!resolved) {
      return res.status(404).json({
        error: "Ссылка не найдена",
      });
    }

    const stepNumber = Number(req.params.stepNumber);
    const result = await getPublicStep(req.params.token, stepNumber);

    return res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post("/links/:token/steps/:stepNumber", async (req, res, next) => {
  try {
    const resolved = await resolveAdminByParticipantToken(req.params.token);

    if (!resolved) {
      return res.status(404).json({
        error: "Ссылка не найдена",
      });
    }

    const stepNumber = Number(req.params.stepNumber);
    const result = await submitPublicStep(
      req.params.token,
      stepNumber,
      req.body,
    );

    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

export default router;

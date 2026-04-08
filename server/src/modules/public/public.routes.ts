import { Router } from "express";
import { resolveAdminDbByParticipantToken } from "../../services/public/public-link-resolver.service";
import {
  getPublicLinkState,
  getPublicSessionProgress,
  getPublicStep,
  startPublicSession,
  submitPublicStep,
} from "./public.service";

const router = Router();

router.get("/links/:token", (req, res, next) => {
  const resolved = resolveAdminDbByParticipantToken(req.params.token);

  if (!resolved) {
    return res.status(404).json({
      state: "not_found",
    });
  }

  try {
    const result = getPublicLinkState(resolved.db, req.params.token);
    return res.json(result);
  } catch (error) {
    next(error);
  } finally {
    resolved.db.close();
  }
});

router.post("/links/:token/start", (req, res, next) => {
  const resolved = resolveAdminDbByParticipantToken(req.params.token);

  if (!resolved) {
    return res.status(404).json({
      error: "Ссылка не найдена",
    });
  }

  try {
    const result = startPublicSession(resolved.db, req.params.token, req.body);
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  } finally {
    resolved.db.close();
  }
});

router.get("/links/:token/progress", (req, res, next) => {
  const resolved = resolveAdminDbByParticipantToken(req.params.token);

  if (!resolved) {
    return res.status(404).json({
      state: "not_found",
    });
  }

  try {
    const result = getPublicSessionProgress(resolved.db, req.params.token);
    return res.json(result);
  } catch (error) {
    next(error);
  } finally {
    resolved.db.close();
  }
});

router.get("/links/:token/steps/:stepNumber", (req, res, next) => {
  const resolved = resolveAdminDbByParticipantToken(req.params.token);

  if (!resolved) {
    return res.status(404).json({
      error: "Ссылка не найдена",
    });
  }

  try {
    const stepNumber = Number(req.params.stepNumber);
    const result = getPublicStep(resolved.db, req.params.token, stepNumber);

    return res.json(result);
  } catch (error) {
    next(error);
  } finally {
    resolved.db.close();
  }
});

router.post("/links/:token/steps/:stepNumber", (req, res, next) => {
  const resolved = resolveAdminDbByParticipantToken(req.params.token);

  if (!resolved) {
    return res.status(404).json({
      error: "Ссылка не найдена",
    });
  }

  try {
    const stepNumber = Number(req.params.stepNumber);
    const result = submitPublicStep(
      resolved.db,
      req.params.token,
      stepNumber,
      req.body,
    );

    return res.status(201).json(result);
  } catch (error) {
    next(error);
  } finally {
    resolved.db.close();
  }
});

export default router;

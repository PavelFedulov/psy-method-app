import { Router } from "express";

const router = Router();

router.get("/links/:token", (req, res) => {
  res.json({
    message: "Public link check endpoint",
    token: req.params.token,
  });
});

router.post("/links/:token/start", (req, res) => {
  res.json({
    message: "Public session start endpoint",
    token: req.params.token,
    body: req.body,
  });
});

router.get("/links/:token/progress", (req, res) => {
  res.json({
    message: "Public progress endpoint",
    token: req.params.token,
  });
});

router.get("/links/:token/steps/:stepNumber", (req, res) => {
  res.json({
    message: "Public get step endpoint",
    token: req.params.token,
    stepNumber: req.params.stepNumber,
  });
});

router.post("/links/:token/steps/:stepNumber", (req, res) => {
  res.json({
    message: "Public submit step endpoint",
    token: req.params.token,
    stepNumber: req.params.stepNumber,
    body: req.body,
  });
});

export default router;

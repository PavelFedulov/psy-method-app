import { Router } from "express";
import { requireSuperAdminAuth } from "../../middlewares/require-super-admin-auth";

const router = Router();

router.post("/auth/login", (_req, res) => {
  res.cookie("superAdminId", "demo-super-admin", {
    httpOnly: true,
    sameSite: "lax",
  });

  res.json({
    ok: true,
    role: "super-admin",
  });
});

router.post("/auth/logout", (_req, res) => {
  res.clearCookie("superAdminId");
  res.json({ ok: true });
});

router.get("/auth/me", (req, res) => {
  res.json({
    authenticated: Boolean(req.cookies.superAdminId),
    superAdminId: req.cookies.superAdminId ?? null,
  });
});

router.use("/admins", requireSuperAdminAuth);

router.post("/admins", (_req, res) => {
  res.json({ message: "Create admin endpoint" });
});

router.get("/admins", (_req, res) => {
  res.json({ message: "List admins endpoint" });
});

router.patch("/admins/:id", (req, res) => {
  res.json({
    message: "Update admin endpoint",
    id: req.params.id,
  });
});

router.delete("/admins/:id", (req, res) => {
  res.json({
    message: "Delete admin endpoint",
    id: req.params.id,
  });
});

export default router;

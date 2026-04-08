import { Router } from "express";

const router = Router();

router.post("/login", (_req, res) => {
  res.cookie("adminId", "demo-admin", {
    httpOnly: true,
    sameSite: "lax",
  });

  res.json({
    ok: true,
    role: "admin",
  });
});

router.post("/logout", (_req, res) => {
  res.clearCookie("adminId");
  res.json({ ok: true });
});

router.get("/me", (req, res) => {
  res.json({
    authenticated: Boolean(req.cookies.adminId),
    adminId: req.cookies.adminId ?? null,
  });
});

export default router;

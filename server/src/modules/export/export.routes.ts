import { Router } from "express";
import { requireAdminAuth } from "../../middlewares/require-admin-auth";

const router = Router();

router.use(requireAdminAuth);

router.post("/csv", (_req, res) => {
  res.json({ message: "Export CSV endpoint" });
});

router.post("/xlsx", (_req, res) => {
  res.json({ message: "Export XLSX endpoint" });
});

export default router;

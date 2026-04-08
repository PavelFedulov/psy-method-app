import { Router } from "express";
import { requireAdminAuth } from "../../middlewares/require-admin-auth";

const router = Router();

router.use(requireAdminAuth);

router.post("/", (_req, res) => {
  res.json({ message: "Create admin link endpoint" });
});

router.get("/", (_req, res) => {
  res.json({ message: "List admin links endpoint" });
});

router.delete("/:id", (req, res) => {
  res.json({
    message: "Delete admin link endpoint",
    id: req.params.id,
  });
});

router.post("/:id/revoke", (req, res) => {
  res.json({
    message: "Revoke admin link endpoint",
    id: req.params.id,
  });
});

export default router;

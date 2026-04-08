import { Router } from "express";
import { requireAdminAuth } from "../../middlewares/require-admin-auth";

const router = Router();

router.use(requireAdminAuth);

router.get("/", (_req, res) => {
  res.json({ message: "List admin sessions endpoint" });
});

router.get("/:id", (req, res) => {
  res.json({
    message: "Get admin session detail endpoint",
    id: req.params.id,
  });
});

router.delete("/:id", (req, res) => {
  res.json({
    message: "Delete session endpoint",
    id: req.params.id,
  });
});

router.post("/bulk-delete", (req, res) => {
  res.json({
    message: "Bulk delete sessions endpoint",
    body: req.body,
  });
});

export default router;

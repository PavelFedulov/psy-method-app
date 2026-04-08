import { Router } from "express";
import { requireAdminAuth } from "../../middlewares/require-admin-auth";

const router = Router();

router.use(requireAdminAuth);

router.get("/", (req, res) => {
  res.json({
    ok: true,
    admin: req.admin,
    message: "Admin protected route works",
  });
});

export default router;

import { Router } from "express";
import { requireAdminAuth } from "../../middlewares/require-admin-auth";
import {
  bulkDeleteAdminSessions,
  deleteAdminSession,
  getAdminSessionDetail,
  getAdminSessionsList,
} from "./admin-sessions.service";

const router = Router();

router.use(requireAdminAuth);

router.get("/", async (req, res, next) => {
  try {
    if (!req.admin) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const sessions = await getAdminSessionsList(req.admin.id);
    return res.json({ sessions });
  } catch (error) {
    next(error);
  }
});

router.post("/bulk-delete", async (req, res, next) => {
  try {
    if (!req.admin) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { sessionIds } = req.body as { sessionIds: number[] };
    const result = await bulkDeleteAdminSessions(req.admin.id, sessionIds);

    return res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    if (!req.admin) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const sessionId = Number(req.params.id);
    const result = await getAdminSessionDetail(req.admin.id, sessionId);

    return res.json(result);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    if (!req.admin) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const sessionId = Number(req.params.id);
    const result = await deleteAdminSession(req.admin.id, sessionId);

    return res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;

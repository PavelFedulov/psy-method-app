import { Router } from "express";
import { requireAdminAuth } from "../../middlewares/require-admin-auth";
import { attachAdminDb } from "../../middlewares/attach-admin-db";
import {
  bulkDeleteAdminSessions,
  deleteAdminSession,
  getAdminSessionDetail,
  getAdminSessionsList,
} from "./admin-sessions.service";

const router = Router();

router.use(requireAdminAuth);
router.use(attachAdminDb);

router.get("/", (req, res, next) => {
  try {
    if (!req.adminDb) {
      return res.status(500).json({ error: "Admin DB not attached" });
    }

    const sessions = getAdminSessionsList(req.adminDb);
    return res.json({ sessions });
  } catch (error) {
    next(error);
  }
});

router.post("/bulk-delete", (req, res, next) => {
  try {
    if (!req.adminDb) {
      return res.status(500).json({ error: "Admin DB not attached" });
    }

    const { sessionIds } = req.body as { sessionIds: number[] };
    const result = bulkDeleteAdminSessions(req.adminDb, sessionIds);

    return res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", (req, res, next) => {
  try {
    if (!req.adminDb) {
      return res.status(500).json({ error: "Admin DB not attached" });
    }

    const sessionId = Number(req.params.id);
    const result = getAdminSessionDetail(req.adminDb, sessionId);

    return res.json(result);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", (req, res, next) => {
  try {
    if (!req.adminDb) {
      return res.status(500).json({ error: "Admin DB not attached" });
    }

    const sessionId = Number(req.params.id);
    const result = deleteAdminSession(req.adminDb, sessionId);

    return res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;

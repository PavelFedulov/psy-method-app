import { Router } from "express";
import { requireAdminAuth } from "../../middlewares/require-admin-auth";
import { attachAdminDb } from "../../middlewares/attach-admin-db";
import {
  createParticipantLink,
  deleteUnusedParticipantLink,
  getParticipantLinks,
  revokeParticipantLink,
} from "./admin-links.service";

const router = Router();

router.use(requireAdminAuth);
router.use(attachAdminDb);

router.post("/", (req, res, next) => {
  try {
    if (!req.adminDb || !req.admin) {
      return res.status(500).json({ error: "Admin DB not attached" });
    }

    const link = createParticipantLink({
      db: req.adminDb,
      adminId: req.admin.id,
      dbFileName: req.admin.dbFileName,
    });

    return res.status(201).json({ link });
  } catch (error) {
    next(error);
  }
});

router.get("/", (req, res, next) => {
  try {
    if (!req.adminDb) {
      return res.status(500).json({ error: "Admin DB not attached" });
    }

    const links = getParticipantLinks(req.adminDb);

    return res.json({ links });
  } catch (error) {
    next(error);
  }
});

router.post("/:id/revoke", (req, res, next) => {
  try {
    if (!req.adminDb) {
      return res.status(500).json({ error: "Admin DB not attached" });
    }

    const linkId = Number(req.params.id);
    const result = revokeParticipantLink(req.adminDb, linkId);

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

    const linkId = Number(req.params.id);
    const result = deleteUnusedParticipantLink(req.adminDb, linkId);

    return res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;

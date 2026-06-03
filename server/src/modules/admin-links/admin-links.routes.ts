import { Router } from "express";
import { requireAdminAuth } from "../../middlewares/require-admin-auth";
import {
  createParticipantLink,
  deleteUnusedParticipantLink,
  getParticipantLinks,
  revokeParticipantLink,
} from "./admin-links.service";

const router = Router();

router.use(requireAdminAuth);

router.post("/", async (req, res, next) => {
  try {
    if (!req.admin) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const link = await createParticipantLink({
      adminId: req.admin.id,
    });

    return res.status(201).json({ link });
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    if (!req.admin) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const links = await getParticipantLinks(req.admin.id);

    return res.json({ links });
  } catch (error) {
    next(error);
  }
});

router.post("/:id/revoke", async (req, res, next) => {
  try {
    if (!req.admin) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const linkId = Number(req.params.id);
    const result = await revokeParticipantLink(req.admin.id, linkId);

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

    const linkId = Number(req.params.id);
    const result = await deleteUnusedParticipantLink(req.admin.id, linkId);

    return res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;

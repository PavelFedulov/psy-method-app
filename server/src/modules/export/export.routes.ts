import { Router } from "express";
import { requireAdminAuth } from "../../middlewares/require-admin-auth";
import { exportSessionsToCsv, exportSessionsToXlsx } from "./export.service";

const router = Router();

router.use(requireAdminAuth);

router.post("/csv", async (req, res, next) => {
  try {
    if (!req.admin) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const fileBuffer = await exportSessionsToCsv(req.admin.id, req.body);
    const timestamp = new Date()
      .toISOString()
      .slice(0, 19)
      .replace(/[:T]/g, "-");

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="results-${timestamp}.csv"`,
    );

    return res.send(fileBuffer);
  } catch (error) {
    next(error);
  }
});

router.post("/xlsx", async (req, res, next) => {
  try {
    if (!req.admin) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const fileBuffer = await exportSessionsToXlsx(req.admin.id, req.body);
    const timestamp = new Date()
      .toISOString()
      .slice(0, 19)
      .replace(/[:T]/g, "-");

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="results-${timestamp}.xlsx"`,
    );

    return res.send(fileBuffer);
  } catch (error) {
    next(error);
  }
});

export default router;

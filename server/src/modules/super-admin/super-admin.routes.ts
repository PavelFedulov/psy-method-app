import { Router } from "express";
import { COOKIE_NAMES } from "../../constants/app.constants";
import { env } from "../../config/env";
import { requireSuperAdminAuth } from "../../middlewares/require-super-admin-auth";
import {
  getSuperAdminBySessionToken,
  loginSuperAdmin,
  logoutSuperAdmin,
} from "../../services/auth/auth.service";
import {
  createAdmin,
  deleteAdmin,
  getAdminsList,
  updateAdminStatus,
} from "../../services/admin/admin.service";

const router = Router();

router.post("/auth/login", async (req, res, next) => {
  try {
    const { username, password } = req.body as {
      username: string;
      password: string;
    };

    const result = await loginSuperAdmin(username, password);

    res.cookie(COOKIE_NAMES.SUPER_ADMIN_SESSION, result.token, {
      httpOnly: true,
      sameSite: "lax",
      secure: env.isProduction,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      superAdmin: result.superAdmin,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/auth/logout", (req, res) => {
  const token = req.cookies[COOKIE_NAMES.SUPER_ADMIN_SESSION];

  if (token) {
    logoutSuperAdmin(token);
  }

  res.clearCookie(COOKIE_NAMES.SUPER_ADMIN_SESSION);
  res.json({ ok: true });
});

router.get("/auth/me", (req, res) => {
  const token = req.cookies[COOKIE_NAMES.SUPER_ADMIN_SESSION];

  if (!token) {
    return res.json({
      authenticated: false,
      superAdmin: null,
    });
  }

  const superAdmin = getSuperAdminBySessionToken(token);

  if (!superAdmin) {
    return res.json({
      authenticated: false,
      superAdmin: null,
    });
  }

  return res.json({
    authenticated: true,
    superAdmin,
  });
});

router.post("/admins", requireSuperAdminAuth, async (req, res, next) => {
  try {
    const admin = await createAdmin(req.body);
    res.status(201).json({ admin });
  } catch (error) {
    next(error);
  }
});

router.get("/admins", requireSuperAdminAuth, (_req, res) => {
  const admins = getAdminsList();
  res.json({ admins });
});

router.patch("/admins/:id", requireSuperAdminAuth, (req, res, next) => {
  try {
    const adminId = Number(req.params.id);
    const { isActive } = req.body as { isActive: boolean };

    updateAdminStatus(adminId, isActive);

    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

router.delete("/admins/:id", requireSuperAdminAuth, (req, res, next) => {
  try {
    const adminId = Number(req.params.id);
    const result = deleteAdmin(adminId);

    res.json({
      ok: true,
      dbFileName: result.dbFileName,
    });
  } catch (error) {
    next(error);
  }
});

export default router;

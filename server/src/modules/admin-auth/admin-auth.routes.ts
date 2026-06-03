import { Router } from "express";
import { COOKIE_NAMES } from "../../constants/app.constants";
import {
  getAdminBySessionToken,
  loginAdmin,
  logoutAdmin,
} from "../../services/auth/auth.service";
import { env } from "../../config/env";

const router = Router();

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body as {
      username: string;
      password: string;
    };

    const result = await loginAdmin(username, password);

    res.cookie(COOKIE_NAMES.ADMIN_SESSION, result.token, {
      httpOnly: true,
      sameSite: "lax",
      secure: env.isProduction,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      admin: result.admin,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/logout", async (req, res, next) => {
  try {
    const token = req.cookies[COOKIE_NAMES.ADMIN_SESSION];

    if (token) {
      await logoutAdmin(token);
    }

    res.clearCookie(COOKIE_NAMES.ADMIN_SESSION);
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

router.get("/me", async (req, res, next) => {
  try {
    const token = req.cookies[COOKIE_NAMES.ADMIN_SESSION];

    if (!token) {
      return res.json({
        authenticated: false,
        admin: null,
      });
    }

    const admin = await getAdminBySessionToken(token);

    if (!admin) {
      return res.json({
        authenticated: false,
        admin: null,
      });
    }

    return res.json({
      authenticated: true,
      admin,
    });
  } catch (error) {
    next(error);
  }
});

export default router;

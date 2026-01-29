import { Router } from "express";
import passport from "passport";

const router = Router();

router.get(
  "/dashboard",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Acceso denegado" });
    }

    res.json({ message: "Bienvenido Admin" });
  }
);

export default router;


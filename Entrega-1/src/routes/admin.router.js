import { Router } from "express";
import passport from "passport";
import { authorizeRole } from "../middlewares/authorizeRole.js";

const router = Router();

//  Solo ADMIN puede ver el dashboard
router.get(
  "/dashboard",
  passport.authenticate("current", { session: false }),
  authorizeRole(['admin']), 
  (req, res) => {
    res.json({ message: "Bienvenido Admin, esto es información sensible" });
  }
);

//  Solo USER puede comprar (agregar al carrito)
router.post(
    "/buy",
    passport.authenticate("current", { session: false }),
    authorizeRole(['user']),
    (req, res) => {
        res.json({ message: "Compra procesada exitosamente" });
    }
);

export default router;


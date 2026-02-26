import express from "express";
import { register, login, logout, getAllUsers } from "../controllers/auth.controller.js";
import passport from "passport";
import { generateToken } from "../utils/jwt.js";
import protect, { admin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {

    const token = generateToken(req.user);
    res.redirect(`/auth-callback.html?token=${token}`);
  }
);
router.get("/users", protect, admin, getAllUsers);

export default router;

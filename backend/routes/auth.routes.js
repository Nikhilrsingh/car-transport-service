import express from "express";
import { register, login , logout , googleLogin} from "../controllers/auth.controller.js";
import passport from "passport";

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
  

export default router;

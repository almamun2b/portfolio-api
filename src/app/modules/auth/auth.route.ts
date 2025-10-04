import express from "express";

const router = express.Router();

import { authController } from "./auth.controller";

router.post("/login", authController.loginWithCredential);
router.post("/google", authController.authWithGoogle);

export const authRoutes = router;

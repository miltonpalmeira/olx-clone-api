import { Router } from "express";
import { getStates, info } from "../controllers/UserController.js";
import { authPrivate } from "../middlewares/Auth.js";

const router = Router();

router.get("/states", getStates);

router.get("/user/me", authPrivate, info);
// router.put("/user/me", update);

export default router;
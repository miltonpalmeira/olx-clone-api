import { Router } from "express";
import { signin, signup } from "../controllers/AuthController.js";

const router = Router();

router.post('/user/signin', signin);
router.post('/user/signup', signup);

export default router;
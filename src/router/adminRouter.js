import { Router } from "express";
import { registerAdmin } from "../controller/admin.controller.js";


const router = Router();

router.route("/registerAdmin").post(registerAdmin)

export default router;
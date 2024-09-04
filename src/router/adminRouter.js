import { Router } from "express";
import { loginAdmin, logoutAdmin, registerAdmin, updateAdmin, updateLogo } from "../controller/admin.controller.js";
import { upload } from "../middleware/multer.js";
import { verifyJWT } from '../middleware/userAuth.middleware.js'
import { adminVerifyJWT } from "../middleware/adminAuth.middle.js"
const router = Router();

router.route("/registerAdmin").post(verifyJWT, upload.fields([{ name: 'logo', maxCount: 1 }]), registerAdmin)
router.route("/loginAdmin").post(verifyJWT, loginAdmin)
router.route("/logoutAdmin").get(adminVerifyJWT, logoutAdmin)
router.route("/updateAdmin").put(adminVerifyJWT, updateAdmin)
router.route("/updateLogo").post(adminVerifyJWT, updateLogo)
export default router;
import { Router } from "express";
import { upload } from "../middleware/multer.js";
import { templateAdd } from "../controller/templateController.js";

const router = Router();
router.route("/addTemplate").post(upload.fields([{ name: 'template', maxCount: 1 }]), templateAdd)

export default router;
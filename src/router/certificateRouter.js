import Router from 'express'
import { adminVerifyJWT } from "../middleware/adminAuth.middle.js"
import { generaterCertificateWithForn, generateCetificateCsv } from "../controller/certificate.controller.js"
import { upload } from "../middleware/multer.js"
import { verifyJWT } from '../middleware/userAuth.middleware.js'
const router = Router()

router.route("/generaterCertificateWithForn").post(adminVerifyJWT, generaterCertificateWithForn)
router.route("/generateCetificateCsv").post(adminVerifyJWT, upload.fields([{ name: "csvFile", maxCount: 1 }]), generateCetificateCsv)

export default router;
import { nanoid } from 'nanoid'
import { Result } from "../model/certificate.model.js"
import csv from 'csvtojson'
import { uploadOnCloudinary } from '../utiles/cloudinary.js';
import { sendMail } from '../utiles/mail.js';
import { mailHtml } from '../utiles/mailFormat.js';



const generaterCertificateWithForn = async function (req, res) {
    try {
        //const user = req.user._id;
        const admin = req.admin._id;
        //console.log("admin", admin);

        if (!admin) {
            return res.status(400).json({
                success: false,
                message: "Login with User and Admin account"
            })
        }

        const { name, fatherName, email, institute } = req.body;
        //console.log(name, fatherName, email, institute);

        if (!name && !fatherName && !email && !institute) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        const certificateId = nanoid();
        //console.log("certificateId", certificateId);


        const certificate = await Result.create({
            name,
            email,
            fatherName, institute,
            certificateId: certificateId,
            //user: user,
            admin: admin
        })

        //console.log("certificate", certificate);

        if (certificate) {
            const mail = sendMail(email, "Certificate Id | QuickUp", "", mailHtml(email, name, institute, certificateId))
            return res.status(200).json({
                success: true,
                message: "Certificate Data added SuccessFully"
            })
        }


    } catch (error) {
        return res.status(200).json({
            success: false,
            message: "Certificate Data not added "
        })
    }
}

const generateCetificateCsv = async function (req, res) {
    //const user = req.user._id
    const admin = req.admin._id;

    const csvFiles = req.files?.csvFile?.[0]?.path
    //console.log(csvFiles);


    if (!csvFiles) {
        return res.status(409).json({
            success: true,
            message: "CSV file is missing."
        })
    }

    try {
        const userData = []
        csv()
            .fromFile(csvFiles)
            .then(async (responce) => {
                for (let i = 0; i < responce.length; i++) {
                    var certificateId = nanoid();
                    //console.log("certificateId", certificateId);

                    userData.push({
                        name: responce[i].name,
                        email: responce[i].email,
                        fatherName: responce[i].fatherName,
                        institute: responce[i].institute,
                        certificateId: certificateId,
                        admin: admin
                    })
                }
                console.log("userData", userData);
                const certificate = await Result.insertMany(userData);
                if (!certificate) {
                    return res.status(500).json({
                        success: false,
                        message: "User not added in database"
                    })
                }

                for (let i = 0; i < userData.length; i++) {
                    await sendMail(userData[i].email, "Certificate Id | QuickUp", "", mailHtml(userData[i].email, userData[i].name, userData[i].institute, certificateId))
                }

            })

        const csvUrl = await uploadOnCloudinary(csvFiles);

        return res.status(200).json({
            success: true,
            message: "Details added through CSV file"
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Filed to update marks through CSV"
        })
    }

}

const getCertificateDownload = async function (req, res) {
    try {
        const user = req.user._id;
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Login with User account"
            })
        }

        const { name, email, institute, certificateId } = await req.body
        if (!name && !certificateId && !email && !institute) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        const certificateDownload = await Result.findOne({ name, email, certificateId, institute });
        const updateCertificateDetails = await Result.updateOne({
            user: user
        })
        //console.log("certificateDownload", certificateDownload);
        return res.status(200).json({
            success: true,
            message: "Here Your Certificate"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error while finding Certificate"
        })
    }
}
export {
    generaterCertificateWithForn,
    generateCetificateCsv,
    getCertificateDownload
}
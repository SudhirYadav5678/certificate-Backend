import { Template } from "../model/template.modal.js";
import { uploadOnCloudinary } from "../utiles/cloudinary.js";

const templateAdd = async (req, res) => {
    const { name, ownerOfTemplate } = await req.body

    if (
        [name, ownerOfTemplate].some((field) => field?.trim() === "")
    ) {
        return res.status(409).json({
            success: false,
            message: "All fields are required"
        })
    }

    const pathOfTemplate = req.files?.template?.[0]?.path;
    console.log("pathOfTemplate", pathOfTemplate);

    const templateUrl = await uploadOnCloudinary(pathOfTemplate);

    const template = await Template.create({
        name,
        urlOfTemplate: templateUrl,
        ownerOfTemplate
    })

    if (!template) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while Adding template"
        })
    }

    return res.status(201).json(
        {
            success: true,
            message: "Template Added Successfully"
        }
    )

}

export { templateAdd }
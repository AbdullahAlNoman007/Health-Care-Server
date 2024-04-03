import { TCloudinaryImage } from "../../interface"
import prisma from "../../utility/prismaClient";
import { fileUploader } from "../../utility/sendImage";

const createSpecialties = async (payload: { title: string, icon: string }, path: string) => {
    let ImageData: TCloudinaryImage | undefined;
    if (path) {
        ImageData = await fileUploader.uploadImage(path) as TCloudinaryImage
    }
    if (ImageData) {
        payload.icon = ImageData.secure_url
    }

    const result = await prisma.specialties.create({
        data: payload
    })

    return result
}

export const specialtiesService = {
    createSpecialties
}
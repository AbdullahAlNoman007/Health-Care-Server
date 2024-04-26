import { Prisma, Review } from "@prisma/client";
import prisma from "../../utility/prismaClient";
import { TdecodedData, Tpagination } from "../../interface";
import AppError from "../../Error/AppError";
import httpStatus from "http-status";
import calculatePagination from "../../utility/pagination";

const createReview = async (payload: Partial<Review>, user: TdecodedData) => {
    const appointmentData = await prisma.appointment.findUniqueOrThrow({
        where: {
            id: payload.appointmentId,
            status: 'COMPLETED'
        },
        include: {
            patient: true
        }
    })

    if (user.email !== appointmentData.patient.email) {
        throw new AppError(httpStatus.BAD_REQUEST, "You can't review on others Appointment!")
    }

    const review = prisma.$transaction(async (tx) => {

        const review = await tx.review.create({
            data: {
                doctorId: appointmentData.doctorId,
                patientId: appointmentData.patientId,
                appointmentId: appointmentData.id,
                rating: payload.rating as number,
                comment: payload.comment as string
            }
        })

        const avgRating = await tx.review.aggregate({
            _avg: {
                rating: true
            },
            where: {
                doctorId: appointmentData.doctorId
            }
        })

        await tx.doctor.update({
            where: {
                id: appointmentData.doctorId
            },
            data: {
                averageRating: avgRating._avg.rating as number
            }
        })
        return review
    })
    return review

}

const getAllFromDB = async (
    filters: any,
    options: Tpagination,
) => {
    const { limit, page, skip } = calculatePagination(options);
    const { ...filterData } = filters;
    const andConditions: Prisma.ReviewWhereInput[] = [];

    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(item => (
                {
                    [item]: {
                        email: (filterData as any)[item]
                    }
                }
            ))
        })
    }

    const whereConditions: Prisma.ReviewWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.review.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy:
            options.sortBy && options.sortOrder
                ? { [options.sortBy]: options.sortOrder }
                : {
                    createdAt: 'desc',
                },
        include: {
            doctor: true,
            patient: true,
            appointment: true,
        },
    });
    const total = await prisma.review.count({
        where: whereConditions,
    });

    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };
};


export const reviewService = {
    createReview,
    getAllFromDB
}
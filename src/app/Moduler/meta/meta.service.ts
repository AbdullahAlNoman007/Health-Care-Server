import { UserRole } from "@prisma/client";
import { TdecodedData } from "../../interface"
import AppError from "../../Error/AppError";
import httpStatus from "http-status";
import prisma from "../../utility/prismaClient";

const getDashBoardMeta = async (user: TdecodedData) => {
    let DashBoardData;
    switch (user.role) {

        case UserRole.ADMIN:
            DashBoardData = adminMetaData()
            break;

        case UserRole.SUPER_ADMIN:
            DashBoardData = superAdminMetaData()
            break;

        case UserRole.DOCTOR:
            DashBoardData = doctorMetaData(user.email)
            break;

        case UserRole.PATIENT:
            DashBoardData = patientMetaData(user.email)
            break;

        default:
            throw new AppError(httpStatus.BAD_REQUEST, "Invalid Role");
    }

    return DashBoardData
}


const adminMetaData = async () => {
    const appointmentCount = await prisma.appointment.count()
    const patientCount = await prisma.patient.count()
    const doctorCount = await prisma.doctor.count()
    const paymentCount = await prisma.payment.count()
    const Revenue = await prisma.payment.aggregate({
        _sum: {
            amount: true
        },
        where: {
            status: 'PAID'
        }
    })
    const totalRevenue = Revenue._sum.amount as number
    const barChartData = await getBarChartData();
    const pieChartData = await getPieChartData();


    return { appointmentCount, patientCount, doctorCount, paymentCount, totalRevenue, barChartData, pieChartData }
}

const superAdminMetaData = async () => {
    const appointmentCount = await prisma.appointment.count()
    const patientCount = await prisma.patient.count()
    const adminCount = await prisma.admin.count()
    const doctorCount = await prisma.doctor.count()
    const paymentCount = await prisma.payment.count()
    const Revenue = await prisma.payment.aggregate({
        _sum: {
            amount: true
        },
        where: {
            status: 'PAID'
        }
    })
    const totalRevenue = Revenue._sum.amount as number

    const barChartData = await getBarChartData();
    const pieChartData = await getPieChartData();


    return { appointmentCount, patientCount, doctorCount, paymentCount, totalRevenue, barChartData, pieChartData }
}

const doctorMetaData = async (email: string) => {
    const appointmentCount = await prisma.appointment.count({
        where: {
            doctor: {
                email
            }
        }
    })

    const patientCount = await prisma.appointment.groupBy({
        by: ['patientId'],
        where: {
            doctor: {
                email
            }
        }
    })

    const reviewCount = await prisma.review.count({
        where: {
            doctor: {
                email
            }
        }
    })

    const Revenue = await prisma.payment.aggregate({
        _sum: {
            amount: true
        },
        where: {
            appointment: {
                doctor: {
                    email
                }
            },
            status: 'PAID'
        }
    })

    const totalRevenue = Revenue._sum.amount

    const statusDistribution = await prisma.appointment.groupBy({
        by: ['status'],
        _count: {
            id: true
        },
        where: {
            doctor: {
                email
            }
        }
    })

    const appointmentStatusDistribution = statusDistribution.map(({ _count, status }) => ({
        status,
        count: Number(_count.id)
    }))

    return {
        appointmentCount,
        patientCount: patientCount.length,
        reviewCount,
        totalRevenue,
        appointmentStatusDistribution
    }



}

const patientMetaData = async (email: string) => {

    const appointmentCount = await prisma.appointment.count({
        where: {
            patient: {
                email
            }
        }
    })

    const reviewCount = await prisma.review.count({
        where: {
            patient: {
                email
            }
        }
    })

    const prescriptionCount = await prisma.prescription.count({
        where: {
            patient: {
                email
            }
        }
    });

    const statusDistribution = await prisma.appointment.groupBy({
        by: ['status'],
        _count: {
            id: true
        },
        where: {
            patient: {
                email
            }
        }
    })

    const appointmentStatusDistribution = statusDistribution.map(({ _count, status }) => ({
        status,
        count: Number(_count.id)
    }))

    return {
        appointmentCount,
        reviewCount,
        prescriptionCount,
        appointmentStatusDistribution
    }


}

const getBarChartData = async () => {
    const appointmentCountByMonth: { month: Date, count: bigint }[] = await prisma.$queryRaw`
        SELECT DATE_TRUNC('month',"createAt") AS month,
            CAST(COUNT(*) AS INTEGER) AS count
        FROM "appoinments"
        GROUP BY month
        ORDER BY month ASC
    `
    const formattedMetadata = appointmentCountByMonth.map(({ month, count }) => ({
        month,
        count: Number(count),
    }));
    return formattedMetadata;
}

const getPieChartData = async () => {
    const appointmentStatusDistribution = await prisma.appointment.groupBy({
        by: ['status'],
        _count: { id: true },
    });

    const formattedData = appointmentStatusDistribution.map(({ status, _count }) => ({
        status,
        count: Number(_count.id),
    }));

    return formattedData;
}

export const metaService = {
    getDashBoardMeta
}

// appointmentCount,
// patientCount: patientCount.length,
// reviewCount,
// totalRevenue,
// appointmentStatusDistribution:
// formattedAppointmentStatusDistribution
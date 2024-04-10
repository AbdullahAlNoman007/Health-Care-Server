import { addHours, addMinutes, format } from "date-fns";
import prisma from "../../utility/prismaClient";
import { Schedule } from "@prisma/client";
import { Tschedule } from "./Schedule.interface";


const insertIntoDB = async (payload: Tschedule): Promise<Schedule[]> => {
    const { startDate, endDate, startTime, endTime } = payload;
    const scheduleArray: Schedule[] = []

    const firstDate = new Date(startDate);
    const lastDate = new Date(endDate);

    const intervalTime = 30;

    while (firstDate <= lastDate) {

        const startDateTime = new Date(
            addMinutes(addHours(
                `${format(firstDate, 'yyyy-MM-dd')}`,
                Number(startTime.split(':')[0])
            ), Number(startTime.split(':')[1]))
        )

        const endDateTime = new Date(
            addMinutes(addHours(
                `${format(firstDate, 'yyyy-MM-dd')}`,
                Number(endTime.split(':')[0])
            ), Number(endTime.split(':')[1]))
        )

        while (startDateTime < endDateTime) {
            const schedule = {
                startDateTime: startDateTime,
                endDateTime: addMinutes(startDateTime, intervalTime)
            }
            const find = await prisma.schedule.findFirst({
                where: {
                    startDateTime: schedule.startDateTime,
                    endDateTime: schedule.endDateTime
                }
            })
            if (!find) {
                const result = await prisma.schedule.create({
                    data: schedule
                })
                scheduleArray.push(result)
            }

            startDateTime.setMinutes(startDateTime.getMinutes() + intervalTime)

        }
        firstDate.setDate(firstDate.getDate() + 1);
    }

    return scheduleArray;
}

export const ScheduleService = {
    insertIntoDB
}
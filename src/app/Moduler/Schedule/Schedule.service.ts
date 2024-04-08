import { addHours, format } from "date-fns";

type Tschedule = {
    startDate: String;
    endDate: String;
    startTime: String;
    endTime: String;
}


const insertIntoDB = async (payload: any) => {
    const { startDate, endDate, startTime, endTime } = payload;

    const firstDate = new Date(startDate);
    const lastDate = new Date(endDate);

    while (firstDate <= lastDate) {

        const startDateTime = new Date(
            addHours(
                `${format(firstDate, 'yyyy-MM-dd')}`,
                Number(startTime.split(':')[0])
            )
        )

        const endDateTime = new Date(
            addHours(
                `${format(lastDate, 'yyyy-MM-dd')}`,
                Number(endTime.split(':')[0])
            )
        )

        while (startDateTime <= endDateTime) {

        }
    }

}

export const ScheduleService = {
    insertIntoDB
}
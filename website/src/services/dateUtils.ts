import {DateTime} from "luxon";



export const formatDate = (date, tz = 'Etc/UTC', format = 'dd MMM, yyyy') => {
    if (date === null || date === undefined || date === '' ) return '';

    return DateTime.fromISO(date).setZone(tz).toFormat(format);
}

export const addHoursToDate = (date, hours: number) => {
    if (date === null || date === undefined || date === '' ) return '';
    return DateTime.fromISO(date).plus({ hours });
}

export const formatDateForDateMonth = (date, tz = 'Etc/UTC', format = 'dd MMM') => {
    if (date === null || date === undefined || date === '' ) return '';

    return DateTime.fromISO(date).setZone(tz).toFormat(format);
}


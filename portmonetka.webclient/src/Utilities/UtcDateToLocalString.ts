import { utcToZonedTime } from "date-fns-tz";

export default function UtcDateToLocalString(utcDate: Date): string {
    const timeZoneName = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const localDate = utcToZonedTime(utcDate, timeZoneName);
    return localDate.toLocaleDateString();
}
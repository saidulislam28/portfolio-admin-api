export class TimeZoneHelper {
    // Convert UTC "HH:mm" to local "HH:mm" in given timeZone
    static utcToLocal(utcTime, timeZone) {
        const [H, M = "0"] = utcTime.split(":");
        const now = new Date();

        // Build a UTC Date for today with given time
        const d = new Date(Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate(),
            Number(H),
            Number(M)
        ));

        // Format in target timeZone
        return new Intl.DateTimeFormat("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
            timeZone,
        }).format(d);
    }

    // Convert local "HH:mm" in given timeZone to UTC "HH:mm"
    static localToUtc(localTime, timeZone) {
        const [H, M = "0"] = localTime.split(":");
        const now = new Date();

        // Build a local Date at given time (today)
        const localDate = new Date(Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate(),
            Number(H),
            Number(M)
        ));

        // Shift into the given timeZone
        const zonedDate = new Date(localDate.toLocaleString("en-US", { timeZone }));

        // Format in UTC
        return new Intl.DateTimeFormat("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
            timeZone: "UTC",
        }).format(zonedDate);
    }
}

import * as Localization from 'expo-localization';

export const getUserDeviceTimezone = (): string | null => {
    return Localization.getCalendars()[0].timeZone;
}
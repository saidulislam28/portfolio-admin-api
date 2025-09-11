import * as Localization from 'expo-localization';

export const getUserDeviceTimezone = (): string | null | undefined => {
    // eslint-disable-next-line prettier/prettier
    return Localization.getCalendars()[0]?.timeZone;
}
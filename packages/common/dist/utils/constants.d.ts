export declare const SupportedDevices: {
    readonly ST906: "ST906";
    readonly X3: "X3";
};
export type DeviceModelType = typeof SupportedDevices[keyof typeof SupportedDevices];
export declare const DeviceCommands: {
    readonly engine_on: "engine_on";
    readonly engine_off: "engine_off";
    readonly lock_door: "lock_door";
    readonly unlock_door: "unlock_door";
    readonly voice_monitor: "voice_monitor";
    readonly location_request: "location_request";
    readonly status_check: "status_check";
    readonly set_center_number: "set_center_number";
    readonly set_apn: "set_apn";
    readonly set_timezone: "set_timezone";
    readonly factory_reset: "factory_reset";
    readonly arm_alarm: "arm_alarm";
    readonly disarm_alarm: "disarm_alarm";
    readonly panic_mode: "panic_mode";
    readonly speed_limit: "speed_limit";
};
export type CommandIdType = typeof DeviceCommands[keyof typeof DeviceCommands];
export declare const PLACEHOLDERS: {
    deviceId: string;
    time: string;
};
export declare const NotificationEventName: {
    end_call: string;
    start_call: string;
    incoming_call: string;
};
export declare const USER_ROLE: {
    consultant: string;
    user: string;
};
export declare const NotificationChannel: {
    calls: string;
    call: string;
};
export declare const ADMIN_CALL_USER_ID = 999999;

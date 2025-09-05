//list of supported device models

export const SupportedDevices = {
  ST906: 'ST906',
  X3: 'X3',
} as const;

export type DeviceModelType = typeof SupportedDevices[keyof typeof SupportedDevices];

export const DeviceCommands = {
  engine_on: 'engine_on',
  engine_off: 'engine_off',
  lock_door: 'lock_door',
  unlock_door: 'unlock_door',
  voice_monitor: 'voice_monitor',
  location_request: 'location_request',
  status_check: 'status_check',
  set_center_number: 'set_center_number',
  set_apn: 'set_apn',
  set_timezone: 'set_timezone',
  factory_reset: 'factory_reset',
  arm_alarm: 'arm_alarm',
  disarm_alarm: 'disarm_alarm',
  panic_mode: 'panic_mode',
  speed_limit: 'speed_limit',
} as const;

export type CommandIdType = typeof DeviceCommands[keyof typeof DeviceCommands];

export const PLACEHOLDERS = {
  deviceId: 'deviceId',
  time: 'time'
}

export const NotificationEventName = {
  end_call: "end_call",
  start_call: "start_call",
  incoming_call: "incoming_call"
}

export const USER_ROLE = {
  consultant: "CONSULTANT",
  user: "USER",
}

export const NotificationChannel = {
  "calls": "calls",
  "call": "call"
}

export const ADMIN_CALL_USER_ID = 999999; 
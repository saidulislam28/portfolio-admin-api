/**
 * Replaces placeholders in a string with values from an object
 * @param template - String with placeholders in format {key}
 * @param params - Object containing replacement values
 * @returns String with placeholders replaced by corresponding values
 */
export declare function replacePlaceholders(template: string, params: Record<string, string | number>): string;

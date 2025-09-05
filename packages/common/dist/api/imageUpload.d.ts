/**
 * Upload an image to the attachments endpoint
 * @param uri Local file URI of the image
 */
export declare const uploadImageFromApp: (uri: string, name?: string) => Promise<string>;

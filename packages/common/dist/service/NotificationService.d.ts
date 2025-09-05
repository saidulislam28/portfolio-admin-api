export declare class NotificationService {
    #private;
    startCall(receiver_id: number, receiver_role: string, additionalInfo?: any): Promise<void>;
    endCall(receiver_id: number, receiver_role: string, additionalInfo?: any): Promise<void>;
}

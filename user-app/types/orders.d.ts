export interface AppointmentDto {
  appointmentId: string;
  date: string;
  time: string;
}

export interface BookItemDto {
  name: string;
  quantity: number;
  price: number;
}

export interface ExamItemDto {
  name: string;
  quantity: number;
  price: number;
}

export interface BaseOrderResponse {
  title: string;
  subtitle: string;
  cardTitle: string;
  icon: string;
  tip?: string;
  createdAt: string;
}

export interface SpeakingMockTestResponse extends BaseOrderResponse {
  appointments: AppointmentDto[];
}

export interface ConversationResponse extends BaseOrderResponse {
  appointments: AppointmentDto[];
}

export interface BookPurchaseResponse extends BaseOrderResponse {
  orderId: string;
  purchaseDate: string;
  items: BookItemDto[];
  totalPrice: number;
}

export interface ExamRegistrationResponse extends BaseOrderResponse {
  registrationId: string;
  examDate: string;
  items: ExamItemDto[];
  totalPrice: number;
}

export interface IeltsAcademicResponse extends BaseOrderResponse {
  orderId: string;
}

export interface GenericOrderResponse extends BaseOrderResponse {
  orderId: string;
  date: string;
  [key: string]: any;
}

export type OrderDetailsResponse =
  | SpeakingMockTestResponse
  | ConversationResponse
  | BookPurchaseResponse
  | ExamRegistrationResponse
  | IeltsAcademicResponse
  | GenericOrderResponse;
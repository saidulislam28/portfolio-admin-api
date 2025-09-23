import { lazy } from "react";

// const BLOG =  lazy(() => import('./pages/website_setting/blog/blog'))
const Dashboard = lazy(() => import("./pages/Home"));
const users = lazy(() => import("./pages/user"));
const usersDetails = lazy(() => import("./pages/user/UserDetails"));
const Books = lazy(() => import("./pages/books"));
const Package = lazy(() => import("./pages/package"));
const ExamRegistration = lazy(() => import("./pages/exam-registration"));
const ExamDetailsPage = lazy(() => import("./pages/exam-registration/details"));
const OnlineClassRequest = lazy(() => import("./pages/online-class-request"));
const SpokenRequest = lazy(() => import("./pages/spoken-request"));
const Notification = lazy(() => import("./pages/notification"));
const BookOrder = lazy(() => import("./pages/book-order"));
const BookOrderDetails = lazy(
  () => import("./pages/book-order/book-order-details")
);
const Consultants = lazy(() => import("./pages/consultants"));
const LiveAppointments = lazy(() => import("./pages/live-appointments"));
const ConsultantsDetails = lazy(
  () => import("./pages/consultants/consultant-details")
);
const MocktestAppointment = lazy(() => import("./pages/mocktest-appointments"));
const ConversationAppointment = lazy(() => import("./pages/conversation-appointments"));
const onlineCourseDetails = lazy(() => import("./pages/online-class-request/details"));
const MocktestAppointmentDetails = lazy(
  () => import("./pages/mocktest-appointments/appointment-details")
);
const ConversationAppointmentDetails = lazy(
  () => import("./pages/conversation-appointments/appointment-details")
);
const AdminUsers = lazy(
  () => import("./pages/admin-user")
);
const BookVendor = lazy(
  () => import("./pages/book-vendor")
);
const AppSlider = lazy(
  () => import("./pages/app-home-slider")
);
const VideoSlider = lazy(
  () => import("./pages/app-home-video")
);
const Setting = lazy(
  () => import("./pages/setting")
);
const IeltsTestReg = lazy(
  () => import("./pages/ielts-test-reg")
);
const StudyAbroad = lazy(
  () => import("./pages/study_abroad_reg")
);
const OnlineCourse = lazy(
  () => import("./pages/online_course_reg")
);
const ExamCenter = lazy(
  () => import("./pages/exam-center")
);
const StudyAbroadOrder = lazy(
  () => import("./pages/study-abroad")
);
const StudyAbroadOrderDetails = lazy(
  () => import("./pages/study-abroad/details")
);
const FeedbackComments = lazy(
  () => import("./pages/conversation-comments")
);
const MocktestComments = lazy(
  () => import("./pages/mocktest-comments")
);
const ReportBookPurchase = lazy(
  () => import("./pages/reports/book-purchase")
);
const ReportConsultant = lazy(
  () => import("./pages/reports/consultants")
);
const CouponPage = lazy(
  () => import("./pages/coupon")
);
const ConsultantSchedule = lazy(
  () => import("./pages/consultant-schedule")
);
const WebSettings = lazy(
  () => import("./pages/web-settings")
);
const WebFaq = lazy(
  () => import("./pages/web-faqs")
);
const WebTestimonial = lazy(
  () => import("./pages/web-testimonials")
);
const HelpRequest = lazy(
  () => import("./pages/help-req")
);

const routes = [
  { path: "/", element: Dashboard },
  { path: "/users", element: users },
  { path: "/users/details/:id", element: usersDetails },
  { path: "/books", element: Books },
  { path: "/package", element: Package },
  { path: "/exam-egistration", element: ExamRegistration },
  { path: "/exam-registration/details/:id", element: ExamDetailsPage },
  { path: "/onlineClassRequest", element: OnlineClassRequest },
  { path: "/online-course/details/:id", element: onlineCourseDetails },
  { path: "/spokenRequest", element: SpokenRequest },
  { path: "/bookOrder", element: BookOrder },
  { path: "/bookOrder/details/:id", element: BookOrderDetails },
  { path: "/consultants", element: Consultants },
  { path: "/consultants/details/:id", element: ConsultantsDetails },
  { path: "/admin-users", element: AdminUsers },
  { path: "/notification", element: Notification },
  { path: "/live-appointments", element: LiveAppointments },
  { path: "/book-vendor", element: BookVendor },
  { path: "/appointments/mocktest", element: MocktestAppointment },
  { path: "/appointments/conversation", element: ConversationAppointment },
  { path: "/appointments/conversation/details/:id", element: ConversationAppointmentDetails },
  { path: "/appointments/mocktest/details/:id", element: MocktestAppointmentDetails },
  { path: "/app-home-slider", element: AppSlider },
  { path: "/app-home-video", element: VideoSlider },
  { path: "/setting", element: Setting },
  { path: "/ielts-test-reg", element: IeltsTestReg },
  { path: "/online-course-reg", element: OnlineCourse },
  { path: "/study-abroad-reg", element: StudyAbroad },
  { path: "/exam-center", element: ExamCenter },
  { path: "/study-abroad", element: StudyAbroadOrder },
  { path: "/study-abroad/details/:id", element: StudyAbroadOrderDetails },
  { path: "/conversation-comments", element: FeedbackComments },
  { path: "/mocktest-comments", element: MocktestComments },
  //reports
  { path: "/reports/orders", element: ReportBookPurchase },
  { path: "/reports/consultants", element: ReportConsultant },
  { path: "/coupon", element: CouponPage },
  { path: "/consultant-schedule", element: ConsultantSchedule },
  { path: "/web-setting", element: WebSettings },
  { path: "/web-faq", element: WebFaq },
  { path: "/web-testimonial", element: WebTestimonial },
  { path: "/web-help-req", element: HelpRequest },
];

export default routes;

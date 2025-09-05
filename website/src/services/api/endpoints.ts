import { API_URL } from "@/config/config";
const API_URL_WITH_PREFIX = `${API_URL}/api/v1`;

export const ROLE_USER = "user";

export const GET_CONTENT_API = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/content`;

export const CREATE_VEHICLE = 'vehicles/add-vehicle'

export const API_FILE_UPLOAD = `${API_URL}/api/v1/attachments/upload-image`; //DEMO
export const API_GET_HOME_SETTINGS = `${API_URL_WITH_PREFIX}/home/settings`; // DEMO
export const API_GET_HOME_METADATA = "home/home-metaData"; // DEMO
export const API_GET_HOME_DATA = `${API_URL_WITH_PREFIX}/home`;
export const API_GET_ALL_CUSTOM_COLLECTION_PRODUCTS = `${API_URL_WITH_PREFIX}/home/custom-collection-products`;
export const API_CHECKOUT = "checkout";
export const API_GET_SUCCESSFUL_ORDER = "checkout/get-successful-order";
export const API_GUEST_CHECKOUT = "checkout/guest-checkout";
export const API_REGISTRATION = "auth/user/register";
export const VENDOR_REGISTRATION = "auth/vendor/register";
export const API_VENDOR_REGISTRATION = "auth/vendor/register";
export const USER_LOGIN_URL = "auth/user/login";
export const API_USER_VERIFY_OTP = "auth/user/otp/verify";
export const API_VENDOR_VERIFY_OTP = "auth/vendor/otp/verify";
export const API_SOCIAL_VALIDATION = "auth/social/validation";
export const API_SENT_OTP_VENDOR_AUTH = "auth/vendor/sent/otp";

export const API_PAYPAL_CONFIRM_PAYMENT = 'paypal/capture-order'

// user dashboard

export const API_GET_USER_PROFILE = {
  profile: "user/dashboard/profile",
  updateProfile: "user/dashboard/update/profile",
  reviews: "user/dashboard/product-review",
  delete: "user/dashboard/delete-review",
  updatePassword: "user/dashboard/update/password",
  update_address: "user/dashboard/update-address",
  add_address: "user/dashboard/add-address",
};

export const API_GET_ALL_STORE_LOCATIONS = "get-all-store-location";

export const API_GET_ORDERS = "user/dashboard/orders";
export const API_GET_SINGLE_ORDERS = "user/dashboard/single-order";

export const API_GET_ADDRESS = "user/dashboard/address";
export const API_DELETE_ADDRESS = "user/dashboard/delete-address";

export const DASHBOARD_URL = "/dashboard";

export const API_GET_ALL_CATEGORY = "all-categories";
export const API_GET_ALL_PRODUCT_BRANDS = "all-product-brands";
export const REVIEW_ON_PRODUCT = "user/dashboard/product-review";

export const API_GET_BLOGS = "website/all-blogs";
export const API_GET_SINGLE_BLOG = `${API_URL_WITH_PREFIX}/website/blog`;
export const API_GET_ALL_CATEGORIES = `${API_URL_WITH_PREFIX}/all-categories`;
export const API_GET_LATEST_BLOGS = "website/latest-blogs";
export const API_GET_BLOGS_BY_CATEGORY = "website/category";
export const API_GET_CATEGORY_COUNT = "website/category-count";
export const API_GET_BLOGS_BY_TAG = "website/tag";
export const API_GET_ALL_PRODUCT_COLLECTIONS = "products/products_by_collections";
export const API_GET_ALL_PRODUCT_CATEGORY = "products/products_by_category";
export const API_UPDATE_USER_PROFILE = "user/dashboard/update-user";

export const PRODUCT_APIS = {
  products: "products",
  singleProduct: "products/single_product",
};

export const APP_NAME = "BeHub Admin";

export const ROUTES = {
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  PROFILE: "/dashboard/profile",
  SERVICE_CATEGORIES: "/dashboard/service-categories",
  SERVICE_CATEGORY_CREATE: "/dashboard/service-categories/create",
  SERVICE_CATEGORY_DETAILS: (id: string) =>
    `/dashboard/service-categories/${id}`,
  SERVICE_CATEGORY_EDIT: (id: string) =>
    `/dashboard/service-categories/${id}/edit`,
} as const;

export const STORAGE_KEYS = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  USER: "user",
} as const;

export const DEFAULT_PAGE_SIZE = 20;

export const TOAST_MESSAGES = {
  LOGIN_SUCCESS: "Login successful",
  LOGIN_ERROR: "Invalid email or password",
  LOGOUT_SUCCESS: "Logged out successfully",
  CREATE_SUCCESS: "Service category created successfully",
  UPDATE_SUCCESS: "Service category updated successfully",
  DELETE_SUCCESS: "Service category deleted successfully",
  ERROR: "An error occurred. Please try again.",
} as const;

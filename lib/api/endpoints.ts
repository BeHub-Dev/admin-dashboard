// Auth endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: "/auth/login",
  REFRESH: "/auth/refresh",
} as const

// Admin endpoints
export const ADMIN_ENDPOINTS = {
  SERVICE_CATEGORIES: "/admin/service-categories",
  SERVICE_CATEGORY_BY_ID: (id: string) => `/admin/service-categories/${id}`,
} as const

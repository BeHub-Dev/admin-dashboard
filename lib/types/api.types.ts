export interface ApiError {
  success: false
  message: string
  errors?: Record<string, string[]>
}

export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: "asc" | "desc"
  search?: string
}

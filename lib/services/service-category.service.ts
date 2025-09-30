import { apiClient } from "@/lib/api/axios-instance"
import { ADMIN_ENDPOINTS } from "@/lib/api/endpoints"
import type {
  ServiceCategoryListResponse,
  ServiceCategoryResponse,
  CreateServiceCategoryRequest,
  UpdateServiceCategoryRequest,
  DeleteServiceCategoryResponse,
} from "@/lib/types/service-category.types"
import type { PaginationParams } from "@/lib/types/api.types"

export const serviceCategoryService = {
  getAll: async (params?: PaginationParams): Promise<ServiceCategoryListResponse> => {
    const response = await apiClient.get<ServiceCategoryListResponse>(ADMIN_ENDPOINTS.SERVICE_CATEGORIES, { params })
    return response.data
  },

  getById: async (id: string): Promise<ServiceCategoryResponse> => {
    const response = await apiClient.get<ServiceCategoryResponse>(ADMIN_ENDPOINTS.SERVICE_CATEGORY_BY_ID(id))
    return response.data
  },

  create: async (data: CreateServiceCategoryRequest): Promise<ServiceCategoryResponse> => {
    const response = await apiClient.post<ServiceCategoryResponse>(ADMIN_ENDPOINTS.SERVICE_CATEGORIES, data)
    return response.data
  },

  update: async (id: string, data: UpdateServiceCategoryRequest): Promise<ServiceCategoryResponse> => {
    const response = await apiClient.put<ServiceCategoryResponse>(ADMIN_ENDPOINTS.SERVICE_CATEGORY_BY_ID(id), data)
    return response.data
  },

  delete: async (id: string): Promise<DeleteServiceCategoryResponse> => {
    const response = await apiClient.delete<DeleteServiceCategoryResponse>(ADMIN_ENDPOINTS.SERVICE_CATEGORY_BY_ID(id))
    return response.data
  },
}

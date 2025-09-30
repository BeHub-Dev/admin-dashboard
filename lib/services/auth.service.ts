import { apiClient } from "@/lib/api/axios-instance"
import { AUTH_ENDPOINTS } from "@/lib/api/endpoints"
import type { LoginRequest, LoginResponse, RefreshTokenResponse } from "@/lib/types/auth.types"

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>(AUTH_ENDPOINTS.LOGIN, credentials)
    return response.data
  },

  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    const response = await apiClient.post<RefreshTokenResponse>(AUTH_ENDPOINTS.REFRESH, { refreshToken })
    return response.data
  },
}

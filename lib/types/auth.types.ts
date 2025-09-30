export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
    passwordToken: string;
    refreshToken?: string;
    needsProviderDetails: boolean;
    isEmailVerified: boolean;
  };
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
  isActive: boolean;
  profilePicture?: string;
  averageRating?: number;
  totalReviews?: number;
  phoneNumber?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  data: {
    passwordToken: string;
    refreshToken: string;
  };
}

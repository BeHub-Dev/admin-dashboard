export interface ServiceCategory {
  _id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  isActive: boolean;
  sortOrder: number;
  totalProviders?: number;
  totalBookings?: number;
  averageRating?: number;
  createdBy?: {
    fullName: string;
    email: string;
  };
  updatedBy?: {
    fullName: string;
    email: string;
  };
  createdAt: string;
  updatedAt?: string;
  subcategories?: Subcategory[];
  averagePriceRange?: {
    min: number;
    max: number;
  };
  averageDuration?: number;
  requiresLicense?: boolean;
  requiresSpecialEquipment?: boolean;
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
}

export interface Subcategory {
  name: string;
  description: string;
  icon: string;
  isActive: boolean;
}

export interface CreateServiceCategoryRequest {
  name: string;
  description: string;
  icon: string;
  color: string;
  sortOrder: number;
  averagePriceRange?: {
    min: number;
    max: number;
  };
  averageDuration?: number;
  isActive?: boolean;
  requiresLicense?: boolean;
  requiresSpecialEquipment?: boolean;
  metaTitle?: string;
  metaDescription?: string;
}

export interface UpdateServiceCategoryRequest {
  name?: string;
  description?: string;
  icon?: string;
  color?: string;
  isActive?: boolean;
  sortOrder?: number;
  averagePriceRange?: {
    min: number;
    max: number;
  };
  averageDuration?: number;
  requiresLicense?: boolean;
  requiresSpecialEquipment?: boolean;
  metaTitle?: string;
  metaDescription?: string;
}

export interface ServiceCategoryListResponse {
  success: boolean;
  data: {
    categories: ServiceCategory[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
}

export interface ServiceCategoryResponse {
  success: boolean;
  message?: string;
  data: {
    category: ServiceCategory;
  };
}

export interface DeleteServiceCategoryResponse {
  success: boolean;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedData<T> {
  items: T[];
  meta: PaginationMeta;
}

export interface ApiError {
  success: false;
  error: {
    code: number;
    message: string;
    details?: unknown;
  };
}

export interface ListParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'ASC' | 'DESC';
  search?: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  status?: number;
  message?: string;
}

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
}

export type ID = string | number;

export type Status = 'active' | 'inactive' | 'pending';

export type Prettify<T> = {
  [K in keyof T]: T[K]
}

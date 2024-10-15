export const API_ENDPOINT = "http://localhost:3000/v1"

// export interface Response<T> {
//   success: boolean
//   data: T | null
//   message?: string
//   errorCode?: number
// }

export interface DataWithPagination<T> {
  results: T
  page: number
  limit: number
  totalPages: number
  totalResults: number
}

export enum SORT_TYPE {
  ASC = "asc",
  DESC = "desc",
}

export interface Response<T> {
  status?: string
  data: T | null
  message?: string
}

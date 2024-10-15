export enum ROLE_ACCOUNT {
  USER = "user",
  ADMIN = "admin",
}

export interface User {
  id?: string
  email?: string
  favorite_books?: any[]
  image?: string
  isActive?: boolean
  isEmailVerified?: boolean
  my_refer_code?: string
  name?: string
  role?: ROLE_ACCOUNT
}

export type AuthInfo = {
  expires: string
  token: string
}

export type AccountInfo = {
  tokens: {
    access: AuthInfo
    refresh: AuthInfo
  }
  user: User
}

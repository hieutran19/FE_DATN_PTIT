export interface AuthInfo {
  access?: {
    expires?: string
    token?: string
  }
  refresh?: {
    expires?: string
    token?: string
  }
}

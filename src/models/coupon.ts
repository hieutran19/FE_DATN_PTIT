export type Coupon = {
  isActive: boolean
  maxPerPerson: number
  expiredAt: string
  code: string
  percent: number
  description: string
  quantity: number
  minimum_value: number
  isPublic: boolean
  remaining_amount: number
  id: string
}

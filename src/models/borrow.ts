import { Category } from "./category"
import { User } from "./user"

export type Borrow = {
  borrow_date: string
  due_date: string
  price: number
  payBy: number
  book_id: {
    genres: Category[]
    title: string
    slug: string
    id: string
  }
  duration: string
  isExpired: boolean
  id: string
  user_id: User
}

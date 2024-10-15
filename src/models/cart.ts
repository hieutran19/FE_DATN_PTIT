import { Category } from "./category"

type PriceDuration = {
  _id: string
  duration: string
  price: number
}

export type Cart = {
  refer_code: string
  book_id: {
    genres: Category[]
    title: string
    cover_image: string
    prices: PriceDuration[]
    slug: string
    id: string
  }
  duration: string
  price: number
  user_id: string
  id: string
}

import { API_ENDPOINT } from "@models/api"
import { Book } from "@models/book"
import React, { useEffect, useState } from "react"
import { Response } from "@models/api"
import Slider from "react-slick"
import { Image } from "@nextui-org/react"
import Link from "next/link"
import RateStar from "../RateStar"
import { formatCurrency } from "@utils/formatCurrency"
import Icon from "@components/icons"
import { useRouter } from "next/router"

const CustomArrow = (props: any) => {
  const { className, style, onClick } = props
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "green", borderRadius: "100%" }}
      onClick={onClick}
    />
  )
}

const SETTINGS = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 5,
  slidesToScroll: 1,
  nextArrow: <CustomArrow />,
  prevArrow: <CustomArrow />,
}

const NewBooks = () => {
  const [books, setBooks] = useState<Book[]>([])
  const route = useRouter()

  useEffect(() => {
    const handleFetchBook = async () => {
      const response = await fetch(API_ENDPOINT + `/books?sortBy=published_date:desc`)
      const raw = (await response.json()) as Response<any>
      if (raw.data?.result.results) {
        setBooks(raw.data.result.results)
      }
    }
    handleFetchBook()
  }, [])

  return (
    <div className="my-4 rounded-md bg-white p-4 shadow-lg">
      <div className="my-4 flex justify-between border-b-1 pb-2 text-slate-500">
        <p className="font-semibold">Truyện mới nhất</p>
        <Link href={`/all-book/new`} className="flex items-center gap-1 hover:text-blue-500">
          <span>Xem toàn bộ</span>
          <Icon name="arrow-right-to-line" />
        </Link>
      </div>
      <Slider {...SETTINGS} className="mx-auto flex justify-center">
        {books.map((book) => (
          <div
            key={book.title}
            className="flex w-[220px] cursor-pointer justify-center text-center"
            onClick={() => route.push(`/book/${book.slug}`)}
          >
            <div className="flex w-[200px] flex-col items-center gap-2">
              <Image
                src={`http://localhost:3000/img/books/${book.cover_image}`}
                alt={book.title}
                className="mx-auto h-[200px]"
              />
              <p className="line-clamp-3 text-black">{book.title}</p>
              <RateStar rate={book.rating} />
              <p className="uppercase text-black">{book.author}</p>
              <p className="text-green-400">Chỉ từ {formatCurrency(book.price.toString())}</p>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  )
}

export default NewBooks

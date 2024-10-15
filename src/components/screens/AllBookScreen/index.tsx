import { CustomButton } from "@components/common/CustomButton"
import RateStar from "@components/common/RateStar"
import Icon from "@components/icons"
import React, { ChangeEvent, useEffect, useState } from "react"
import { Image, Input, Pagination } from "@nextui-org/react"
import { formatCurrency } from "@utils/formatCurrency"
import { API_ENDPOINT, DataWithPagination } from "@models/api"
import { Book } from "@models/book"
import { Category } from "@models/category"
import { Response } from "@models/api"
import { useRouter } from "next/router"
import Link from "next/link"

type Props = {
  type: string
}

type ResultBooks = {
  books: DataWithPagination<Book[]>
}

enum MAPPING_TYPE {
  "new" = "New Books",
  "hot" = "Hot Books",
  "bestSeller" = "Best seller",
}

export enum LANGUAGE {
  VI = "vi",
  EN = "en",
}

export type Price = {
  from?: string
  to?: string
}

const AllBookScreen = ({ type }: Props) => {
  const [books, setBooks] = useState<DataWithPagination<Book[]> | null>()
  const [categories, setCategories] = useState<Category[]>([])
  const [page, setPage] = useState<number>(1)
  const [categoryPage, setCategoryPage] = useState<number>(1)
  const [categoryTotalPages, setCategoryTotalPages] = useState<number>(1)
  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  const route = useRouter()
  const [title, setTitle] = useState<string>("")
  const [lang, setLang] = useState<LANGUAGE>()
  const [price, setPrice] = useState<Price>({
    to: undefined,
    from: undefined,
  })

  useEffect(() => {
    if (type === "new") {
      setTitle(MAPPING_TYPE.new)
    } else if (type === "hot") {
      setTitle(MAPPING_TYPE.hot)
    } else if (type === "bestSeller") {
      setTitle(MAPPING_TYPE.bestSeller)
    }
  }, [type])

  const handleChangePrice = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name
    const value = e.target.value
    const regex = /^[+]?((0|[1-9]\d*)(\.\d*)?|(\.\d+))$/
    if (regex.test(value) || value === "") {
      if (name === "from") {
        setPrice({
          ...price,
          from: value,
        })
      }
      if (name === "to") {
        setPrice({
          ...price,
          to: value,
        })
      }
    }
  }

  useEffect(() => {
    const handleFetchBook = async () => {
      let bookType = "published_date"
      if (type === "new") {
        bookType = "published_date"
      } else if (type === "hot") {
        bookType = "access_times"
      } else if (type === "bestSeller") {
        bookType = "amount_borrowed"
      }
      let params = `/books?sortBy=${bookType}:asc&page=${page}`
      if (lang) {
        params += `&language=${lang}`
      }
      if (price?.from) {
        params += `&fromPrice=${price.from}`
      }
      if (price?.to) {
        params += `&toPrice=${price.to}`
      }
      const response = await fetch(API_ENDPOINT + params)
      const raw = (await response.json()) as Response<any>
      if (raw.data?.result?.results.length) {
        const newBooks = {
          results: raw.data.result.results,
          page: Number(raw.data.result.page),
          totalPages: Number(raw.data.result.totalPages),
          totalResults: Number(raw.data.result.totalResults),
        }
        setBooks(newBooks as DataWithPagination<Book[]>)
      } else {
        setBooks(null)
      }
    }
    handleFetchBook()
  }, [page, lang, price])

  const fetchCategories = async (page: number) => {
    const response = await fetch(API_ENDPOINT + `/genres?page=${page}&limit=8`, {
      headers: { "Content-Type": "application/json" },
    })
    const data = (await response.json()) as Response<any>
    return data
  }

  useEffect(() => {
    const handleFetchCategories = async () => {
      const data = await fetchCategories(categoryPage)
      if (data.status === "success" && data.data?.results.length) {
        setCategories((prevCategories) => {
          const uniqueCategories = [
            ...prevCategories,
            ...data.data.results.filter(
              (newCategory: Category) =>
                !prevCategories.some((existingCategory) => existingCategory.id === newCategory.id)
            ),
          ]
          return uniqueCategories
        })
        setCategoryTotalPages(data.data.totalPages)
      }
    }
    handleFetchCategories()
  }, [categoryPage])

  const loadMoreCategories = () => {
    if (categoryPage < categoryTotalPages) {
      setCategoryPage(categoryPage + 1)
      setIsExpanded(true)
    }
  }

  const showLessCategories = async () => {
    setCategories([])
    setCategoryPage(1)
    setIsExpanded(false)
    const data = await fetchCategories(1)
    if (data.status === "success" && data.data?.results.length) {
      setCategories(data.data.results)
      setCategoryTotalPages(data.data.totalPages)
    }
  }

  return (
    <div>
      <div className="bg-green-400 px-40 py-4">
        <Link href="/">Trang chủ</Link>
        <p className="text-lg font-semibold text-white">{title}</p>
      </div>
      <div className="flex gap-8 px-40 py-8">
        <div className="w-[300px] rounded-lg bg-white p-4">
          <p className="pb-4 text-lg">Chủ đề tiêu biểu</p>
          {categories.length &&
            categories.map((categoryItem) => (
              <div
                key={categoryItem.id}
                onClick={() => route.push(`/category/${categoryItem.slug}`)}
                className="flex cursor-pointer items-center gap-1 border-b-2 py-2 text-sm"
              >
                <Icon name="folder-open" />
                <p>{categoryItem.name}</p>
              </div>
            ))}
          {isExpanded && (
            <CustomButton onClick={showLessCategories} className="mt-4 w-full">
              Thu gọn
            </CustomButton>
          )}
          {!isExpanded && categoryPage < categoryTotalPages && (
            <CustomButton onClick={loadMoreCategories} className="mt-4 w-full">
              Xem thêm
            </CustomButton>
          )}
          <p className="py-4 text-lg">Theo ngôn ngữ</p>
          <div className="flex gap-2">
            <CustomButton onClick={() => setLang(LANGUAGE.VI)} isGhost={lang !== LANGUAGE.VI}>
              Tiếng Việt
            </CustomButton>
            <CustomButton onClick={() => setLang(LANGUAGE.EN)} isGhost={lang !== LANGUAGE.EN}>
              Tiếng Anh
            </CustomButton>
          </div>
          <p className="py-4 text-lg">Theo giá</p>
          <div className="flex gap-2">
            <Input label="Từ" value={price.from} startContent="$" name="from" onChange={handleChangePrice} />
            <Input label="Đến" value={price.to} startContent="$" name="to" onChange={handleChangePrice} />
          </div>
        </div>
        <div className="w-full">
          <div className="flex w-full flex-wrap justify-center gap-8 rounded-lg bg-white p-4 py-8">
            {books?.results?.length ? (
              books.results.map((book) => (
                <div
                  key={book.title}
                  className="flex h-[440px] w-[220px] cursor-pointer justify-center rounded-xl bg-gray-200 py-2 text-center"
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
              ))
            ) : (
              <div className="text-center">
                <p className="mb-1 text-xl font-semibold">Không có kết quả nào</p>
                <p>Hãy thử tìm kiếm với từ khoá khác</p>
              </div>
            )}
          </div>
          {books?.totalPages && books.totalPages > 1 ? (
            <Pagination
              color="success"
              className="mt-4"
              showControls
              total={books.totalPages}
              initialPage={page}
              onChange={(pageChanged: number) => setPage(pageChanged)}
            />
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  )
}

export default AllBookScreen

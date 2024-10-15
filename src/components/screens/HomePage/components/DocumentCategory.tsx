import { CustomButton } from "@components/common/CustomButton"
import { Input } from "@nextui-org/react"
import React, { ChangeEvent, KeyboardEventHandler, useEffect, useRef, useState } from "react"
import Icon from "@components/icons"
import { BookGrid } from "./BookGrid"
import { Category } from "@models/category"
import { API_ENDPOINT } from "@models/api"
import { Response } from "@models/api"
import { Link } from "lucide-react"
import { useRouter } from "next/router"
import { Book } from "@models/book"

const CATEGORYS = [
  "Khoa học cơ bản",
  "Môi trường",
  "NXB Nông nghiệp",
  "Khoa học cơ bản",
  "Môi trường",
  "NXB Nông nghiệp",
  "Khoa học cơ bản",
  "Môi trường",
  "NXB Nông nghiệp",
]

export type Banner = {
  isActive: boolean
  due_date: string | null
  name: string
  image: string
  id: string
}

const DocumentCategory = () => {
  const route = useRouter()
  const [catagories, setCategories] = useState<Category[]>([])
  const [search, setSearch] = useState<string>("")
  const searchRef = useRef<HTMLInputElement>(null)
  const [banners, setBanners] = useState<Banner[]>()

  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const onSearch = () => {
    route.push(`/search?keyword=${search}`)
  }

  useEffect(() => {
    if (searchRef.current) {
      searchRef.current.addEventListener("keypress", (e: any) => {
        if (e.key === "Enter") {
          e.preventDefault()
          route.push(`/search?keyword=${search}`)
        }
      })
    }
    return () => {
      searchRef.current?.removeEventListener("keypress", (e: any) => {
        if (e.key === "Enter") {
          e.preventDefault()
          route.push(`/search?keyword=${search}`)
        }
      })
    }
  }, [search])

  useEffect(() => {
    const handleFetchCategorys = async () => {
      const response = await fetch(API_ENDPOINT + "/genres?page=1&limit=8", {
        headers: { "Content-Type": "application/json" },
      })
      const data = (await response.json()) as Response<any>
      console.log(data)
      if (!!data?.data?.results.length) {
        setCategories(data.data.results)
      }
    }
    handleFetchCategorys()
  }, [])

  console.log(catagories)

  useEffect(() => {
    const handleFetchBanners = async () => {
      const response = await fetch(API_ENDPOINT + "/banners?isActive=true", {
        headers: { "Content-Type": "application/json" },
      })
      const raw = (await response.json()) as Response<any>
      if (!!raw?.data?.results?.length) {
        setBanners(raw.data.results)
      }
    }
    handleFetchBanners()
  }, [])

  return (
    <>
      <div className="flex h-[60px] items-center justify-between bg-green-500 px-40">
        <div className="flex h-full">
          <div className="flex h-full w-72 items-center gap-4 whitespace-nowrap bg-green-400 px-8 font-bold text-white">
            <Icon name="align-justify" />
            DANH MỤC TRUYỆN
          </div>
        </div>
        <Input
          type="email"
          placeholder="Tìm truyện, tác giả, sản phẩm mong muốn..."
          className="w-[400px]"
          labelPlacement="outside"
          endContent={<Icon name="search" onClick={onSearch} />}
          onChange={handleChangeSearch}
          ref={searchRef}
        />
        <CustomButton
          startContent={<Icon name="book-open-check" />}
          onClick={() => route.push("/profile/purchased-books")}
        >
          Truyện của tôi
        </CustomButton>
      </div>
      <div className="flex bg-green-400 px-40">
        <div className="relative h-[428px] w-72 bg-white">
          <div className="flex h-[428px] w-72 flex-col bg-white">
            {catagories.map((category) => (
              <div
                onClick={() => route.push(`/category/${category.slug}`)}
                key={category.id}
                className="flex cursor-pointer gap-1 border-b-1 px-4 py-2 text-slate-500 hover:text-slate-600"
              >
                <Icon name="book" />
                {category.name}
              </div>
            ))}
            <div
              className="flex h-full cursor-pointer items-center justify-center gap-1 text-green-400 hover:text-green-500"
              onClick={() => route.push("/all-book/new")}
            >
              <Icon name="align-justify" />
              Xem tất cả danh mục
            </div>
          </div>
        </div>
        <BookGrid banners={banners} />
      </div>
    </>
  )
}

export default DocumentCategory

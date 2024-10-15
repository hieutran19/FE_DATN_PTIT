import React, { useEffect, useState } from "react"
import Slider from "react-slick"
import { BentoGridItem } from "@components/common/BentoGrid"
import { SETTINGS } from "@constants/slick"
import { Image } from "@nextui-org/react"
import { Book } from "@models/book"
import { API_ENDPOINT } from "@models/api"
import { Response } from "@models/api"
import { useRouter } from "next/router"
import { Banner } from "./DocumentCategory"

// const IMAGES = [
//   "https://static01.nyt.com/images/2021/04/04/pageoneplus/bookreview_itt_lede/bookreview_itt_lede-superJumbo.jpg",
//   "https://media.npr.org/assets/img/2021/02/05/gettyimages-1250276752-832bdef38dd1834d8190b0dafba4049084cd7edf.jpg",
// ]

type Props = {
  banners?: Banner[]
}

export function BookGrid({ banners }: Props) {
  const [books, setBooks] = useState<Book[]>([])
  const route = useRouter()

  useEffect(() => {
    const handleFetchBook = async () => {
      const response = await fetch(API_ENDPOINT + `/books?sortBy=access_times:desc`)
      const raw = (await response.json()) as Response<any>
      if (raw.data?.result.results) {
        setBooks(raw.data.result.results)
      }
    }
    handleFetchBook()
  }, [])

  return (
    <div className="w-full py-2 pl-4">
      <div className="mb-4 flex w-full">
        <div className="relative mr-4 h-[420px] w-[960px] px-4">
          <Slider {...SETTINGS} className="z-1 h-full w-[920px]">
            {banners?.length &&
              banners.map((image) => (
                <Image
                  key={image.id}
                  src={`http://localhost:3000/img/banners/${image.image}`}
                  alt="image"
                  className="h-[420px] w-full"
                />
              ))}
          </Slider>
        </div>
        <div className="flex w-full flex-col gap-4">
          <BentoGridItem
            title={books[0]?.title ?? ""}
            description={""}
            header={
              <Image
                src={`http://localhost:3000/img/books/${books[0]?.cover_image}`}
                alt={books[0]?.title}
                className="mx-auto h-[330px]"
              />
            }
            onClick={() => route.push(`/book/${books[0].slug}`)}
          />
        </div>
      </div>
    </div>
  )
}

const Skeleton = () => (
  <div className="flex h-full min-h-[6rem] w-full flex-1 rounded-xl bg-gradient-to-br from-neutral-200 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800"></div>
)

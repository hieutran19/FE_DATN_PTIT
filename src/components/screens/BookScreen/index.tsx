import Icon from "@components/icons"
import { cn } from "@utils/cn"
import React, { ChangeEvent, useEffect, useRef, useState } from "react"
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  Pagination,
  Textarea,
  useDisclosure,
} from "@nextui-org/react"
import Slider from "react-slick"
import { Star } from "lucide-react"
import RateStar from "@components/common/RateStar"
import { formatCurrency } from "@utils/formatCurrency"
import { CustomButton } from "@components/common/CustomButton"
import { MOCK_BOOKS } from "@constants/book"
import { Book } from "@models/book"
import { API_ENDPOINT, DataWithPagination } from "@models/api"
import { Response } from "@models/api"
import moment from "moment"
import { detectLanguage } from "@utils/detectLanguage"
import { useBoundStore } from "@zustand/total"
import { NOTIFICATION_TYPE, notify } from "@utils/notify"
import BookType from "@components/common/BookType"
import PdfViewer from "@components/common/PdfViewer"
import copy from "copy-to-clipboard"
import { useRouter } from "next/router"
import { useSearchParams } from "next/navigation"
import ReviewItem from "./components/ReviewItem"

type Props = {
  id: string
}

export type Review = {
  rating: number
  comment: string
  isAdjusted: string
  book_id: string
  user_id: {
    image: string
    name: string
    id: string
  }
}

const BookScreen = ({ id }: Props) => {
  const sliderRef = useRef<any>(null)
  const [selectImage, setSelectImage] = useState<string>()
  const [isPreview, setIsPreview] = useState<boolean>(false)
  const [comment, setComment] = useState<string>("")
  const [isCommentNull, setIsCommentNull] = useState<boolean>(false)
  const [rating, setRating] = useState<number>(5)
  const [book, setBook] = useState<Book>()
  const [duration, setDuration] = useState<string>("1 month")
  const { authInfo, accountInfo } = useBoundStore((state) => ({
    authInfo: state.authInfo,
    accountInfo: state.accountInfo,
  }))
  const [pdfBuffer, setPdfBuffer] = useState<ArrayBuffer>()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const route = useRouter()
  const searchParams = useSearchParams()
  const [reviews, setReviews] = useState<DataWithPagination<Review[]>>()
  const [page, setPage] = useState<number>(1)
  const [isUpdateReviews, setIsUpdateReviews] = useState<boolean>(false)

  const handleSelectReview = (reviewSelected: Review) => {
    setComment(reviewSelected.comment)
    setRating(reviewSelected.rating)
  }

  const handleFetchReviews = async () => {
    const response = await fetch(API_ENDPOINT + `/books/${book?.id}/reviews?limit=8&page=${page}`, {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${authInfo?.access?.token}`,
      },
    })
    const raw = (await response.json()) as Response<DataWithPagination<Review[]>>
    if (raw.data?.results) {
      setReviews(raw.data)
    }
  }
  useEffect(() => {
    if (book?.id) {
      handleFetchReviews()
    }
  }, [page, book?.id, isUpdateReviews])

  const handleAddToCart = async (isBuyNow: boolean = false) => {
    const refer_code = searchParams.get("refer_code")
    const priceCalculated = book?.prices.find((price) => price.duration === duration)?.price
    const response = await fetch(API_ENDPOINT + "/carts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authInfo.access?.token}`,
      },
      body: JSON.stringify({
        book_id: book?.id,
        duration: duration,
        price: priceCalculated,
        refer_code,
      }),
    })
    const raw = (await response.json()) as Response<null>
    if (raw.status === "success") {
      notify(NOTIFICATION_TYPE.SUCCESS, "Thêm vào giỏ hàng thành công")
      if (isBuyNow) {
        route.push("/cart")
      }
    } else {
      notify(NOTIFICATION_TYPE.ERROR, raw?.message ? raw?.message : "Có lỗi xảy ra, vui này thử được!")
    }
  }

  const handleReview = async () => {
    if (comment) {
      const response = await fetch(API_ENDPOINT + "/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authInfo.access?.token}`,
        },
        body: JSON.stringify({
          book_id: book?.id,
          comment,
          rating,
        }),
      })
      const raw = (await response.json()) as Response<null>
      if (raw.status !== "success") {
        notify(NOTIFICATION_TYPE.ERROR, raw.message ? raw.message : "Có lỗi xảy ra, vui lòng thử lại!")
      } else {
        notify(NOTIFICATION_TYPE.SUCCESS, "Bình luận thành công")
        setIsPreview(!isPreview)
        handleFetchReviews()
      }
    } else {
      setIsCommentNull(true)
    }
  }

  const handleChangeComment = (e: ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value)
    if (e.target.value) {
      setIsCommentNull(false)
    }
  }

  useEffect(() => {
    if (id) {
      const handleFetchBook = async () => {
        const response = await fetch(API_ENDPOINT + `/books/search/${id}`)
        const raw = (await response.json()) as Response<{ book: Book }>
        if (raw.data?.book) {
          setBook(raw.data.book)
          setSelectImage(raw.data.book.cover_image)
        }
      }
      handleFetchBook()
    }
  }, [id])

  useEffect(() => {
    if (book?.id) {
      const handleFetchPreviewPDF = async () => {
        const response = await fetch(API_ENDPOINT + `/books/preview/${book.id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authInfo.access?.token}`,
          },
        })
        if (response.ok) {
          const blob = await response.blob
          console.log(blob)
        }
      }
      handleFetchPreviewPDF()
    }
  }, [book])

  const next = () => {
    sliderRef.current.slickNext()
  }

  const prev = () => {
    sliderRef.current.slickPrev()
  }

  const handleShare = () => {
    copy(`localhost:3002/book/${id}?refer_code=${accountInfo?.my_refer_code}`)
    notify(NOTIFICATION_TYPE.SUCCESS, "Copy referral link successfully!")
  }

  useEffect(() => {
    const handleIncreaseView = async () => {
      await fetch(API_ENDPOINT + `/books/increase-view/${book?.id}`)
    }
    handleIncreaseView()
  }, [book])

  useEffect(() => {
    const refer_code = searchParams.get("refer_code")
    if (refer_code) {
      const handleReferCodeClick = async () => {
        await fetch(`${API_ENDPOINT}/affiliates/${refer_code}/click`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
      }
      handleReferCodeClick()
    }
  }, [searchParams])

  return (
    <div className="px-40 py-4">
      {book?.id && (
        <PdfViewer title={book.title} bookId={book.id} isOpen={isOpen} onOpen={onOpen} onOpenChange={onOpenChange} />
      )}
      <p>Trang chủ / {book?.title}</p>
      <div className="my-8 flex gap-8 rounded-lg bg-white p-8">
        <div className="slider-container flex h-fit w-[140px] flex-col items-center rounded-lg bg-gray-100">
          <Icon name="chevron-up" />
          <div key={book?.cover_image} className="flex w-full justify-center" style={{ display: "flex !important" }}>
            <Image src={`http://localhost:3000/img/books/${book?.cover_image}`} width={60} className="rounded-none" />
          </div>
          <Icon name="chevron-down" />
        </div>
        <div className="flex flex-col items-center gap-12">
          <Image src={`http://localhost:3000/img/books/${selectImage}`} width={200} className="rounded-none" />
          <CustomButton color="default" onClick={onOpen}>
            Xem trước
          </CustomButton>
        </div>
        <div className="w-[80%]">
          <p className="text-lg font-semibold">{book?.title}</p>
          <div className="my-4 flex gap-8">
            <div className="flex items-center gap-1 border-r-2 px-2">
              <p className="font-semibold">{book?.rating}</p>
              <RateStar rate={book?.rating ?? 0} />
            </div>
            <div className="flex items-center gap-1 border-r-2 px-2">
              <p className="font-semibold">{book?.rating_count}</p>
              <p>Lượt đánh giá</p>
            </div>
            <div className="flex items-center gap-1 border-r-2 px-2">
              <p className="font-semibold">{book?.access_times}</p>
              <p>Luợt xem</p>
            </div>
            <div className="flex items-center gap-1 border-r-2 px-2">
              <p className="font-semibold">{book?.amount_borrowed}</p>
              <p>Lượt đã bán</p>
            </div>
            <div
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300"
              onClick={handleShare}
            >
              <Icon name="share" width={20} />
            </div>
          </div>
          <div className="w-full rounded-lg bg-gray-100 p-8">
            <p className="pb-4 text-lg font-semibold">Chọn sản phẩm</p>
            <div className="flex items-center gap-4 rounded-lg bg-white p-4">
              <Dropdown>
                <DropdownTrigger>
                  <Button variant="bordered" endContent={<Icon name="chevron-down" />}>
                    {duration === "forever" ? "Vĩnh viễn" : duration.split(" ")[0] + " tháng"}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Static Actions">
                  {!!book?.prices.length ? (
                    book.prices.map((price) => (
                      <DropdownItem key={price.duration} onPress={() => setDuration(price.duration)}>
                        {price.duration === "forever" ? "Vĩnh viễn" : `${price.duration.split(" ")[0]} tháng`}
                      </DropdownItem>
                    ))
                  ) : (
                    <DropdownItem></DropdownItem>
                  )}
                </DropdownMenu>
              </Dropdown>
              <p>
                {formatCurrency(book?.prices.find((price) => price.duration === duration)?.price.toString() ?? "0")}
              </p>
            </div>
            <div className="my-4 border-t-2 py-4">
              <p className="pb-2 font-semibold">Thành tiền</p>
              <div className="flex w-full gap-2">
                <CustomButton color="green" className="basis-1/2" onClick={() => handleAddToCart(true)}>
                  Mua ngay
                </CustomButton>
                <CustomButton color="green" className="basis-1/2" isGhost onClick={() => handleAddToCart()}>
                  Thêm vào giỏ
                </CustomButton>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="rounded-lg bg-white p-8">
        <div className="flex gap-4">
          <div className="basis-1/2 border-r-2">
            <p>Tác giả: </p>
            <div className="flex items-center gap-2 pt-2">
              <Avatar />
              <p className="font-semibold">{book?.author}</p>
            </div>
          </div>
          <div className="basis-1/2">
            <p>Được bán bởi: </p>
            <div className="flex items-center gap-2 pt-2">
              <Image src="/images/logo.png" width={40} />
              <p className="font-semibold">SmartOSC Book Store</p>
            </div>
          </div>
        </div>
        <div className="flex gap-4 pt-6">
          <div className="basis-1/2 border-r-2">
            <p className="text-lg">Thông tin xuất bản:</p>
            <div className="ml-2">
              <div>
                <span className="font-semibold">- Năm xuất bản: </span>
                <span>{moment(book?.published_date).locale('vi').format('DD/MM/YYYY')}</span>
              </div>
              <div>
                <span className="font-semibold">- Mã ISBN: </span>
                <span>{book?.isbn}</span>
              </div>
              <div>
                <span className="font-semibold">- Loại sách: </span>
                <span>{book?.genres[0].name}</span>
              </div>
              <div>
                <span className="font-semibold">- Số trang: </span>
                <span>{book?.total_book_pages}</span>
              </div>
              <div>
                <span className="font-semibold">- Ngôn ngữ: </span>
                <span>{detectLanguage(book?.language)}</span>
              </div>
            </div>
          </div>
          <div className="basis-1/2">
            <p className="text-lg">Tóm tắt truyện:</p>
            <p>{book?.summary}</p>
          </div>
        </div>
      </div>
      <div className="mt-8 rounded-lg bg-white p-8">
        {reviews?.totalPages && reviews?.totalPages > 1 ? (
          <Pagination
            color="success"
            className="mt-4"
            showControls
            total={reviews.totalPages}
            initialPage={page}
            onChange={(pageChanged: number) => setPage(pageChanged)}
          />
        ) : (
          ""
        )}
        <div className="mb-4 flex flex-wrap">
          {reviews?.results.length
            ? reviews.results.map((review) => <ReviewItem review={review} handleSelectReview={handleSelectReview} />)
            : "Chưa có lượt đánh giá nào."}
        </div>
        <p className="mb-4 text-xl font-semibold">Bình luận</p>
        <Textarea
          placeholder="Để lại bình luận của bạn"
          className="mb-4 max-w-xs"
          onChange={handleChangeComment}
          value={comment}
        />
        {isCommentNull && (
          <p className="-mt-2 mb-2 text-xs text-red-400">Vui lòng ghi nhận xét trước khi gửi bình luận.</p>
        )}
        <div className="mb-2 flex gap-1">
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <Icon
                name="star"
                key={index}
                onClick={() => setRating(index + 1)}
                className={`${index <= rating - 1 ? "text-yellow-400" : ""} cursor-pointer`}
              />
            ))}
        </div>
        <CustomButton onClick={handleReview} isDisabled={isCommentNull}>
          Gửi bình luận
        </CustomButton>
      </div>
      <div>
        <BookType />
      </div>
    </div>
  )
}

export default BookScreen

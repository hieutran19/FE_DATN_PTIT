import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react"
import React, { useEffect, useState } from "react"
import { ACCESS_STATUS, Book } from "@models/book"
import { API_ENDPOINT, DataWithPagination, Response } from "@models/api"
import RateStar from "@components/common/RateStar"
import { useBoundStore } from "@zustand/total"
import Link from "next/link"
import moment from "moment"
import { CustomButton } from "@components/common/CustomButton"
import ReadBook from "@components/common/ReadBook"
import { NOTIFICATION_TYPE, notify } from "@utils/notify"

type BookResponse = {
  books: DataWithPagination<Book[]>
  status: string
}

const columns = [
  {
    key: "title",
    label: "Tên sách",
  },
  {
    key: "author",
    label: "Tác giả",
  },
  {
    key: "rating",
    label: "Đánh giá",
  },
  {
    key: "action",
    label: "Đọc sách",
  },
]

const BooksHasBought = () => {
  const [books, setBooks] = useState<DataWithPagination<Book[]>>()
  const [page, setPage] = useState<number>(1)
  const { authInfo } = useBoundStore((state) => ({
    authInfo: state.authInfo,
  }))
  const [bookRead, setBookRead] = useState<Book>()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  useEffect(() => {
    const handleFetchBooks = async () => {
      const token = "Bearer " + authInfo.access?.token
      const response = await fetch(API_ENDPOINT + `/users/my-books?page=${page}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      })
      const raw = (await response.json()) as BookResponse
      if (raw.status === "success") {
        setBooks(raw.books)
      }
    }
    handleFetchBooks()
  }, [])

  const handleReadBook = (bookSelected: Book) => {
    setBookRead(bookSelected)
    onOpen()
  }

  const handleDownload = async (book: Book) => {
    const response = await fetch(API_ENDPOINT + `/books/download/${book.id}`, {
      headers: {
        authorization: `Bearer ${authInfo?.access?.token}`,
      },
    })
    if (response.status === 200) {
      notify(NOTIFICATION_TYPE.SUCCESS, "Đang tải sách về!")
      const contentDisposition = response.headers.get("Content-Disposition")
      let filename = book.slug
      const blob = await response.blob()

      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob)

      // Create a temporary link element
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()

      // Clean up
      a.remove()
      window.URL.revokeObjectURL(url)
    } else {
      notify(NOTIFICATION_TYPE.ERROR, "Có lỗi xảy ra khi tải truyện, vui lòng thử lại")
    }
  }

  return (
    <div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="full" placement="center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Read book: {bookRead?.title}</ModalHeader>
              <ModalBody>{bookRead && <ReadBook bookId={bookRead.id} />}</ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <div className="flex items-center justify-between border-b-1 px-10 py-6">
        <p className="font-semibold">Truyện bạn đã muợn/mua</p>
        <Dropdown>
          <DropdownTrigger>
            <Button variant="bordered">Sắp xếp theo</Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Static Actions">
            <DropdownItem key="time">Theo thời gian</DropdownItem>
            <DropdownItem key="price-asc">Theo giá từ thấp đến cao</DropdownItem>
            <DropdownItem key="price-desc">Theo giá từ cao đến thấp</DropdownItem>
            <DropdownItem key="date">Theo năm xuất bản</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <div className="px-10">
        <Table aria-label="Example table with dynamic content">
          <TableHeader columns={columns}>
            {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
          </TableHeader>
          {books?.results ? (
            <TableBody items={books?.results}>
              {(item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Link href={`/book/${item?.slug}`}>{item?.title}</Link>
                  </TableCell>
                  <TableCell>{item.author}</TableCell>
                  <TableCell>
                    <RateStar rate={item.rating} />
                  </TableCell>
                  <TableCell className="flex gap-1">
                    <CustomButton onClick={() => handleReadBook(item)}>Đọc truyện</CustomButton>
                    {item.access_status === ACCESS_STATUS.DOWNLOAD && (
                      <CustomButton onClick={() => handleDownload(item)}>Tải truyện</CustomButton>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          ) : (
            <TableBody emptyContent={"Bạn chưa có lịch sử mua/mượn sách."}>{[]}</TableBody>
          )}
        </Table>
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
  )
}

export default BooksHasBought

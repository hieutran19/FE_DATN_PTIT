import { AdminLayout } from "@components/layouts/adminLayout"
import { API_ENDPOINT, DataWithPagination } from "@models/api"
import { BOOK_LANGUAGES, Book } from "@models/book"
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Link,
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
import React, { ChangeEvent, useEffect, useState } from "react"
import { Response } from "@models/api"
import { CustomButton } from "@components/common/CustomButton"
import moment from "moment"
import Icon from "@components/icons"
import { useBoundStore } from "@zustand/total"
import { NOTIFICATION_TYPE, notify } from "@utils/notify"
import { Category } from "@models/category"

type Column = {
  name: string
  uid: string
}

type Review = {
  rating: number
  comment: string
  isAdjusted: boolean
  book_id: {
    title: string
    slug: string
    id: string
  }
  user_id: {
    image: string
    name: string
    id: string
  }
  id: string
}

const columns: Column[] = [
  { name: "TÊN SÁCH", uid: "book_title" },
  { name: "NGƯỜI DÙNG", uid: "user_name" },
  { name: "ĐÁNH GIÁ", uid: "rating" },
  { name: "BÌNH LUẬN", uid: "comment" },
  { name: "HÀNH ĐỘNG", uid: "action" },
]

const ManageReviews = () => {
  const [page, setPage] = useState<number>(1)
  const [reviews, setReviews] = useState<DataWithPagination<Review[]>>()
  const [limit, setLimit] = useState<number>(5)
  const [isStaleData, setIsStaleData] = useState<boolean>(false)
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)
  const [reviewToDelete, setReviewToDelete] = useState<string>("")

  const { authInfo } = useBoundStore((state) => ({
    authInfo: state.authInfo,
  }))

  const handleDeleteReview = async () => {
    const response = await fetch(API_ENDPOINT + `/reviews/${reviewToDelete}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${authInfo.access?.token}`,
      },
    })
    if (response.status === 200) {
      notify(NOTIFICATION_TYPE.SUCCESS, "Đánh giá đã được xoá thành công")
      setIsStaleData(!isStaleData)
    } else {
      notify(NOTIFICATION_TYPE.ERROR, "Có lỗi xảy ra, vui lòng thử lại")
    }
    setDeleteModalOpen(false)
  }

  useEffect(() => {
    const handleFetchReviews = async () => {
      let params = `/reviews?page=${page}&limit=${limit}`
      const response = await fetch(API_ENDPOINT + params, {
        headers: {
          authorization: `Bearer ${authInfo?.access?.token}`,
        },
      })
      const raw = (await response.json()) as Response<any>
      if (raw.status === "success" && raw?.data?.results.length) {
        setReviews(raw.data)
      }
    }
    handleFetchReviews()
  }, [isStaleData, page, limit])

  const handleOpenDeleteModal = (reviewId: string) => {
    setReviewToDelete(reviewId)
    setDeleteModalOpen(true)
  }

  const handleCloseDeleteModal = () => {
    setReviewToDelete("")
    setDeleteModalOpen(false)
  }

  return (
    <AdminLayout>
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onOpenChange={setDeleteModalOpen}
        scrollBehavior="inside"
        placement="center"
        size="sm"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Xác nhận xoá</ModalHeader>
              <ModalBody>
                <p>Bạn có chắc chắn muốn xoá đánh giá này không?</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={handleCloseDeleteModal}>
                  Huỷ
                </Button>
                <CustomButton color="danger" onPress={handleDeleteReview}>
                  Xoá
                </CustomButton>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <div className="px-8 py-4">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-400">Tổng: {reviews?.totalResults} đánh giá</p>
            <Pagination showControls total={reviews?.totalPages ?? 1} page={page} color="success" onChange={setPage} />
          </div>
          <Table aria-label="Example table with custom cells">
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            {reviews?.results?.length ? (
              <TableBody items={reviews.results}>
                {(item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Link href={`/book/${item.book_id.slug}`} className="text-black hover:text-gray-600">
                        {item.book_id.title}
                      </Link>
                    </TableCell>
                    <TableCell>{item.user_id.name}</TableCell>
                    <TableCell>{item.rating}</TableCell>
                    <TableCell>{item.comment}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Chip color="danger" className="cursor-pointer" onClick={() => handleOpenDeleteModal(item.id)}>
                          Xoá
                        </Chip>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            ) : (
              <TableBody emptyContent={"Không có dữ liệu đánh giá nào."}>{[]}</TableBody>
            )}
          </Table>
        </div>
      </div>
    </AdminLayout>
  )
}

export default ManageReviews

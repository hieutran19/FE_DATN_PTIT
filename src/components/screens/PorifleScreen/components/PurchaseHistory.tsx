import {
  Chip,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  getKeyValue,
} from "@nextui-org/react"
import React, { useEffect, useState } from "react"
import { API_ENDPOINT, DataWithPagination } from "@models/api"
import { Borrow } from "@models/borrow"
import { useBoundStore } from "@zustand/total"
import { Response } from "@models/api"
import moment from "moment"
import { useRouter } from "next/router"
import { CustomButton } from "@components/common/CustomButton"
import Link from "next/link"

const columns = [
  {
    key: "title",
    label: "Tên sách",
  },
  {
    key: "borrow_date",
    label: "Ngày mượn",
  },
  {
    key: "due_date",
    label: "Ngày hết hạn",
  },
  {
    key: "duration",
    label: "Thời hạn",
  },
  {
    key: "isExpired",
    label: "Tình trạng",
  },
]

const PurchaseHistory = () => {
  const route = useRouter()
  const { authInfo, accountInfo } = useBoundStore((state) => ({
    authInfo: state.authInfo,
    accountInfo: state.accountInfo
  }))

  const [borrows, setBorrows] = useState<DataWithPagination<Borrow[]>>()
  const [page, setPage] = useState<number>(1)

  useEffect(() => {
    const handleFetchBorrows = async () => {
      const response = await fetch(API_ENDPOINT + `/users/${accountInfo?.id}/records?page=${page}`, {
        headers: { "Content-Type": "application/json", authorization: `Bearer ${authInfo.access?.token}` },
      })
      const data = (await response.json()) as Response<any>
      if (data?.data?.result) {
        setBorrows(data.data.result)
      }
    }
    handleFetchBorrows()
  }, [page])

  return (
    <div className="px-12 py-10">
      <p className="mb-8 text-xl font-semibold">Lịch sử mua/mượn truyện</p>
      <Table aria-label="Example table with dynamic content">
        <TableHeader columns={columns}>
          {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
        </TableHeader>
        {borrows?.results ? (
          <TableBody items={borrows?.results}>
            {(item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Link href={`/book/${item.book_id?.slug}`}>{item.book_id?.title}</Link>
                </TableCell>
                <TableCell>{moment(item.borrow_date).format("L")}</TableCell>
                <TableCell>{item.due_date ? moment(item.due_date).format("L") : "Vĩnh viễn"}</TableCell>
                <TableCell>{item.duration === 'forever' ? "Vĩnh viễn" : item.duration.replaceAll(/\bmonths?\b/gi, "tháng")}</TableCell>
                <TableCell>
                  {item.isExpired ? (
                    <Chip color="danger">Đã hết hạn</Chip>
                  ) : (
                    <Chip color="success" className="text-white">
                      Chưa hết hạn
                    </Chip>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        ) : (
          <TableBody emptyContent={"Bạn chưa có lịch sử mua/mượn truyện."}>{[]}</TableBody>
        )}
      </Table>
      {borrows?.totalPages && borrows.totalPages > 1 ? (
        <Pagination
          color="success"
          className="mt-4"
          showControls
          total={borrows.totalPages}
          initialPage={page}
          onChange={(pageChanged: number) => setPage(pageChanged)}
        />
      ) : (
        ""
      )}
    </div>
  )
}

export default PurchaseHistory

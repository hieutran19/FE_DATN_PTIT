import { AdminLayout } from "@components/layouts/adminLayout"
import { API_ENDPOINT, DataWithPagination } from "@models/api"
import { BOOK_LANGUAGES, Book } from "@models/book"
import {
  Avatar,
  Button,
  Checkbox,
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
import { DatePicker } from "@nextui-org/date-picker"
import { parseDate, getLocalTimeZone, DateValue } from "@internationalized/date"
import React, { ChangeEvent, useEffect, useState } from "react"
import { Response } from "@models/api"
import { CustomButton } from "@components/common/CustomButton"
import moment from "moment"
import Icon from "@components/icons"
import { useBoundStore } from "@zustand/total"
import { NOTIFICATION_TYPE, notify } from "@utils/notify"
import { Category } from "@models/category"
import { Borrow } from "@models/borrow"
import { User } from "@models/user"

type Column = {
  name: string
  uid: string
}

type Price = {
  duration: string
  price: number
}

type BookSelected = {
  title: string
  author: string
  published_date?: string
  isbn: string
  summary: string
  cover_image: string
  total_book_pages: number
  digital_content: number
  prices: Price[]
  languange: BOOK_LANGUAGES
  price: number
}

const columns: Column[] = [
  { name: "MÃ GIAO DỊCH", uid: "id" },
  { name: "TÊN SÁCH", uid: "title" },
  { name: "NGƯỜI MUA", uid: "user_id" },
  { name: "THỜI HẠN", uid: "duration" },
  { name: "NGÀY GIAO DỊCH", uid: "borrow_date" },
  { name: "GIÁ", uid: "price" },
]

type CreateRecord = {
  book_id: string
  user_id: string
  price: string
  duration: string
}

const ManageRecords = () => {
  const [search, setSearch] = useState<string>("")
  const [page, setPage] = useState<number>(1)
  const [records, setRecords] = useState<DataWithPagination<Borrow[]>>()
  const [limit, setLimit] = useState<number>(5)
  const [startDate, setStartDate] = useState<string | null>(null)
  const [endDate, setEndDate] = useState<string | null>(null)
  const [isStaleData, setIsStaleData] = useState<boolean>(false)
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
  const [recordSelected, setRecordSelected] = useState<CreateRecord>({
    book_id: "",
    user_id: "",
    price: "",
    duration: "",
  })

  const { authInfo } = useBoundStore((state) => ({
    authInfo: state.authInfo,
  }))

  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    setPage(1)
  }

  const handleFetchRecords = async () => {
    let params = `/borrow-records?page=${page}&limit=${limit}`
    if (search) {
      params += `&title=${search}`
    }
    if (startDate) {
      params += `&from=${startDate}`
    }
    if (endDate) {
      params += `&to=${endDate}`
    }
    const response = await fetch(API_ENDPOINT + params, {
      headers: {
        authorization: `Bearer ${authInfo?.access?.token}`,
      },
    })
    const raw = (await response.json()) as Response<any>
    console.log(raw)
    if (raw.status === "success" && raw?.data?.result) {
      setRecords(raw.data.result)
    }
  }
  useEffect(() => {
    handleFetchRecords()
  }, [search, isStaleData, page, limit])

  const handleChangeRecordSelected = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name
    const value = e.target.value
    setRecordSelected({
      ...recordSelected,
      [name]: value,
    })
  }

  const handleDateChange = () => {
    handleFetchRecords()
  }

  const handleCloseModal = () => {
    setRecordSelected({ book_id: "", user_id: "", price: "", duration: "" })
    onClose()
  }

  const handleCreateRecord = async () => {
    const response = await fetch(API_ENDPOINT + `/borrow-records`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${authInfo.access?.token}`,
      },
      body: JSON.stringify({
        ...recordSelected,
      }),
    })
    if (response.status === 201) {
      notify(NOTIFICATION_TYPE.SUCCESS, "Tạo mới chủ đề thành công")
      handleCloseModal()
      setIsStaleData(!isStaleData)
    } else {
      notify(NOTIFICATION_TYPE.ERROR, "Có lỗi xảy ra, vui lòng thử lại")
      handleCloseModal()
    }
  }

  const [users, setUsers] = useState<DataWithPagination<User[]>>()
  const [pageUser, setPageUser] = useState<number>(1)
  const [searchUser, setSearchUser] = useState<string>("")

  useEffect(() => {
    const handleFetchUsers = async () => {
      let params = `/users?page=${pageUser}&limit=${limit}`
      if (searchUser) {
        params += `&name=${searchUser}`
      }
      const response = await fetch(API_ENDPOINT + params, {
        headers: {
          authorization: `Bearer ${authInfo?.access?.token}`,
        },
      })
      const raw = (await response.json()) as Response<any>
      if (raw.status === "success") {
        setUsers(raw.data.result as DataWithPagination<User[]>)
      }
    }
    handleFetchUsers()
  }, [pageUser, searchUser, isStaleData])

  const [books, setBooks] = useState<DataWithPagination<Book[]>>()
  const [pageBook, setPageBook] = useState<number>(1)
  const [searchBook, setSearchBook] = useState<string>("")

  useEffect(() => {
    const handleFetchBooks = async () => {
      let params = `/books?page=${pageBook}&limit=${limit}`
      if (searchBook) {
        params += `&search=${searchBook}`
      }
      const response = await fetch(API_ENDPOINT + params)
      const raw = (await response.json()) as Response<any>
      if (raw.status === "success") {
        const newBooks = {
          results: raw.data.result.results,
          page: Number(raw.data.result.page),
          totalPages: Number(raw.data.result.totalPages),
          totalResults: Number(raw.data.result.totalResults),
        }
        setBooks(newBooks as DataWithPagination<Book[]>)
      }
    }
    handleFetchBooks()
  }, [pageBook, searchBook, isStaleData])

  return (
    <AdminLayout>
      <Modal
        isOpen={isOpen}
        onClose={handleCloseModal}
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
        placement="center"
        size="5xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Tạo 1 giao dịch mới</ModalHeader>
              <ModalBody>
                {Object.entries(recordSelected).map((item) => (
                  <>
                    {item[0] === "duration" ? (
                      <div className="flex items-center gap-4">
                        <Checkbox
                          isSelected={recordSelected.duration === "1 month"}
                          onValueChange={() => setRecordSelected({ ...recordSelected, duration: "1 month" })}
                        >
                          1 Tháng
                        </Checkbox>
                        <Checkbox
                          isSelected={recordSelected.duration === "3 months"}
                          onValueChange={() => setRecordSelected({ ...recordSelected, duration: "3 months" })}
                        >
                          3 Tháng
                        </Checkbox>
                        <Checkbox
                          isSelected={recordSelected.duration === "6 months"}
                          onValueChange={() => setRecordSelected({ ...recordSelected, duration: "6 months" })}
                        >
                          6 Tháng
                        </Checkbox>
                        <Checkbox
                          isSelected={recordSelected.duration === "forever"}
                          onValueChange={() => setRecordSelected({ ...recordSelected, duration: "forever" })}
                        >
                          Vĩnh viễn
                        </Checkbox>
                      </div>
                    ) : item[0] === "user_id" ? (
                      <div className="flex flex-col gap-2 bg-green-100 p-4">
                        <p className="text-sm">Select User</p>
                        <Input
                          label="Search user"
                          size="sm"
                          value={searchUser}
                          onChange={(e) => setSearchUser(e.target.value)}
                        />
                        <div className="flex gap-4 rounded-lg bg-slate-100 px-4 py-2">
                          {users?.results.length &&
                            users.results.map((user) => (
                              <div
                                className={`rounded-lg px-2 py-1 ${recordSelected.user_id === user.id ? "bg-green-400" : "bg-white"} cursor-pointer`}
                                onClick={() => setRecordSelected({ ...recordSelected, user_id: user.id ?? "" })}
                              >
                                {user.name}
                              </div>
                            ))}
                        </div>
                        <Pagination
                          showControls
                          total={users?.totalPages ?? 1}
                          page={pageUser}
                          color="success"
                          onChange={(pageSelect) => setPageUser(pageSelect)}
                        />
                      </div>
                    ) : item[0] === "book_id" ? (
                      <div className="flex flex-col gap-2 bg-green-100 p-4">
                        <p className="text-sm">Select Book</p>
                        <Input
                          label="Search book"
                          size="sm"
                          value={searchBook}
                          onChange={(e) => setSearchBook(e.target.value)}
                        />
                        <div className="flex gap-4 rounded-lg bg-slate-100 px-4 py-2">
                          {books?.results.length &&
                            books.results.map((book) => (
                              <div
                                className={`rounded-lg px-2 py-1 ${recordSelected.book_id === book.id ? "bg-green-400" : "bg-white"} cursor-pointer`}
                                onClick={() => setRecordSelected({ ...recordSelected, book_id: book.id ?? "" })}
                              >
                                {book.title}
                              </div>
                            ))}
                        </div>
                        <Pagination
                          showControls
                          total={books?.totalPages ?? 1}
                          page={pageBook}
                          color="success"
                          onChange={(pageSelect) => setPageBook(pageSelect)}
                        />
                      </div>
                    ) : (
                      <Input
                        label={(item[0].slice(0, 1).toUpperCase() + item[0].slice(1)).replace("_", " ")}
                        value={item[1].toString()}
                        name={item[0]}
                        onChange={handleChangeRecordSelected}
                      />
                    )}
                  </>
                ))}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={handleCloseModal}>
                  Đóng
                </Button>
                <CustomButton color="green" onPress={handleCreateRecord}>
                  Tạo
                </CustomButton>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <div className="px-8 py-4">
        <div className="mb-8 flex justify-between items-center gap-4">
        <div className="flex gap-4 items-center">
            <Input
              type="date"
              placeholder="Từ ngày"
              value={startDate || ""}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Input
              type="date"
              placeholder="Đến ngày"
              value={endDate || ""}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <CustomButton color="green" onClick={handleDateChange} className="pl-8 pr-8">Thống kê</CustomButton>
          </div>
          <CustomButton color="green" onClick={onOpen}>
            Thêm mới
          </CustomButton>
        </div>
        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-400">Tổng: {records?.totalResults} đã mượn/bán</p>
            <Pagination showControls total={records?.totalPages ?? 1} page={page} color="success" onChange={setPage} />
          </div>
          <Table aria-label="Example table with custom cells">
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            {records?.results?.length ? (
              <TableBody items={records.results}>
                {(item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>
                      <Link href={`/book/${item.book_id.slug}`} className="text-black hover:text-gray-600">
                        {item.book_id?.title}
                      </Link>
                    </TableCell>
                    <TableCell>{item.user_id?.name}</TableCell>
                    <TableCell>{item.duration === 'forever' ? "Vĩnh viễn" : item.duration.replaceAll(/\bmonths?\b/gi, "tháng")}</TableCell>
                    <TableCell>{moment(item.borrow_date).locale('vi').format('DD/MM/YYYY')}</TableCell>
                    <TableCell>${item.price}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            ) : (
              <TableBody emptyContent={"Không có dữ liệu của giao dịch nào!"}>{[]}</TableBody>
            )}
          </Table>
        </div>
      </div>
    </AdminLayout>
  )
}

export default ManageRecords

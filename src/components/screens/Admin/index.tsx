import { AdminLayout } from "@components/layouts/adminLayout"
import { API_ENDPOINT } from "@models/api"
import { useBoundStore } from "@zustand/total"
import React, { useEffect, useState, useRef } from "react"
import { Response } from "@models/api"
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Image, Input, Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react"
import { CustomButton } from "@components/common/CustomButton"
import Icon from "@components/icons"
import { useRouter } from "next/router"
import { Link } from "@nextui-org/react"
import { NOTIFICATION_TYPE, notify } from "@utils/notify"
import moment from "moment"

type Analytics = {
  totalRevenue?: number
  totalBooks?: number
  totalUsers?: number
}

enum LANGUAGE {
  VI = "vi",
  EN = "en",
}

export type AnalyticsBook = {
  _id: string
  totalRevenue: number
  title: string
  cover_image: string
  slug: string
  languange: LANGUAGE
  amount_borrowed: number
  access_times: number
}

enum TIME {
  TODAY = "today",
  YESTERDAY = "yesterday",
  "3DAYSAGO" = "3-days-ago",
  "7DAYSAGO" = "7-days-ago",
  "14DAYSAGO" = "14-days-ago",
  "30DAYSAGO" = "30-days-ago",
}

const timeLabels = {
  [TIME.TODAY]: "Hôm nay",
  [TIME.YESTERDAY]: "Hôm qua",
  [TIME["3DAYSAGO"]]: "3 ngày trước",
  [TIME["7DAYSAGO"]]: "7 ngày trước",
  [TIME["14DAYSAGO"]]: "14 ngày trước",
  [TIME["30DAYSAGO"]]: "30 ngày trước",
  "NOTSET": ""
}

const AdminHomeScreen = () => {
  const route = useRouter()
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
  const [issuer, setIssuer] = useState<string>("")
  const [analytics, setAnalytics] = useState<Analytics>({
    totalRevenue: undefined,
    totalBooks: undefined,
    totalUsers: undefined,
  })
  const [time, setTime] = useState<TIME | null>(TIME.TODAY)
  const [startDate, setStartDate] = useState<string | null>(null)
  const [endDate, setEndDate] = useState<string | null>(null)
  const timeRef = useRef(time)
  const [topSellerBooks, setTopSellerBooks] = useState<AnalyticsBook[]>()
  const [topBadBooks, setTopBadBooks] = useState<AnalyticsBook[]>()

  const { authInfo } = useBoundStore((store) => ({
    authInfo: store.authInfo,
  }))

  const handleFetchAnalytics = async () => {
    let url = `${API_ENDPOINT}/analysts?`
    if (startDate) {
      url += `from=${startDate}&`
    }
    if (endDate) {
      url += `to=${endDate}`
    } else {
      url += `time=${timeRef.current}`
    }
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${authInfo.access?.token}`,
      },
    })
    const raw = (await response.json()) as Response<Analytics>
    if (raw.status === "success" && raw.data) {
      setAnalytics(raw.data)
    }
  }

  useEffect(() => {
    handleFetchAnalytics()
  }, [time])

  useEffect(() => {
    const handleFetchTopSellerBooks = async () => {
      const response = await fetch(API_ENDPOINT + `/analysts/top-seller-books`, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${authInfo.access?.token}`,
        },
      })
      const raw = (await response.json()) as Response<AnalyticsBook[]>
      if (raw.status === "success" && raw.data?.length) {
        setTopSellerBooks(raw.data)
      }
    }
    handleFetchTopSellerBooks()
  }, [])

  useEffect(() => {
    const handleFetchTopBadBooks = async () => {
      const response = await fetch(API_ENDPOINT + `/analysts/top-bad-books`, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${authInfo.access?.token}`,
        },
      })
      const raw = (await response.json()) as Response<AnalyticsBook[]>
      if (raw.status === "success" && raw.data?.length) {
        setTopBadBooks(raw.data)
      }
    }
    handleFetchTopBadBooks()
  }, [])

  const handleTimeChange = (newTime: TIME) => {
    setTime(newTime)
    timeRef.current = newTime
    setStartDate(null)
    setEndDate(null)
  }

  const handleDateChange = () => {
    setTime(null)
    timeRef.current = null
    handleFetchAnalytics()
  }

  const handleExportReport = async () => {
    if (!issuer || !startDate || !endDate) {
      if (!issuer) notify(NOTIFICATION_TYPE.ERROR, "Vui lòng nhập tên người xuất báo cáo")
      if (!startDate) notify(NOTIFICATION_TYPE.ERROR, "Vui lòng chọn ngày bắt đầu")
      if (!endDate) notify(NOTIFICATION_TYPE.ERROR, "Vui lòng chọn ngày kết thúc")
      return
    }

    const response = await fetch(`${API_ENDPOINT}/analysts/exports-analysts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${authInfo.access?.token}`,
      },
      body: JSON.stringify({
        issuer,
        from: startDate,
        to: endDate,
      }),
    })
    if (response.status === 200) {
      const blob = await response.blob()
      const contentDisposition = response.headers.get("Content-Disposition")
      let fileName = `Bao_cao_thong_ke_${issuer}_ngay_${moment().format("DD/MM/YYYY")}.pdf`
      if (contentDisposition) {
        const matches = /filename="([^"]+)"/.exec(contentDisposition)
        if (matches && matches[1]) {
          fileName = matches[1]
        }
      }
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      document.body.appendChild(a)
      a.download = fileName
      a.click()
      a.remove()
      notify(NOTIFICATION_TYPE.SUCCESS, "Xuất báo cáo thành công")
      resetForm()
      onClose()
    } else {
      notify(NOTIFICATION_TYPE.ERROR, "Có lỗi xảy ra, vui lòng thử lại")
    }
  }

  const resetForm = () => {
    setIssuer("")
    setStartDate(null)
    setEndDate(null)
  }

  return (
    <AdminLayout>
      <div className="px-20 py-8">
        <div className="flex justify-between items-center">
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
          <div className="flex gap-4 items-center">
            <Dropdown>
              <DropdownTrigger>
                <CustomButton variant="bordered" className="uppercase" endContent={<Icon name="chevron-down" />}>
                  {timeLabels[time || "NOTSET"]}
                </CustomButton>
              </DropdownTrigger>
              <DropdownMenu aria-label="Static Actions" className="capitalize">
                {Object.values(TIME).map((item) => (
                  <DropdownItem key={item} onClick={() => handleTimeChange(item)}>
                    {timeLabels[item]}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <CustomButton color="green" onClick={onOpen}>Xuất báo cáo</CustomButton>
          </div>
        </div>
        <div className="mt-4 flex justify-between gap-8">
          <div className="basis-1/3 rounded-lg bg-green-400 px-8 py-4 text-white">
            <p className="text-xl font-semibold">Tổng số truyện đã bán</p>
            <p className="text-3xl font-semibold">{analytics.totalBooks}</p>
          </div>
          <div className="basis-1/3 rounded-lg bg-green-400 px-8 py-4 text-white">
            <p className="text-xl font-semibold">Tổng doanh thu</p>
            <p className="text-3xl font-semibold">${analytics.totalRevenue}</p>
          </div>
          <div className="basis-1/3 rounded-lg bg-green-400 px-8 py-4 text-white">
            <p className="text-xl font-semibold">Tổng số người dùng mới</p>
            <p className="text-3xl font-semibold">{analytics.totalUsers}</p>
          </div>
        </div>
        <div className="flex w-full justify-between gap-8">
          <div className="mt-4 flex basis-1/2 justify-between gap-4">
            <div className="w-full rounded-lg bg-teal-400 px-8 py-6 text-white">
              <div className="mb-8 flex items-center justify-between">
                <p className="text-xl font-semibold">Top 10 Sách Bán Chạy</p>
                <Link href="/admin/top-seller-books" className="text-white">
                  Xem tất cả
                </Link>
              </div>
              <div className="flex flex-wrap gap-2">
                {topSellerBooks?.length &&
                  topSellerBooks.slice(0, 2).map((book) => (
                    <div
                      key={book.title}
                      className="flex h-[180px] w-full cursor-pointer gap-4 rounded-lg bg-gray-100 px-4 py-2 hover:bg-gray-200"
                      onClick={() => route.push(`/book/${book.slug}`)}
                    >
                      <div className="flex basis-1/3 justify-center">
                        <Image
                          src={`http://localhost:3000/img/books/${book.cover_image}`}
                          alt={book.title}
                          className="mx-auto h-[140px]"
                        />
                      </div>
                      <div className="flex basis-2/3 flex-col gap-2">
                        <p className="line-clamp-2 text-black">{book.title}</p>
                        <p className="text-black">Số lượt xem: {book.access_times}</p>
                        <p className="text-black">Số lượt mua: {book.amount_borrowed}</p>
                        <p className="text-black">Doanh thu: ${book.totalRevenue}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div className="mt-4 flex basis-1/2 justify-between gap-4">
            <div className="w-full rounded-lg bg-teal-400 px-8 py-6 text-white">
              <div className="mb-8 flex items-center justify-between">
                <p className="text-xl font-semibold">Top 10 Sách Bán Chậm</p>
                <Link href="/admin/top-bad-seller-books" className="text-white">
                  Xem tất cả
                </Link>
              </div>
              <div className="flex flex-wrap gap-2">
                {topBadBooks?.length &&
                  topBadBooks.slice(0, 2).map((book) => (
                    <div
                      key={book.title}
                      className="flex h-[180px] w-full cursor-pointer gap-4 rounded-lg bg-gray-100 px-4 py-2 hover:bg-gray-200"
                      onClick={() => route.push(`/book/${book.slug}`)}
                    >
                      <div className="flex basis-1/3 justify-center">
                        <Image
                          src={`http://localhost:3000/img/books/${book.cover_image}`}
                          alt={book.title}
                          className="mx-auto h-[140px]"
                        />
                      </div>
                      <div className="flex basis-2/3 flex-col gap-2">
                        <p className="line-clamp-2 text-black">{book.title}</p>
                        <p className="text-black">Số lượt xem: {book.access_times}</p>
                        <p className="text-black">Số lượt mua: {book.amount_borrowed}</p>
                        <p className="text-black">Doanh thu: ${book.totalRevenue}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={() => { resetForm(); onClose(); }} onOpenChange={onOpenChange} placement="center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Xuất báo cáo</ModalHeader>
              <ModalBody>
                <Input
                  label="Người xuất báo cáo"
                  placeholder="Nhập tên người xuất báo cáo"
                  value={issuer}
                  onChange={(e) => setIssuer(e.target.value)}
                />
                <Input
                  type="date"
                  label="Từ ngày"
                  placeholder="Từ ngày"
                  value={startDate || ""}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <Input
                  type="date"
                  label="Đến ngày"
                  placeholder="Đến ngày"
                  value={endDate || ""}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={() => { resetForm(); onClose(); }}>
                  Đóng
                </Button>
                <CustomButton color="green" onPress={handleExportReport}>
                  Xuất
                </CustomButton>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </AdminLayout>
  )
}

export default AdminHomeScreen

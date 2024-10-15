import {
  Chip,
  Input,
  Pagination,
  Spinner,
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
import { NOTIFICATION_TYPE, notify } from "@utils/notify"
import { ROLE_ACCOUNT } from "@models/user"

const columns = [
  {
    key: "refer_code",
    label: "Mã tiếp thị",
  },
  {
    key: "link_count",
    label: "Số lần truy cập",
  },
  {
    key: "purchase_count",
    label: "Số lần tiếp thị thành công",
  },
  {
    key: "commission_paid",
    label: "Tiền hoa hồng đã nhận",
  },
  {
    key: "commission_amount",
    label: "Tổng số tiền hoa hồng",
  },
]

type Referral = {
  link_count: number
  purchase_count: number
  commission_amount: number
  commission_paid: number
  commission_percent: number
  isUpdatedReceiver: boolean
  _id: string
  user_id: string
  refer_code: string
  email_receiver: string
  commission_remaining: number
  id: string
}

const Referral = () => {
  const route = useRouter()
  const { authInfo, accountInfo } = useBoundStore((state) => ({
    authInfo: state.authInfo,
    accountInfo: state.accountInfo,
  }))

  const [referrals, setReferrals] = useState<DataWithPagination<Referral[]>>()
  const [page, setPage] = useState<number>(1)
  const [email, setEmail] = useState<string>("")

  useEffect(() => {
    const handleFetchReferrals = async () => {
      const response = await fetch(API_ENDPOINT + `/users/${accountInfo?.id}/affiliates`, {
        headers: { "Content-Type": "application/json", authorization: `Bearer ${authInfo.access?.token}` },
      })
      const data = (await response.json()) as Response<any>
      console.log(data)
      if (data?.data?.results) {
        setReferrals(data.data)
        setEmail(data.data.results[0]?.email_receiver || "")
      }
    }
    handleFetchReferrals()
  }, [page])

  const handleUpdateEmail = async () => {
    const response = await fetch(API_ENDPOINT + `/affiliates/${referrals?.results[0].id}`, {
      method: "PATCH",
      headers: {
        authorization: `Bearer ${authInfo?.access?.token}`,
      },
      body: JSON.stringify({
        email_receiver: email,
      }),
    })
    if (response.status === 200) {
      notify(NOTIFICATION_TYPE.SUCCESS, "Cập nhật email thành công!")
    } else {
      console.log({response})
      notify(NOTIFICATION_TYPE.ERROR, "Email nhận hoa hồng chỉ được cập nhất 1 lần duy nhất!")
    }
  }

  return (
    <div className="px-12 py-10">
      <p className="mb-8 text-xl font-semibold">Tiếp thị liên kết của bạn</p>
      {accountInfo?.role === ROLE_ACCOUNT.USER && (
        <div className="flex items-center gap-2">
          <Input
            className="mb-4"
            label="Nhập email để nhận hoa hồng"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <CustomButton color="green" onClick={handleUpdateEmail} isDisabled={!email}>
            Xác nhận
          </CustomButton>
        </div>
      )}
      <Table aria-label="Example table with dynamic content">
        <TableHeader columns={columns}>
          {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
        </TableHeader>
        {referrals?.results ? (
          <TableBody items={referrals?.results}>
            {(item) => (
              <TableRow key={item.id}>
                <TableCell>{item.refer_code}</TableCell>
                <TableCell>{item.link_count}</TableCell>
                <TableCell>{item.purchase_count}</TableCell>
                <TableCell>${item.commission_paid}</TableCell>
                <TableCell>${item.commission_amount}</TableCell>
              </TableRow>
            )}
          </TableBody>
        ) : (
          <TableBody emptyContent={<Spinner />}>{[]}</TableBody>
        )}
      </Table>
      {referrals?.totalPages && referrals.totalPages > 1 ? (
        <Pagination
          color="success"
          className="mt-4"
          showControls
          total={referrals.totalPages}
          initialPage={page}
          onChange={(pageChanged: number) => setPage(pageChanged)}
        />
      ) : (
        ""
      )}
    </div>
  )
}

export default Referral

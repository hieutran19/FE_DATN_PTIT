import Icon from "@components/icons"
import { Avatar } from "@nextui-org/react"
import { useBoundStore } from "@zustand/total"
import React from "react"
import { MOCK_BOOKS } from "@constants/book"
import ChangePassword from "./components/ChangePassword"
import { useRouter } from "next/router"
import BooksHasBought from "./components/BooksHasBought"
import PurchaseHistory from "./components/PurchaseHistory"
import Link from "next/link"
import dynamic from "next/dynamic"
import BookType from "@components/common/BookType"
import Referral from "./components/Referral"

const CustomerInformation = dynamic(() => import("./components/CustomerInformation").then((mod) => mod.default), {
  ssr: false,
})

export enum PROFILE_TYPE {
  BOOKS_HAS_BOUGHT,
  CUSTOMER_INFORMATION,
  CHANGE_PASSWORD,
  HISTORY,
  REFERRAL,
}

type Props = {
  type: PROFILE_TYPE
}

const ProfileScreen = ({ type }: Props) => {
  const route = useRouter()

  const { accountInfo, removeAuthInfo, removeAccountInfo } = useBoundStore((store) => ({
    accountInfo: store.accountInfo,
    removeAuthInfo: store.removeAuthInfo,
    removeAccountInfo: store.removeAccountInfo,
  }))

  const onLogout = () => {
    removeAccountInfo()
    removeAuthInfo()
    route.push("/")
  }

  return (
    <div>
      <div className="flex gap-8 px-40 py-8">
        <div className="h-fit basis-1/4 rounded-lg bg-white p-4">
          <div className="flex items-center gap-2 border-b-2 pb-2">
            {accountInfo?.image ? (
              <Avatar size="sm" src={`http://localhost:3000/img/users/${accountInfo?.image}`} isBordered color="success" />
            ) : (
              <Avatar size="sm" name={accountInfo?.name} isBordered color="success" />
            )}
            <p className="font-semibold">{accountInfo?.name}</p>
          </div>
          <div className="flex flex-col gap-2 py-2">
            <Link
              href="/profile/purchased-books"
              className={`flex cursor-pointer items-center gap-1 border-b-2 py-2 ${type === PROFILE_TYPE.BOOKS_HAS_BOUGHT ? "textslate-900 font-semibold" : "text-slate-500"} hover:text-slate-900`}
            >
              <Icon name="book" />
              <p>Truyện đã mua</p>
            </Link>
            <Link
              href="/profile/my-account"
              className={`flex cursor-pointer items-center gap-1 border-b-2 py-2 ${type === PROFILE_TYPE.CUSTOMER_INFORMATION ? "textslate-900 font-semibold" : "text-slate-500"} hover:text-slate-900`}
            >
              <Icon name="user" />
              <p>Thông tin khách hàng</p>
            </Link>
            <Link
              href="/profile/change-password"
              className={`flex cursor-pointer items-center gap-1 border-b-2 py-2 ${type === PROFILE_TYPE.CHANGE_PASSWORD ? "textslate-900 font-semibold" : "text-slate-500"} hover:text-slate-900`}
            >
              <Icon name="lock" />
              <p>Đổi mật khẩu</p>
            </Link>
            <Link
              href="/profile/purchase-history"
              className={`flex cursor-pointer items-center gap-1 border-b-2 py-2 ${type === PROFILE_TYPE.HISTORY ? "textslate-900 font-semibold" : "text-slate-500"} hover:text-slate-900`}
            >
              <Icon name="history" />
              <p>Lịch sự mua hàng</p>
            </Link>
            <Link
              href="/profile/referral"
              className={`flex cursor-pointer items-center gap-1 border-b-2 py-2 ${type === PROFILE_TYPE.REFERRAL ? "textslate-900 font-semibold" : "text-slate-500"} hover:text-slate-900`}
            >
              <Icon name="history" />
              <p>Tiếp thị liên kết</p>
            </Link>
            <div
              className="flex cursor-pointer items-center gap-1 text-slate-500 hover:text-slate-900"
              onClick={onLogout}
            >
              <Icon name="log-out" />
              <p>Đăng xuất</p>
            </div>
          </div>
        </div>
        <div className="basis-3/4 rounded-lg bg-white">
          {type === PROFILE_TYPE.BOOKS_HAS_BOUGHT && <BooksHasBought />}
          {type === PROFILE_TYPE.CHANGE_PASSWORD && <ChangePassword />}
          {type === PROFILE_TYPE.CUSTOMER_INFORMATION && <CustomerInformation />}
          {type === PROFILE_TYPE.HISTORY && <PurchaseHistory />}
          {type === PROFILE_TYPE.REFERRAL && <Referral />}
        </div>
      </div>
      <div className="px-40">
        <BookType />
      </div>
    </div>
  )
}

export default ProfileScreen

import { Avatar } from "@nextui-org/react"
import React from "react"
import { useBoundStore } from "@zustand/total"
import { useRouter } from "next/router"
import { CustomButton } from "@components/common/CustomButton"

const DropDownMenu = () => {
  const { accountInfo, removeAccountInfo, removeAuthInfo } = useBoundStore((store) => ({
    accountInfo: store.accountInfo,
    removeAccountInfo: store.removeAccountInfo,
    removeAuthInfo: store.removeAuthInfo,
  }))

  const router = useRouter()

  const onLogout = () => {
    removeAccountInfo()
    removeAuthInfo()
    router.push("/")
  }

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  return (
    <div className="z-[999] h-fit w-52 rounded-lg bg-white text-black">
      <div className="p-8 text-center">
        <div className="flex flex-col items-center gap-1 text-center text-sm font-normal text-gray-400">
          {accountInfo?.image ? (
            <Avatar size="sm" src={`http://localhost:3000/img/users/${accountInfo?.image}`} name={accountInfo?.name} isBordered color="success" />
          ) : (
            <Avatar size="sm" name={accountInfo?.name} isBordered color="success" />
          )}
        </div>
        <p className="my-2 font-medium">{accountInfo?.name}</p>
      </div>
      <div className="flex flex-col gap-4 border-t border-gray-300 p-4">
        <div>
          <CustomButton
            className="w-full text-left rounded-md px-4 py-2"
            onClick={() => handleNavigation("/profile/purchased-books")}
            color="white"
          >
            Truyện đã mua
          </CustomButton>
          <CustomButton
            className="w-full text-left rounded-md px-4 py-2"
            onClick={() => handleNavigation("/profile/my-account")}
            color="white"
          >
            Thông tin tài khoản
          </CustomButton>
          <CustomButton
            className="w-full text-left rounded-md px-4 py-2"
            onClick={() => handleNavigation("/profile/change-password")}
            color="white"
          >
            Đổi mật khẩu
          </CustomButton>
          <CustomButton
            className="w-full text-left rounded-md px-4 py-2"
            onClick={() => handleNavigation("/profile/purchase-history")}
            color="white"
          >
            Lịch sử mua hàng
          </CustomButton>
          <CustomButton
            className="w-full text-left rounded-md px-4 py-2"
            onClick={() => handleNavigation("/profile/referral")}
            color="white"
          >
            Tiếp thị liên kết
          </CustomButton>
          {accountInfo?.role === 'admin' && (
            <CustomButton
              className="w-full text-left rounded-md px-4 py-2"
              onClick={() => handleNavigation("/admin")}
              color="white"
            >
              Quản trị
            </CustomButton>
          )}
        </div>
        <br />
        <CustomButton onClick={onLogout} color="green">
          Đăng xuất
        </CustomButton>
      </div>
    </div>
  )
}

export default DropDownMenu

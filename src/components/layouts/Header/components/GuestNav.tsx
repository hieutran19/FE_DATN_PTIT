import Link from "next/link"
import { Button } from "@nextui-org/react"
import { CustomButton } from "@components/common/CustomButton"

const GuestNav = () => {
  return (
    <div className="flex items-center">
      <Link href="/cart">
        <CustomButton>Giỏ Hàng</CustomButton>
      </Link>
      <div className="mx-2 h-[30px] w-[1px] bg-black"></div>
      <Link href="/login">
        <CustomButton isGhost>Đăng Nhập</CustomButton>
      </Link>
    </div>
  )
}

export default GuestNav

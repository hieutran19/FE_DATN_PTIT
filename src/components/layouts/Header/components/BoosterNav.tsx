import { Avatar, Chip } from "@nextui-org/react"
import Link from "next/link"
import React, { useEffect, useRef, useState } from "react"
import { useClickOutside } from "@hooks/useClickOutside"
import { useBoundStore } from "@zustand/total"
import DropDownMenu from "./DropDownMenu"
import { CustomButton } from "@components/common/CustomButton"
import { API_ENDPOINT } from "@models/api"
import { Response } from "@models/api"
import { Cart } from "@models/cart"

const BoosterNav = () => {
  const [isOpenDropDownMenu, setIsOpenDropDownMenu] = useState<boolean>(false)
  const toggleRef = useRef<HTMLDivElement>(null)
  const dropDownRef = useRef<HTMLDivElement>(null)
  useClickOutside(dropDownRef, toggleRef, () => setIsOpenDropDownMenu(false))
  const [quantity, setQuantity] = useState<number>(0)

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation()
    setIsOpenDropDownMenu((prev) => !prev)
  }

  const { accountInfo, authInfo } = useBoundStore((store) => ({
    accountInfo: store.accountInfo,
    authInfo: store.authInfo,
  }))

  const handleGetCart = async () => {
    const response = await fetch(API_ENDPOINT + "/carts", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authInfo?.access?.token}`,
      },
    })
    const raw = (await response.json()) as Response<Cart[]>
    if (raw.data) {
      setQuantity(raw.data.length)
    }
  }

  useEffect(() => {
    if(authInfo?.access?.token) {
      handleGetCart()

    }
  }, [])

  return (
    <div className="flex items-center gap-4 font-semibold">
      <Link href="/cart">
        <CustomButton endContent={quantity !== 0 ? <Chip>{quantity}</Chip> : ""}>Giỏ Hàng</CustomButton>
      </Link>
      <div className="relative" ref={toggleRef} onMouseDown={handleMouseDown}>
        <div className="bg-green flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-1 text-sm font-semibold text-black transition-all delay-75 hover:border-white hover:bg-green-400 hover:text-white">
          {accountInfo?.image? (
            <Avatar size="sm" src={`http://localhost:3000/img/users/${accountInfo?.image}`} className="border-2" />
          ) : (
            <Avatar size="sm" name={accountInfo?.name} isBordered color="success" />
          )}
          {accountInfo?.name?.slice(0, 7)}...
        </div>
        <div
          className={`absolute left-0 top-14 shadow-xl ${isOpenDropDownMenu ? "menu-show" : "menu-hidden"}`}
          ref={dropDownRef}
        >
          <DropDownMenu />
        </div>
      </div>
    </div>
  )
}

export default BoosterNav

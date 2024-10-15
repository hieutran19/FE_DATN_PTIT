import Link from "next/link"
import React, { useRef, useState } from "react"
import { useClickOutside } from "@hooks/useClickOutside"
import { useBoundStore } from "@zustand/total"
import DropDownMenu from "./DropDownMenu"
const AdminNav = () => {
  const [isOpenDropDownMenu, setIsOpenDropDownMenu] = useState<boolean>(false)
  const toggleRef = useRef<HTMLDivElement>(null)
  const dropDownRef = useRef<HTMLDivElement>(null)
  useClickOutside(dropDownRef, toggleRef, () => setIsOpenDropDownMenu(false))

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation()
    setIsOpenDropDownMenu((prev) => !prev)
  }

  const { accountInfo, removeAccountInfo } = useBoundStore((store) => ({
    accountInfo: store.accountInfo,
    removeAccountInfo: store.removeAccountInfo,
  }))
  return (
    <div className="flex items-center font-semibold">
      <Link href="/management/report">
        <p className="cursor-pointer rounded-lg px-4 py-2 text-white transition-all delay-[20ms] hover:text-primary-500">
          Report
        </p>
      </Link>
      <Link href="/list-of-requests">
        <p className="cursor-pointer rounded-lg px-4 py-2 text-white transition-all delay-[20ms] hover:text-primary-500">
          Register Booster Request
        </p>
      </Link>
      <div className="relative" ref={toggleRef} onMouseDown={handleMouseDown}>
        <div className="cursor-pointer rounded-xl border bg-black px-4 py-2 text-sm font-semibold text-white transition-all delay-75 hover:border-black hover:bg-white hover:text-black">
          {accountInfo?.username?.slice(0, 7)}...
        </div>
      </div>
      <div className={`absolute right-8 top-16 ${isOpenDropDownMenu ? "menu-show" : "menu-hidden"}`} ref={dropDownRef}>
        <DropDownMenu />
      </div>
    </div>
  )
}

export default AdminNav

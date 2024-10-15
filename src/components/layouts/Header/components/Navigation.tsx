import React from "react"
import { ROLE_ACCOUNT } from "@models/user"
import { useBoundStore } from "@zustand/total"
import AdminNav from "./AdminNav"
import BoosterNav from "./BoosterNav"
import GuestNav from "./GuestNav"
import ManagerNav from "./ManagerNav"
import CustomerNav from "./CustomerNav"

const Navigation = () => {
  const { accountInfo } = useBoundStore((store) => ({
    accountInfo: store.accountInfo,
  }))

  if (accountInfo?.role === ROLE_ACCOUNT.USER) {
    return <BoosterNav />
  }

  if (accountInfo?.role === ROLE_ACCOUNT.ADMIN) {
    return <BoosterNav />
  }

  return <GuestNav />
}

export default Navigation

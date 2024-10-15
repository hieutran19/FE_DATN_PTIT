import React from "react"
import { NavbarWrapper } from "../NavBar/NavBar"
import { SidebarWrapper } from "../sidebar/Sidebar"
import { useBoundStore } from "@zustand/total"
import { ROLE_ACCOUNT } from "@models/user"
import Page498 from "../../../../pages/498"

interface Props {
  children: React.ReactNode
}

export const AdminLayout = ({ children }: Props) => {
  const { accountInfo } = useBoundStore((store) => ({
    accountInfo: store.accountInfo,
  }))

  return (
    <>
      {accountInfo?.role === ROLE_ACCOUNT.ADMIN ? (
        <section className="flex">
          <SidebarWrapper />
          <NavbarWrapper>{children}</NavbarWrapper>
        </section>
      ) : (
        <Page498 />
      )}
    </>
  )
}

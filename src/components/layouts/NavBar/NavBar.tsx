import { Input, Link, Navbar, NavbarContent } from "@nextui-org/react"
import React, { memo } from "react"
import { UserDropdown } from "./UserDropdown"
import Icon from "@components/icons"
import { Image } from "@nextui-org/react"

interface Props {
  children: React.ReactNode
}

export const NavbarWrapper = memo(({ children }: Props) => {
  return (
    <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
      <Navbar
        isBordered
        className="flex w-full justify-end"
        classNames={{
          wrapper: "w-full max-w-full",
        }}
      >
        <NavbarContent className="w-full">
          <Link href="/">
            <Image src="/images/logo.png" className="h-10" />
            <p className="ml-2 text-lg font-semibold text-green-400">SmartOSC Book Store</p>
          </Link>
        </NavbarContent>
        <NavbarContent justify="end" className="flex w-fit justify-end data-[justify=end]:flex-grow-0">
          <UserDropdown />
        </NavbarContent>
      </Navbar>
      {children}
    </div>
  )
})

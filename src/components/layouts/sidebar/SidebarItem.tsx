import NextLink from "next/link"
import React from "react"
import clsx from "clsx"

interface Props {
  title: string
  icon: React.ReactNode
  isActive?: boolean
  href?: string
}

export const SidebarItem = ({ icon, title, isActive, href = "" }: Props) => {
  return (
    <NextLink href={href} className="max-w-full text-default-900 active:bg-none">
      <div
        className={clsx(
          isActive ? "bg-primary-100 [&_svg_path]:fill-primary-500" : "hover:bg-default-100",
          "flex h-full min-h-[44px] w-full cursor-pointer items-center gap-2 rounded-xl px-3.5 transition-all duration-150 active:scale-[0.98]"
        )}
      >
        {icon}
        <span className="text-default-900">{title}</span>
      </div>
    </NextLink>
  )
}

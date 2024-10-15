import React, { memo } from "react"
import { Avatar, Tooltip } from "@nextui-org/react"
import { usePathname } from "next/navigation"
import { SidebarItem } from "./SidebarItem"
import Icon from "@components/icons"
import { SidebarMenu } from "./SidebarMenu"
import { CollapseItems } from "./CollapseItem"
import { Sidebar } from "./sidebar.style"

export const SidebarWrapper = memo(() => {
  const pathname = usePathname()

  return (
    <aside className="sticky top-0 z-[20] h-screen border-r-2 px-8">
      <div>
        <div className="flex h-full flex-col justify-between">
          <div className={Sidebar.Body()}>
            <SidebarItem title="Trang chủ" icon={<Icon name="home" />} isActive={pathname === "/admin"} href="/admin" />
            <SidebarMenu title="Quản lý">
              <SidebarItem
                isActive={pathname === "/admin/manage-users"}
                title="Quản lý người dùng"
                icon={<Icon name="user" />}
                href="/admin/manage-users"
              />
              <SidebarItem
                isActive={pathname === "/admin/manage-books"}
                title="Quản lý truyện"
                icon={<Icon name="book" />}
                href="/admin/manage-books"
              />
              <SidebarItem
                isActive={pathname === "/admin/manage-genres"}
                title="Quản lý danh mục"
                icon={<Icon name="tag" />}
                href="/admin/manage-genres"
              />
              <SidebarItem
                isActive={pathname === "/admin/manage-records"}
                title="Quản lý đơn đặt hàng"
                icon={<Icon name="shopping-cart" />}
                href="/admin/manage-records"
              />
              <SidebarItem
                isActive={pathname === "/admin/manage-banners"}
                title="Quản lý banner"
                icon={<Icon name="megaphone" />}
                href="/admin/manage-banners"
              />
              <SidebarItem
                isActive={pathname === "/admin/manage-affiliates"}
                title="Quản lý tiếp thị liên kết"
                icon={<Icon name="link" />}
                href="/admin/manage-affiliates"
              />
              <SidebarItem
                isActive={pathname === "/admin/manage-coupons"}
                title="Quản lý mã giảm giá"
                icon={<Icon name="ticket" />}
                href="/admin/manage-coupons"
              />
              <SidebarItem
                isActive={pathname === "/admin/manage-reviews"}
                title="Quản lý bình luận"
                icon={<Icon name="view" />}
                href="/admin/manage-reviews"
              />
            </SidebarMenu>
            <SidebarMenu title="Thống kê">
            <SidebarItem
                isActive={pathname === "/admin/top-seller-books"}
                title="Top 10 truyện bán chạy"
                icon={<Icon name="book" />}
                href="/admin/top-seller-books"
              />
              <SidebarItem
                isActive={pathname === "/admin/top-bad-seller-books"}
                title="Top 10 truyện bán chậm"
                href="/admin/top-bad-seller-books"
                icon={<Icon name="book-dashed" />}
              />
            </SidebarMenu>
          </div>
          
        </div>
      </div>
    </aside>
  )
})

import { Image } from "@nextui-org/react"
import Link from "next/link"
import React from "react"

const Footer = () => {
  return (
    <>
      <footer className="bg-theme footer border-t-2 border-white px-40 py-10 text-black">
        <aside className="flex justify-center">
          <Image src="/images/logo.png" width={100} height={100} />
          <p className="text-lg font-semibold text-green-400">
            <br />
            SmartOSC Book Store
          </p>
        </aside>
        <nav>
          <header className="footer-title">CHÚNG TÔI PHỤC VỤ</header>
          <div className="h-1 w-full bg-black"></div>
          <div className="flex flex-col gap-1">
            <p className="cursor-pointer hover:text-green-400">Bộ Xây dựng</p>
            <p className="cursor-pointer hover:text-green-400">Nhà sách</p>
            <p className="cursor-pointer hover:text-green-400">Trường đại học</p>
            <p className="cursor-pointer hover:text-green-400">Doanh nghiệp/ Tổ chức</p>
            <p className="cursor-pointer hover:text-green-400">Quản lý thư viện</p>
            <p className="cursor-pointer hover:text-green-400">Sinh viên</p>
            <p className="cursor-pointer hover:text-green-400">Viện Nghiên cứu</p>
            <p className="cursor-pointer hover:text-green-400">Tác giả</p>
          </div>
        </nav>
        <nav>
          <header className="footer-title">VỀ CHÚNG TÔI</header>
          <div className="h-1 w-full bg-black"></div>
          <div className="flex flex-col gap-1">
            <p className="cursor-pointer hover:text-green-400">Giới thiệu</p>
            <p className="cursor-pointer hover:text-green-400">Liên hệ</p>
            <p className="cursor-pointer hover:text-green-400">Các đối tác</p>
            <p className="cursor-pointer hover:text-green-400">Phát triển bởi VHMT</p>
          </div>
        </nav>
        <nav>
          <header className="footer-title">CHÍNH SÁCH VÀ ĐIỀU KHOẢN</header>
          <div className="h-1 w-full bg-black"></div>
          <div className="flex flex-col gap-1">
            <p className="cursor-pointer hover:text-green-400">Chính sách bảo mật</p>
            <p className="cursor-pointer hover:text-green-400">Điều khoản sử dụng</p>
            <p className="cursor-pointer hover:text-green-400">Hướng dẫn đăng ký tài khoản</p>
            <p className="cursor-pointer hover:text-green-400">Hướng dẫn kiểm tra tem truyện</p>
            <p className="cursor-pointer hover:text-green-400">Hướng dẫn sử dụng truyện ebook</p>
          </div>
        </nav>
      </footer>
      <div className="flex justify-center bg-green-400 py-1 text-white">
        Copyright © 2024 -SMARTOSC BOOK STORE. All rights reserved.
      </div>
    </>
  )
}

export default Footer

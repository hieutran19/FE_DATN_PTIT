import { useMutation } from "@tanstack/react-query"
import Link from "next/link"
import { redirect } from "next/navigation"
import React, { ChangeEvent, useState, useEffect } from "react"
import CustomInput from "@components/common/CustomInput"
import { NOTIFICATION_TYPE, notify } from "@utils/notify"
import { API_ENDPOINT } from "@models/api"
import { useBoundStore } from "@zustand/total"
import { useRouter } from "next/router"
import { CustomButton } from "@components/common/CustomButton"
import { Input } from "@nextui-org/react"

const ForgotPassword = () => {
  const route = useRouter()
  const [isEnterOTP, setIsEnterOTP] = useState<boolean>(false)
  const [email, setEmail] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState<string>("")

  const handleForgotPassword = async () => {
    const response = await fetch(API_ENDPOINT + "/auth/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    })
    if (response.status === 204) {
      notify(NOTIFICATION_TYPE.SUCCESS, "Vui lòng kiểm tra email của bạn!")
    } else {
      notify(NOTIFICATION_TYPE.ERROR, "Có lỗi xảy ra, vui lòng thử lại!")
    }
  }

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    setErrorMessage("")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsEnterOTP(true)
      handleForgotPassword()
    } else {
      setErrorMessage("Vui lòng nhập email!")
    }
  }

  return (
    <div className="bg-theme hero min-h-screen">
      <div className="flex items-center gap-12">
        <div className="card hidden w-1/2 items-center justify-center p-8 shadow-2xl lg:flex">
          <img src="images/auth-forgot-password.png" alt="" className="w-[60%]" />
        </div>
        <div className="w-full max-w-sm shrink-0 px-8 lg:w-1/2 lg:px-2">
          <div className="text-center text-slate-400 lg:text-left">
            <h1 className="text-4xl font-bold">Quên mật khẩu 🔒</h1>
          </div>
          <div className="mt-8 flex flex-col gap-4">
            <Input
              type="email"
              name="email"
              label="Vui lòng nhập email của bạn để lấy lại mật khẩu."
              placeholder="Nhập địa chỉ email..."
              labelPlacement="outside"
              onChange={handleChangeInput}
            />
            {errorMessage && <span className="text-red-600">{errorMessage}</span>}
            <CustomButton color="green" onClick={handleSubmit}>
              Gửi{" "}
            </CustomButton>
            <div className="flex justify-center gap-2">
              <Link href="login" className="text-primary-400 hover:underline">
                Quay lại trang đăng nhập
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword

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
import { Response } from "@models/api"

const ResetPassword = () => {
  const route = useRouter()
  const [password, setPassword] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState<string>("")

  const handleResetPassword = async () => {
    const response = await fetch(API_ENDPOINT + `/auth/reset-password?token=${route.query.token}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password,
      }),
    })
    if (response.status === 204) {
      notify(NOTIFICATION_TYPE.SUCCESS, "Cập nhật mật khẩu thành công!")
      setTimeout(() => {
        route.push("/login")
      }, 500)
    } else {
      try {
        const raw = (await response.json()) as Response<null>
        setTimeout(() => {
          notify(NOTIFICATION_TYPE.ERROR, raw?.message ?? "Có lỗi xảy ra, vui lòng thử lại")
        }, 500)
      } catch (error) {
        setTimeout(() => {
          notify(NOTIFICATION_TYPE.ERROR, "Có lỗi xảy ra, vui lòng thử lại")
        }, 500)
      }
      route.push("/forgot-password")
    }
  }

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPassword(value)
    setErrorMessage("")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password) {
      handleResetPassword()
    } else {
      setErrorMessage("Vui lòng nhập password!")
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
            <h1 className="text-4xl font-bold">Reset Password 🔒</h1>
          </div>
          <div className="mt-8 flex flex-col gap-4">
            <Input
              type="password"
              name="password"
              label="Vui lòng nhập mật khẩu mới của bạn."
              placeholder="Nhập mật khẩu mới..."
              labelPlacement="outside"
              onChange={handleChangeInput}
            />
            {errorMessage && <span className="text-red-600">{errorMessage}</span>}
            <CustomButton color="green" onClick={handleSubmit} isDisabled={!route.query.token}>
              Xác nhận{" "}
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

export default ResetPassword

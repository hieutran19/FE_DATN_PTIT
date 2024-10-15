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
import { AccountInfo } from "@models/user"
import { Response } from "@models/api"

export type RegisterRequest = {
  name: string
  email: string
  password: string
}
type ResponseChpwd = {
  success: string
  message: string
}

const Register = () => {
  const route = useRouter()
  const { saveAuthInfo, saveAccountInfo } = useBoundStore((state) => ({
    saveAuthInfo: state.saveAuthInfo,
    saveAccountInfo: state.saveAccountInfo,
  }))

  const [changePass, setChangePass] = useState<RegisterRequest>({
    name: "",
    email: "",
    password: "",
  })
  const [errorMessage, setErrorMessage] = useState<RegisterRequest>({
    name: "",
    email: "",
    password: "",
  })

  const putChangePassword = async (changePass: RegisterRequest) => {
    const response = await fetch(API_ENDPOINT + "/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(changePass),
    })
    const raw = (await response.json()) as Response<AccountInfo>
    if (!raw.data) {
      notify(NOTIFICATION_TYPE.ERROR, raw?.message ?? "<Som></Som>ething error happen, try again!")
    } else {
      setTimeout(() => {
        notify(NOTIFICATION_TYPE.SUCCESS, `Đăng ký tài khoản thành công, hãy xác thực tài khoản của bạn!`)
      }, 500)
      saveAuthInfo(raw.data.tokens)
      saveAccountInfo(raw.data.user)
      route.push(`/verify-account`)
    }
  }

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name
    const value = e.target.value
    setChangePass({
      ...changePass,
      [name]: value,
    })
    setErrorMessage({ email: "", password: "", name: "" })
  }

  const validateForm = () => {
    let isValid = true
    Object.entries(changePass).forEach(([key, value]) => {
      if (!value) {
        isValid = false
        setErrorMessage({ ...errorMessage, [key]: !value ? `${key} is require` : "" })
      }
    })
    return isValid
  }

  const hanldeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      void putChangePassword(changePass)
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
            <h1 className="text-4xl font-bold">Đăng ký tài khoản 🔒</h1>
          </div>
          <form onSubmit={hanldeSubmit}>
            <div className="flex flex-col gap-4">
              <CustomInput
                type="text"
                name="name"
                label="Name"
                placeholder="Nhập tên của bạn..."
                onChange={handleChangeInput}
              />
              {errorMessage.name && <span className="text-red-600">{errorMessage.name}</span>}
              <CustomInput
                type="email"
                name="email"
                label="Email"
                placeholder="Nhập địa chỉ email..."
                onChange={handleChangeInput}
              />
              {errorMessage.email && <span className="text-red-600">{errorMessage.email}</span>}
              <CustomInput
                type="password"
                name="password"
                label="Password"
                placeholder="Nhập mật khẩu..."
                onChange={handleChangeInput}
              />
              {errorMessage.password && <span className="text-red-600">{errorMessage.password}</span>}
              <CustomButton onClick={hanldeSubmit}>Đăng ký</CustomButton>
              <div className="flex justify-center gap-2">
                <Link href="login" className="text-primary-400 hover:underline">
                  Quay về trang đăng nhập
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register

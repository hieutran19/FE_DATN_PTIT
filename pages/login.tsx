import { Button, Checkbox, Input } from "@nextui-org/react"
import Link from "next/link"
import { useRouter } from "next/router"
import React, { ChangeEvent, useEffect, useRef, useState } from "react"
import CheckBox from "@components/common/CheckBox"
import { API_ENDPOINT, Response } from "@models/api"
import decodeJWT from "@utils/decodeJWT"
import { NOTIFICATION_TYPE, notify } from "@utils/notify"
import { useBoundStore } from "@zustand/total"
import { Image } from "@nextui-org/react"
import { CustomButton } from "@components/common/CustomButton"
import { AccountInfo, ROLE_ACCOUNT } from "@models/user"
import { v4 as uuidv4 } from "uuid"

type LoginInfo = {
  email: string
  password: string
}

const Login = () => {
  const { saveAuthInfo, saveAccountInfo } = useBoundStore((store) => ({
    saveAuthInfo: store.saveAuthInfo,
    saveAccountInfo: store.saveAccountInfo,
  }))
  const inputRef = useRef<HTMLInputElement>(null)

  const route = useRouter()

  const [isRemember, setIsRemember] = useState<boolean>(true)

  const [loginInfo, setLoginInfo] = useState<LoginInfo>({
    email: "",
    password: "",
  })

  const [errorMessage, setErrorMessage] = useState<LoginInfo>({
    email: "",
    password: "",
  })

  const handleChangeLoginInfo = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name
    const value = e.target.value
    setLoginInfo({
      ...loginInfo,
      [name]: value,
    })
    if (!value) {
      setErrorMessage({
        ...errorMessage,
        [name]: `Field ${name} is require!`,
      })
    } else {
      setErrorMessage({
        ...errorMessage,
        [name]: "",
      })
    }
  }

  const onLogin = async () => {
    if (!loginInfo.email || !loginInfo.password) {
      setErrorMessage({
        email: !loginInfo.email ? "Email is require!" : "",
        password: !loginInfo.password ? "Password is require!" : "",
      })
    } else {
      const response = await fetch(API_ENDPOINT + "/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginInfo),
      })
      const data = (await response.json()) as Response<AccountInfo>
      if (data.data) {
        saveAuthInfo({
          access: data.data.tokens.access,
          refresh: data.data.tokens.refresh,
        })
        saveAccountInfo({ ...data.data.user })
        //TODO: check gain
        if (data.data.user.isEmailVerified) {
          saveAccountInfo({
            ...data.data.user,
          })
          if (data.data.user.role === ROLE_ACCOUNT.USER) {
            route.push("/")
          } else {
            route.push("/admin")
          }
        } else {
          route.push("/verify-account")
        }
        setTimeout(() => {
          notify(NOTIFICATION_TYPE.SUCCESS, "Đăng nhập thành công")
        }, 50)
      } else {
        notify(NOTIFICATION_TYPE.ERROR, !!data.message ? data.message : "Có lỗi xảy ra tại server, vui lòng thử lại", {
          toastId: uuidv4(),
        })
      }
    }
  }

  return (
    <div className="bg-theme hero min-h-screen">
      <div className="flex h-full">
        <div className="basis-1/2">
          <img
            src="https://th-thumbnailer.cdn-si-edu.com/sWf0xF1il7OWYO8j-PGqwBvxTAE=/1000x750/filters:no_upscale():focal(2550x1724:2551x1725)/https://tf-cmsv2-smithsonianmag-media.s3.amazonaws.com/filer_public/9a/d7/9ad71c28-a69d-4bc0-b03d-37160317bb32/gettyimages-577674005.jpg"
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
        <div className="my-auto shrink-0 basis-1/2 px-28">
          <div className="flex w-full justify-center">
            <Image width={50} height={50} alt="logo" src="/images/logo.png" />
          </div>
          <div className="text-center text-green-400 lg:text-left">
            <h1 className="text-5xl font-bold">Chào mừng đến với SmartOSC Book Store! 👋🏻</h1>
            <p className="py-6 text-slate-500">Hãy đăng ký tài khoản ngay để trải nghiệm vô vàn thứ thú vị</p>
          </div>
          <div className="flex w-full flex-col gap-4">
            <p className="text-default-400">Email</p>
            <Input
              name="email"
              type="text"
              placeholder="Nhập địa chỉ email"
              value={loginInfo.email}
              onChange={handleChangeLoginInfo}
            />
            <p className="text-sm text-red-400">{errorMessage.email && errorMessage.email}</p>
            <p className="text-default-400">Mật khẩu</p>
            <Input
              name="password"
              type="password"
              placeholder="Nhập mật khẩu"
              value={loginInfo.password}
              ref={inputRef}
              onChange={handleChangeLoginInfo}
            />
            <p className="text-sm text-red-400">{errorMessage.password && errorMessage.password}</p>
            <div className="flex items-center justify-between">
              <Checkbox isSelected={isRemember} color="success" onClick={() => setIsRemember(!isRemember)}>
                Lưu thông tin
              </Checkbox>
              <Link href="forgot-password" className="text-primary-400 hover:underline">
                Quên mật khẩu
              </Link>
            </div>
            <CustomButton onClick={onLogin} color="green" isDisabled={!!errorMessage.email || !!errorMessage.password}>
              Đăng nhập
            </CustomButton>
            <div className="flex justify-center gap-1">
              <p>Bạn chưa có tài khoản</p>
              <Link href="/register" className="text-blue-400 hover:text-blue-500">
                Đăng ký ngay!
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

import Link from "next/link"
import React, { ChangeEvent, useState, useEffect } from "react"
import CustomInput from "@components/common/CustomInput"
import { NOTIFICATION_TYPE, notify } from "@utils/notify"
import { API_ENDPOINT } from "@models/api"
import { useBoundStore } from "@zustand/total"
import { useRouter } from "next/router"
import { CustomButton } from "@components/common/CustomButton"
import { Response } from "@models/api"

const VerifyAccountPage = () => {
  const route = useRouter()
  const [isEnterOTP, setIsEnterOTP] = useState<boolean>(false)
  const { authInfo, saveAccountInfo, accountInfo } = useBoundStore((store) => ({
    authInfo: store.authInfo,
    saveAccountInfo: store.saveAccountInfo,
    accountInfo: store.accountInfo,
  }))

  const handleSendOTPToEmail = async () => {
    const authorization = `Bearer ${authInfo?.access?.token}`
    const response = await fetch(API_ENDPOINT + "/auth/send-verification-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization,
      },
    })
    if (response.status === 204) {
      notify(NOTIFICATION_TYPE.SUCCESS, "Mã xác thực đã được gửi tới email của bạn. Vui lòng kiểm tra.", {
        toastId: "verify-account",
      })
      setIsEnterOTP(true)
    } else {
      notify(NOTIFICATION_TYPE.ERROR, "Something error is happen, please try again!")
    }
  }

  useEffect(() => {
    const { token } = route.query
    if (token) {
      const handleVerifyAccount = async () => {
        const response = await fetch(API_ENDPOINT + `/auth/verify-email?token=${token}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authInfo.access?.token}`,
          },
          body: JSON.stringify({ token }),
        })
        if (response.status === 204) {
          saveAccountInfo({
            ...accountInfo,
            isActive: true,
            isEmailVerified: true,
          })
          notify(NOTIFICATION_TYPE.SUCCESS, "Xác thực tài khoản thành công.")
          route.push("/")
        } else {
          notify(NOTIFICATION_TYPE.ERROR, "Something error with server, please try again!")
        }
      }
      handleVerifyAccount()
    }
  }, [route.query.token])

  return (
    <div className="bg-theme hero min-h-screen">
      <div className="flex items-center gap-12">
        <div className="card hidden w-1/2 items-center justify-center p-8 shadow-2xl lg:flex">
          <img src="images/auth-forgot-password.png" alt="" className="w-[60%]" />
        </div>
        <div className="w-full max-w-sm shrink-0 px-8 lg:w-1/2 lg:px-2">
          <div className="text-center text-slate-400 lg:text-left">
            <h1 className="mb-4 text-4xl font-bold">Verify Account 🔒</h1>
          </div>
          <div className="flex flex-col gap-4 text-center">
            <p>Mã xác thực tài khoản của bạn đã được gửi tới email. Vui lòng kiểm tra và xác nhận</p>
            <CustomButton color="green" onClick={handleSendOTPToEmail}>
              Nhận mã xác thực
            </CustomButton>
            <div className="flex justify-center gap-2">
              <Link href="login" className="text-primary-400 hover:underline">
                Back to login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerifyAccountPage

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

export type ChangePassRequest = {
  oldPass: string
  newPass: string
  reEnterPass: string
}
type ResponseChpwd = {
  success: string
  message: string
}

const ChangePassword = () => {
  const route = useRouter()
  const { authInfo, removeAuthInfo } = useBoundStore((state) => ({
    authInfo: state.authInfo,
    removeAuthInfo: state.removeAuthInfo,
  }))

  // useEffect(() => {
  //   if (authInfo.accessToken == null) {
  //     notify(NOTIFICATION_TYPE.ERROR, `Unauthorize`)
  //     route.push("/login")
  //   }
  // }, [])

  const [changePass, setChangePass] = useState<ChangePassRequest>({
    oldPass: "",
    newPass: "",
    reEnterPass: "",
  })
  const [errorMessage, setErrorMessage] = useState<ChangePassRequest>({
    oldPass: "",
    newPass: "",
    reEnterPass: "",
  })

  const putChangePassword = async (changePass: ChangePassRequest): Promise<Response> => {
    const token = "Bearer " + authInfo.access
    const response = await fetch(API_ENDPOINT + "/user/change-pass", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(changePass),
    })
    const raw = (await response.json()) as ResponseChpwd
    if (response.status !== 200) {
      setErrorMessage({ ...errorMessage, oldPass: raw.message })
    } else {
      notify(NOTIFICATION_TYPE.SUCCESS, `change password successfully!`)
      removeAuthInfo()
      route.push("/login")
    }
    return response
  }

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name
    const value = e.target.value
    setChangePass({
      ...changePass,
      [name]: value,
    })
    setErrorMessage({ oldPass: "", newPass: "", reEnterPass: "" })
  }

  const validateForm = () => {
    let isValid = true
    Object.entries(changePass).forEach(([key, value]) => {
      if (!value) {
        isValid = false
        setErrorMessage({ ...errorMessage, [key]: !value ? `${key} is require` : "" })
      }
    })
    if (isValid) {
      if (changePass.newPass !== changePass.reEnterPass) {
        isValid = false
        setErrorMessage({ ...errorMessage, reEnterPass: `re-enter password not match` })
      }
    }
    return isValid
  }

  const hanldeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      const data = putChangePassword(changePass)
      console.log(authInfo)
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
            <h1 className="text-4xl font-bold">Change Password 🔒</h1>
            <p className="py-6">Change your pass to a more secure one</p>
          </div>
          <form onSubmit={hanldeSubmit}>
            <div className="flex flex-col gap-4">
              <CustomInput
                type="password"
                name="oldPass"
                label="Old password"
                placeholder="Old password"
                onChange={handleChangeInput}
              />
              {errorMessage.oldPass && <span className="text-red-600">{errorMessage.oldPass}</span>}
              <CustomInput
                type="password"
                name="newPass"
                label="New password"
                placeholder="New password"
                onChange={handleChangeInput}
              />
              {errorMessage.newPass && <span className="text-red-600">{errorMessage.newPass}</span>}
              <CustomInput
                type="password"
                name="reEnterPass"
                label="Re-enter new password"
                placeholder="Re-enter new password"
                onChange={handleChangeInput}
              />
              {errorMessage.reEnterPass && <span className="text-red-600">{errorMessage.reEnterPass}</span>}
              <CustomButton color="green">Change</CustomButton>
              <div className="flex justify-center gap-2">
                <Link href="login" className="text-primary-400 hover:underline">
                  Back to login
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ChangePassword

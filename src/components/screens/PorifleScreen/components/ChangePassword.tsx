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
  const { authInfo, saveAuthInfo, saveAccountInfo } = useBoundStore((state) => ({
    authInfo: state.authInfo,
    saveAuthInfo: state.saveAuthInfo,
    saveAccountInfo: state.saveAccountInfo,
  }))

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

  const handleChangePassword = async () => {
    const token = "Bearer " + authInfo.access?.token
    const response = await fetch(API_ENDPOINT + "/users/update-my-password", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        currentPassword: changePass.oldPass,
        newPassword: changePass.newPass,
      }),
    })
    const raw = (await response.json()) as Response<AccountInfo>
    if (raw.status === "success" && raw?.data) {
      notify(NOTIFICATION_TYPE.SUCCESS, "Đổi mật khẩu thành công")
      saveAccountInfo(raw.data.user)
      saveAuthInfo(raw.data.tokens)
    } else {
      setErrorMessage({ ...errorMessage, oldPass: raw.message ?? "" })
      notify(NOTIFICATION_TYPE.ERROR, raw.message ? raw.message : "Có lỗi xảy ra, vui lòng thử lại!")
    }
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      handleChangePassword()
    }
  }

  return (
    <div className="px-20 py-10">
      <div className="pb-8 text-2xl font-semibold">Đổi Mật Khẩu</div>
      <div className="flex flex-col gap-4">
        <CustomInput
          type="password"
          name="oldPass"
          label="Mật khẩu hiện tại"
          placeholder="Mật khẩu hiện tại"
          onChange={handleChangeInput}
        />
        {errorMessage.oldPass && <span className="text-red-600">{errorMessage.oldPass}</span>}
        <CustomInput
          type="password"
          name="newPass"
          label="Mật khẩu mới"
          placeholder="Mật khẩu mới"
          onChange={handleChangeInput}
        />
        {errorMessage.newPass && <span className="text-red-600">{errorMessage.newPass}</span>}
        <CustomInput
          type="password"
          name="reEnterPass"
          label="Xác nhận mật khẩu"
          placeholder="Xác nhận mật khẩu"
          onChange={handleChangeInput}
        />
        {errorMessage.reEnterPass && <span className="text-red-600">{errorMessage.reEnterPass}</span>}
        <CustomButton color="green" onClick={handleSubmit}>
          Cập nhật
        </CustomButton>
      </div>
    </div>
  )
}

export default ChangePassword

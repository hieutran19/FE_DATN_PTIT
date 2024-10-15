import MainLayout from "@components/layouts/MainLayout"
import { PROFILE_TYPE } from "@components/screens/PorifleScreen"
import React from "react"
import dynamic from "next/dynamic"

const ProfileScreen = dynamic(() => import("@components/screens/PorifleScreen").then((mod) => mod.default), {
  ssr: false,
})

const ChangePasswordPage = () => {
  return (
    <MainLayout title="Change Password">
      <ProfileScreen type={PROFILE_TYPE.CHANGE_PASSWORD} />
    </MainLayout>
  )
}

export default ChangePasswordPage

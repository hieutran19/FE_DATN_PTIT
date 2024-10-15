import MainLayout from "@components/layouts/MainLayout"
import { PROFILE_TYPE } from "@components/screens/PorifleScreen"
import React from "react"
import dynamic from "next/dynamic"

const ProfileScreen = dynamic(() => import("@components/screens/PorifleScreen").then((mod) => mod.default), {
  ssr: false,
})

const MyAccountPage = () => {
  return (
    <MainLayout title="My Account">
      <ProfileScreen type={PROFILE_TYPE.CUSTOMER_INFORMATION} />
    </MainLayout>
  )
}

export default MyAccountPage

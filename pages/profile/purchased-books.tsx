import MainLayout from "@components/layouts/MainLayout"
import { PROFILE_TYPE } from "@components/screens/PorifleScreen"
import React from "react"
import dynamic from "next/dynamic"

const ProfileScreen = dynamic(() => import("@components/screens/PorifleScreen").then((mod) => mod.default), {
  ssr: false,
})

const PurchasedBooksPage = () => {
  return (
    <MainLayout title="Purchased Books">
      <ProfileScreen type={PROFILE_TYPE.BOOKS_HAS_BOUGHT} />
    </MainLayout>
  )
}

export default PurchasedBooksPage

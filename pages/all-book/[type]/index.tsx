import React from "react"
import MainLayout from "@components/layouts/MainLayout"
import CategoryScreen from "@components/screens/CategoryScreen"
import { useRouter } from "next/router"
import AllBookScreen from "@components/screens/AllBookScreen"

const AllBookPage = () => {
  const route = useRouter()
  return (
    <MainLayout
      title={`${route.query.type?.toString().slice(0, 1).toUpperCase()}${route.query.type?.toString().slice(1)} Books`}
    >
      <AllBookScreen type={route.query.type as string} />
    </MainLayout>
  )
}

export default AllBookPage

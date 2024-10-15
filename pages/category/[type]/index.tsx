import React from "react"
import MainLayout from "@components/layouts/MainLayout"
import CategoryScreen from "@components/screens/CategoryScreen"
import { useRouter } from "next/router"

const CategoryPage = () => {
  const route = useRouter()
  return (
    <MainLayout title={route.query.type as string}>
      <CategoryScreen category={route.query.type as string} />
    </MainLayout>
  )
}

export default CategoryPage

import MainLayout from "@components/layouts/MainLayout"
import SearchScreen from "@components/screens/SearchScreen"
import { useRouter } from "next/router"
import React from "react"

const SearchPage = () => {
  return (
    <MainLayout title="Search">
      <SearchScreen />
    </MainLayout>
  )
}

export default SearchPage

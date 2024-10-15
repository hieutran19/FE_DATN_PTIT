import React from "react"
import MainLayout from "@components/layouts/MainLayout"
import { useRouter } from "next/router"
import BookScreen from "@components/screens/BookScreen"

const BookPage = () => {
  const route = useRouter()
  return (
    <MainLayout title={route.query.id as string}>
      <BookScreen id={route.query.id as string} />
    </MainLayout>
  )
}

export default BookPage

import React from "react"
import { useRouter } from "next/router"
import DocumentCategory from "./components/DocumentCategory"
import BookType from "@components/common/BookType"

const HomePageScreen = () => {
  const router = useRouter()

  return (
    <div className="h-full w-screen">
      <DocumentCategory />
      <div className="px-40">
        <BookType />
      </div>
    </div>
  )
}

export default HomePageScreen

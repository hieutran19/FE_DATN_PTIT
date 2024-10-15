import React from "react"
import dynamic from "next/dynamic"

const ManageScreen = dynamic(
  () => import("@components/screens/Admin/components/ManageGenres").then((mod) => mod.default),
  {
    ssr: false,
  }
)

const ManagePage = () => {
  return <ManageScreen />
}

export default ManagePage

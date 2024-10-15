import React from "react"
import dynamic from "next/dynamic"

const AdminHomeScreen = dynamic(() => import("@components/screens/Admin").then((mod) => mod.default), {
  ssr: false,
})

const AdminHomePage = () => {
  return <AdminHomeScreen />
}

export default AdminHomePage

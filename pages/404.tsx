import { Button } from "@nextui-org/react"
import { useRouter } from "next/router"
import CustomButton from "@components/common/CustomButton"
import MainLayout from "@components/layouts/MainLayout"

const Page404 = () => {
  const router = useRouter()

  const backToHome = () => {
    void router.push("/")
  }

  return (
    <MainLayout className="h-full" title="404 - Not Found">
      <div className="bg-theme text-white flex h-[calc(100vh-120px)] flex-col items-center justify-center">
        <p className="text-center text-[5rem] font-bold sm:text-[6rem]">404</p>
        <p className="mb-6 -mt-4 text-3xl font-semibold">Trang không tồn tại</p>
        <Button color="danger" onClick={backToHome}>Quay về trang chủ</Button>
      </div>
    </MainLayout>
  )
}

export default Page404

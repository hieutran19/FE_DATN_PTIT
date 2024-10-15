import { useRouter } from "next/router"
import MainLayout from "@components/layouts/MainLayout"
import { CustomButton } from "@components/common/CustomButton"

const Page498 = () => {
  const router = useRouter()

  const backToHome = () => {
    void router.push("/")
  }

  return (
    <MainLayout className="h-full" title="Access Denied">
      <div className="-mt-20 flex h-[calc(100vh-120px)] flex-col items-center justify-center text-red-400">
        <p className="sm:text-[6rem] text-center text-[5rem] font-bold">Truy cập bị từ chối</p>
        <p className="mb-4 text-3xl font-semibold">Bạn không có quyền truy cập vào trang này</p>
        <CustomButton onClick={backToHome} color="green">
          Quay lại trang chủ
        </CustomButton>
      </div>
    </MainLayout>
  )
}

export default Page498

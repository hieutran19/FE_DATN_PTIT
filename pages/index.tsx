import MainLayout from "@components/layouts/MainLayout"
import HomePageScreen from "@components/screens/HomePage"

export default function Web() {
  return (
    <MainLayout title="Home">
      <HomePageScreen />
    </MainLayout>
  )
}

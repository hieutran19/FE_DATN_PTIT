import dynamic from "next/dynamic"
import Head from "next/head"
import React, { HTMLAttributes, PropsWithChildren } from "react"
import Footer from "../Footer"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

const Header = dynamic(() => import("../Header/index").then((mod) => mod.default), {
  ssr: false,
})

type Props = PropsWithChildren & HTMLAttributes<HTMLDivElement>

const MainLayout: React.FC<Props> = (props) => {
  const { children, className, title } = props
  return (
    <>
      <Head>
        <link rel="icon" href="/logo2.png"/>
        <title>{title}</title>
        {/* <meta http-equiv="Content-Security-Policy" content="frame-ancestors 'self' http://localhost:3000" /> */}
      </Head>
      <main className="sm:flex font-plus bg-theme min-h-screen">
        <div className={`container-w flex-auto ${className || ""}`}>
          <div className="flex min-h-screen flex-col">
            <div className="fixed z-30 flex w-full justify-center ">
              <Header />
            </div>
            <div className="grow bg-slate-100 pt-16">{children}</div>
            <Footer />
          </div>
        </div>
      </main>
    </>
  )
}

export default React.memo(MainLayout)

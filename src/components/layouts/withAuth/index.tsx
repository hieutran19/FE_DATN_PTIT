import React, { ComponentType, useEffect } from "react"
import { NOTIFICATION_TYPE, notify } from "@utils/notify"
import { useBoundStore } from "@zustand/total"

interface AuthProps {
  isAuthenticated: boolean
  userRole: string | null
}

const withAuth = <P extends AuthProps>(WrappedComponent: ComponentType<P>, requiredRole: string[]) => {
  const WithAuth: React.FC<Omit<P, keyof AuthProps>> = (props) => {
    const { accountInfo } = useBoundStore((store) => ({
      accountInfo: store.accountInfo,
    }))

    if (requiredRole.includes(accountInfo?.role ?? "")) {
      return <WrappedComponent {...(props as P)} />
    } else {
      import("next/router").then((Router) => {
        Router.default.back()
      })
      setTimeout(() => {
        notify(NOTIFICATION_TYPE.ERROR, "Unauthorized access", { toastId: "Auth notify" })
      }, 50)
    }
  }

  return WithAuth
}

export default withAuth

import { useEffect, useState } from "react"
import { INITIAL_STATE } from "@zustand/total"

const useZustandStore = <TStore, TReturnFuncValue>(
  store: (callback: (state: TStore) => unknown) => unknown,
  callback: (state: TStore) => TReturnFuncValue
) => {
  const result = store(callback) as TReturnFuncValue
  const [isHydrated, setIsHydrated] = useState<boolean>(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  return isHydrated ? result : (INITIAL_STATE as TReturnFuncValue)
}

export default useZustandStore

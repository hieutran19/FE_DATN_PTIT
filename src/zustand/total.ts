import { create } from "zustand"
import { persist } from "zustand/middleware"
import { AccountInfoSlice, createAccountInfoSlice } from "./accountInfo"
import { AuthInfoSlice, createAuthInfoSlice } from "./authInfo"

type StoreSlice = AccountInfoSlice & AuthInfoSlice
export const ZUSTAND_STORAGE_NAME = "fuhub.states"

export const INITIAL_STATE = {
  accountInfo: {
    userId: null,
    username: null,
    gmail: null,
    picture: null,
    role: null,
  },
  saveAccountInfo: () => {},
  removeAccountInfo: () => {},
  authInfo: {
    accessToken: null,
    refreshToken: null,
  },
  saveAuthInfo: () => {},
  removeAuthInfo: () => {},
}

export const useBoundStore = create<StoreSlice>()(
  persist(
    (...a) => ({
      ...createAccountInfoSlice(...a),
      ...createAuthInfoSlice(...a),
    }),
    {
      name: ZUSTAND_STORAGE_NAME,
      skipHydration: false,
    }
  )
)

import { User } from "@models/user"
import { StateCreator } from "zustand"

export interface AccountInfoSlice {
  accountInfo?: User
  saveAccountInfo: (payload: User) => void
  removeAccountInfo: () => void
}

export const createAccountInfoSlice: StateCreator<AccountInfoSlice, [], [], AccountInfoSlice> = (set) => ({
  accountInfo: {},
  saveAccountInfo: (payload: User) =>
    set(() => ({
      accountInfo: payload,
    })),
  removeAccountInfo: () =>
    set(() => ({
      accountInfo: {},
    })),
})

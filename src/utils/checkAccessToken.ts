import { deleteCookie, getCookie } from 'cookies-next'
import jwt from 'jsonwebtoken'
import { AppAccountInfo } from '@models/common'
import { COOKIES_KEY } from '@models/keys'
import dayjs from '@utils/dayjs'

export enum STATUS_ACCESS_TOKEN {
  EXPIRED = 'EXPIRED',
  UNEXPIRED = 'UNEXPIRED',
  NO_ACCESS_TOKEN = 'NO_ACCESS_TOKEN',
  INVALID = 'INVALID',
}

export const dayTokenExpires = process.env.NEXT_PUBLIC_JWT_ACCESS_DAY_TOKEN_EXPIRES_IN
  ? Number(process.env.NEXT_PUBLIC_JWT_ACCESS_DAY_TOKEN_EXPIRES_IN)
  : 7

export function checkExpiresAccessToken(accessToken = ''): STATUS_ACCESS_TOKEN {
  if (accessToken) {
    let accessTokenData
    try {
      accessTokenData = jwt.decode(accessToken)
    } catch (error) {
      deleteCookie(COOKIES_KEY.WEB_ACCESS_TOKEN)
    }
    if (accessTokenData && typeof accessTokenData !== 'string') {
      const expired = dayjs.utc().valueOf() > (accessTokenData as any).exp * 1000

      if (expired) {
        // case het han
        return STATUS_ACCESS_TOKEN.EXPIRED
      } else {
        return STATUS_ACCESS_TOKEN.UNEXPIRED
      }
    } else {
      return STATUS_ACCESS_TOKEN.NO_ACCESS_TOKEN
    }
  } else {
    return STATUS_ACCESS_TOKEN.NO_ACCESS_TOKEN
  }
}

export function checkIsAppAccessTokenExpired(): STATUS_ACCESS_TOKEN {
  const appAccountInfo = getCookie(COOKIES_KEY.APP_ACCOUNT_INFO)
  if (!appAccountInfo) {
    return STATUS_ACCESS_TOKEN.NO_ACCESS_TOKEN
  }
  const appAccountInfoJson = JSON.parse(appAccountInfo as string) as AppAccountInfo
  const appAccessToken = appAccountInfoJson.appAccessToken
  const expiredAt = appAccountInfoJson.expiresAt
  if (appAccessToken && expiredAt) {
    if (dayjs.utc(expiredAt * 1000).isBefore(dayjs.utc())) {
      return STATUS_ACCESS_TOKEN.EXPIRED
    } else {
      return STATUS_ACCESS_TOKEN.UNEXPIRED
    }
  } else {
    return STATUS_ACCESS_TOKEN.NO_ACCESS_TOKEN
  }
}

export const getTokenExpired = (accessToken = '') => {
  if (accessToken) {
    let accessTokenData
    try {
      accessTokenData = jwt.decode(accessToken)
    } catch (error) {
      deleteCookie(COOKIES_KEY.WEB_ACCESS_TOKEN)
    }
    if (accessTokenData && typeof accessTokenData !== 'string') {
      return dayjs((accessTokenData as any).exp * 1000).toDate()
    }
  }
  return null
}

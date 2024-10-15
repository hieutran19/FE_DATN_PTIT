const SECONDS_IN_A_DAY = 24 * 60 * 60
const MILLISECONDS_IN_A_SECOND = 1000
const DAYS_IN_A_MONTH = 30
const DAYS_IN_A_YEAR = 365

export const calculateDaysDifferent = (createdDate: string) => {
  if (!createdDate) {
    return "1 day"
  }
  const createdAt = new Date(createdDate)
  const currentDate = new Date()
  const differenceInTime = currentDate.getTime() - createdAt.getTime()
  let differenceInDays = differenceInTime / (MILLISECONDS_IN_A_SECOND * SECONDS_IN_A_DAY)

  let result
  if (differenceInDays < 1) {
    result = "1 day"
  } else if (differenceInDays < DAYS_IN_A_MONTH) {
    result = `${Math.ceil(differenceInDays)} days`
  } else if (differenceInDays < DAYS_IN_A_YEAR) {
    const differenceInMonths = Math.ceil(differenceInDays / DAYS_IN_A_MONTH)
    result = `${differenceInMonths} months`
  } else {
    const differenceInYears = Math.ceil(differenceInDays / DAYS_IN_A_YEAR)
    result = `${differenceInYears} years`
  }

  return result
}

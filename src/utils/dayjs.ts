import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import updateLocale from 'dayjs/plugin/updateLocale'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)
dayjs.extend(updateLocale)
dayjs.extend(duration)

dayjs.updateLocale('en', {
  months: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  weekStart: 1,
})

const extendedDayJs = dayjs

export const toLocalTime = (date: Date, isDisplayHour = true) => {
  if (!date || !extendedDayJs(date).isValid()) {
    return ''
  }
  return extendedDayJs
    .utc(date)
    .local()
    .format(`MMM DD, YYYY ${isDisplayHour ? 'hh:mm A' : ''}`)
}

export const getDateFromParam = (param: string, index: number) => {
  return extendedDayJs.unix(Number(param.split('/')[index])).toDate()
}

export default extendedDayJs

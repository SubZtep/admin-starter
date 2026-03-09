import clsx, { type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/** Calculates the relative time interval. */
export function getTimeAgo(time: Date, now = new Date(), locale = "en") {
  function monthDiff(dateFrom: Date, dateTo: Date) {
    return dateTo.getMonth() - dateFrom.getMonth() + 12 * (dateTo.getFullYear() - dateFrom.getFullYear())
  }

  let value
  const diff = (now.getTime() - time.getTime()) / 1000
  const minutes = Math.floor(diff / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  // const months = Math.floor(days / 30)
  const months = monthDiff(time, now)
  const years = Math.floor(months / 12)
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" })

  if (years > 0) {
    value = rtf.format(0 - years, "year")
  } else if (months > 0) {
    value = rtf.format(0 - months, "month")
  } else if (days > 0) {
    value = rtf.format(0 - days, "day")
  } else if (hours > 0) {
    value = rtf.format(0 - hours, "hour")
  } else if (minutes > 0) {
    value = rtf.format(0 - minutes, "minute")
  } else {
    value = rtf.format(0 - diff, "second")
  }
  return value
}

/** Extracts the first part of a name. */
export function getFirstName(fullName?: string, prefix = " ") {
  return fullName ? `${prefix}${fullName.split(" ")[0]}` : ""
}

/** Merge CSS class names. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

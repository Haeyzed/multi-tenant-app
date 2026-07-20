/**
 * Formats a given date value into a human-readable, localized date string using `Intl.DateTimeFormat`.
 *
 * Defaults to the "en-US" locale with a "Month Day, Year" format (e.g., "July 20, 2026"),
 * but can be easily customized by passing additional formatting options. Gracefully falls back
 * to an empty string `""` if the input is missing, undefined, or invalid.
 *
 * @param date - The date to format. Accepts a `Date` object, a date string, a timestamp number, or `undefined`.
 * @param opts - Optional `Intl.DateTimeFormatOptions` to override default formatting behavior (month, day, year).
 * @returns The formatted date string, or an empty string `""` if formatting fails.
 *
 * @example
 * formatDate("2026-07-20")
 * // Returns "July 20, 2026"
 *
 * @example
 * formatDate(new Date(), { month: "short", year: "2-digit", day: "2-digit" })
 * // Returns "Jul 20, 26"
 */
export function formatDate(
    date: Date | string | number | undefined,
    opts: Intl.DateTimeFormatOptions = {}
) {
  if (!date) return ""

  try {
    return new Intl.DateTimeFormat("en-US", {
      month: opts.month ?? "long",
      day: opts.day ?? "numeric",
      year: opts.year ?? "numeric",
      ...opts,
    }).format(new Date(date))
  } catch (_err) {
    return ""
  }
}

/**
 * Converts a Date, timestamp number, or numeric string (e.g., "1782860400000" from Dice UI)
 * into a standard "YYYY-MM-DD" SQL-compatible date string using local timezone methods.
 *
 * Prevents UTC day-shifting issues caused by .toISOString() and returns `undefined`
 * on invalid inputs so query libraries automatically strip empty parameters from URLs.
 *
 * @param date - The date value to convert. Accepts a `Date` object, a date/timestamp string, a number, or `undefined`.
 * @returns A formatted "YYYY-MM-DD" string, or `undefined` if the input is invalid or missing.
 */
export function formatToLocalDateString(
    date: Date | string | number | undefined
): string | undefined {
  if (!date) return undefined

  try {
    // If passed a purely numeric string (e.g. from nuqs/URL), parse it as a number first
    const val =
        typeof date === "string" && !isNaN(Number(date)) && date.trim() !== ""
            ? Number(date)
            : date

    const parsedDate = new Date(val)

    // Ensure we have a valid date object before extracting methods
    if (isNaN(parsedDate.getTime())) return undefined

    // Use local time getters to prevent UTC conversion from rolling back the date
    const year = parsedDate.getFullYear()
    const month = String(parsedDate.getMonth() + 1).padStart(2, "0")
    const day = String(parsedDate.getDate()).padStart(2, "0")

    return `${year}-${month}-${day}`
  } catch (_err) {
    return undefined
  }
}
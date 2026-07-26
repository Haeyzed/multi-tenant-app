export function formatMoney(
    amount: number,
    currency = "NGN",
    locale = "en-NG"
): string {
    try {
        return new Intl.NumberFormat(locale, {
            style: "currency",
            currency,
            maximumFractionDigits: 0,
        }).format(amount)
    } catch {
        return `${currency} ${amount.toLocaleString()}`
    }
}

export function formatPercent(value: number): string {
    const sign = value > 0 ? "+" : ""
    return `${sign}${value.toFixed(1)}%`
}

export function formatCompactNumber(value: number): string {
    return new Intl.NumberFormat("en", {
        notation: "compact",
        maximumFractionDigits: 1,
    }).format(value)
}

export function formatRelativeTime(value: string | null): string {
    if (!value) {
        return "—"
    }

    const date = new Date(value)
    if (Number.isNaN(date.getTime())) {
        return "—"
    }

    const diffMs = date.getTime() - Date.now()
    const absSeconds = Math.round(Math.abs(diffMs) / 1000)
    const rtf = new Intl.RelativeTimeFormat("en", {numeric: "auto"})

    if (absSeconds < 60) {
        return rtf.format(Math.round(diffMs / 1000), "second")
    }
    if (absSeconds < 3600) {
        return rtf.format(Math.round(diffMs / 60000), "minute")
    }
    if (absSeconds < 86400) {
        return rtf.format(Math.round(diffMs / 3600000), "hour")
    }
    return rtf.format(Math.round(diffMs / 86400000), "day")
}

export type GatewayFilterOption = {
    label: string
    value: string
}

/**
 * Static payment gateway options used for table select filters.
 * Mirrors the backend App\Enums\Central\PaymentGateway enum.
 */
export const PAYMENT_GATEWAY_FILTER_OPTIONS: GatewayFilterOption[] = [
    {label: "Stripe", value: "stripe"},
    {label: "Paystack", value: "paystack"},
    {label: "Flutterwave", value: "flutterwave"},
    {label: "Lemon Squeezy", value: "lemon_squeezy"},
    {label: "Paddle", value: "paddle"},
    {label: "PayPal", value: "paypal"},
    {label: "Razorpay", value: "razorpay"},
    {label: "Braintree", value: "braintree"},
    {label: "Square", value: "square"},
    {label: "Manual", value: "manual"},
    {label: "Bank Transfer", value: "bank_transfer"},
    {label: "Cryptocurrency", value: "crypto"},
]

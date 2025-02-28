export interface PaymentData {
  amount: number
  cardNumber: string
  cvv: string
  name: string
  email: string
}

export interface PaymentResult {
  gatewayId: number | undefined
  externalId: string | null
  success: boolean
}

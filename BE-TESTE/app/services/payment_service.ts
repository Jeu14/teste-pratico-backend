import Gateway from '#models/gateway'
import Gateway1Service from './Gateways/Gateway1Service.js'
import Gateway2Service from './Gateways/Gateway2Service.js'
import Transaction from '#models/transaction'

import { ChargeBackResult, PaymentData, PaymentResult } from '../interfaces/Payment_interface.js'

export default class PaymentService {
  public static async processPayment(data: PaymentData): Promise<PaymentResult> {
    const gateways = await Gateway.query().where('is_active', true).orderBy('priority', 'asc')
    let lastError: string | null = null

    for (const gateway of gateways) {
      try {
        let result: PaymentResult

        if (gateway.name === 'Gateway 1') {
          const response = await Gateway1Service.createTransaction({
            amount: data.amount,
            name: data.name,
            email: data.email,
            cardNumber: data.cardNumber,
            cvv: data.cvv,
          })
          const externalId = response.id
          result = { gatewayId: 1, externalId: externalId || null, success: !!externalId }
        } else if (gateway.name === 'Gateway 2') {
          const response = await Gateway2Service.createTransaction({
            valor: data.amount,
            nome: data.name,
            email: data.email,
            numeroCartao: data.cardNumber,
            cvv: data.cvv,
          })
          const externalId = response.id
          result = { gatewayId: 2, externalId: externalId || null, success: !!externalId }
        } else {
          lastError = `Gateway ${gateway.name} not implemented`
          continue
        }

        if (result.success) {
          return result
        } else {
          lastError = `Payment refused by ${gateway.name}`
        }
      } catch (error: any) {
        lastError = error.message
      }
    }

    return { gatewayId: undefined, externalId: null, success: false }
  }

  public static async chargeBackPayment(transaction: Transaction): Promise<ChargeBackResult> {
    const gateways = await Gateway.query().where('is_active', true).orderBy('priority', 'asc')
    let lastError: string | null = null

    for (const gateway of gateways) {
      try {
        let result: ChargeBackResult
        if (gateway.name === 'Gateway 1') {
          result = await Gateway1Service.chargeBack(transaction)
        } else if (gateway.name === 'Gateway 2') {
          result = await Gateway2Service.chargeBack(transaction)
        } else {
          lastError = `Gateway ${gateway.name} not implemented for refunds`
          continue
        }

        if (result.success) {
          return result
        } else {
          lastError = result.error || 'chargeback failed'
        }
      } catch (error: any) {
        lastError = error.message
      }
    }

    return { success: false, error: lastError || 'No gateway was able to process the chargeback' }
  }
}

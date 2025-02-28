import Client from '#models/client'
import Product from '#models/product'
import Transaction from '#models/transaction'
import TransactionProduct from '#models/transaction_product'
import PaymentService from '#services/payment_service'
import vine from '@vinejs/vine'
import PurchaseValidator from '#validators/PurchaseValidator'

import type { HttpContext } from '@adonisjs/core/http'
import { PaymentResult } from '../interfaces/Payment_interface.js'

export default class PurchasesController {
  public async store({ request, response }: HttpContext) {
    const data = request.only([
      'clientName',
      'clientEmail',
      'productId',
      'quantity',
      'cardNumber',
      'cvv',
    ])

    try {
      await vine.validate({ schema: PurchaseValidator, data })
    } catch (errors) {
      return response.status(422).json({ errors })
    }

    const product = await Product.find(data.productId)
    if (!product) {
      return response.status(404).json({ message: 'Product not found' })
    }

    const amount = product.amount * data.quantity

    let paymentResult: PaymentResult
    try {
      paymentResult = await PaymentService.processPayment({
        amount,
        cardNumber: data.cardNumber,
        cvv: data.cvv,
        name: data.clientName,
        email: data.clientEmail,
      })
    } catch (error: any) {
      return response.status(500).json({
        message: 'An error occurred while processing the payment. Please try again later.',
      })
    }

    let client = await Client.findBy('email', data.clientEmail)
    if (!client) {
      client = await Client.create({ name: data.clientName, email: data.clientEmail })
    }

    const transaction = await Transaction.create({
      client_id: client.id,
      gateway_id: paymentResult.gatewayId,
      external_id: paymentResult.externalId || '',
      status: paymentResult.success ? 'SUCCESS' : 'FAILED',
      amount,
      card_last_numbers: data.cardNumber.slice(-4),
    })

    await TransactionProduct.create({
      transaction_id: transaction.id,
      product_id: product.id,
      quantity: data.quantity,
    })

    if (!paymentResult.success) {
      return response.status(400).json({
        message: 'Your purchase has been declined. Please check your details or contact support.',
      })
    }

    return response.status(200).json({ message: 'Purchase processed successfully', transaction })
  }
}

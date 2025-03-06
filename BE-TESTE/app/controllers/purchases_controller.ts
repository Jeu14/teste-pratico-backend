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
    const data = request.only(['clientName', 'clientEmail', 'products', 'cardNumber', 'cvv'])

    try {
      await vine.validate({ schema: PurchaseValidator, data })
    } catch (errors) {
      return response.status(422).json({ errors })
    }

    let client = await Client.findBy('email', data.clientEmail)
    if (!client) {
      client = await Client.create({ name: data.clientName, email: data.clientEmail })
    }

    let totalAmount = 0
    const items = []

    for (const item of data.products) {
      const product = await Product.find(item.id)
      if (!product) {
        return response.status(404).json({ message: `Product with id ${item.id} not found` })
      }
      totalAmount += product.amount * item.quantity
      items.push({ product_id: product.id, quantity: item.quantity })
    }

    let paymentResult: PaymentResult
    try {
      paymentResult = await PaymentService.processPayment({
        amount: totalAmount,
        cardNumber: data.cardNumber,
        cvv: data.cvv,
        name: data.clientName,
        email: data.clientEmail,
      })
    } catch (error: any) {
      return response.status(400).json({
        message: 'An error occurred while processing the payment. Please try again later.',
      })
    }

    const transaction = await Transaction.create({
      client_id: client.id,
      gateway_id: paymentResult.gatewayId,
      external_id: paymentResult.externalId || '',
      status: paymentResult.success ? 'SUCCESS' : 'FAILED',
      amount: totalAmount,
      card_last_numbers: data.cardNumber.slice(-4),
    })

    for (const item of items) {
      await TransactionProduct.create({
        transaction_id: transaction.id,
        product_id: item.product_id,
        quantity: item.quantity,
      })
    }

    if (!paymentResult.success) {
      return response.status(400).json({
        message: 'Your purchase has been declined. Please check your details or contact support.',
      })
    }

    return response.status(200).json({
      message: 'Purchase processed successfully',
      transaction,
    })
  }
}

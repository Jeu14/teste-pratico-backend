import Transaction from '#models/transaction'
import type { HttpContext } from '@adonisjs/core/http'

export default class TransactionsController {
  public async index({ request, response }: HttpContext) {
    const statusFilter = request.input('status')?.toLowerCase()

    const query = Transaction.query()
      .select(
        'id',
        'client_id',
        'gateway_id',
        'external_id',
        'status',
        'amount',
        'card_last_numbers'
      )
      .preload('client', (query) => {
        query.select('id', 'name', 'email')
      })
      .preload('transactionProducts', (tpQuery) => {
        tpQuery
          .select('id', 'transaction_id', 'product_id', 'quantity')
          .preload('product', (pQuery) => {
            pQuery.select('id', 'name', 'amount')
          })
      })

    if (statusFilter === 'success') {
      query.where('status', 'SUCCESS')
    } else if (statusFilter === 'failed') {
      query.where('status', 'FAILED')
    }

    const transactions = await query.exec()

    const transformed = transactions.map((t) => ({
      id: t.id,
      externalId: t.external_id,
      status: t.status,
      amount: t.amount,
      cardLastNumbers: t.card_last_numbers,
      client: t.client,
      transactionProducts: t.transactionProducts.map((tp) => ({
        id: tp.id,
        transactionId: tp.transaction_id,
        quantity: tp.quantity,
        product: tp.product,
      })),
    }))

    return response.status(200).json({ transactions: transformed })
  }

  public async show({ params, response }: HttpContext) {
    const transaction = await Transaction.query()
      .where('id', params.id)
      .preload('client', (query) => {
        query.select('id', 'name', 'email')
      })
      .preload('transactionProducts', (tpQuery) => {
        tpQuery.select('id', 'product_id', 'quantity').preload('product', (pQuery) => {
          pQuery.select('id', 'name', 'amount')
        })
      })
      .select(
        'id',
        'client_id',
        'gateway_id',
        'external_id',
        'status',
        'amount',
        'card_last_numbers'
      )
      .first()

    if (!transaction) {
      return response.status(404).json({ message: 'Purchase not found' })
    }

    const transformed = {
      id: transaction.id,
      externalId: transaction.external_id,
      status: transaction.status,
      amount: transaction.amount,
      cardLastNumbers: transaction.card_last_numbers,
      client: transaction.client,
      transactionProducts: transaction.transactionProducts.map((tp) => ({
        id: tp.id,
        productId: tp.product_id,
        quantity: tp.quantity,
        product: tp.product,
      })),
    }

    return response.status(200).json({ transaction: transformed })
  }
}

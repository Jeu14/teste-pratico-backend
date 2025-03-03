import Client from '#models/client'

import type { HttpContext } from '@adonisjs/core/http'

export default class ClientsController {
  public async index({ response }: HttpContext) {
    const clients = await Client.all()
    return response.status(200).json({ clients })
  }

  public async show({ params, request, response }: HttpContext) {
    const statusFilter = request.input('status')?.toLowerCase()

    const client = await Client.query()
      .where('id', params.id)
      .preload('transactions', (transactionQuery) => {
        if (statusFilter === 'success') {
          transactionQuery.where('status', 'SUCCESS')
        } else if (statusFilter === 'failed') {
          transactionQuery.where('status', 'FAILED')
        }
        transactionQuery.select('id', 'external_id', 'status', 'amount', 'card_last_numbers')
        transactionQuery.preload('transactionProducts', (tpQuery) => {
          tpQuery.select('id', 'product_id', 'quantity')
          tpQuery.preload('product', (productQuery) => {
            productQuery.select('id', 'name', 'amount')
          })
        })
      })
      .first()

    if (!client) {
      return response.status(404).json({ message: 'Client not found' })
    }

    const transformedClient = {
      id: client.id,
      name: client.name,
      email: client.email,
      transactions: client.transactions.map((transaction) => ({
        id: transaction.id,
        externalId: transaction.external_id,
        status: transaction.status,
        amount: transaction.amount,
        cardLastNumbers: transaction.card_last_numbers,
        transactionProducts: transaction.transactionProducts.map((tp) => ({
          product: {
            id: tp.product.id,
            name: tp.product.name,
            amount: tp.product.amount,
            quantity: tp.quantity,
          },
        })),
      })),
    }

    return response.status(200).json({ client: transformedClient })
  }
}

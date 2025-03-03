import Product from './product.js'
import Transaction from './transaction.js'

import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class TransactionProduct extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare transaction_id: number

  @column()
  declare product_id: number

  @column()
  declare quantity: number

  @belongsTo(() => Transaction, { foreignKey: 'transaction_id' })
  declare transaction: BelongsTo<typeof Transaction>

  @belongsTo(() => Product, { foreignKey: 'product_id' })
  declare product: BelongsTo<typeof Product>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
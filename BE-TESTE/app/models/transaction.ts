import Client from './client.js'
import Gateway from './gateway.js'
import TransactionProduct from './transaction_product.js'

import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

export default class Transaction extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare client_id: number

  @column()
  declare gateway_id: number

  @column()
  declare external_id: string

  @column()
  declare status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'CHARGED_BACK'

  @column()
  declare amount: number

  @column()
  declare card_last_numbers: string

  @belongsTo(() => Client, { foreignKey: 'client_id' })
  declare client: BelongsTo<typeof Client>

  @belongsTo(() => Gateway, { foreignKey: 'gateway_id' })
  declare gateway: BelongsTo<typeof Gateway>

  @hasMany(() => TransactionProduct, { foreignKey: 'transaction_id' })
  declare transactionProducts: HasMany<typeof TransactionProduct>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
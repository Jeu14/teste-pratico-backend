import Transaction from './transaction.js'

import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class Gateway extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string
  
  @column()
  declare is_active: boolean

  @column()
  declare priority: number

  @hasMany(() => Transaction)
  declare transactions: HasMany<typeof Transaction>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
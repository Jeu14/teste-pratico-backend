import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'transactions'

  async up() {
    this.schema.raw(`
      ALTER TABLE ${this.tableName} 
      MODIFY COLUMN status ENUM('PENDING', 'SUCCESS', 'FAILED', 'CHARGED_BACK') NOT NULL
    `)
  }

  async down() {
    this.schema.raw(`
      ALTER TABLE ${this.tableName} 
      MODIFY COLUMN status ENUM('PENDING', 'SUCCESS', 'FAILED') NOT NULL
    `)
  }
}

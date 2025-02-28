import Gateway from '#models/gateway'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Gateway.firstOrCreate(
      { name: 'Gateway 1' },
      { is_active: true, priority: 1 }
    )

    await Gateway.firstOrCreate(
      { name: 'Gateway 2' },
      { is_active: true, priority: 2 }
    )
  }
}
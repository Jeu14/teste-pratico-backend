import User from '#models/user'
import env from '#start/env'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class UserSeeder extends BaseSeeder {
  async run() {
    await User.firstOrCreate({
      name: env.get('ADMIN_USERNAME'),
      email: env.get('ADMIN_EMAIL'),
      password: env.get('ADMIN_PASSWORD'),
      role: 'ADMIN',
    })
  }
}
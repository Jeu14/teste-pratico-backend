import User from '#models/user'
import vine from '@vinejs/vine'

import type { HttpContext } from '@adonisjs/core/http'

export default class BaseController {
  protected async validateData(schema: any, data: any, response: HttpContext['response']) {
    try {
      return await vine.validate({ schema, data })
    } catch (errors) {
      response.status(422).json({ errors })
      return null
    }
  }

  protected async getUser(id: string, response: HttpContext['response']) {
    const user = await User.find(id)
    if (!user) {
      response.status(404).json({ message: 'User not found' })
      return null
    }
    return user
  }
}

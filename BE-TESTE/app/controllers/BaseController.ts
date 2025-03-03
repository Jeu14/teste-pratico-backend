import vine from '@vinejs/vine'

import type { BaseModel } from '@adonisjs/lucid/orm'
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
  protected async getResource<T extends InstanceType<typeof BaseModel>>(
    modelClass: { find(id: string): Promise<T | null> },
    id: string,
    response: HttpContext['response']
  ): Promise<T | null> {
    const resource = await modelClass.find(id)
    if (!resource) {
      response.status(404).json({ message: 'Resource not found' })
      return null
    }
    return resource
  }
}

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

  protected async updateField(
    resource: InstanceType<typeof BaseModel>,
    field: string,
    value: any,
    response: HttpContext['response'],
    successMessage: string,
    responseKey: string = 'resource'
  ) {
    try {
      ;(resource as any)[field] = value
      await resource.save()
      return response.status(200).json({
        message: successMessage,
        [responseKey]: resource,
      })
    } catch (error: any) {
      return response.status(500).json({
        message: `Error updating ${field}`,
        error: error.message,
      })
    }
  }
}

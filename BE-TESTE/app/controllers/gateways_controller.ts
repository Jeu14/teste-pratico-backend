import Gateway from '#models/gateway'
import vine from '@vinejs/vine'

import {
  updateGatewayStatusSchema,
  updateGatewayPrioritySchema,
} from '#validators/GatewayValidator'

import type { HttpContext } from '@adonisjs/core/http'

export default class GatewaysController {
  private async validateData(schema: any, data: any, response: HttpContext['response']) {
    try {
      return await vine.validate({ schema, data })
    } catch (errors) {
      response.status(422).json({ errors })
      return null
    }
  }

  private async getGateway(id: string, response: HttpContext['response']) {
    const gateway = await Gateway.find(id)
    if (!gateway) {
      response.status(404).json({ message: 'Gateway not found' })
      return null
    }
    return gateway
  }

  private async updateField(
    field: 'is_active' | 'priority',
    value: any,
    gateway: Gateway,
    response: HttpContext['response'],
    successMessage: string
  ) {
    try {
      ;(gateway as any)[field] = value
      await gateway.save()
      return response.status(200).json({
        message: successMessage,
        gateway,
      })
    } catch (error: any) {
      return response.status(500).json({
        message: `Error updating gateway ${field}`,
        error: error.message,
      })
    }
  }

  public async updateStatus({ params, request, response }: HttpContext) {
    const data = request.only(['is_active'])

    const validated = await this.validateData(updateGatewayStatusSchema, data, response)
    if (!validated) return

    const gateway = await this.getGateway(params.id, response)
    if (!gateway) return

    return this.updateField(
      'is_active',
      data.is_active,
      gateway,
      response,
      'Gateway status updated successfully'
    )
  }

  public async updatePriority({ params, request, response }: HttpContext) {
    const data = request.only(['priority'])

    const validated = await this.validateData(updateGatewayPrioritySchema, data, response)
    if (!validated) return

    const gateway = await this.getGateway(params.id, response)
    if (!gateway) return

    return this.updateField(
      'priority',
      data.priority,
      gateway,
      response,
      'Gateway priority updated successfully'
    )
  }
}

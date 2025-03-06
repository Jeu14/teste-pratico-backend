import Gateway from '#models/gateway'
import BaseController from './BaseController.js'

import {
  updateGatewayStatusSchema,
  updateGatewayPrioritySchema,
} from '#validators/GatewayValidator'

import type { HttpContext } from '@adonisjs/core/http'

export default class GatewaysController extends BaseController {
  public async updateStatus({ params, request, response }: HttpContext) {
    const data = request.only(['is_active'])

    const validated = await this.validateData(updateGatewayStatusSchema, data, response)
    if (!validated) return

    const gateway = await this.getResource(Gateway, params.id, response)
    if (!gateway) return

    return this.updateField(
      gateway,
      'is_active',
      data.is_active,
      response,
      'Gateway status updated successfully',
      'gateway'
    )
  }

  public async updatePriority({ params, request, response }: HttpContext) {
    const data = request.only(['priority'])

    const validated = await this.validateData(updateGatewayPrioritySchema, data, response)
    if (!validated) return

    const gateway = await this.getResource(Gateway, params.id, response)
    if (!gateway) return

    return this.updateField(
      gateway,
      'priority',
      data.priority,
      response,
      'Gateway priority updated successfully',
      'gateway'
    )
  }
}

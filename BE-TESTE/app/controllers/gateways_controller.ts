import Gateway from '#models/gateway'
import updateGatewayStatusSchema from '#validators/GatewayValidator'
import vine from '@vinejs/vine'

import type { HttpContext } from '@adonisjs/core/http'

export default class GatewaysController {
  public async updateStatus({ params, request, response }: HttpContext) {
    try {
      const gatewayId = params.id

      const data = request.only(['is_active'])

      try {
        await vine.validate({ schema: updateGatewayStatusSchema, data })
      } catch (errors) {
        return response.status(422).json({ errors })
      }

      const gateway = await Gateway.find(gatewayId)
      if (!gateway) {
        return response.status(404).json({ message: 'Gateway not found' })
      }

      gateway.is_active = data.is_active
      await gateway.save()

      return response.status(200).json({
        message: 'Gateway status updated successfully',
        gateway,
      })
    } catch (error: any) {
      return response.status(500).json({
        message: 'Error updating gateway status',
        error: error.message,
      })
    }
  }
}

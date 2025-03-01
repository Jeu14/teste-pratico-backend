import vine from '@vinejs/vine'

const updateGatewayStatusSchema = vine.object({
  is_active: vine.boolean(),
})

export default updateGatewayStatusSchema

import vine from '@vinejs/vine'

export const updateGatewayStatusSchema = vine.object({
  is_active: vine.boolean(),
})

export const updateGatewayPrioritySchema = vine.object({
  priority: vine.number().min(1),
})

import vine from '@vinejs/vine'

export const createProductSchema = vine.object({
  name: vine.string().minLength(3),
  amount: vine.number().min(1),
})

export const updateProductSchema = vine.object({
  name: vine.string().minLength(3).optional(),
  amount: vine.number().min(1).optional(),
})

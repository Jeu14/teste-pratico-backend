import vine from '@vinejs/vine'

export const createUserSchema = vine.object({
  name: vine.string().minLength(3),
  email: vine.string().email(),
  password: vine.string().minLength(8),
  role: vine.enum(['ADMIN', 'MANAGER', 'FINANCE', 'USER']),
})

export const updateUserSchema = vine.object({
  name: vine.string().minLength(3).optional(),
  email: vine.string().email().optional(),
  password: vine.string().minLength(8).optional(),
  role: vine.enum(['ADMIN', 'MANAGER', 'FINANCE', 'USER']).optional(),
})

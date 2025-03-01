import type { HttpContext } from '@adonisjs/core/http'

export default class RoleMiddleware {
  async handle({ auth, response }: HttpContext, next: () => Promise<void>, roles: string[]) {
    const user = auth.user
    if (!user) {
      return response.unauthorized({ error: 'User not authenticated.' })
    }

    if (!roles.includes(user.role)) {
      return response.forbidden({
        error: 'Access Denied: Your profile does not have permission for this operation.',
      })
    }

    await next()
  }
}

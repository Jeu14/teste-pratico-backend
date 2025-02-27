import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  public async login({ request, response }: HttpContext) {
    try {
      const { email, password } = request.only(['email', 'password'])
      const user = await User.verifyCredentials(email, password)
      const token = await User.accessTokens.create(user)

      return {
        type: 'Bearer',
        token: token.value?.release(),
      }
    } catch (err) {
      return response.unauthorized()
    }
  }
}

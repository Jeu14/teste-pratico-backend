import BaseController from '#controllers/users/UserBaseController'
import User from '#models/user'

import type { HttpContext } from '@adonisjs/core/http'
import { createUserSchema, updateUserSchema } from '#validators/UserValidator'

export default class UsersController extends BaseController {
  public async index({ response }: HttpContext) {
    const users = await User.all()
    return response.status(200).json({ users })
  }

  public async show({ params, response }: HttpContext) {
    const user = await this.getUser(params.id, response)
    if (!user) return
    return response.status(200).json({ user })
  }

  public async store({ request, response }: HttpContext) {
    const data = request.only(['name', 'email', 'password', 'role'])
    const validatedData = await this.validateData(createUserSchema, data, response)
    if (!validatedData) return

    const user = await User.create(validatedData)
    return response.status(201).json({ message: 'User created successfully', user })
  }

  public async update({ params, request, response }: HttpContext) {
    const user = await this.getUser(params.id, response)
    if (!user) return

    const data = request.only(['name', 'email', 'password', 'role'])
    const validatedData = await this.validateData(updateUserSchema, data, response)
    if (!validatedData) return

    user.merge(validatedData)
    await user.save()
    return response.status(200).json({ message: 'User updated successfully', user })
  }

  public async destroy({ params, response }: HttpContext) {
    const user = await this.getUser(params.id, response)
    if (!user) return

    await user.delete()
    return response.status(200).json({ message: 'User successfully removed' })
  }
}

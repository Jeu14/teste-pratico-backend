import Product from '#models/product'
import BaseController from '#controllers/BaseController'

import type { HttpContext } from '@adonisjs/core/http'
import { createProductSchema, updateProductSchema } from '#validators/ProductValidator'

export default class ProductsController extends BaseController {
  public async index({ response }: HttpContext) {
    const products = await Product.all()
    return response.status(200).json({ products })
  }

  public async show({ params, response }: HttpContext) {
    const product = await this.getResource(Product, params.id, response)
    if (!product) return
    return response.status(200).json({ product })
  }

  public async store({ request, response }: HttpContext) {
    const data = request.only(['name', 'amount'])
    const validatedData = await this.validateData(createProductSchema, data, response)
    if (!validatedData) return

    const product = await Product.create(validatedData)
    return response.status(201).json({
      message: 'Product created successfully',
      product,
    })
  }

  public async update({ params, request, response }: HttpContext) {
    const product = await this.getResource(Product, params.id, response)
    if (!product) return

    const data = request.only(['name', 'amount'])
    const validatedData = await this.validateData(updateProductSchema, data, response)
    if (!validatedData) return

    product.merge(validatedData)
    await product.save()

    return response.status(200).json({
      message: 'Product updated successfully',
      product,
    })
  }

  public async destroy({ params, response }: HttpContext) {
    const product = await this.getResource(Product, params.id, response)
    if (!product) return

    await product.delete()
    return response.status(200).json({ message: 'Product removed successfully' })
  }
}

import axios from 'axios'
import env from '#start/env'

import { createTransactionGateway1 } from '../../interfaces/Transaction_interface.js'

const GATEWAY1_URL = env.get('GATEWAY1_URL')
const GATEWAY1_LOGIN_EMAIL = env.get('GATEWAY1_LOGIN_EMAIL')
const GATEWAY1_LOGIN_TOKEN = env.get('GATEWAY1_LOGIN_TOKEN')

export default class Gateway1Service {
  public static async login(): Promise<string> {
    const loginResponse = await axios.post(`${GATEWAY1_URL}/login`, {
      email: GATEWAY1_LOGIN_EMAIL,
      token: GATEWAY1_LOGIN_TOKEN,
    })

    const token = loginResponse.data.token
    if (!token) {
      throw new Error('Failed to get token from Gateway 1')
    }
    return token
  }

  public static async createTransaction(data: createTransactionGateway1): Promise<any> {
    const token = await this.login()
    const transactionResponse = await axios.post(
      `${GATEWAY1_URL}/transactions`,
      {
        amount: data.amount,
        name: data.name,
        email: data.email,
        cardNumber: data.cardNumber,
        cvv: data.cvv,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )

    return transactionResponse.data
  }
}

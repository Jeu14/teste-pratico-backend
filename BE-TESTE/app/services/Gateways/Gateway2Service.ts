import axios from 'axios'
import env from '#start/env'
import Transaction from '#models/transaction'

import { createTransactionGateway2 } from '../../interfaces/Transaction_interface.js'

const GATEWAY2_URL = env.get('GATEWAY2_URL')
const GATEWAY2_AUTH_TOKEN = env.get('GATEWAY2_AUTH_TOKEN')
const GATEWAY2_AUTH_SECRET = env.get('GATEWAY2_AUTH_SECRET')

export default class Gateway2Service {
  public static async createTransaction(data: createTransactionGateway2): Promise<any> {
    const transactionResponse = await axios.post(
      `${GATEWAY2_URL}/transacoes`,
      {
        valor: data.valor,
        nome: data.nome,
        email: data.email,
        numeroCartao: data.numeroCartao,
        cvv: data.cvv,
      },
      {
        headers: {
          'Gateway-Auth-Token': GATEWAY2_AUTH_TOKEN,
          'Gateway-Auth-Secret': GATEWAY2_AUTH_SECRET,
        },
      }
    )
    return transactionResponse.data
  }

  public static async chargeBack(
    transaction: Transaction
  ): Promise<{ success: boolean; gatewayId: number }> {
    const response = await axios.post(
      `${GATEWAY2_URL}/transacoes/reembolso`,
      { id: transaction.external_id },
      {
        headers: {
          'Gateway-Auth-Token': GATEWAY2_AUTH_TOKEN,
          'Gateway-Auth-Secret': GATEWAY2_AUTH_SECRET,
        },
      }
    )
    if (response.data.error) {
      throw new Error(response.data.error)
    }
    return { success: true, gatewayId: 2 }
  }
}

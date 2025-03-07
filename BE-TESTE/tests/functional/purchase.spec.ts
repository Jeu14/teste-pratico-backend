import test from 'japa'
import supertest from 'supertest'

const BASE_URL = 'http://localhost:3333'

test.group('Purchase', () => {
  test('must register a purchase with multiple products', async (assert) => {
    ///ATTENTION!!! The product IDs that will be used in the payload below must exist in the database for the test to work. Otherwise, you are free to change the IDs for values ​​that exist in the database.
    const payload = {
      clientName: 'tester',
      clientEmail: 'teste@example.com',
      products: [
        { id: 1, quantity: 2 },
        { id: 2, quantity: 1 },
      ],
      cardNumber: '5569000000006063',
      cvv: '010',
    }

    const response = await supertest(BASE_URL).post('/transactions').send(payload).expect(200)

    assert.equal(response.body.message, 'Purchase processed successfully')
    assert.exists(response.body.transaction)
    assert.exists(response.body.transaction.id)
  })

  test('should return error if a product does not exist', async (assert) => {
    const payload = {
      clientName: 'tester',
      clientEmail: 'tester@example.com',
      products: [
        { id: 9999, quantity: 1 },
      ],
      cardNumber: '5569000000006063',
      cvv: '010',
    }

    const response = await supertest(BASE_URL).post('/transactions').send(payload).expect(404)

    assert.match(response.body.message, /Product with id 9999 not found/)
  })
})

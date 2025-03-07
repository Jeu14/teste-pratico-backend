import test from 'japa'
import supertest from 'supertest'
import env from '#start/env'

const BASE_URL = 'http://localhost:3333'

test.group('Auth', () => {
  test('should return a valid token with correct credentials', async (assert) => {
    const response = await supertest(BASE_URL)
      .post('/login')
      .send({ email: env.get('ADMIN_EMAIL'), password: env.get('ADMIN_PASSWORD') })
      .expect(200)

    assert.exists(response.body.token, 'Token not returned')
  })

  test('should return error with status.code(401)', async () => {
    await supertest(BASE_URL)
      .post('/login')
      .send({ email: env.get('ADMIN_EMAIL'), password: 'wrong password' })
      .expect(401)
  })
})

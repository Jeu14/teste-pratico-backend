const AuthController = () => import('#controllers/auth_controller')
const PurchasesController = () => import ('#controllers/purchases_controller')
const GatewaysController = () => import ('#controllers/gateways_controller')
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.group(() => {
  router.post('/login', [AuthController, 'login'])
})

router.group(() => {
  router.post('/transactions', [PurchasesController, 'store'])
})

router.group(() => {
  router.put('/gateway/:id', [GatewaysController, 'updateStatus'])
}).use([middleware.auth({ guards: ['api'] }), middleware.role(['ADMIN'])])
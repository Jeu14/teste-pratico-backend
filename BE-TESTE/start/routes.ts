const AuthController = () => import('#controllers/auth_controller')
const PurchasesController = () => import ('#controllers/purchases_controller')
import router from '@adonisjs/core/services/router'

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
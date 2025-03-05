import router from '@adonisjs/core/services/router'
const AuthController = () => import('#controllers/auth_controller')
const PurchasesController = () => import('#controllers/purchases_controller')
const GatewaysController = () => import('#controllers/gateways_controller')
const UsersController = () => import('#controllers/users_controller')
const ProductsController = () => import('#controllers/products_controller')
const ClientsController = () => import('#controllers/clients_controller')
const TransactionsController = () => import('#controllers/transactions_controller')

import { middleware } from './kernel.js'

router.post('/login', [AuthController, 'login'])
router.post('/transactions', [PurchasesController, 'store'])

router
  .post('/transactions/:id/charge_back', [TransactionsController, 'chargeBack'])
  .use([middleware.auth({ guards: ['api'] }), middleware.role(['ADMIN', 'FINANCE'])])

router
  .group(() => {
    router.put('/gateway/status/:id', [GatewaysController, 'updateStatus'])
    router.put('/gateway/priority/:id', [GatewaysController, 'updatePriority'])
  })
  .use([middleware.auth({ guards: ['api'] }), middleware.role(['ADMIN'])])

router
  .resource('/users', UsersController)
  .apiOnly()
  .use('*', [middleware.auth({ guards: ['api'] }), middleware.role(['ADMIN', 'MANAGER'])])

router
  .resource('/products', ProductsController)
  .apiOnly()
  .use('*', [
    middleware.auth({ guards: ['api'] }),
    middleware.role(['ADMIN', 'MANAGER', 'FINANCE']),
  ])

router
  .resource('/clients', ClientsController)
  .only(['index', 'show'])
  .use(
    ['index', 'show'],
    [middleware.auth({ guards: ['api'] }), middleware.role(['ADMIN', 'USER'])]
  )

router
  .resource('/transactions', TransactionsController)
  .only(['index', 'show'])
  .use(
    ['index', 'show'],
    [middleware.auth({ guards: ['api'] }), middleware.role(['ADMIN', 'USER'])]
  )

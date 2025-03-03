import router from '@adonisjs/core/services/router'
const AuthController = () => import('#controllers/auth_controller')
const PurchasesController = () => import('#controllers/purchases_controller')
const GatewaysController = () => import('#controllers/gateways_controller')
const UsersController = () => import('#controllers/users_controller')
const ProductsController = () => import('#controllers/products_controller')
const ClientsController = () => import('#controllers/clients_controller')

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

router
  .group(() => {
    router.put('/gateway/status/:id', [GatewaysController, 'updateStatus'])
    router.put('/gateway/priority/:id', [GatewaysController, 'updatePriority'])
  })
  .use([middleware.auth({ guards: ['api'] }), middleware.role(['ADMIN'])])

router
  .group(() => {
    router.get('/users', [UsersController, 'index'])
    router.get('/users/:id', [UsersController, 'show'])
    router.post('/users', [UsersController, 'store'])
    router.put('/users/:id', [UsersController, 'update'])
    router.delete('/users/:id', [UsersController, 'destroy'])
  })
  .use([middleware.auth({ guards: ['api'] }), middleware.role(['ADMIN', 'MANAGER'])])

router
  .group(() => {
    router.get('/products', [ProductsController, 'index'])
    router.get('/products/:id', [ProductsController, 'show'])
    router.post('/products', [ProductsController, 'store'])
    router.put('/products/:id', [ProductsController, 'update'])
    router.delete('/products/:id', [ProductsController, 'destroy'])
  })
  .use([middleware.auth({ guards: ['api'] }), middleware.role(['ADMIN', 'MANAGER', 'FINANCE'])])

router.group(() => {
  router.get('/clients', [ClientsController, 'index'])
  router.get('/clients/:id', [ClientsController, 'show'])
}).use([middleware.auth({ guards: ['api'] }), middleware.role(['ADMIN', 'USER'])])

/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const LoginController = () => import('#controllers/auth/login_controller')
const RegisterController = () => import('#controllers/auth/register_controller')
const LogoutController = () => import('#controllers/auth/logout_controller')
const OrganizationsController = () => import('#controllers/organizations_controller')
import router from '@adonisjs/core/services/router'

router
  .get('/', async ({ i18n, response }) => {
    return response.redirect().toRoute('home.locale', { locale: i18n.locale })
  })
  .as('home')

router
  .group(() => {
    router
      .get('/', async ({ auth, view }) => {
        await auth.check()
        return view.render('pages/home')
      })
      .as('home')

    router
      .get('/:slug', async ({ view }) => {
        return view.render('pages/terms')
      })
      .where('slug', /terms-of-service|conditions-generales/)
      .as('terms')
  })
  .prefix(':locale')
  .where('locale', /en|fr/)
  .as('locale')

router
  .group(() => {
    router.get('/register', [RegisterController, 'show']).as('register.show')
    router.post('/register', [RegisterController, 'store']).as('register.store')
    router.get('/login', [LoginController, 'show']).as('login.show')
    router.post('/login', [LoginController, 'store']).as('login.store')
    router.post('/logout', [LogoutController, 'handle']).as('logout.handle')
  })
  .prefix('auth')
  .as('auth')

router
  .group(() => {
    router.get('/', [OrganizationsController, 'index']).as('index')
    router.get('/create', [OrganizationsController, 'create']).as('create')
    router.post('/', [OrganizationsController, 'store']).as('store')
    router.get('/:organizationId', [OrganizationsController, 'show']).as('show')
    router.get('/:organizationId/edit', [OrganizationsController, 'edit']).as('edit')
    router.put('/:organizationId', [OrganizationsController, 'update']).as('update')
    router.delete('/:organizationId', [OrganizationsController, 'destroy']).as('destroy')
  })
  .prefix('organizations')
  .as('organizations')

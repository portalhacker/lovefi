import Organization from '#models/organization'
import { organizationValidator } from '#validators/organization'
import type { HttpContext } from '@adonisjs/core/http'

export default class OrganizationsController {
  /**
   * Return list of all posts or paginate through
   * them
   */
  async index({ view, response }: HttpContext) {
    const organizations = await Organization.all()
    if (organizations.length === 0) return response.redirect().toRoute('organizations.create')
    return view.render('pages/organizations/index', { organizations })
  }

  /**
   * Render the form to create a new post.
   *
   * Not needed if you are creating an API server.
   */
  async create({ view }: HttpContext) {
    return view.render('pages/organizations/create')
  }

  /**
   * Handle form submission to create a new post
   */
  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(organizationValidator)
    const organization = await Organization.create(data)
    return response.redirect().toRoute('organizations.show', { organizationId: organization.id })
  }

  /**
   * Display a single post by id.
   */
  async show({ params, view }: HttpContext) {
    const organizationId = params.organizationId
    const organization = await Organization.findOrFail(organizationId)
    return view.render('pages/organizations/show', { organization })
  }

  /**
   * Render the form to edit an existing post by its id.
   *
   * Not needed if you are creating an API server.
   */
  async edit({ view }: HttpContext) {
    return view.render('pages/organizations/edit')
  }

  /**
   * Handle the form submission to update a specific post by id
   */
  async update({}: HttpContext) {}

  /**
   * Handle the form submission to delete a specific post by id.
   */
  async destroy({ params, response }: HttpContext) {
    const organizationId = params.organizationId
    const organization = await Organization.findOrFail(organizationId)
    await organization.delete()
    return response.redirect().toRoute('organizations.index')
  }
}

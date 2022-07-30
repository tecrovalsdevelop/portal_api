'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with portalprofissionais
 */
 const PortalProfissionai = use('App/Models/PortalProfissionai')

 const ResponseHelper = use('App/Helpers/ResponseHelper')
 
class PortalProfissionaiController {


  
   
    /**
     * Show a list of all portalceodiscursos.
     * GET portalceodiscursos
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
     async index({ request, response }) {
      try {
          const result = await PortalProfissionai.query().where({ estado: 1 })
              // .with('noticiaItem')
          
              .orderBy("id", "desc")
              .fetch()
          return ResponseHelper.getOnlyDataResponse(result)
      } catch (err) {
          console.error(err)
          return ResponseHelper.getErrorResponse("Erro ao listar os dados")
      }
  }
  
  
  async getPortalProfissionais({ request, response, view }) { 
      try {
          const result = await PortalProfissionai.query().where({ estado: 1 })
              // .with('noticiaItem')
          .limit(10)
              .orderBy("id", "desc")
              .fetch()
          return ResponseHelper.getOnlyDataResponse(result)
      } catch (err) {
          console.error(err)
          return ResponseHelper.getErrorResponse("Erro ao listar as profissionais")
      }
    }
  /**
   * Render a form to be used for creating a new portalprofissionai.
   * GET portalprofissionais/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new portalprofissionai.
   * POST portalprofissionais
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
  }

  /**
   * Display a single portalprofissionai.
   * GET portalprofissionais/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing portalprofissionai.
   * GET portalprofissionais/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update portalprofissionai details.
   * PUT or PATCH portalprofissionais/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a portalprofissionai with id.
   * DELETE portalprofissionais/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = PortalProfissionaiController

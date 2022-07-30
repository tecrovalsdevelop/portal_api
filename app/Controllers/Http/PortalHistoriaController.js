'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with portalhistorias
 */

 const PortalHistoria = use('App/Models/PortalHistoria')

 const ResponseHelper = use('App/Helpers/ResponseHelper')
 
 
class PortalHistoriaController {
  /**
   * Show a list of all portalhistorias.
   * GET portalhistorias
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
   async index({ request, response }) {
    try {
        const result = await PortalHistoria.query().where({ estado: 1 })
            // .with('noticiaItem')
            .limit(8)
            .orderBy("id", "desc")
            .fetch()
        return ResponseHelper.getOnlyDataResponse(result)
    } catch (err) {
        console.error(err)
        return ResponseHelper.getErrorResponse("Erro ao listar as Bolsas")
    }
}
  async getPortalHistorial({ request, response, view }) { 
    try {
        const result = await PortalHistoria.query().where({ estado: 1 })
            // .with('noticiaItem') 
            .orderBy("id", "asc")
            .fetch()
        return ResponseHelper.getOnlyDataResponse(result)
    } catch (err) {
        console.error(err)
        return ResponseHelper.getErrorResponse("Erro ao listar as Bolsas")
    }
  }
  /**
   * Render a form to be used for creating a new portalhistoria.
   * GET portalhistorias/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new portalhistoria.
   * POST portalhistorias
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
  }

  /**
   * Display a single portalhistoria.
   * GET portalhistorias/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing portalhistoria.
   * GET portalhistorias/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update portalhistoria details.
   * PUT or PATCH portalhistorias/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a portalhistoria with id.
   * DELETE portalhistorias/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = PortalHistoriaController

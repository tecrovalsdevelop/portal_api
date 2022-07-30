'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with portaleventos
 */



 const PortalEvento = use('App/Models/PortalEvento')

 const ResponseHelper = use('App/Helpers/ResponseHelper')
 
 
class PortalEventoController {
  /**
   * Show a list of all portaleventos.
   * GET portaleventos
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
   async index({ request, response }) {
    try {
        const result = await PortalEvento.query() 
            // .with('noticiaItem')
       
            .orderBy("id", "desc")
            .fetch()
        return ResponseHelper.getOnlyDataResponse(result)
    } catch (err) {
        console.error(err)
        return ResponseHelper.getErrorResponse("Erro ao listar as Bolsas")
    }
}
async getPortalEvento({ request, response }) {
    try {
      let data = request.all();
      let page = data.page ? data.page : 1;
      const result = await PortalEvento.query().where({ estado: 1 }).orderBy('id', 'desc').paginate(page, 3)
      //  this.registarLog('', '', 'produtos', 'visualizar', '', '', 'visitante')

        return ResponseHelper.getOnlyDataResponse(result)
    } catch (err) {
        console.error(err)
        return ResponseHelper.getErrorResponse("Erro ao listar as Bolsas")
    }
}

  /**
   * Render a form to be used for creating a new portalevento.
   * GET portaleventos/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new portalevento.
   * POST portaleventos
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
  }

  /**
   * Display a single portalevento.
   * GET portaleventos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing portalevento.
   * GET portaleventos/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update portalevento details.
   * PUT or PATCH portaleventos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a portalevento with id.
   * DELETE portaleventos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = PortalEventoController

'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */



const PortalInstituicoe = use('App/Models/PortalInstituicoe')

const ResponseHelper = use('App/Helpers/ResponseHelper')



class PortalInstituicoeController {
  /**
   * Show a list of all portalinstituicoes.
   * GET portalinstituicoes
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
   async index({ request, response }) {
    try {
        const result = await PortalInstituicoe.query() 
            // .with('noticiaItem')
       
            .orderBy("id", "desc")
            .fetch()
        return ResponseHelper.getOnlyDataResponse(result)
    } catch (err) {
        console.error(err)
        return ResponseHelper.getErrorResponse("Erro ao listar as Bolsas")
    }
}
async getPortalInstituicao({ request, response }) {
    try {
        const result = await PortalInstituicoe.query() 
            // .with('noticiaItem')
       
            .orderBy("id", "desc")
            .first()
        return ResponseHelper.getOnlyDataResponse(result)
    } catch (err) {
        console.error(err)
        return ResponseHelper.getErrorResponse("Erro ao listar as Bolsas")
    }
}


  /**
   * Render a form to be used for creating a new portalinstituicoe.
   * GET portalinstituicoes/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new portalinstituicoe.
   * POST portalinstituicoes
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
  }

  /**
   * Display a single portalinstituicoe.
   * GET portalinstituicoes/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing portalinstituicoe.
   * GET portalinstituicoes/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update portalinstituicoe details.
   * PUT or PATCH portalinstituicoes/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a portalinstituicoe with id.
   * DELETE portalinstituicoes/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = PortalInstituicoeController

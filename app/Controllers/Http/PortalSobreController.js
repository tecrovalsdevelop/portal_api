'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with portalsobres
 */
 const BaseLog = use('App/Models/BaseLog')
 const PortalCliente = use('App/Models/PortalCliente')
 const ResponseHelper = use('App/Helpers/ResponseHelper')
 
class PortalSobreController {
  
  
  async registarLog(email, user, pagina, accao, estado, ip, pais, detalhes) {
    console.log("registar logs....")
    return await BaseLog.create({
      email: email, user: user, pagina: pagina, accao: accao, estado: estado, ip: ip, pais: pais, detalhes: detalhes,
    })
  }

   async index({ request, response, view }) {
    try {
      const result = await PortalCliente.query().fetch();

      this.registarLog('', '',   'sobre', 'visualizar', '1','', '')
      return ResponseHelper.getOnlyDataResponse(result)
    } catch (err) {
      console.log(err.message)
      return ResponseHelper.getErrorResponse("informação não encontrada")
    }
  }




  /**
   * Create/save a new portalsobre.
   * POST portalsobres
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
  }

  /**
   * Display a single portalsobre.
   * GET portalsobres/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing portalsobre.
   * GET portalsobres/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update portalsobre details.
   * PUT or PATCH portalsobres/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a portalsobre with id.
   * DELETE portalsobres/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = PortalSobreController

'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with portalcontactos
 */


const BaseLog = use('App/Models/BaseLog')
const PortalContacto = use('App/Models/PortalContacto')
const ResponseHelper = use('App/Helpers/ResponseHelper')

class PortalContactoController {


  async registarLog(email, user, pagina, accao, estado, ip, pais, detalhes) {
    console.log("registar logs....")
    return await BaseLog.create({
      email: email, user: user, pagina: pagina, accao: accao, estado: estado, ip: ip, pais: pais, detalhes: detalhes,
    })
  }


  async index({ request, response, view }) {
    try {
      const result = await PortalContacto.query().fetch();

      this.registarLog('', '', 'contacto', 'visualizar', '1', '', 'visitante')
      return ResponseHelper.getOnlyDataResponse(result)
    } catch (err) {
      console.log(err.message)
      return ResponseHelper.getErrorResponse("informação não encontrada")
    }
  }
  async getPortalContacto({ request, response, view }) { 
    try {
        const result = await PortalContacto.query() 
            // .with('noticiaItem')
        
            .orderBy("id", "desc")
            .first()
        return ResponseHelper.getOnlyDataResponse(result)
    } catch (err) {
        console.error(err)
        return ResponseHelper.getErrorResponse("Erro ao listar as Bolsas")
    }
  }

  async store({ request, auth, response }) {
/*    try {
      let data = request.all();
      let result = ""
      if (data.id) {
        result = await PortalContacto.query().where({ id: data.id }).first();
        result.merge(data);
        await result.save();
      } else {
        result = await PortalContacto.create(data);
      }
      return ResponseHelper.getSuccessResponse("Informação Salva com sucesso", result)
    } catch (err) {
      console.log(err.message)
      return ResponseHelper.getErrorResponse("A Informação não foi Salva")
    }
    */
  }

  /**
   * Display a single portalcontacto.
   * GET portalcontactos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing portalcontacto.
   * GET portalcontactos/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {
  }

  /**
   * Update portalcontacto details.
   * PUT or PATCH portalcontactos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
  }

  /**
   * Delete a portalcontacto with id.
   * DELETE portalcontactos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {
  }
}

module.exports = PortalContactoController

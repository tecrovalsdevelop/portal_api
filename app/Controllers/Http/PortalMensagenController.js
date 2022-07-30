'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with portalmensagens
 */



 const BaseLog = use('App/Models/BaseLog')
 const PortalMensagen = use('App/Models/PortalMensagen')
 const ResponseHelper = use('App/Helpers/ResponseHelper')

class PortalMensagenController {
 
  
  async registarLog(email, user, pagina, accao, estado, ip, pais, detalhes) {
    console.log("registar logs....")
    return await BaseLog.create({
      email: email, user: user, pagina: pagina, accao: accao, estado: estado, ip: ip, pais: pais, detalhes: detalhes,
    })
  }

   async index({ request, response, view }) {
    try {
      const result = await PortalMensagen.query().fetch();

      this.registarLog('', '',   'mensagem', 'visualizar', '1','', '')
      return ResponseHelper.getOnlyDataResponse(result)
    } catch (err) {
      console.log(err.message)
      return ResponseHelper.getErrorResponse("informação não encontrada")
    }
  }
 async store({ request, auth, response }) {
    try {
     let data = request.all();
      let result = ""
      if (data.id) {
        result = await PortalMensagen.query().where({ id: data.id }).first();
        result.merge(data);
        await result.save();
      } else {
        result = await PortalMensagen.create(data);
      }
      
      this.registarLog('', '',   'mensagem', 'cadastrar', '1','', '')
      return ResponseHelper.getSuccessResponse("Informação Salva com sucesso", result)
    } catch (err) {
      console.log(err.message)
      return ResponseHelper.getErrorResponse("A Informação não foi Salva")
    }
    
  }
  /**
   * Display a single portalmensagen.
   * GET portalmensagens/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing portalmensagen.
   * GET portalmensagens/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update portalmensagen details.
   * PUT or PATCH portalmensagens/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a portalmensagen with id.
   * DELETE portalmensagens/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = PortalMensagenController

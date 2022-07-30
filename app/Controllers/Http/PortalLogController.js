'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with baselogs
 */

 const BaseLog = use('App/Models/BaseLog')
const ResponseHelper = use('App/Helpers/ResponseHelper')


class PortalLogController {
  /**
   * Show a list of all baselogs.
   * GET baselogs
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, view }) {
    try {
      const result = await BaseLog.query().fetch();
      return ResponseHelper.getOnlyDataResponse(result)
    } catch (err) {
      console.log(err.message)
      return ResponseHelper.getErrorResponse("informação não encontrada")
    }
  }

  async registarLog(email, user, pagina, accao, estado, ip, pais, detalhes) {

    return await BaseLog.create({
      email: email, user: user, pagina: pagina, accao: accao, estado: estado, ip: ip, pais: pais, detalhes: detalhes,
    })
  }

  
  async downloadroval({ request, response }) {
    let data = request.all();
    try {
      this.registarLog("parabens", "download", "roval", 'acesso', "1", "", "", "-");

      console.log("parabens alguem está a baixar o roval....")
      return ResponseHelper.getOnlyDataResponse("acesso a plataforma")
    } catch (err) {

      this.registarLog("email", "user", "acesso", 'acesso', "0", "", "", "-");
      // this.registarLog(username, "", "user", 'login', "0", "", "", err.message);
      return ResponseHelper.getErrorResponse("acesso ou senha Invalido")
    }
  }
  async logs({ request, response }) {
    let data = request.all();
    try {
      this.registarLog("", "", "home", 'visita', "1", "", "", "-");
      return ResponseHelper.getOnlyDataResponse("acesso a plataforma")
    } catch (err) {

      this.registarLog("email", "user", "acesso", 'acesso', "0", "", "", "-");
      // this.registarLog(username, "", "user", 'login', "0", "", "", err.message);
      return ResponseHelper.getErrorResponse("acesso ou senha Invalido")
    }
  }
  
  
  async store({ request, auth, response }) {
    try {
      let data = request.all();
      let result = ""
      if (data.id) {
        result = await BaseLog.query().where({ id: data.id }).first();
        result.merge(data);
        await result.save();
      } else {
        result = await BaseLog.create(data);
      }
      return ResponseHelper.getSuccessResponse("Informação Salva com sucesso", result)
    } catch (err) {
      console.log(err.message)
      return ResponseHelper.getErrorResponse("A Informação não foi Salva")
    }
  }
 
  async show({ params, request, response, view }) {
  }
 
  async edit({ params, request, response, view }) {
  }
 
  async update({ params, request, response }) {
  }
 
  async destroy({ params, request, response }) {
  }
}

module.exports = PortalLogController

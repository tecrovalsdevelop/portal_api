'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */



const BaseLog = use('App/Models/BaseLog')
const PortalProduto = use('App/Models/PortalProduto')
const ResponseHelper = use('App/Helpers/ResponseHelper')


class PortalProdutoController {




  async registarLog(email, user, pagina, accao, estado, ip, pais, detalhes) {
    console.log("registar logs....")
    return await BaseLog.create({
      email: email, user: user, pagina: pagina, accao: accao, estado: estado, ip: ip, pais: pais, detalhes: detalhes,
    })
  }


  async index({ request, response, view }) {
    try {
      const result = await PortalProduto.query().fetch();

      this.registarLog('', '', 'produtos', 'visualizar', '', '', 'visitante')
      return ResponseHelper.getOnlyDataResponse(result)
    } catch (err) {
      console.log(err.message)
      return ResponseHelper.getErrorResponse("informação não encontrada")
    }
  }


  async getProdutos({ request, response, view }) {
    try {
      const result = await PortalProduto.query()
        .where({ portal_tipo_produto_id: 1 })
        .fetch();
        this.registarLog('', '', 'produtos', 'visualizar', '', '', 'visitante')
 
      return ResponseHelper.getOnlyDataResponse(result)
    } catch (err) {
      console.log(err.message)
      return ResponseHelper.getErrorResponse("informação não encontrada")
    }
  }

  async getServicos({ request, response, view }) {
    try {
      const result = await PortalProduto.query()
        .where({ portal_tipo_produto_id: 2 })
        .fetch();
        this.registarLog('', '', 'serviços', 'visualizar', '1', '', '')
  
      return ResponseHelper.getOnlyDataResponse(result)
    } catch (err) {
      console.log(err.message)
      return ResponseHelper.getErrorResponse("informação não encontrada")
    }
  }

  async store({ request, auth, response }) {
   /*  try {
     let data = request.all();
      let result = ""
      if (data.id) {
        result = await PortalProduto.query().where({ id: data.id }).first();
        result.merge(data);
        await result.save();
      } else {
        result = await PortalProduto.create(data);
      }
      return ResponseHelper.getSuccessResponse("Informação Salva com sucesso", result)
    } catch (err) {
      console.log(err.message)
      return ResponseHelper.getErrorResponse("A Informação não foi Salva")
    }
    */
  }


  /**
   * Display a single portalproduto.
   * GET portalprodutos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {

    try {
      const result = await PortalProduto.query().where({ id: params.id }).first();

      this.registarLog('', 'produtos', 'detalhes', '1', '', '', 'visitante')

      return ResponseHelper.getOnlyDataResponse(result)
    } catch (err) {
      console.log(err.message)
      return ResponseHelper.getErrorResponse("informação não encontrada")
    }
  }

  /**
   * Render a form to update an existing portalproduto.
   * GET portalprodutos/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {
  }

  /**
   * Update portalproduto details.
   * PUT or PATCH portalprodutos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
  }

  /**
   * Delete a portalproduto with id.
   * DELETE portalprodutos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {
  }
}

module.exports = PortalProdutoController

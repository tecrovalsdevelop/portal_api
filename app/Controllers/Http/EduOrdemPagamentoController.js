'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with eduordempagamentos
 */


const ResponseHelper = use('App/Helpers/ResponseHelper')
const EduOrdemPagamento = use('App/Models/EduOrdemPagamento')



const Database = use('Database')
class EduOrdemPagamentoController {
  /**
   * Show a list of all eduordempagamentos.
   * GET eduordempagamentos
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, view }) {
    try {

      let data = request.all();
      let page = Number(data.page);
      let size = Number(data.size);

      let result = await EduOrdemPagamento.query().paginate(page, size)
      return ResponseHelper.getOnlyDataResponse(result)

    } catch (err) {
      //console.log(err.message)
      return ResponseHelper.getErrorResponse("Erro ao listar Cursos")
    }
  }



  async ordemPagamentosList({ request, response }) {
    try {

      let result = await EduOrdemPagamento.all() 

      return ResponseHelper.getOnlyDataResponse(result)


    } catch (err) {
      //console.log(err.message)
      return ResponseHelper.getErrorResponse("dados não encontrado")
    }
  }
  /**
   * Render a form to be used for creating a new eduordempagamento.
   * GET eduordempagamentos/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response, view }) {
  }

  /**
   * Create/save a new eduordempagamento.
   * POST eduordempagamentos
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
  }

  /**
   * Display a single eduordempagamento.
   * GET eduordempagamentos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing eduordempagamento.
   * GET eduordempagamentos/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {
  }

  /**
   * Update eduordempagamento details.
   * PUT or PATCH eduordempagamentos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
  }

  /**
   * Delete a eduordempagamento with id.
   * DELETE eduordempagamentos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {
  }
}

module.exports = EduOrdemPagamentoController

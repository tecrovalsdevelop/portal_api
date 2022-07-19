'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with edupagamentosbolseiros
 */

const ResponseHelper = use('App/Helpers/ResponseHelper')
const EduPagamentosBolseiro = use('App/Models/EduPagamentosBolseiro')



const Database = use('Database')

class EduPagamentosBolseiroController {
  /**
   * Show a list of all edupagamentosbolseiros.
   * GET edupagamentosbolseiros
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

      let result = await EduPagamentosBolseiro.query().paginate(page, size)

      return ResponseHelper.getOnlyDataResponse(result)


    } catch (err) {
      //console.log(err.message)
      return ResponseHelper.getErrorResponse("Erro ao listar Cursos")
    }
  }

  /**
   * Render a form to be used for creating a new edupagamentosbolseiro.
   * GET edupagamentosbolseiros/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response, view }) {
  }

  /**
   * Create/save a new edupagamentosbolseiro.
   * POST edupagamentosbolseiros
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {


    try {
      let result = ""
      if (data.id) {
        result = await EduPagamentosBolseiro.query().where({ id: data.id }).first();
        result.merge(data);
        result = await result.save();
      } else {
        result = await EduPagamentosBolseiro.create(data);
      }
      return ResponseHelper.getSuccessResponse("Pagamento  criado com sucesso", result)
    } catch (err) {
      //console.log(err.message)
      return ResponseHelper.getErrorResponse("Erro ao listar Cursos")
    }
  }

  /**
   * Display a single edupagamentosbolseiro.
   * GET edupagamentosbolseiros/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing edupagamentosbolseiro.
   * GET edupagamentosbolseiros/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {
  }

  /**
   * Update edupagamentosbolseiro details.
   * PUT or PATCH edupagamentosbolseiros/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
  }

  /**
   * Delete a edupagamentosbolseiro with id.
   * DELETE edupagamentosbolseiros/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {
  }
}

module.exports = EduPagamentosBolseiroController

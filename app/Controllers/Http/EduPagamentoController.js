'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with edupagamentos
 */

const ResponseHelper = use('App/Helpers/ResponseHelper')
const EduPagamento = use('App/Models/EduPagamento')




const requestFields = ['id', 'nome', 'nib', 'iban', 'estado','bi','banco','edu_ordem_pagamento_id'];

const Database = use('Database')
class EduPagamentoController {
  /**
   * Show a list of all edupagamentos.
   * GET edupagamentos
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

      let result;
      if (data.nome_bi) {
        result = await EduPagamento.query()
          .where('nome', 'like', '%' + data.nome_bi + '%')
          .orWhere('nib', 'like', '%' + data.nome_bi + '%')
          .orWhere('iban', 'like', '%' + data.nome_bi + '%')
          .with('EduOrdemPagamento')
          .with('EduCandidato')
          .with('EduReclamacao')
          .paginate(page, size)
      } else {
          let result_query = EduPagamento.query()
          if(data.estado){
            result_query.where({ estado: data.estado})
          }

          if(data.edu_ordem_pagamento_id){
            result_query.where({ edu_ordem_pagamento_id: data.edu_ordem_pagamento_id })
          }

          result = await result_query
          .with('EduOrdemPagamento')
          .with('EduCandidato')
          .with('EduReclamacao')

          .paginate(page, size)
      }



      return ResponseHelper.getOnlyDataResponse(result)


    } catch (err) {
      //console.log(err.message)
      return ResponseHelper.getErrorResponse("Erro ao listar Cursos")
    }
  }


  /**
   * Create/save a new edupagamento.
   * POST edupagamentos
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {

    try {

      const data = request.only(requestFields);

      let result = ""
      if (data.id) {
        result = await EduPagamento.query().where({ id: data.id }).first();
        result.merge(data);
        result = await result.save();
      } else {
        result = await EduPagamento.create(data);
       // console.log(result);
      }

      return ResponseHelper.getSuccessResponse("Pagamento  Salvo com sucesso", result)


    } catch (err) {
      console.log(err)
      return ResponseHelper.getErrorResponse("Informação Não Salva")
    }
  }


  /**
   * Display a single edupagamento.
   * GET edupagamentos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing edupagamento.
   * GET edupagamentos/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {
  }

  /**
   * Update edupagamento details.
   * PUT or PATCH edupagamentos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
  }

  /**
   * Delete a edupagamento with id.
   * DELETE edupagamentos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {
  }
}

module.exports = EduPagamentoController

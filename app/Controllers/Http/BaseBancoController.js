'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with basebancos
 */


 const BaseBanco = use('App/Models/BaseBanco')
 const ResponseHelper = use('App/Helpers/ResponseHelper')
 const Database = use('Database')

class BaseBancoController {
  /**
   * Show a list of all basebancos.
   * GET basebancos
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
    try {
 
      let data = request.all();
      let page = Number(data.page);
      let size = Number(data.size);
 

      let result = await BaseBanco.query()
      .paginate(page, size)
   
      return ResponseHelper.getOnlyDataResponse(result)


    } catch (err) {
      //console.log(err.message)
      return ResponseHelper.getErrorResponse("Erro ao listar Banco")
    }
  }

  /**
   * Render a form to be used for creating a new basebanco.
   * GET basebancos/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new basebanco.
   * POST basebancos
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
     
    try {
      let result = ""
      if (data.id) {
        result = await BaseBanco.query().where({ id: data.id }).first();
        result.merge(data);
        result = await result.save();
      } else {
        result = await BaseBanco.create(data);
      }

      return ResponseHelper.getSuccessResponse("Banco  criado com sucesso", result)


    } catch (err) {
      //console.log(err.message)
      return ResponseHelper.getErrorResponse("Erro ao listar Bancos")
    }
  }

  /**
   * Display a single basebanco.
   * GET basebancos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing basebanco.
   * GET basebancos/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update basebanco details.
   * PUT or PATCH basebancos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a basebanco with id.
   * DELETE basebancos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = BaseBancoController

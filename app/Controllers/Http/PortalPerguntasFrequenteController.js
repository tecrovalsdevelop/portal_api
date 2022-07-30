'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with portalperguntasfrequentes
 */

 const PortalPerguntasFrequente = use('App/Models/PortalPerguntasFrequente')

 const ResponseHelper = use('App/Helpers/ResponseHelper')
 
 
 
 const requestFields = ['id', 'titulo', 'descricao_menor', 'categoria', 'foto_menor',
     'foto_maior', 'estado'
 ];
class PortalPerguntasFrequenteController {
  /**
   * Show a list of all portalperguntasfrequentes.
   * GET portalperguntasfrequentes
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
   async index({ request, response }) {
    try {
        const noticias = await PortalPerguntasFrequente.query().where({ estado: 1 })
            // .with('noticiaItem')
            .limit(8)
            .orderBy("id", "desc")
            .fetch()
        return ResponseHelper.getOnlyDataResponse(noticias)
    } catch (err) {
        console.error(err)
        return ResponseHelper.getErrorResponse("Erro ao listar as Bolsas")
    }
}

async getPortalPerguntasFrequentes({ request, response, view }) {
    try {
        let data = request.all();
        let page = data.page ? data.page : 1;
      //  const result = await PortalPerguntasFrequente.query().where({ estado: 1 }).orderBy('id', 'desc').paginate(page, 6)
        //  this.registarLog('', '', 'produtos', 'visualizar', '', '', 'visitante')
        const result = await PortalPerguntasFrequente.query().where({ estado: 1 })
        // .with('noticiaItem')
        .limit(10)
        .orderBy("id", "desc")
        .fetch()
        return ResponseHelper.getOnlyDataResponse(result)
    } catch (err) {
        console.log(err.message)
        return ResponseHelper.getErrorResponse("informação não encontrada")
    }
}

  /**
   * Render a form to be used for creating a new portalperguntasfrequente.
   * GET portalperguntasfrequentes/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new portalperguntasfrequente.
   * POST portalperguntasfrequentes
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
  }

  /**
   * Display a single portalperguntasfrequente.
   * GET portalperguntasfrequentes/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing portalperguntasfrequente.
   * GET portalperguntasfrequentes/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update portalperguntasfrequente details.
   * PUT or PATCH portalperguntasfrequentes/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a portalperguntasfrequente with id.
   * DELETE portalperguntasfrequentes/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = PortalPerguntasFrequenteController

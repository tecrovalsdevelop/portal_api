'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */


const BaseNoticiasItens = use('App/Models/NoticiaIten')
const ResponseHelper = use('App/Helpers/ResponseHelper')

const requestFields = ['id', 'noticias_id', 'paragrafos', 'negrito', 'link', 'subblinhado'

];



/**
 * Resourceful controller for interacting with noticiaitens
 */
class PortalNoticiaItenController {
  /**
   * Show a list of all noticiaitens.
   * GET noticiaitens
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response }) {

  }

  /**
   * Render a form to be used for creating a new noticiaiten.
   * GET noticiaitens/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new noticiaiten.
   * POST noticiaitens
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
  }

  /**
   * Display a single noticiaiten.
   * GET noticiaitens/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response}) {
  }



  async buscarNoticiaPeloId({ request, response}) {
    try {
        let dados = request.all();


        let result = await BaseNoticiasItens.query()
            .where({ noticias_id: dados.id })
            .with('noticia')
            .fetch();
            return ResponseHelper.getOnlyDataResponse(result);

    } catch (err) {
        //// //console.log(err.message)
        return ResponseHelper.getErrorResponse("Erro ao listar Noticia")
    }
  }

  /**
   * Render a form to update an existing noticiaiten.
   * GET noticiaitens/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update noticiaiten details.
   * PUT or PATCH noticiaitens/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a noticiaiten with id.
   * DELETE noticiaitens/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = PortalNoticiaItenController

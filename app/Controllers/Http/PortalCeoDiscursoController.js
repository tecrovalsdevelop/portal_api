'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */



const PortalCeoDiscurso = use('App/Models/PortalCeoDiscurso')

const ResponseHelper = use('App/Helpers/ResponseHelper')



class PortalCeoDiscursoController {
  /**
   * Show a list of all portalceodiscursos.
   * GET portalceodiscursos
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
   async index({ request, response }) {
    try {
        const noticias = await PortalCeoDiscurso.query().where({ estado: 1 })
            // .with('noticiaItem')
        
            .orderBy("id", "desc")
            .first()
        return ResponseHelper.getOnlyDataResponse(noticias)
    } catch (err) {
        console.error(err)
        return ResponseHelper.getErrorResponse("Erro ao listar as Bolsas")
    }
}


async getPortalCeoDiscurso({ request, response, view }) { 
    try {
        const noticias = await PortalCeoDiscurso.query().where({ estado: 1 })
            // .with('noticiaItem')
        
            .orderBy("id", "desc")
            .first()
        return ResponseHelper.getOnlyDataResponse(noticias)
    } catch (err) {
        console.error(err)
        return ResponseHelper.getErrorResponse("Erro ao listar as Bolsas")
    }
  }
  /**
   * Render a form to be used for creating a new portalceodiscurso.
   * GET portalceodiscursos/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new portalceodiscurso.
   * POST portalceodiscursos
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
  }

  /**
   * Display a single portalceodiscurso.
   * GET portalceodiscursos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing portalceodiscurso.
   * GET portalceodiscursos/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update portalceodiscurso details.
   * PUT or PATCH portalceodiscursos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a portalceodiscurso with id.
   * DELETE portalceodiscursos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = PortalCeoDiscursoController

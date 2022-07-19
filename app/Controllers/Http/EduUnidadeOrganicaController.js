'use strict'

const EduUnidadeOrganica = use('App/Models/EduUnidadeOrganica');
const ResponseHelper = use('App/Helpers/ResponseHelper')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with eduunidadeorganicas
 */
class EduUnidadeOrganicaController {
    /**
     * Show a list of all eduunidadeorganicas.
     * GET eduunidadeorganicas
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async index({ request, response }) {

        try {
            return ResponseHelper.getOnlyDataResponse(await EduUnidadeOrganica.all())
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Dados não encontrados")
        }
    }



    /**
     * Render a form to be used for creating a new eduunidadeorganica.
     * GET eduunidadeorganicas/create
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async create({ request, response, view }) {}

    /**
     * Create/save a new eduunidadeorganica.
     * POST eduunidadeorganicas
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async store({ request, response }) {}

    /**
     * Display a single eduunidadeorganica.
     * GET eduunidadeorganicas/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async show({ params, request, response }) {
        try {


            //console.log(params.id)

            const unidadeOrganica = await EduUnidadeOrganica.query().where({ id: params.id }).first()

            return ResponseHelper.getOnlyDataResponse(unidadeOrganica);

        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Dados não encontrados")
        }

    }

    /**
     * Render a form to update an existing eduunidadeorganica.
     * GET eduunidadeorganicas/:id/edit
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async edit({ params, request, response, view }) {}

    /**
     * Update eduunidadeorganica details.
     * PUT or PATCH eduunidadeorganicas/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async update({ params, request, response }) {}

    /**
     * Delete a eduunidadeorganica with id.
     * DELETE eduunidadeorganicas/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async destroy({ params, request, response }) {}
}

module.exports = EduUnidadeOrganicaController
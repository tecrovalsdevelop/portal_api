'use strict'
const ResponseHelper = use('App/Helpers/ResponseHelper')
const anoDeFrequencia = use('App/Models/BaseAnoFrequencia')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with baseanofrequencias
 */
class BaseAnoFrequenciaController {
    /**
     * Show a list of all baseanofrequencias.
     * GET baseanofrequencias
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async index({ request, response }) {
        try {

            const anoDeFrequencias = await anoDeFrequencia.query().orderBy("id", "asc").fetch();

            return ResponseHelper.getOnlyDataResponse(anoDeFrequencias);
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Dados não encontrados")
        }
    }

    /**
     * Render a form to be used for creating a new baseanofrequencia.
     * GET baseanofrequencias/create
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async create({ request, response, view }) {}

    /**
     * Create/save a new baseanofrequencia.
     * POST baseanofrequencias
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async store({ request, response }) {}

    /**
     * Display a single baseanofrequencia.
     * GET baseanofrequencias/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async show({ params, request, response, view }) {}

    /**
     * Render a form to update an existing baseanofrequencia.
     * GET baseanofrequencias/:id/edit
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async edit({ params, request, response, view }) {}

    /**
     * Update baseanofrequencia details.
     * PUT or PATCH baseanofrequencias/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async update({ params, request, response }) {}

    /**
     * Delete a baseanofrequencia with id.
     * DELETE baseanofrequencias/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async destroy({ params, request, response }) {}
}

module.exports = BaseAnoFrequenciaController
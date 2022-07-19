'use strict'
const EduComunicacaoTipo = use('App/Models/EduComunicacaoTipo')
const ResponseHelper = use('App/Helpers/ResponseHelper')
    /** @typedef {import('@adonisjs/framework/src/Request')} Request */
    /** @typedef {import('@adonisjs/framework/src/Response')} Response */
    /** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with educomunicacaotipos
 */
class EduComunicacaoTipoController {
    /**
     * Show a list of all educomunicacaotipos.
     * GET educomunicacaotipos
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async index({ request, response, view }) {
        try {
            return ResponseHelper.getOnlyDataResponse(await EduComunicacaoTipo.all())
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Dados não encontrados")
        }
    }

    /**
     * Render a form to be used for creating a new educomunicacaotipo.
     * GET educomunicacaotipos/create
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async create({ request, response, view }) {}

    /**
     * Create/save a new educomunicacaotipo.
     * POST educomunicacaotipos
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async store({ request, response }) {}

    /**
     * Display a single educomunicacaotipo.
     * GET educomunicacaotipos/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async show({ params, request, response, view }) {}

    /**
     * Render a form to update an existing educomunicacaotipo.
     * GET educomunicacaotipos/:id/edit
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async edit({ params, request, response, view }) {}

    /**
     * Update educomunicacaotipo details.
     * PUT or PATCH educomunicacaotipos/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async update({ params, request, response }) {}

    /**
     * Delete a educomunicacaotipo with id.
     * DELETE educomunicacaotipos/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async destroy({ params, request, response }) {}
}

module.exports = EduComunicacaoTipoController
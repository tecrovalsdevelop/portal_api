'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with baseestadocivis
 */
class BaseEstadoCiviController {
    /**
     * Show a list of all baseestadocivis.
     * GET baseestadocivis
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async index({ request, response, view }) {}

    /**
     * Render a form to be used for creating a new baseestadocivi.
     * GET baseestadocivis/create
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async create({ request, response, view }) {}

    /**
     * Create/save a new baseestadocivi.
     * POST baseestadocivis
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async store({ request, response }) {}

    /**
     * Display a single baseestadocivi.
     * GET baseestadocivis/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async show({ params, request, response, view }) {}

    /**
     * Render a form to update an existing baseestadocivi.
     * GET baseestadocivis/:id/edit
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async edit({ params, request, response, view }) {}

    /**
     * Update baseestadocivi details.
     * PUT or PATCH baseestadocivis/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async update({ params, request, response }) {}

    /**
     * Delete a baseestadocivi with id.
     * DELETE baseestadocivis/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async destroy({ params, request, response }) {
        try {
            //console.log(params);
            // const anoAvaliacao = await AnoAvaliacao.find(params.id).update({estado: 0});
            const anoAvaliacao = await AnoAvaliacao
                .query()
                .where('id', params.id)
                .delete();
            if (!anoAvaliacao) {
                return ResponseHelper.getWarningResponse("Não foi encontrado a anoAvaliacao a ser eliminado", reclamacao)
            }
            // await anoAvaliacao.delete(); 
            return ResponseHelper.getSuccessResponse("anoAvaliacao eliminado com sucesso", null)
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao eliminar o anoAvaliacao")
        }

    }
}

module.exports = BaseEstadoCiviController
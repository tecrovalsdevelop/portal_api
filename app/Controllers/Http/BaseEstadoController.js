'use strict'
const ResponseHelper = use('App/Helpers/ResponseHelper')
const estado = use('App/Models/BaseEstado')
    /** @typedef {import('@adonisjs/framework/src/Request')} Request */
    /** @typedef {import('@adonisjs/framework/src/Response')} Response */
    /** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with baseestados
 */

class BaseEstadoController {
    /**
     * Show a list of all baseestados.
     * GET baseestados
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async index({ request, response }) {
        try {
            return ResponseHelper.getOnlyDataResponse(await estado.all())
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao listar Estado de Renovação")
        }
    }

    /**
     * Render a form to be used for creating a new baseestado.
     * GET baseestados/create
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async create({ request, response, view }) {}

    /**
     * Create/save a new baseestado.
     * POST baseestados
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async store({ request, response }) {

        const { name } = request.all();
        const dados = await estado.create({ name });

        return dados;

        /* assim tambem
    estado.create({
         name:request.all().name
    });
     return response.json({"data":"Usuario Criado com sucesso"});
*/

    }

    /**
     * Display a single baseestado.
     * GET baseestados/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async show({ params, request, response, view }) {}

    /**
     * Render a form to update an existing baseestado.
     * GET baseestados/:id/edit
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async edit({ params, request, response, view }) {}

    /**
     * Update baseestado details.
     * PUT or PATCH baseestados/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async update({ params, request, response }) {}

    /**
     * Delete a baseestado with id.
     * DELETE baseestados/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async destroy({ params, request, response }) {}
}

module.exports = BaseEstadoController
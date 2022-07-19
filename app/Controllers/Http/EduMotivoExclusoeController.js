'use strict'
const ResponseHelper = use('App/Helpers/ResponseHelper')
const MotivoExclusoe = use('App/Models/EduMotivoExclusoe')
    /** @typedef {import('@adonisjs/framework/src/Request')} Request */
    /** @typedef {import('@adonisjs/framework/src/Response')} Response */
    /** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with edumotivoexclusoes
 */
class EduMotivoExclusoeController {
    /**
     * Show a list of all edumotivoexclusoes.
     * GET edumotivoexclusoes
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */

    async index({ request, response, view }) {
        try {
            return ResponseHelper.getOnlyDataResponse(await MotivoExclusoe.all())
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Dados não encontrados")
        }
    }

    /**
     * Render a form to be used for creating a new edumotivoexclusoe.
     * GET edumotivoexclusoes/create
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async create({ request, response, view }) {

    }

    /**
     * Create/save a new edumotivoexclusoe.
     * POST edumotivoexclusoes
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async store({ request, response }) {
        try {
            let data = request.all();
            let result = ""
            if (data.id) {
                result = await MotivoExclusoe.query().where({ id: data.id }).first();
                result.merge(data);
                await result.save();
            } else {
                result = await MotivoExclusoe.create(data);
            }
            return ResponseHelper.getSuccessResponse("Informação Salva com sucesso", result)
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("A Informação não foi Salva")
        }
    }

    /**
     * Display a single edumotivoexclusoe.
     * GET edumotivoexclusoes/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async show({ params, request, response, view }) {}

    /**
     * Render a form to update an existing edumotivoexclusoe.
     * GET edumotivoexclusoes/:id/edit
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async edit({ params, request, response, view }) {}

    /**
     * Update edumotivoexclusoe details.
     * PUT or PATCH edumotivoexclusoes/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async update({ params, request, response }) {}

    /**
     * Delete a edumotivoexclusoe with id.
     * DELETE edumotivoexclusoes/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async destroy({ params, request, response }) {}
}

module.exports = EduMotivoExclusoeController
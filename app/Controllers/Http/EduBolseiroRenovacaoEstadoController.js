'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with bolseirorenovacaoestados
 */
const ResponseHelper = use('App/Helpers/ResponseHelper')
const estadoRenovacao = use('App/Models/EduBolseiroRenovacaoEstado')

class EduBolseiroRenovacaoEstadoController {
    /**
     * Show a list of all bolseirorenovacaoestados.
     * GET bolseirorenovacaoestados
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async index({ request, response }) {
        try {
            return ResponseHelper.getOnlyDataResponse(await estadoRenovacao.all())
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao listar Estado de Renovação")
        }
    }

    /**
     * Render a form to be used for creating a new bolseirorenovacaoestado.
     * GET bolseirorenovacaoestados/create
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async create({ request, response, view }) {}

    /**
     * Create/save a new bolseirorenovacaoestado.
     * POST bolseirorenovacaoestados
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
                result = await estadoRenovacao.query().where({ id: data.id }).first();
                result.merge(data);
                await result.save();
            } else {
                result = await estadoRenovacao.create(data);
            }
            return ResponseHelper.getSuccessResponse("Informação Salva com sucesso", result)
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("A Informação não foi Salva")
        }
    }

    /**
     * Display a single bolseirorenovacaoestado.
     * GET bolseirorenovacaoestados/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async show({ params, request, response, view }) {}

    /**
     * Render a form to update an existing bolseirorenovacaoestado.
     * GET bolseirorenovacaoestados/:id/edit
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async edit({ params, request, response, view }) {}

    /**
     * Update bolseirorenovacaoestado details.
     * PUT or PATCH bolseirorenovacaoestados/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async update({ params, request, response }) {}

    /**
     * Delete a bolseirorenovacaoestado with id.
     * DELETE bolseirorenovacaoestados/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async destroy({ params, request, response }) {}
}

module.exports = EduBolseiroRenovacaoEstadoController
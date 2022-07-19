'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const NivelInstituicao = use('App/Models/EduNivelInstituicoe')
const ResponseHelper = use('App/Helpers/ResponseHelper')
const requestFields = ['id', 'nome', 'estado']; // alterar os campos conforme a bd

/**
 * Resourceful controller for interacting with edunivelinstituicoes
 */
class EduNivelInstituicoeController {
    /**
     * Show a list of all edunivelinstituicoes.
     * GET edunivelinstituicoes
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async index({ request, response, view }) {
        try {
            return ResponseHelper.getOnlyDataResponse(await NivelInstituicao.all());
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao listar o Nível da instituição")
        }
    }

    /**
     * Render a form to be used for creating a new edunivelinstituicoe.
     * GET edunivelinstituicoes/create
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async create({ request, response, view }) {}

    /**
     * Create/save a new edunivelinstituicoe.
     * POST edunivelinstituicoes
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */


    async store({ request, response }) {
        try {
            const data = request.only(requestFields);
            const nivelinstituicao = await NivelInstituicao.create(data);
            return ResponseHelper.getSuccessResponse("Nivel Instituição criada com sucesso", nivelinstituicao)
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao salvar o Nível de Instituição")
        }
    }

    /**
     * Display a single edunivelinstituicoe.
     * GET edunivelinstituicoes/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async show({ params, request, response, view }) {
        try {
            return ResponseHelper.getOnlyDataResponse(await NivelInstituicao.find(params.id))
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao buscar o Nível de Instituição")
        }
    }

    /**
     * Render a form to update an existing edunivelinstituicoe.
     * GET edunivelinstituicoes/:id/edit
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async edit({ params, request, response, view }) {}

    /**
     * Update edunivelinstituicoe details.
     * PUT or PATCH edunivelinstituicoes/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async update({ params, request, response }) {
        try {
            const data = request.only(requestFields);
            const nivelinstituicao = await NivelInstituicao.find(params.id);

            nivelinstituicao.merge(data);
            await nivelinstituicao.save();

            return ResponseHelper.getSuccessResponse("Nível de Instituição actualizada com sucesso", nivelinstituicao)

        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao actualizar o nível da Instituição")
        }
    }

    /**
     * Delete a edunivelinstituicoe with id.
     * DELETE edunivelinstituicoes/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async destroy({ params, request, response }) {

        try {

            const nivelinstituicao = await NivelInstituicao.find(params.id);

            if (!nivelinstituicao) {
                return ResponseHelper.getWarningResponse("Não foi encontrada o nível de instituição a ser eliminada", nivelinstituicao)
            }

            await nivelinstituicao.delete();

            return ResponseHelper.getSuccessResponse(" Nível de Instituição eliminada com sucesso", null)

        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao eliminar o nível da instituição")
        }

    }
}

module.exports = EduNivelInstituicoeController
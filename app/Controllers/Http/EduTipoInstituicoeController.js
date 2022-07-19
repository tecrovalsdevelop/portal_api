'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */


const TipoInstituicao = use('App/Models/EduTipoInstituicoe')
const ResponseHelper = use('App/Helpers/ResponseHelper')
const requestFields = ['id', 'codigo', 'nome', 'estado'];

/**
 * Resourceful controller for interacting with EduTipoInstituicao
 */
class EduTipoInstituicoeController {
    /**
     * Show a list of all EduTipoInstituicao.
     * GET EduTipoInstituicao
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */

    async index({ request, response, view }) {
        try {
            return ResponseHelper.getOnlyDataResponse(await TipoInstituicao.all());
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao listar o Tipo de instituição")
        }
    }




    /**
     * Create/save a new EduTipoInstituicao.
     * POST EduTipoInstituicao
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async store({ request, response }) {
        try {
            const data = request.only(requestFields);
            const tipoinstituicao = await TipoInstituicao.create(data);
            return ResponseHelper.getSuccessResponse("Tipo de Instituição criada com sucesso", tipoinstituicao)
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao salvar o Tipo de Instituição")
        }
    }

    /**
     * Display a single edutipoinstituicoe.
     * GET EduTipoInstituicao/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async show({ params, request, response, view }) {
        try {
            return ResponseHelper.getOnlyDataResponse(await TipoInstituicao.find(params.id))
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao buscar o tipo de Instituição")
        }
    }

    /**
     * Update edutipoinstituicoes details.
     * PUT or PATCH EduTipoInstituicao/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async update({ params, request, response }) {
        try {
            const data = request.only(requestFields);
            const tipoinstituicao = await TipoInstituicao.find(params.id);

            tipoinstituicao.merge(data);
            await tipoinstituicao.save();

            return ResponseHelper.getSuccessResponse("Tipo de Instituição actualizada com sucesso", tipoinstituicao)

        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao actualizar o tipo de Instituição")
        }
    }

    /**
     * Delete a edutipoinstituicoe with id.
     * DELETE EduTipoInstituicao/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async destroy({ params, request, response }) {
        try {

            const tipoinstituicao = await TipoInstituicao.find(params.id);

            if (!tipoinstituicao) {
                return ResponseHelper.getWarningResponse("Não foi encontrada o Tipo de instituição a ser eliminada", tipoinstituicao)
            }

            await tipoinstituicao.delete();

            return ResponseHelper.getSuccessResponse(" Tipo de Instituição eliminada com sucesso", null)

        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao eliminar o tipo de instituição")
        }
    }

}

module.exports = EduTipoInstituicoeController
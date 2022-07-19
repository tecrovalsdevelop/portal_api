'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */


const EduNaturezaInstituicoes = use('App/Models/EduNaturezaInstituicoe')
const ResponseHelper = use('App/Helpers/ResponseHelper')
const requestFields = ['id', 'nome', 'estado'];

/**
 * Resourceful controller for interacting with EduNaturezaInstituicoes
 */
class EduNaturezaInstituicoeController {
    /**
     * Show a list of all EduNaturezaInstituicoes.
     * GET EduNaturezaInstituicoes
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async index({ request, response }) {
        try {
            return ResponseHelper.getOnlyDataResponse(await EduNaturezaInstituicoes.all());
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao listar a Natureza da Instituição")
        }
    }

    /**
     * Create/save a new EduNaturezaInstituicoes.
     * POST EduNaturezaInstituicoes
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async store({ request, response }) {
        try {
            const data = request.only(requestFields);
            const eduNaturezaInstituicoes = await EduNaturezaInstituicoes.create(data);
            return ResponseHelper.getSuccessResponse("Natureza da Instituição criada com sucesso", eduNaturezaInstituicoes)
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao salvar a Natureza da Instituição")
        }
    }

    /**
     * Display a single edutipoinstituicoe.
     * GET EduNaturezaInstituicoes/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async show({ params, request, response }) {
        try {
            return ResponseHelper.getOnlyDataResponse(await EduNaturezaInstituicoes.find(params.id))
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao buscar a Natureza da Instituição")
        }
    }

    /**
     * Update edutipoinstituicoes details.
     * PUT or PATCH EduNaturezaInstituicoes/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async update({ params, request, response }) {
        try {
            const data = request.only(requestFields);
            const eduNaturezaInstituicoes = await EduNaturezaInstituicoes.find(params.id);

            eduNaturezaInstituicoes.merge(data);
            await eduNaturezaInstituicoes.save();

            return ResponseHelper.getSuccessResponse("Natureza da Instituição actualizada com sucesso", eduNaturezaInstituicoes)

        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao actualizar o Natureza da Instituição")
        }
    }

    /**
     * Delete a edutipoinstituicoe with id.
     * DELETE EduNaturezaInstituicoes/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async destroy({ params, request, response }) {
        try {

            const eduNaturezaInstituicoes = await EduNaturezaInstituicoes.find(params.id);

            if (!eduNaturezaInstituicoes) {
                return ResponseHelper.getWarningResponse("Não foi encontrada a Natureza da Instituição a ser eliminada", eduNaturezaInstituicoes)
            }

            await eduNaturezaInstituicoes.delete();

            return ResponseHelper.getSuccessResponse(" Natureza da Instituição eliminada com sucesso", null)

        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao eliminar a Natureza da Instituição")
        }
    }

}

module.exports = EduNaturezaInstituicoeController
'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const TipoBolsas = use('App/Models/EduTipoBolsa')
const ResponseHelper = use('App/Helpers/ResponseHelper')
const requestFields = ['id', 'codigo', 'nome', 'estado', 'idade', 'media', 'curso_prioritario', 'curso_nao_prioritario', 'oferta_actual'];

/**
 * Resourceful controller for interacting with edutipobolsas
 */
class EduTipoBolsaController {
    /**
     * Show a list of all edutipobolsas.
     * GET edutipobolsas
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */


    async index({ request, response }) {
        try {
            return ResponseHelper.getOnlyDataResponse(await TipoBolsas.all());
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao listar o tipo de bolsa")
        }
    }


    /**
     * Render a form to be used for creating a new edutipobolsa.
     * GET edutipobolsas/create
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */

    /**
     * Create/save a new edutipobolsa.
     * POST edutipobolsas
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */

    async store({ request, response }) {
        try {
            const data = request.only(requestFields);
            const tipoBolsas = await TipoBolsas.create(data);

            return ResponseHelper.getSuccessResponse("Tipo de Bolsa criado com sucesso", tipoBolsas)
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao salvar o Tipo de Bolsa")
        }
    }


    /**
     * Display a single edutipobolsa.
     * GET edutipobolsas/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */

    async show({ params, request, response }) {
        try {
            return ResponseHelper.getOnlyDataResponse(await TipoBolsas.find(params.id))
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao buscar o tipo de instituição")
        }
    }


    /**
     * Update edutipobolsa details.
     * PUT or PATCH edutipobolsas/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */

    async update({ params, request, response }) {
        try {
            const data = request.only(requestFields);
            const tipoBolsas = await TipoBolsas.find(params.id);
            tipoBolsas.merge(data);
            await tipoBolsas.save();
            return ResponseHelper.getSuccessResponse("Tipo de Bolsa actualizado com sucesso", tipoBolsas)
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao actualizar o tipo de Bolsa")
        }
    }

    /**
     * Delete a edutipobolsa with id.
     * DELETE edutipobolsas/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */

    async destroy({ params, request, response }) {
        try {

            const tipoBolsas = await TipoBolsas.find(params.id);

            if (!tipoBolsas) {
                return ResponseHelper.getWarningResponse("Não foi encontrado o tipo de Bolsa", tipoBolsas)
            }

            await tipoBolsas.delete();

            return ResponseHelper.getSuccessResponse("Tipo de bolsa eliminado com sucesso", null)

        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao eliminar o tipo de bolsa")
        }
    }

}

module.exports = EduTipoBolsaController
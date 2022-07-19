'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */


const NivelAcademico = use('App/Models/BaseNivelAcademico')
const ResponseHelper = use('App/Helpers/ResponseHelper')
const requestFields = ['id', 'nome', 'estado', 'sigla'];


/**
 * Resourceful controller for interacting with basenivelacademicos
 */
class BaseNivelAcademicoController {
    /**
     * Show a list of all basenivelacademicos.
     * GET basenivelacademicos
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */


    async index({ request, response }) {
        try {
            return ResponseHelper.getOnlyDataResponse(await NivelAcademico.all());
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao listar o Nível Académico")
        }
    }


    /**
     * Create/save a new basenivelacademico.
     * POST basenivelacademicos
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */

    async store({ request, response }) {
        try {
            const data = request.only(requestFields);

            //console.log(data)
            const nivelAcademico = await NivelAcademico.create(data);
            return ResponseHelper.getSuccessResponse("Nivel Instituição criada com sucesso", nivelAcademico)
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao salvar o nível académico")
        }
    }



    /**
     * Display a single basenivelacademico.
     * GET basenivelacademicos/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */

    async show({ params, request, response }) {
        try {
            return ResponseHelper.getOnlyDataResponse(await NivelAcademico.find(params.id))
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao buscar o NívelAcadémico")
        }
    }



    /**
     * Render a form to update an existing basenivelacademico.
     * GET basenivelacademicos/:id/edit
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async edit({ params, request, response, view }) {}

    /**
     * Update basenivelacademico details.
     * PUT or PATCH basenivelacademicos/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */

    async update({ params, request, response }) {
        try {
            const data = request.only(requestFields);
            const nivelAcademico = await NivelAcademico.find(params.id);

            nivelAcademico.merge(data);
            await nivelAcademico.save();

            return ResponseHelper.getSuccessResponse("Nível de Instituição actualizada com sucesso", nivelAcademico)

        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao actualizar o nível Académico")
        }
    }

    /**
     * Delete a basenivelacademico with id.
     * DELETE basenivelacademicos/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async destroy({ params, request, response }) {}
}

module.exports = BaseNivelAcademicoController
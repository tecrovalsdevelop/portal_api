'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const BaseTipoAnexo = use('App/Models/BaseTipoAnexo')

const ResponseHelper = use('App/Helpers/ResponseHelper')

const requestFields = ['codigo', 'nome', 'estado', 'categoria', 'obrigatorio'];

/**
 * Resourceful controller for interacting with basetipoanexos
 */

class BaseTipoAnexoController {
    /**
     * Show a list of all basetipoanexos.
     * GET basetipoanexos
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async index({ request, response, view }) {
        try {

            const tipoAnexo = await BaseTipoAnexo.query().where(request._qs).fetch();
            return ResponseHelper.getOnlyDataResponse(tipoAnexo)
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao listar tipoAnexo")
        }
    }
    async candidatura({ params, response, view }) {
        try {

            const tipoAnexo = await BaseTipoAnexo.query().where({ 'categoria': 1 }).fetch();
            return ResponseHelper.getOnlyDataResponse(tipoAnexo)
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao listar tipoAnexo")
        }
    }

    async candidaturagraduacao({ params, response, view }) {
        try {
            const tipoAnexo = await BaseTipoAnexo.query().where({ 'beig': 1, }).fetch();
            return ResponseHelper.getOnlyDataResponse(tipoAnexo)
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao listar tipoAnexo")
        }
    }

    async candidaturaposgraduacao({ params, response, view }) {
        try {
            const tipoAnexo = await BaseTipoAnexo.query().where({ 'beipg': 1, }).fetch();
            return ResponseHelper.getOnlyDataResponse(tipoAnexo)
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao listar tipoAnexo")
        }
    }



    async renovacao({ params, response, view }) {
        try {

            const tipoAnexo = await BaseTipoAnexo.query().where('renovacao', 1).fetch();
            return ResponseHelper.getOnlyDataResponse(tipoAnexo)
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao listar tipoAnexo")
        }
    }
    async reclamacao({ params, response, view }) {
        try {

            const tipoAnexo = await BaseTipoAnexo.query().where('reclamacao', 1).fetch();
            return ResponseHelper.getOnlyDataResponse(tipoAnexo)
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao listar tipoAnexo")
        }
    }

    async anexobolsa({ request, response, view }) {
            try {

                const tipoAnexo = await BaseTipoAnexo.query().where(request._qs).fetch();
                return ResponseHelper.getOnlyDataResponse(tipoAnexo)
            } catch (err) {
                //console.log(err.message)
                return ResponseHelper.getErrorResponse("Erro ao listar tipoAnexo")
            }
        }
        /**
         * Create/save a new basetipoanexo.
         * POST basetipoanexos
         *
         * @param {object} ctx
         * @param {Request} ctx.request
         * @param {Response} ctx.response
         */
    async store({ request, response }) {
        try {
            const data = request.only(requestFields);
            const tipoAnexo = await BaseTipoAnexo.create(data);
            return ResponseHelper.getSuccessResponse("tipoAnexo criado com sucesso", tipoAnexo)
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao salvar o tipoAnexo")
        }
    }

    /**
     * Display a single basetipoanexo.
     * GET basetipoanexos/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async show({ params, request, response, view }) {
        try {
            const tipoAnexo = await BaseTipoAnexo.find(params.id);
            return ResponseHelper.getOnlyDataResponse(tipoAnexo)
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao buscar o tipoAnexo")
        }
    }

    /**
     * Render a form to update an existing basetipoanexo.
     * GET basetipoanexos/:id/edit
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async edit({ params, request, response, view }) {}

    /**
     * Update basetipoanexo details.
     * PUT or PATCH basetipoanexos/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async update({ params, request, response }) {}

    /**
     * Delete a basetipoanexo with id.
     * DELETE basetipoanexos/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async destroy({ params, request, response }) {}
}

module.exports = BaseTipoAnexoController
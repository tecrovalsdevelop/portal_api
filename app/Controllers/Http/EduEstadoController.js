'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const EduEstados = use('App/Models/EduEstado')
const ResponseHelper = use('App/Helpers/ResponseHelper')
const requestFields = ['id', 'nome', 'estado'];

/**
 * Resourceful controller for interacting with eduestados
 */
class EduEstadoController {
    /**
     * Show a list of all eduestados.
     * GET eduestados
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */

    async index({ request, response, view }) {
        try {
            return ResponseHelper.getOnlyDataResponse(await EduEstados.all())
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao listar os estados")
        }
    }
    async estadoscandidatura({ request, response, view }) {
        try {
            return ResponseHelper.getOnlyDataResponse(await EduEstados.all())
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao listar os estados")
        }
    }
    async estadoscandidaturavalidacao({ request, response, view }) {
        try {
            return ResponseHelper.getOnlyDataResponse(await EduEstados.query()
                .where({ estado: 1 })
                .fetch()
            )
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao listar os estados")
        }
    }




    /**
     * Create/save a new eduestado.
     * POST eduestados
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async store({ request, response }) {

        try {

            const data = request.only(requestFields);
            const eduEstados = await EduEstados.create(data);
            return ResponseHelper.getSuccessResponse("Estado criado com sucesso", eduEstados)

        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao salvar o estados")
        }

    }

    /**
     * Display a single eduestado.
     * GET eduestados/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async show({ params, request, response, view }) {

        try {
            return ResponseHelper.getOnlyDataResponse(await EduEstados.find(params.id))
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao listar os estados")
        }
    }

    /**
     * Render a form to update an existing eduestado.
     * GET eduestados/:id/edit
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */

    async update({ params, request, response }) {

        try {

            const data = request.only(requestFields);
            const eduEstados = await EduEstados.find(params.id);

            eduEstados.merge(data);
            await eduEstados.save();

            return ResponseHelper.getSuccessResponse("estado actualizado com sucesso", eduEstados)

        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao actualizar o estado")
        }

    }

    /**
     * Delete a eduestado with id.
     * DELETE eduestados/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async destroy({ params, request, response }) {

        try {

            const eduEstados = await eduEstados.find(params.id);

            if (!eduEstados) {
                return ResponseHelper.getWarningResponse("Não foi encontrado o estado", eduEstados)
            }

            await eduEstados.delete();

            return ResponseHelper.getSuccessResponse("Estado eliminado com sucesso", null)

        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao eliminar o estado")
        }

    }
}

module.exports = EduEstadoController
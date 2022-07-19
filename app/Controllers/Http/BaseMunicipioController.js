'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with basemunicipios
 */


const requestFields = ['id', 'nome', 'estado', 'base_provincia_id'];

const BaseMunicipio = use('App/Models/BaseMunicipio')

const ResponseHelper = use('App/Helpers/ResponseHelper')
const GeneralConstants = use('App/Constants/GeneralConstants')



class BaseMunicipioController {
    /**
     * Show a list of all basemunicipios.
     * GET basemunicipios
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async index({ request, response, view }) {
        try {
            return ResponseHelper.getOnlyDataResponse(await BaseMunicipio.all())

        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao listar municipios")
        }
    }

    /**
     * Render a form to be used for creating a new basemunicipio.
     * GET basemunicipios/create
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async create({ request, response, view }) {}

    /**
     * Create/save a new basemunicipio.
     * POST basemunicipios
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async store({ request, response }) {
        try {

            const data = request.only(requestFields);
            const base_Municipio = await baseMunicipio.create(data);
            return ResponseHelper.getSuccessResponse("Curso criado com sucesso", base_Municipio)

        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao salvar o Curso")
        }
    }

    /**
     * Display a single basemunicipio.
     * GET basemunicipios/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async show({ params, request, response, view }) {}

    /**
     * Render a form to update an existing basemunicipio.
     * GET basemunicipios/:id/edit
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async edit({ params, request, response, view }) {}

    /**
     * Update basemunicipio details.
     * PUT or PATCH basemunicipios/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async update({ params, request, response }) {}

    /**
     * Delete a basemunicipio with id.
     * DELETE basemunicipios/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async destroy({ params, request, response }) {}
}

module.exports = BaseMunicipioController
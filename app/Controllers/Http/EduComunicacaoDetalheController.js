'use strict'

const EduComunicacaoDetalhe = use('App/Models/EduComunicacaoDetalhe')
const ResponseHelper = use('App/Helpers/ResponseHelper')
const Database = use('Database')

const requestFields = ['id', 'edu_comunicacao_id', 'base_anexo_id', 'texto', 'user_id', 'estado'];


/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with educomunicacaodetalhes
 */
class EduComunicacaoDetalheController {
    /**
     * Show a list of all educomunicacaodetalhes.
     * GET educomunicacaodetalhes
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async index({ request, response, view }) {}

    /**
     * Render a form to be used for creating a new educomunicacaodetalhe.
     * GET educomunicacaodetalhes/create
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async create({ request, response, view }) {}

    /**
     * Create/save a new educomunicacaodetalhe.
     * POST educomunicacaodetalhes
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async store({ request, response }) {

        const data = request.only(requestFields);

        try {
            let result = ""
            if (data.id) {
                result = await EduComunicacaoDetalhe.query().where({ id: data.id }).first();
                result.merge(data);
                await result.save();
            } else {
                result = await EduComunicacaoDetalhe.create(data);
            }
            return ResponseHelper.getSuccessResponse("Informação Salva com sucesso", result)
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("A Informação não foi Salva")
        }
    }

    /**
     * Display a single educomunicacaodetalhe.
     * GET educomunicacaodetalhes/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async show({ params, request, response, view }) {

        try {

            const Edu_Comunicacao_Detalhes = await EduComunicacaoDetalhe.query().where({ edu_comunicacao_id: params.id })
                .with('comunicacao').with('comunicacao.bolseiro').with('comunicacao.bolseiro.pessoa').with('baseAnexo').orderBy('id', 'desc').fetch();

            return ResponseHelper.getOnlyDataResponse(Edu_Comunicacao_Detalhes);

        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Dados não encontrados")
        }
    }

    /**
     * Render a form to update an existing educomunicacaodetalhe.
     * GET educomunicacaodetalhes/:id/edit
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async edit({ params, request, response, view }) {}

    /**
     * Update educomunicacaodetalhe details.
     * PUT or PATCH educomunicacaodetalhes/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async update({ params, request, response }) {}

    /**
     * Delete a educomunicacaodetalhe with id.
     * DELETE educomunicacaodetalhes/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async destroy({ params, request, response }) {}
}

module.exports = EduComunicacaoDetalheController
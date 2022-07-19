'use strict'
const ResponseHelper = use('App/Helpers/ResponseHelper')
const bolseiro = use('App/Models/EduBolseiro')
const User = use('App/Models/User')

const BasePessoa = use('App/Models/BasePessoa')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with edubolseiros
 */



class EduBolseiroController {
    /**
     * Show a list of all edubolseiros.
     * GET edubolseiros
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async index({ request, response, view }) {
        try {

            const bolseiros = await bolseiro.query().with('pessoa')
                .with('eduInstituicoes').with('eduCurso').with('eduCurso.eduUnidadeOrganica')
                .with('anoFrequencia').with('edutipobolseiro').with('basenivelacademico')
                .with('basegrauacademico').with('eduestadobolsa').with('periodoAvaliacao').first();

            return ResponseHelper.getOnlyDataResponse(bolseiros);

        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Dados não encontrados")
        }
    }

    /**
     * Render a form to be used for creating a new edubolseiro.
     * GET edubolseiros/create
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async create({ request, response, view }) {}

    /**
     * Create/save a new edubolseiro.
     * POST edubolseiros
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async store({ request, response }) {}

    /**
     * Display a single edubolseiro.
     * GET edubolseiros/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async show({ params, request, response, view }) {
        try {

            const bolseiros = await bolseiro.query().where({ id: params.id }).with('pessoa').with('pessoa.municipioresidencia').with('pessoa.user')
                .with('eduInstituicoes').with('eduCurso').with('eduCurso.eduUnidadeOrganica')
                .with('anoFrequencia').with('edutipobolseiro').with('basenivelacademico')
                .with('basegrauacademico').with('eduestadobolsa').with('edutipobolsa').with('periodoAvaliacao').with('baseprovincia').first()

            return ResponseHelper.getOnlyDataResponse(bolseiros);

        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Dados não encontrados")
        }
    }


    async getBolseiroByUser({ params, request, response, view }) {
        try {

            const bolseiros = await BasePessoa.query().where({ user_id: params.user_id })
                .with('user')
                .with('municipioresidencia')
                .with('bolseiro')
                .with('bolseiro.bolseiroRenovacao.anexo')
                .with('bolseiro.bolseiroRenovacao.anexo.itens')
                .with('bolseiro.bolseiroRenovacao.anexo.itens.tipo_anexo')
                .with('bolseiro.eduInstituicoes')
                .with('bolseiro.eduCurso')
                .with('bolseiro.eduCurso.eduUnidadeOrganica')
                .with('bolseiro.eduCurso.eduUnidadeOrganica.provincia')
                .with('bolseiro.anoFrequencia')
                .with('bolseiro.edutipobolseiro')
                .with('bolseiro.basenivelacademico')
                .with('bolseiro.basegrauacademico')
                .with('bolseiro.eduestadobolsa')
                .with('bolseiro.edutipobolsa')
                .with('bolseiro.periodoAvaliacao')
                .with('bolseiro.baseprovincia')
                .with('bolseiro.bolseiroRenovacao')
                .with('bolseiro.bolseiroRenovacao.periodoAvaliacao')
                .with('bolseiro.bolseiroRenovacao.anoFrequencia')
                .with('bolseiro.bolseiroRenovacao.estadoRenovacao')
                .first()

            return ResponseHelper.getOnlyDataResponse(bolseiros);

        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Dados não encontrados")
        }
    }


    /**
     * Render a form to update an existing edubolseiro.
     * GET edubolseiros/:id/edit
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async edit({ params, request, response, view }) {}

    /**
     * Update edubolseiro details.
     * PUT or PATCH edubolseiros/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async update({ params, request, response }) {}

    /**
     * Delete a edubolseiro with id.
     * DELETE edubolseiros/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async destroy({ params, request, response }) {}
}

module.exports = EduBolseiroController
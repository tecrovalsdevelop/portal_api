'use strict'
const EduComunicacao = use('App/Models/EduComunicacoe')

const BaseAnexo = use('App/Models/BaseAnexo')
const ResponseHelper = use('App/Helpers/ResponseHelper')
const Database = use('Database')

const requestFields = ['id', 'nome', 'bi', 'email', 'edu_bolseiro_id', 'base_anexo_id', 'edu_comunicacao_tipo_id',
    'telefone', 'assunto', 'texto', 'resposta', 'estado', 'notificacao', 'notificacao_ies', 'notificacao_inagbe'
];

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with educomunicacoes
 */
class EduComunicacoeController {

    async buscarTotalDeComunicacaoId({ params, request, response }) {
        try {

            let totalComunicacaoIdBolseiro = await EduComunicacao.query().where({ edu_bolseiro_id: params.id }).getCount()
            return ResponseHelper.getOnlyDataResponse(totalComunicacaoIdBolseiro)
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("A Informação não foi Salva")
        }

    }




    /**
     * Show a list of all educomunicacoes.
     * GET educomunicacoes
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async index({ request, response, view }) {}

    /**
     * Render a form to be used for creating a new educomunicacoe.
     * GET educomunicacoes/create
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async create({ request, response, view }) {}

    /**
     * Create/save a new educomunicacoe.
     * POST educomunicacoes
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async store({ request, response }) {

        const data = request.only(requestFields);
        const data_full = request.all();

        try {
            let result = ""
            if (data.id) {
                result = await EduComunicacao.query().where({ id: data.id }).first();
                result.merge(data);
                result = await result.save();
            } else {
                result = await EduComunicacao.create(data);
            }


            if (result) {
                let result_renovacao = result.toJSON()
                let anexo = await BaseAnexo.query().where({
                        categoria: 3,
                        user_id: data_full ? .user_id,
                        estado: 1,
                        //   ndi: result_renovacao.bolseiro.pessoa.ndi,
                        //  base_periodo_avaliacao_id: result_renovacao.base_periodo_avaliacao_id
                    })
                    .orderBy('id', 'desc')
                    .first()


                //console.log(anexo.id)
                if (anexo) {

                    await EduComunicacao.query().where({ id: result_renovacao.id }).update({ base_anexo_id: anexo.id })
                    await BaseAnexo.query().where({ id: anexo.id }).update({ estado: 0 })
                }
            }
            return ResponseHelper.getSuccessResponse("Informação Salva com sucesso", result)
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("A Informação não foi Salva")
        }

    }


    /**
     * Display a single educomunicacoe.
     * GET educomunicacoes/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async show({ params, request, response, view }) {
        try {

            const Edu_Comunicacao = await EduComunicacao.query().where({ id: params.id })
                .with('comunicacaodetalhe', (builder) => {
                    builder.orderBy('id', 'desc')
                })
                .orderBy('id', 'desc')
                .with('comunicacaoTipo')
                .with('comunicacaodetalhe.user')
                .with('bolseiro').with('bolseiro.pessoa')
                .with('baseAnexo').first()
            return ResponseHelper.getOnlyDataResponse(Edu_Comunicacao);

        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Dados não encontrados")
        }
    }


    async getComunicacaoByBolseiro({ params, request, response, view }) {
        try {

            const Edu_comunicacao = await EduComunicacao.query().where({ edu_bolseiro_id: params.id })
                .with('bolseiro').with('baseAnexo').orderBy('id', 'desc').fetch()

            return ResponseHelper.getOnlyDataResponse(Edu_comunicacao);

        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Dados não encontrados")
        }
    }

    /**
     * Render a form to update an existing educomunicacoe.
     * GET educomunicacoes/:id/edit
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async edit({ params, request, response, view }) {}

    /**
     * Update educomunicacoe details.
     * PUT or PATCH educomunicacoes/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async update({ params, request, response }) {}

    /**
     * Delete a educomunicacoe with id.
     * DELETE educomunicacoes/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async destroy({ params, request, response }) {}
}

module.exports = EduComunicacoeController
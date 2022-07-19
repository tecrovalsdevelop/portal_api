'use strict'
const EduProjectos = use('App/Models/EduProjecto')
const ResponseHelper = use('App/Helpers/ResponseHelper')
const Database = use('Database')

const requestFields = ['id', 'nome', 'descricao', 'titulo', 'resumo', 'edu_bolseiro_id',
    'base_anexo_id', 'notificacao'
];


/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with eduprojectos
 */
class EduProjectoController {
    /**
     * Show a list of all eduprojectos.
     * GET eduprojectos
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async index({ request, response, view }) {}

    /**
     * Render a form to be used for creating a new eduprojecto.
     * GET eduprojectos/create
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async create({ request, response, view }) {}

    /**
     * Create/save a new eduprojecto.
     * POST eduprojectos
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
                result = await EduProjectos.query().where({ id: data.id }).first();
                result.merge(data);
                await result.save();
            } else {
                result = await EduProjectos.create(data);
            }
            return ResponseHelper.getSuccessResponse("Informação Salva com sucesso", result)
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("A Informação não foi Salva")
        }
    }

    /**
     * Display a single eduprojecto.
     * GET eduprojectos/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async show({ params, request, response, view }) {}

    /**
     * Render a form to update an existing eduprojecto.
     * GET eduprojectos/:id/edit
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async edit({ params, request, response, view }) {}

    /**
     * Update eduprojecto details.
     * PUT or PATCH eduprojectos/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async update({ params, request, response }) {}

    /**
     * Delete a eduprojecto with id.
     * DELETE eduprojectos/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async destroy({ params, request, response }) {}
}

module.exports = EduProjectoController
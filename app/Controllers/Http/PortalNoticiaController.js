'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const PortalNoticia = use('App/Models/PortalNoticia')

const ResponseHelper = use('App/Helpers/ResponseHelper')



const requestFields = ['id', 'titulo', 'descricao_menor', 'categoria', 'foto_menor',
    'foto_maior', 'estado'
];

/**
 * Resourceful controller for interacting with noticias
 */
class PortalNoticiaController {
    /**
     * Show a list of all noticias.
     * GET noticias
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async index({ request, response }) {
        try {
            let data = request.all();
            let page = data.page ? data.page : 1;
            let pagesize = data.pagesize ? data.pagesize : 10;


            const noticias = await PortalNoticia.query().where({ estado: 1 }).orderBy('id', 'desc').paginate(page, 6)

            return ResponseHelper.getOnlyDataResponse(noticias)
        } catch (err) {
            console.error(err)
            return ResponseHelper.getErrorResponse("Erro ao listar as Bolsas")
        }
    }

    async getNoticias({ request, response, view }) {
        try {
            let data = request.all();
            let page = data.page ? data.page : 1;
            let pagesize = data.pagesize ? data.pagesize : 10;
            const result = await PortalNoticia.query().where({ estado: 1 }).orderBy('id', 'desc').paginate(page, 6)
            //  this.registarLog('', '', 'produtos', 'visualizar', '', '', 'visitante')

            return ResponseHelper.getOnlyDataResponse(result)
        } catch (err) {
            console.log(err.message)
            return ResponseHelper.getErrorResponse("informação não encontrada")
        }
    }

    async getNoticiasPopulares({ request, response, view }) {
        try {
            let data = request.all();
            let page = data.page ? data.page : 1;
            const result = await PortalNoticia.query().orderBy('visualizacoes', 'desc').limit(5).fetch()
            //  this.registarLog('', '', 'produtos', 'visualizar', '', '', 'visitante')

            return ResponseHelper.getOnlyDataResponse(result)
        } catch (err) {
            console.log(err.message)
            return ResponseHelper.getErrorResponse("informação não encontrada")
        }
    }

    async buscarNoticiaId({ request, params, response }) {
        try {

            const noticia = await PortalNoticia.query().where({ id: params.id }).with('PortalNoticiaItem').first()

            await PortalNoticia.query().where({ id: params.id }).update({ visualizacoes: Number(noticia.visualizacoes) + Number(1) })
            return ResponseHelper.getOnlyDataResponse(noticia);

        } catch (err) {
            console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao listar Noticia")
        }
    }


    /**
     * Render a form to be used for creating a new noticia.
     * GET noticias/create
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async create({ request, response, view }) {
    }

    /**
     * Create/save a new noticia.
     * POST noticias
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async store({ request, response }) {
    }

    /**
     * Display a single noticia.
     * GET noticias/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async show({ params, request, response, view }) {
    }



    /**
     * Render a form to update an existing noticia.
     * GET noticias/:id/edit
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async edit({ params, request, response, view }) {
    }

    /**
     * Update noticia details.
     * PUT or PATCH noticias/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async update({ params, request, response }) {
    }

    /**
     * Delete a noticia with id.
     * DELETE noticias/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async destroy({ params, request, response }) {
    }

    async bolsasdisponiveisportal({ request, response, view }) {
        try {



            let data = new Date();

            let dia = data.getDate();
            let ano = data.getFullYear()
            let mes_id = data.getMonth() + 1
            let mes = mes_id > 9 ? mes_id : "0" + mes_id;

            let mes_um = 1;
            let data_hoje = data.getFullYear() + "-" + mes + "-" + data.getDate();


            const bolsa = await BaseNoticias.query()
                .where('estado', '1')
                //  .where('data_abertura' , '<=', data_hoje)
                //  .where('data_encerramento' , '>=', data_hoje)
                .with('bolsas')
                .fetch()
            //      return ResponseHelper.getOnlyDataResponse(bolsas)

            const bolsas = await EduBolsa.query()
                .where('estado', '1')
                .where('data_abertura', '<=', data_hoje)
                .where('data_encerramento', '>=', data_hoje)
                .with('EduTipoBolsa')
                .fetch()

            return ResponseHelper.getOnlyDataResponse(bolsas)
        } catch (err) {
            console.error(err)
            return ResponseHelper.getErrorResponse("Erro ao listar as Bolsas")
        }
    }


    async listagemNoticia({ request, response }) {
        try {

            let data = request.all();
            let page = Number(data.page ? data.page : 1);
            let size = Number(data.size ? data.tableSize : 5);

            const bolsa = await BaseNoticias.query()
                .paginate(page, size)

            return ResponseHelper.getOnlyDataResponse(bolsa)
        } catch (err) {
            console.error(err)
            return ResponseHelper.getErrorResponse("Erro ao listar as Bolsas")
        }
    }
}

module.exports = PortalNoticiaController

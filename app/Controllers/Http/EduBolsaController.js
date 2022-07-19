'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const EduBolsa = use('App/Models/EduBolsa')

const EduTipoBolsa = use('App/Models/EduTipoBolsa')
const ResponseHelper = use('App/Helpers/ResponseHelper')

const requestFields = ['codigo', 'nome', 'estado', 'data_abertura', 'data_encerramento', 'vagas_disponivel',
    'titulo', 'descricao', 'cronograma'
];


/**
 * Resourceful controller for interacting with edubolsas
 */
class EduBolsaController {
    /**
     * Show a list of all edubolsas.
     * GET edubolsas 
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     * 
     */
    async index({ request, response, view }) {
        try {
            const bolsa = await EduBolsa.query().where({ estado: 1 }).fetch()
            return ResponseHelper.getOnlyDataResponse(bolsa)
        } catch (err) {
            console.error(err)
            return ResponseHelper.getErrorResponse("Erro ao listar as Bolsas")
        }
    }

    async bolsaslista({ request, response, view }) {
        try {
            const bolsa = await EduBolsa.query().fetch()
            return ResponseHelper.getOnlyDataResponse(bolsa)
        } catch (err) {
            console.error(err)
            return ResponseHelper.getErrorResponse("Erro ao listar as Bolsas")
        }
    }
    async bolsadisponivelportal({ request, params, response, view }) {
        try {

            const bolsas = await EduBolsa.query()
                .where('id', params.id)
                .with('EduTipoBolsa')
                .first()

            return ResponseHelper.getOnlyDataResponse(bolsas)
        } catch (err) {
            console.error(err)
            return ResponseHelper.getErrorResponse("Erro ao listar as Bolsas")
        }
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


            const bolsa = await EduTipoBolsa.query()
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


    /* na busca das bolsas é possivel alguns candidatos terem acesso a uma bolsa ja encerrada caso no acto da 
 validação o inagbe precisa activar esta funcionalidade para o candidato submeter alguma informação adicional*/
    async bolsasactivas({ params }) {

        try {
            let bolsa = await EduBolsa.query().where('estado', 1)
                .orWhere('id', params.bolsa_id)
                .fetch()
            return ResponseHelper.getOnlyDataResponse(bolsa)
        } catch (err) {
            console.error(err)
            return ResponseHelper.getErrorResponse("Erro ao listar as Bolsas")
        }
    }
    async getBolsasByPermissoes1({ params }) {
        try {
            const bolsa = await EduBolsa.query().where({ estado: 0 })

            /*    if (params.bolsa_id){ bolsa.orWhere('id',params.bolsa_id)    }   */

            bolsa.fetch()
            if (!pessoa) {
                return ResponseHelper.getWarningResponse("Bolsas Não Encontrdas");
            }
            return ResponseHelper.getOnlyDataResponse(bolsa)
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao buscar a Bolsa pelo utilizador")
        }
    }
    /**
     * Create/save a new edubolsa.
     * POST edubolsas
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async store({ request, response }) {
        try {

            const data = request.all();
            let show_data = ""
            if (data.id) {
                show_data = await EduBolsa.query().where('id', data.id).first();
                show_data.merge(data)
                await show_data.save();
            }
            else {
                show_data = await EduBolsa.create(data);
            }
            return ResponseHelper.getSuccessResponse("Bolsa criado com sucesso", show_data)
        } catch (err) {
            console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao salvar a bolsa")
        }
    }

    /**
     * Display a single edubolsa.
     * GET edubolsas/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async show({ params, request, response, view }) {
        try {

            const bolsa = await EduBolsa.find(params.id)
            return ResponseHelper.getOnlyDataResponse(bolsa)
        } catch (err) {
            console.error(err)
            return ResponseHelper.getErrorResponse("Erro ao buscar a Bolsa")
        }
    }

    async listagemBolsa({ request, response }) {
        try {

            let data = request.all();
            let page = Number(data.page ? data.page : 1);
            let size = Number(data.size ? data.tableSize : 5);

            const bolsa = await EduBolsa.query()
            .paginate(page, size)

            return ResponseHelper.getOnlyDataResponse(bolsa)
        } catch (err) {
            console.error(err)
            return ResponseHelper.getErrorResponse("Erro ao listar as Bolsas")
        }
    }

    /**
     * Render a form to update an existing edubolsa.
     * GET edubolsas/:id/edit
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async edit({ params, request, response, view }) { }

    /**
     * Update edubolsa details.
     * PUT or PATCH edubolsas/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async update({ params, request, response }) {
        try {

            let data = request.all()

            let show_data = await EduBolsa.query().where('id', data.id).first();
            show_data.merge(data)
            await show_data.save();

            return ResponseHelper.getSuccessResponse("Informação Salva com sucesso", show_data);
        }

        catch (err) {
            console.log(err);
            return ResponseHelper.getErrorResponse("A Informação não foi Salva")
        }
    }

    /**
     * Delete a edubolsa with id.
     * DELETE edubolsas/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async destroy({ params, request, response }) { }
}

module.exports = EduBolsaController
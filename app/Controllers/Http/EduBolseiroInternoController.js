'use strict'

const ResponseHelper = use('App/Helpers/ResponseHelper')

const pessoa = use('App/Models/BasePessoa')
const Database = use('Database')
const EduUnidadeOrganica = use('App/Models/EduUnidadeOrganica');

const bolseiro = use('App/Models/EduBolseiro')
const bolseiroInterno = use('App/Models/EduBolseiroInterno')
const User = use('App/Models/User')
const EduCurso = use('App/Models/EduCurso')


const Funcionario = use('App/Models/Funcionario');

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with edubolseirointernos
 */
class EduBolseiroInternoController {
    /**
     * Show a list of all edubolseirointernos.
     * GET edubolseirointernos
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */

    async index({ request, response, view }) {

        try {
            let paginate = request.all();
            let page = Number(paginate.page ? paginate.page : 1);
            let size = Number(paginate.size ? paginate.size : 10);

            //console.log(paginate)
            const bolseiros_interno = await bolseiroInterno.query().with('bolseiro')
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
                .with('bolseiro.pessoa')
                .with('bolseiro.pessoa.user')
                .with('eduCurso')
                .with('tipoBolsa').with('nivelAcademico')
                .with('grauAcademico')
                .paginate(page, size)

            ;

            return ResponseHelper.getOnlyDataResponse(bolseiros_interno);

        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Dados não encontrados")
        }

    }


    async bolseiroInternofiltro({ request, response, view }) {

        try {
            let paginate = request.all();
            let page = Number(paginate.page ? paginate.page : 1);
            let size = Number(paginate.size ? paginate.size : 10);


            let dada = request.all()

            //console.log(dada)
            const pessoa_find = await pessoa.query()
                .where('ndi', 'like', '' + dada.bi_nome + '')
                .orWhere('nome', 'like', '' + dada.bi_nome + '')
                .first()

            let pessoa_id = -1
            if (pessoa_find)
                pessoa_id = pessoa_find.id
            const bolseiro_find = await bolseiro.query()
                .where('base_pessoa_id', pessoa_id)
                .first()

            let bolseiro_id = -1
            if (bolseiro_find)
                bolseiro_id = bolseiro_find.id

            //console.log('bolseiro_id')

            const bolseiros_interno = await bolseiroInterno.query().with('bolseiro')

            .where('edu_bolseiro_id', bolseiro_id)
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
                .with('bolseiro.pessoa')
                .with('bolseiro.pessoa.user')
                .with('eduCurso')
                .with('tipoBolsa').with('nivelAcademico')
                .with('grauAcademico')
                .paginate(page, size);

            return ResponseHelper.getOnlyDataResponse(bolseiros_interno);

        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Dados não encontrados")
        }

    }


    async bolseiroInternorenovacao({ request, response }) {

        try {
            let paginate = request.all();

            //console.log(paginate)
            let page = Number(paginate.page ? paginate.page : 1);
            let size = Number(paginate.size ? paginate.size : 10);
            const bolseiros_interno = await bolseiroInterno.query().with('bolseiro')
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
                .with('bolseiro.pessoa')
                .with('bolseiro.pessoa.user')
                .with('eduCurso')
                .with('tipoBolsa').with('nivelAcademico')
                .with('grauAcademico')
                .paginate(page, size);

            return ResponseHelper.getOnlyDataResponse(bolseiros_interno);

        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Dados não encontrados")
        }

    }



    async bolseiroInternorenovacaoies({ request, response }) {

            try {
                let data = request.all();
                let cursos = []




                const funcionario = await Funcionario.query().where({ user_id: data.user_id })
                    .with('user').with('eduInstituicoes').with('unidadeOrganica')


                .first();

                if (funcionario) {

                    let fun = funcionario.toJSON()
                        //  //console.log(fun_json)

                    data.edu_instituicao_id = fun.edu_instituicoes_id;
                    data.edu_unidade_organica_id = fun.edu_unidade_organica_id;


                    //console.log(data.edu_instituicao_id)
                    //console.log(data.edu_unidade_organica_id)

                    if (data.edu_unidade_organica_id) {
                        //-- buscamos todos cursos da Instituição 

                        const uo = await EduUnidadeOrganica.query().where({ id: fun.edu_unidade_organica_id }).first();

                        cursos = Database.from('edu_cursos')
                            .where({ edu_unidade_organica_codigo: uo.codigo })
                            .select('id')
                    } else {
                        //-- buscamos todos cursos da Instituição 
                        cursos = Database.from('edu_cursos')
                            .where({ edu_instituicao_id: fun.edu_instituicoes_id })
                            .select('id')

                    }

                    //console.log("filtro funcionario")
                    //  //console.log(data)
                    // //console.log(cursos)

                    let paginate = request.all();


                    let page = Number(paginate.page ? paginate.page : 1);
                    let size = Number(paginate.size ? paginate.size : 10);
                    const bolseiros_interno = await bolseiroInterno.query().whereIn('edu_curso_id', cursos).with('bolseiro')
                        .with('bolseiro.bolseiroRenovacao.anexo')
                        .with('bolseiro.bolseiroRenovacao.anexo.itens')
                        .with('bolseiro.bolseiroRenovacao.anexo.itens.tipo_anexo')
                        .with('bolseiro.eduInstituicoes')
                        .with('bolseiro.eduCurso')
                        .with('bolseiro.eduCurso.instituicao')
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
                        .with('bolseiro.pessoa')
                        .with('bolseiro.pessoa.user')
                        .with('eduCurso')
                        .with('tipoBolsa').with('nivelAcademico')
                        .with('grauAcademico')
                        .paginate(page, size);

                    return ResponseHelper.getOnlyDataResponse(bolseiros_interno);
                }
                return ResponseHelper.getErrorResponse("Dados não encontrados")

            } catch (err) {
                //console.log(err.message)
                return ResponseHelper.getErrorResponse("Dados não encontrados")
            }

        }
        /**
         * Render a form to be used for creating a new edubolseirointerno.
         * GET edubolseirointernos/create
         *
         * @param {object} ctx
         * @param {Request} ctx.request
         * @param {Response} ctx.response
         * @param {View} ctx.view
         */
    async create({ request, response, view }) {}

    /**
     * Create/save a new edubolseirointerno.
     * POST edubolseirointernos
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async store({ request, response }) {}

    /**
     * Display a single edubolseirointerno.
     * GET edubolseirointernos/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async show({ params, request, response, view }) {}

    /**
     * Render a form to update an existing edubolseirointerno.
     * GET edubolseirointernos/:id/edit
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async edit({ params, request, response, view }) {}

    /**
     * Update edubolseirointerno details.
     * PUT or PATCH edubolseirointernos/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async update({ params, request, response }) {}

    /**
     * Delete a edubolseirointerno with id.
     * DELETE edubolseirointernos/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async destroy({ params, request, response }) {}
}

module.exports = EduBolseiroInternoController
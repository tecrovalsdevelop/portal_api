'use strict'

const ResponseHelper = use('App/Helpers/ResponseHelper')
const pessoa = use('App/Models/BasePessoa')
const bolseiro = use('App/Models/EduBolseiro')
const bolseiroInterno = use('App/Models/EduBolseiroInterno')


const EduRenovacao = use('App/Models/EduBolseiroRenovacoes')
const requestFields_Pessoa = ['id', 'nome', 'ndi', 'user_id', 'data_nascimento',
    'base_genero_id', 'base_estado_civil_id', 'base_anexo_id', 'base_municipio_id', 'endereco', 'data_emissao',
    'tipo_identificacao', 'banco', 'mae', 'pai', 'telefone_principal', 'telefone_alternativo', 'outro_contacto'
];

const requestFields_Bolseiro = ['id', 'edu_tipo_bolseiro_id', 'codigo_bolsa', 'base_periodo_avaliacao_id', 'base_pessoa_id', 'base_nivel_academico_id', 'base_grau_academico_id',
    'edu_estado_bolsa_id', 'edu_instituicao_id', 'edu_curso_id', 'duracao', 'base_ano_frequencia_id', 'cidade', 'numero_conta', 'iban', 'base_provincia_residencia_id', 'edu_tipo_bolsa_id',
    'data_inicio', 'data_fim', 'estado', 'observacao', 'base_anexo_id', 'base_banco_id'
];

const requestFields_Bolseiro_Interno = ['id', 'edu_tipo_bolsa_id', 'edu_bolseiro_id', 'edu_curso_id', 'base_grau_academico_id', 'base_nivel_academico_id', 'valor_bolsa'];



const requestFields_Pessoa_edit = ['id', 'nome', 'ndi', 'data_nascimento',
    'base_genero_id', 'base_estado_civil_id', 'base_anexo_id', 'base_municipio_id', 'endereco', 'data_emissao',
    'tipo_identificacao', 'banco', 'mae', 'pai'
];

const requestFields_Bolseiro_edit = ['id', 'edu_tipo_bolseiro_id', 'codigo_bolsa', 'base_periodo_avaliacao_id', 'base_pessoa_id', 'base_nivel_academico_id', 'base_grau_academico_id',
    'edu_estado_bolsa_id', 'edu_instituicao_id', 'edu_curso_id', 'duracao', 'base_ano_frequencia_id', 'cidade', 'numero_conta', 'iban', 'base_provincia_residencia_id', 'edu_tipo_bolsa_id',
    'data_inicio', 'data_fim', 'base_banco_id'
];

const requestFields_Bolseiro_Interno_edit = ['id', 'edu_tipo_bolsa_id', 'edu_bolseiro_id', 'edu_curso_id', 'base_grau_academico_id', 'base_nivel_academico_id', 'valor_bolsa'];


/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with basepessoas
 */
class BasePessoaController {
    /**
     * Show a list of all basepessoas.
     * GET basepessoas
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async index({ request, response }) {
        try {

            let paginate = request.all();
            let page = Number(paginate.page ? paginate.page : 1);
            let size = Number(paginate.size ? paginate.size : 10);

            const pessoas = await pessoa.query().with('user').paginate(page, size)

            return ResponseHelper.getOnlyDataResponse(pessoas);
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Dados não encontrados")
        }
    }



    async getByUser({ params }) {
        try {
            const pessoa = await BasePessoa.query()
                .where({ user_id: params.user_id })
                .with('municipio.provincia')
                .with('municipio_residencia.provincia')
                .with('contactos')
                .with('agregado')
                .with('formacoes.instituicao.provincia')
                .with('formacoes.curso')
                .with('candidaturas.candidatura_interna.curso.instituicao')
                .with('candidaturas.candidatura_externa.instituicao')
                .with('candidaturas.candidatura_externa.curso')
                .with('candidaturas.bolsa')
                .with('anexo.itens.tipo_anexo')
                .first();

            if (!pessoa) {
                return ResponseHelper.getWarningResponse("Utilizador precisa registar os dados pessoais");
            }
            pessoa.data_nascimento = moment(pessoa.data_nascimento).utc('pt');
            pessoa.dtEmissao = moment(pessoa.dtEmissao).utc('pt');


            return ResponseHelper.getOnlyDataResponse(pessoa)
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao buscar a Pessoa pelo utilizador")
        }
    }



    /**
     * Render a form to be used for creating a new basepessoa.
     * GET basepessoas/create
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async create({ request, response, view }) {}

    /**
     * Create/save a new basepessoa.
     * POST basepessoas
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async store({ request, response }) {

        try {
            let data = request.all();

            let data_pessoa = request.only(requestFields_Pessoa);
            let data_bolseiro = request.only(requestFields_Bolseiro);
            let data_bolseiro_interno = request.only(requestFields_Bolseiro_Interno);

            data_pessoa.id = data_bolseiro.base_pessoa_id
            data_bolseiro.id = data_bolseiro_interno.edu_bolseiro_id

            const pessoa_find = await pessoa.query().where({ id: data_pessoa.id }).first()


            if (pessoa_find) {

                data_pessoa = request.only(requestFields_Pessoa_edit);
                data_bolseiro = request.only(requestFields_Bolseiro_edit);
                data_bolseiro_interno = request.only(requestFields_Bolseiro_Interno_edit);

                data_pessoa.id = data_bolseiro.base_pessoa_id
                data_bolseiro.id = data_bolseiro_interno.edu_bolseiro_id

                pessoa_find.merge(data_pessoa);
                await pessoa_find.save();

                const bolseiro_find = await bolseiro.query().where({ id: data_bolseiro.id }).first()
                const bolseiro_interno_find = await bolseiroInterno.query().where({ id: data_bolseiro_interno.id }).first()

                //console.log(data_pessoa)
                //console.log(data_pessoa.id)
                //console.log(data_bolseiro.id)
                //console.log(data_bolseiro_interno.id)
                //console.log("--------------------------------")


                if (bolseiro_find) {
                    bolseiro_find.merge(data_bolseiro);
                    let result = await bolseiro_find.save();
                    //console.log("editar " + result)

                    const bolseiro_renovacao_find = await EduRenovacao.query().where({ edu_bolseiro_id: data_bolseiro.id }).first()

                    if (bolseiro_renovacao_find) {
                        await EduRenovacao.query().where({ edu_bolseiro_id: data_bolseiro.id }).update({ ano_frequencia_anterior_id: data.base_ano_frequencia_id })
                    } else {
                        await bolseiro.query().where({ id: data_bolseiro.id }).update({ base_ano_frequencia_id: data.base_ano_frequencia_id })
                    }
                } else {
                    data_bolseiro.base_anexo_id = 1
                    let result = await bolseiro.create(data_bolseiro);
                    //console.log("slavar " + result.id)
                }


                //console.log("bolseiro salvo..........")
                if (bolseiro_interno_find) {
                    bolseiro_interno_find.merge(data_bolseiro_interno);
                    let result = await bolseiro_interno_find.save()
                        //console.log(data_pessoa.nome + " - " + bolseiro_interno_find.id + " bei actualizado com sucesso." + result)
                } else {
                    let result = await bolseiroInterno.create(data_bolseiro_interno)
                        //console.log(data_pessoa.nome + " - " + bolseiro_interno_find + "  salvo ....." + result)
                }

                //console.log("bolseiro interno..........")
                //console.log(data_pessoa.nome + " actualizado com sucesso.....",)
                return ResponseHelper.getSuccessResponse(data_pessoa.nome + "actualizado com sucesso", data_pessoa)

            } else {
                await pessoa.create(data_pessoa);
                await bolseiro.create(data_bolseiro);
                await bolseiroInterno.create(data_bolseiro_interno)

                //console.log(data_pessoa.nome + " cadastrado com sucesso",)

                return ResponseHelper.getSuccessResponse(data_pessoa.nome + "cadastrado com sucesso", data_pessoa)

            }
            return ResponseHelper.getSuccessResponse("Curso criado com sucesso", base_pessoa)

        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao salvar o Curso")
        }



    }


    async updateUserPessoa({ request, response }) {

        try {
            let data_all = request.all();
            let pessoa_result = ""
                //console.log(data_all)

            pessoa_result = await pessoa.query().where({ id: data_all.id }).first();
            pessoa_result.merge(data_all);
            await pessoa_result.save();


            return ResponseHelper.getSuccessResponse("Informação Salva com sucesso", pessoa_result)
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("A Informação não foi Salva")

        }

    }


    async updatepessoa({ request, response }) {

            try {
                let data = request.all();
                //   //console.log(data)
                let data_pessoa = request.only(requestFields_Pessoa);
                let data_bolseiro = request.only(requestFields_Bolseiro);

                //console.log(data_bolseiro)
                const pessoa_find = await pessoa.query().where({ id: data_pessoa.id }).first()

                if (pessoa_find) {


                    pessoa_find.merge(data_pessoa);
                    let result = await pessoa_find.save();


                    await bolseiro.query().where({ base_pessoa_id: pessoa_find.id }).update({ iban: data_bolseiro.iban })

                    //console.log("bolseiro editou o dado com sucesso ")
                    return ResponseHelper.getSuccessResponse(data_pessoa.nome + "actualizado com sucesso", data_pessoa)

                }
                return ResponseHelper.getSuccessResponse("Curso criado com sucesso", base_pessoa)

            } catch (err) {
                //console.log(err.message)
                return ResponseHelper.getErrorResponse("Dados não salvo")
            }



        }
        /**
         * Display a single basepessoa.
         * GET basepessoas/:id
         *
         * @param {object} ctx
         * @param {Request} ctx.request
         * @param {Response} ctx.response
         * @param {View} ctx.view
         */
    async show({ params, request, response }) {
        try {

            const pessoas = await pessoa.query().where({ user_id: params.id }).with('user')
                .with('bolseiro').with('bolseiro.renovacaobolseiro').with('bolseiro.eduInstituicoes').with('bolseiro.eduCurso')
                .with('bolseiro.eduCurso.eduUnidadeOrganica').with('bolseiro.anoFrequencia').first();
            return ResponseHelper.getOnlyDataResponse(pessoas);

        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Dados não encontrados")
        }

    }

    /**
     * Render a form to update an existing basepessoa.
     * GET basepessoas/:id/edit
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async edit({ params, request, response, view }) {}

    /**
     * Update basepessoa details.
     * PUT or PATCH basepessoas/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async update({ params, request, response }) {}



    /**
     * Delete a basepessoa with id.
     * DELETE basepessoas/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async destroy({ params, request, response }) {}
}


module.exports = BasePessoaController
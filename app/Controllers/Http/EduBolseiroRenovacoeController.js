'use strict'
const ResponseHelper = use('App/Helpers/ResponseHelper')

const EduRenovacao = use('App/Models/EduBolseiroRenovacoes')


const EduUnidadeOrganica = use('App/Models/EduUnidadeOrganica');


const pessoa = use('App/Models/BasePessoa')

const bolseiro = use('App/Models/EduBolseiro')
const bolseiroInterno = use('App/Models/EduBolseiroInterno')
const BasePeriodoAvaliacoe = use('App/Models/BasePeriodoAvaliacoe')
const Edubolseiro = use('App/Models/EduBolseiro')

const BaseAnexo = use('App/Models/BaseAnexo')

const BaseLog = use('App/Models/BaseLog')
const Database = use('Database')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with bolseirorenovacoes
 */
class EduBolseiroRenovacoeController {

    async registarLog(user, pagina, accao, estado, ip, pais, detalhes) {
        return await BaseLog.create({
            user: user,
            pagina: pagina,
            accao: accao,
            estado: estado,
            ip: ip,
            pais: pais,
            detalhes: detalhes,
        })
    }


    async index({ request, params, response }) {
        try {

            let paginate = request.all();
            let page = Number(paginate.page ? paginate.page : 1);
            let size = Number(paginate.size ? paginate.size : 10);

            let dada = request.all()
            const bolseirosRenovados = await EduRenovacao.query()
                .with('bolseiro').with('bolseiro.pessoa')


            .with('anexo')
                .with('anexo.itens')
                .with('anexo.itens.tipo_anexo')
                .with('bolseiro.eduInstituicoes')
                .with('bolseiro.eduCurso')
                .with('bolseiro.eduCurso.instituicao')
                .with('bolseiro.eduCurso.eduUnidadeOrganica')
                .with('bolseiro.eduCurso.eduUnidadeOrganica.provincia')
                .with('bolseiro.anoFrequencia')
                .with('bolseiro.edutipobolseiro')
                .with('bolseiro.basenivelacademico')
                .with('bolseiro.basegrauacademico')
                .with('bolseiro.bolseiroRenovacao.estadoRenovacao')

            .paginate(page, size);

            return ResponseHelper.getOnlyDataResponse(bolseirosRenovados);

        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Dados não encontrados")
        }
    }



    async bolseirorenovacaofiltro({ request, response }) {


        try {
            let paginate = request.all();
            let page = Number(paginate.page ? paginate.page : 1);
            let size = Number(paginate.size ? paginate.size : 10);

            let cursos = []
            let data = request.all()


            const pessoa_find = await pessoa.query()
                .where('ndi', 'like', '' + data.bi_nome + '')
                .orWhere('nome', 'like', '' + data.bi_nome + '')
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

            console.log(data)
            if (data.edu_unidade_organica_id) {
                //-- buscamos todos cursos da Instituição   
                //console.log("filtro por unidade organica....")
                const uo = await EduUnidadeOrganica.query().where({ id: data.edu_unidade_organica_id }).first();
                cursos = Database.from('edu_cursos')
                    .where({ edu_unidade_organica_codigo: uo.codigo })
                    .select('id')
            } else {
                //-- buscamos todos cursos da Instituição  
                //console.log("filtro por instituição....")
                cursos = Database.from('edu_cursos')
                    .where({ edu_instituicao_id: data.edu_instituicoes_id })
                    .select('id')
            }


            const bolseiros_interno = Database.from('edu_bolseiro_internos').whereIn('edu_curso_id', cursos).select('edu_bolseiro_id')

            let bolseirosRenovados_query = EduRenovacao.query()
            let bolseirosRenovados = null
            if (bolseiro_id > 0) {
                if (paginate.renovacao_sgbe) {
                    if (Number(paginate.renovacao_sgbe) == 0)
                        bolseirosRenovados_query.where('edu_bolseiro_id', bolseiro_id).whereNull('renovacao_sgbe')
                    else
                        bolseirosRenovados_query.where('edu_bolseiro_id', bolseiro_id).whereNotNull('renovacao_sgbe')
                } else {
                    bolseirosRenovados_query.where('edu_bolseiro_id', bolseiro_id)
                }
            } else {
                if (paginate.renovacao_sgbe) {
                    if (Number(paginate.renovacao_sgbe) == 0)
                        bolseirosRenovados_query.whereNull('renovacao_sgbe')
                    else
                        bolseirosRenovados_query.whereNotNull('renovacao_sgbe')
                }

                if (paginate.edu_instituicoes_id)
                    bolseirosRenovados_query.whereIn('edu_bolseiro_id', bolseiros_interno)
            }

            bolseirosRenovados = await bolseirosRenovados_query
                .with('bolseiro')
                .with('bolseiro.pessoa')
                .with('anexo')
                .with('anexo.itens')
                .with('anexo.itens.tipo_anexo')
                .with('bolseiro.eduInstituicoes')
                .with('bolseiro.eduCurso')
                .with('bolseiro.eduCurso.instituicao')
                .with('bolseiro.eduCurso.eduUnidadeOrganica')
                .with('bolseiro.eduCurso.eduUnidadeOrganica.provincia')
                .with('bolseiro.anoFrequencia')
                .with('bolseiro.edutipobolseiro')
                .with('bolseiro.basenivelacademico')
                .with('bolseiro.basegrauacademico')
                .with('bolseiro.bolseiroRenovacao.estadoRenovacao')
                .paginate(page, size);

            // //console.log(bolseirosRenovados)

            return ResponseHelper.getOnlyDataResponse(bolseirosRenovados);

        } catch (err) {
            console.log(err.message)
            return ResponseHelper.getErrorResponse("Dados não encontrados")
        }

    }




    async buscarAllRenovacao({ request, response }) {
        try {

            const bolseirosRenovados = await EduRenovacao.query().with('bolseiro').fetch();

            return ResponseHelper.getOnlyDataResponse(bolseirosRenovados);

        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Dados não encontrados")
        }
    }


    async store({ request, response }) {
        try {

            let data = request.only(['id', 'edu_bolseiro_id', 'edu_bolseiro_renovacao_estado_id', 'base_ano_frequencia_id', 'ano_frequencia_anterior_id', 'base_periodo_avaliacao_id', 'edu_ies_renovacao_estado_id', 'edu_inagbe_renovacao_estado_id', 'base_anexo_id']);
            let result = ""
            if (data.id) {
                result = await EduRenovacao.query().where({ id: data.id }).first();
                result.merge(data);
                await result.save();
            } else {
                result = await EduRenovacao.create(data);
            }
            return ResponseHelper.getSuccessResponse("Informação Salva com sucesso", result)
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("A Informação não foi Salva")
        }
    }


    async renovar({ request, response }) {
        try {

            let data = request.only(['id', 'edu_bolseiro_id', 'edu_bolseiro_renovacao_estado_id', 'base_ano_frequencia_id', 'base_periodo_avaliacao_id', 'ano_frequencia_anterior_id']);


            let result = await EduRenovacao.query()
                .where({ edu_bolseiro_id: data.edu_bolseiro_id, base_periodo_avaliacao_id: data.base_periodo_avaliacao_id })
                .with('bolseiro').with('bolseiro.pessoa').first();

            if (result) {
                result.merge(data);
                await result.save();
                await Edubolseiro.query().where({ id: data.edu_bolseiro_id })
                    .update({ base_ano_frequencia_id: data.base_ano_frequencia_id })

                let result_json = result.toJSON()

                //console.log(result_json.bolseiro.pessoa.ndi + " renovação feita com sucesso ...");

                this.registarLog(result_json.bolseiro.pessoa.ndi, "renovacao", "actualizada", '1', "1", "-", "-", " renovacao feita com sucesso");

            } else {
                let bolseiro = await Edubolseiro.query().with('pessoa').where({ id: data.edu_bolseiro_id }).first();
                data.ano_frequencia_anterior_id = bolseiro.base_ano_frequencia_id
                result = await EduRenovacao.create(data);

                await Edubolseiro.query().where({ id: data.edu_bolseiro_id })
                    .update({ base_ano_frequencia_id: data.base_ano_frequencia_id })

                let result_json = bolseiro.toJSON()
                this.registarLog(result_json.pessoa.ndi, "renovacao", "cadastro", '1', "1", "-", "-", " renovacao feita com sucesso");

                //console.log(result_json.pessoa.ndi + " renovação feita com sucesso ...");
            }

            let result_renovacao = await EduRenovacao.query().where({ id: result.id }).with('bolseiro').with('bolseiro.pessoa').first();

            if (result_renovacao) {
                result_renovacao = result_renovacao.toJSON()

                let anexo = await BaseAnexo.query().where({
                    ndi: result_renovacao.bolseiro.pessoa.ndi,
                    base_periodo_avaliacao_id: result_renovacao.base_periodo_avaliacao_id
                }).first()


                if (anexo) {
                    //console.log("actualizar referencia do a anexo do bolseiro....")
                    //console.log(anexo.id)
                    await EduRenovacao.query().where({ id: result.id }).update({ base_anexo_id: anexo.id })
                }
            }

            return ResponseHelper.getSuccessResponse("Informação Salva com sucesso", result)
        } catch (err) {
            //console.log(err.message)
            this.registarLog(result.id, "", "renovacao", 'renovacao_falhou', "1", "-", "-", err.message);

            return ResponseHelper.getErrorResponse("A Informação não foi Salva")
        }
    }


    async renovacaoIes({ request, response }) {
        try {

            let data = request.only(['id', 'edu_bolseiro_id', 'edu_ies_renovacao_estado_id', 'base_ano_frequencia_id', 'base_periodo_avaliacao_id', 'ano_frequencia_anterior_id', 'renovacao_sgbe']);

            const anoAvaliacao = await BasePeriodoAvaliacoe.query().last();


            //console.log(data)
            //console.log(anoAvaliacao.id)
            let result = await EduRenovacao.query().where({ edu_bolseiro_id: data.edu_bolseiro_id, base_periodo_avaliacao_id: anoAvaliacao.id }).first();

            //console.log(result)
            if (result) {
                result.merge(data);
                await result.save();
                //  await Edubolseiro.query().where({ id: data.edu_bolseiro_id }) .update({ base_ano_frequencia_id: data.base_ano_frequencia_id })

            } else {
                let bolseiro = await Edubolseiro.query().where({ id: data.edu_bolseiro_id }).first();
                data.ano_frequencia_anterior_id = bolseiro.base_ano_frequencia_id

                if (data.edu_ies_renovacao_estado_id == 1)
                    data.base_ano_frequencia_id = Number(bolseiro.base_ano_frequencia_id) + 1
                else
                    data.base_ano_frequencia_id = Number(bolseiro.base_ano_frequencia_id)

                data.edu_bolseiro_renovacao_estado_id = 0
                result = await EduRenovacao.create(data);

                await Edubolseiro.query().where({ id: data.edu_bolseiro_id })
                    .update({ base_ano_frequencia_id: data.base_ano_frequencia_id })

            }

            let result_renovacao = await EduRenovacao.query().where({ id: result.id }).with('bolseiro').with('bolseiro.pessoa').first();

            if (result_renovacao) {
                result_renovacao = result_renovacao.toJSON()

                let anexo = await BaseAnexo.query().where({
                    ndi: result_renovacao.bolseiro.pessoa.ndi,
                    base_periodo_avaliacao_id: result_renovacao.base_periodo_avaliacao_id
                }).first()

                if (anexo) {
                    await EduRenovacao.query().where({ id: result.id }).update({ base_anexo_id: anexo.id })
                }


            }

            return ResponseHelper.getSuccessResponse("Informação Salva com sucesso", result)
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("A Informação não foi Salva")
        }
    }


    async renovacaoInagbe({ request, response }) {
        try {

            let data = request.only(['id', 'edu_bolseiro_id', 'edu_inagbe_renovacao_estado_id', 'base_ano_frequencia_id', 'base_periodo_avaliacao_id', 'ano_frequencia_anterior_id']);


            //console.log(data)
            let result = await EduRenovacao.query().where({ edu_bolseiro_id: data.edu_bolseiro_id, base_periodo_avaliacao_id: data.base_periodo_avaliacao_id }).first();

            if (result) {
                result.merge(data);
                await result.save();
                await Edubolseiro.query().where({ id: data.edu_bolseiro_id })
                    .update({ base_ano_frequencia_id: data.base_ano_frequencia_id })

            } else {
                let bolseiro = await Edubolseiro.query().where({ id: data.edu_bolseiro_id }).first();
                data.ano_frequencia_anterior_id = bolseiro.base_ano_frequencia_id
                result = await EduRenovacao.create(data);

                result = await EduRenovacao.create(data);
                await Edubolseiro.query().where({ id: data.edu_bolseiro_id })
                    .update({ base_ano_frequencia_id: data.base_ano_frequencia_id })

            }

            let result_renovacao = await EduRenovacao.query().where({ id: result.id }).with('bolseiro').with('bolseiro.pessoa').first();

            if (result_renovacao) {
                result_renovacao = result_renovacao.toJSON()

                let anexo = await BaseAnexo.query().where({
                    ndi: result_renovacao.bolseiro.pessoa.ndi,
                    base_periodo_avaliacao_id: result_renovacao.base_periodo_avaliacao_id
                }).first()

                if (anexo) {
                    await EduRenovacao.query().where({ id: result.id }).update({ base_anexo_id: anexo.id })
                }


            }

            return ResponseHelper.getSuccessResponse("Informação Salva com sucesso", result)
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("A Informação não foi Salva")
        }
    }


    /**
     * Display a single bolseirorenovacoe.
     * GET bolseirorenovacoes/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async show({ params, request, response, view }) {

        try {

            const buscarRenovacaoPeloIdDoBolseiro = await EduRenovacao.query().where({ edu_bolseiro_id: params.id })
                .with('bolseiro').with('anoFrequencia').with('periodoAvaliacao').with('estadoRenovacao').last();

            return ResponseHelper.getOnlyDataResponse(buscarRenovacaoPeloIdDoBolseiro);

        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Dados não encontrados")
        }
    }


    async update({ params, request, response }) {}



    async destroy({ params, request, response }) {}



    async buscarRenovacaoAnoCorrente({ params, request, response }) {

        try {



            const anoAvaliacao = await BasePeriodoAvaliacoe.query().last();

            //console.log("buscar bolseiro.. " + params.user_id)
            //console.log(params.user_id)
            //console.log(anoAvaliacao.id)
            //console.log("--------------------------------------------")
            let renovacao = ""
            renovacao = await Database.from('edu_bolseiro_renovacoes')

            .innerJoin('edu_bolseiros', 'edu_bolseiro_renovacoes.edu_bolseiro_id', 'edu_bolseiros.id')
                .innerJoin('base_pessoas', 'edu_bolseiros.base_pessoa_id', 'base_pessoas.id')
                .innerJoin('users', 'base_pessoas.user_id', 'users.id')

            .innerJoin('edu_cursos', 'edu_bolseiros.id', 'edu_bolseiros.id')
                .innerJoin('edu_instituicoes', 'edu_bolseiros.id', 'edu_bolseiros.id')

            .where("edu_bolseiro_renovacoes.base_periodo_avaliacao_id", anoAvaliacao.id)
                .where("users.id", params.user_id)
                .first()



            //console.log("--------------------------------------------")
            //console.log("renovacao.id")
            return ResponseHelper.getOnlyDataResponse(renovacao);

            const renovacao2 = await EduRenovacao.query()
                .where({ base_periodo_avaliacao_id: anoAvaliacao.id })

            .with('bolseiro.pessoa').with('pessoa.municipioresidencia')
                .with('pessoa.bolseiro')
                .with('pessoa.bolseiro.eduInstituicoes')
                .with('pessoa.bolseiro.eduCurso')
                .with('pessoa.bolseiro.eduCurso.eduUnidadeOrganica')
                .with('pessoa.bolseiro.anoFrequencia')
                .with('pessoa.bolseiro.edutipobolseiro')
                .with('pessoa.bolseiro.basenivelacademico')
                .with('pessoa.bolseiro.basegrauacademico')
                .with('pessoa.bolseiro.eduestadobolsa')
                .with('pessoa.bolseiro.edutipobolsa')
                .with('pessoa.bolseiro.periodoAvaliacao')
                .with('pessoa.bolseiro.baseprovincia')

            .last();


        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Dados não encontrados")
        }
    }
}

module.exports = EduBolseiroRenovacoeController
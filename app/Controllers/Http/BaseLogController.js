'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
/**
 * Resourceful controller for interacting with baselogs
 */

const ResponseHelper = use('App/Helpers/ResponseHelper')


const BaseLogModel = use('App/Models/BaseLog')

const User = use('App/Models/User')
const EduBolsa = use('App/Models/EduBolsa')
const BasePessoa = use('App/Models/BasePessoa')
const EduCandidatura = use('App/Models/EduCandidatura')
const BaseHabilidadeLiteraria = use('App/Models/BaseHabilidadeLiteraria')
const BaseAgregadoFamiliar = use('App/Models/BaseAgregadoFamiliare')

const EduCandidaturaInterna = use('App/Models/EduCandidaturaInterna')
const EduCandidaturaExterna = use('App/Models/EduCandidaturaExterna')


const EduBolseiro = use('App/Models/EduBolseiro')
const EduBolseiroInterno = use('App/Models/EduBolseiroInterno')

const EduBolseiroRenovacao = use('App/Models/EduBolseiroRenovacoes')

const BaseProvincia = use('App/Models/BaseProvincia')

const EduInstituicao = use('App/Models/EduInstituicoes')
const BaseAnexo = use('App/Models/BaseAnexo')
const BaseAnexoItens = use('App/Models/BaseAnexoIten')
const BaseTipoAnexo = use('App/Models/BaseTipoAnexo')



const BaseNivelAcademico = use('App/Models/BaseNivelAcademico')

const Database = use('Database')


class BaseLogController {

    async index({ request, response, view }) {}

    async dasboardAnexos({ request, response, view }) {
        return ResponseHelper.getOnlyDataResponse(await BaseAnexo.getCount())
    }

    async dasboardAnexosItens({ request, response, view }) {
        return ResponseHelper.getOnlyDataResponse(await BaseAnexoItens.getCount())
    }


    async dasboardCandidaturaInterna({ request, response, view }) {
        return ResponseHelper.getOnlyDataResponse(await EduCandidaturaInterna.getCount())
    }

    async dasboardCandidaturaExterna({ request, response, view }) {
        return ResponseHelper.getOnlyDataResponse(await EduCandidaturaExterna.getCount())
    }

    async dasboardUsers({ request, response, view }) {
        return ResponseHelper.getOnlyDataResponse(await User.getCount())
    }
    async dasboard({ request, response, view }) {
        let bolsas = await EduBolsa.all();
        let nivel_academicos = await BaseNivelAcademico.all();
        let jsonObj = [];
        for (let bolsa of bolsas.toJSON()) {
            let data_bolsa = await EduCandidatura.query().where({ 'edu_bolsa_id': bolsa.id }).getCount();

            for (let nivel_academico of nivel_academicos.toJSON()) {
                 let data_nivel_academico = await EduCandidatura.query().where({ 'edu_bolsa_id': bolsa.id, 'base_nivel_academico_id': nivel_academico.id }).getCount();

                jsonObj.push({
                    bolsa_qtd: data_bolsa,
                    bolsa_nome: bolsa.codigo,
                    nive_academico_qtd: data_nivel_academico,
                    nive_academico_nome: nivel_academico.nome,
                });
            }
        }
        //  // //console.log(jsonObj)
        return ResponseHelper.getOnlyDataResponse(jsonObj)
    }

    async dasboardCandidaturaNivel({ request, response, view }) {
        // let bolsas = await EduBolsa.all();
        let nivel_academicos = await BaseNivelAcademico.query()
            .where('id', '>', 1)
            .fetch();
        let jsonObj = [];
        //  for (let bolsa of bolsas.toJSON()) {
        let data_bolsa = await EduCandidatura.query().where({ 'edu_bolsa_id': 2021 }).getCount();

        for (let nivel_academico of nivel_academicos.toJSON()) {
            let data_nivel_academico = await EduCandidatura.query().where({ 'edu_bolsa_id': 2021, 'base_nivel_formacao_id': nivel_academico.id }).getCount();

            jsonObj.push({
                bolsa_qtd: data_bolsa,
                bolsa_nome: "Bolsa Interna ",
                nive_academico_qtd: data_nivel_academico,
                nive_academico_nome: nivel_academico.nome,
            });
        }
        //   }
        //  // //console.log(jsonObj)
        return ResponseHelper.getOnlyDataResponse(jsonObj)
    }


    async dasboardCandidaturaProvincia({ request, response, view }) {
        // let bolsas = await EduBolsa.all();
        let jsonObj = [];
        //  for (let bolsa of bolsas.toJSON()) {
        let provincias = await BaseProvincia.query().where('id', '<', 19).fetch();

        for (let provincia of provincias.toJSON()) {
            let data_provincia = await EduCandidatura.query().where({ 'edu_bolsa_id': 2021, 'base_provincia_formacao_id': provincia.id }).getCount();

            let data_provincia_garaduacao = await EduCandidatura.query()
                .where('base_nivel_formacao_id', '<', 4)
                .where({ 'edu_bolsa_id': 2021, 'base_provincia_formacao_id': provincia.id }).getCount();

            let data_provincia_posgraduacao = await EduCandidatura.query()
                .where('base_nivel_formacao_id', '>', 3)
                .where({ 'edu_bolsa_id': 2021, 'base_provincia_formacao_id': provincia.id }).getCount();

            jsonObj.push({
                //   bolsa_qtd: data_bolsa,
                bolsa_nome: "Bolsa Interna ",
                provincia_nome: provincia.nome,
                provincia_qtd: data_provincia,
                provincia_qtdg: data_provincia_garaduacao,
                provincia_qtdpg: data_provincia_posgraduacao,

                provincia_beig: provincia.bolsa_graduacao,
                provincia_beipg: provincia.bolsa_posgraduacao,
            });
        }
        //   }
        //  // //console.log(jsonObj)
        return ResponseHelper.getOnlyDataResponse(jsonObj)
    }



    async dasboardCandidaturaProvinciaIes({ request, response, view }) {
        // let bolsas = await EduBolsa.all();
        let jsonObj = [];
        //  for (let bolsa of bolsas.toJSON()) {
        let provincias = await BaseProvincia.query().where('id', '<', 19).fetch();

        for (let provincia of provincias.toJSON()) {
            let data_provincia = await EduCandidatura.query().where({ 'edu_bolsa_id': 2021, 'base_provincia_formacao_id': provincia.id }).getCount();

            //   let instituicoes = await EduInstituicao.query().where({ base_provincia_id: provincia.id }).fetch()

            let unidade_organicas = Database.from('edu_unidade_organicas')
                .where({ base_provincia_id: provincia.id })
                .select('codigo')

            let instituicoes = null
            let cursos_unidade_organica_instituicao_id = null
            if (unidade_organicas) {

                //  // //console.log(unidade_organicas)
                cursos_unidade_organica_instituicao_id = Database.from('edu_cursos')
                    //  .where({ edu_instituicao_id: params.id })
                    .whereIn('edu_unidade_organica_codigo', unidade_organicas).select('edu_instituicao_id')

                instituicoes = await EduInstituicao.query()
                    .whereIn('id', cursos_unidade_organica_instituicao_id).fetch()

            }


            let ies = instituicoes.toJSON()

            for (let instituicao of ies) {

                let data_provincia_garaduacao = await EduCandidatura.query()
                    .where('base_nivel_formacao_id', '<', 4)
                    //    .whereIn('edu_curso_id', cursos_unidade_organica_instituicao_id)
                    .where({ 'edu_bolsa_id': 2021, 'base_provincia_formacao_id': provincia.id, 'edu_instituicao_id': instituicao.id })
                    .getCount();

                let data_provincia_posgraduacao = await EduCandidatura.query()
                    .where('base_nivel_formacao_id', '>', 3)
                    //     .whereIn('edu_curso_id', cursos_unidade_organica_instituicao_id)
                    .where({ 'edu_bolsa_id': 2021, 'base_provincia_formacao_id': provincia.id, 'edu_instituicao_id': instituicao.id })
                    .getCount();


                let data_provincia_garaduacao_aprovado = await EduCandidatura.query()
                    .where('base_nivel_formacao_id', '<', 4)
                    .where('base_estado_id', 3)
                    //  .whereIn('edu_curso_id', cursos_unidade_organica_instituicao_id)
                    .where({ 'edu_bolsa_id': 2021, 'base_provincia_formacao_id': provincia.id, 'edu_instituicao_id': instituicao.id })
                    .getCount();

                let data_provincia_posgraduacao_aprovado = await EduCandidatura.query()
                    .where('base_nivel_formacao_id', '>', 3)
                    .where('base_estado_id', 3)
                    //    .whereIn('edu_curso_id', cursos_unidade_organica_instituicao_id)
                    .where({ 'edu_bolsa_id': 2021, 'base_provincia_formacao_id': provincia.id, 'edu_instituicao_id': instituicao.id })
                    .getCount();





                jsonObj.push({
                    //   bolsa_qtd: data_bolsa,
                    bolsa_nome: "Bolsa Interna ",
                    provincia_nome: provincia.nome,
                    provincia_ies: instituicao.nome,
                    provincia_qtd: data_provincia,
                    provincia_qtdg: data_provincia_garaduacao,
                    provincia_qtdpg: data_provincia_posgraduacao,
                    provincia_beig: provincia.bolsa_graduacao,
                    provincia_beipg: provincia.bolsa_posgraduacao,
                    provincia_ies_aprovado_beig: data_provincia_garaduacao_aprovado,
                    provincia_ies_aprovado_beipg: data_provincia_posgraduacao_aprovado

                });
            }
        }
        //   }
        //  // //console.log(jsonObj)
        return ResponseHelper.getOnlyDataResponse(jsonObj)
    }



    async dasboardCandidaturaInstituicao({ request, response, view }) {
        // let bolsas = await EduBolsa.all();
        let jsonObj = [];
        //  for (let bolsa of bolsas.toJSON()) {
        let instituicoes = await EduInstituicao.query().fetch();

        for (let instituicao of instituicoes.toJSON()) {



            let bolseiros_ies = Database.from('edu_bolseiros').where({ edu_instituicao_id: instituicao.id }).select('id')


            let bolseiros = await EduBolseiro.query().where({ 'edu_instituicao_id': instituicao.id }).getCount();
            let bolseiros_renovados = await EduBolseiroRenovacao.query().whereIn('edu_bolseiro_id', bolseiros_ies).getCount();
            let bolseiros_renovados_ies = await EduBolseiroRenovacao.query().whereNotNull('edu_ies_renovacao_estado_id').whereIn('edu_bolseiro_id', bolseiros_ies).getCount();
            let bolseiros_renovados_inagbe = await EduBolseiroRenovacao.query().whereNotNull('edu_inagbe_renovacao_estado_id').whereIn('edu_bolseiro_id', bolseiros_ies).getCount();

            jsonObj.push({
                //   bolsa_qtd: data_bolsa,
                instituicao_nome: instituicao.nome,
                instituicao_bolseiros: bolseiros,
                instituicao_bolseiros_renovados: bolseiros_renovados,
                instituicao_bolseiros_renovados_ies: bolseiros_renovados_ies,
                instituicao_bolseiros_renovados_inagbe: bolseiros_renovados_inagbe,
            });
        }
        //   }
        //  // //console.log(jsonObj)
        return ResponseHelper.getOnlyDataResponse(jsonObj)
    }








    async dasboardBolseiroRenovacaoInstituicao({ request, response, view }) {
        // let bolsas = await EduBolsa.all();
        let jsonObj = [];
        //  for (let bolsa of bolsas.toJSON()) {
        let instituicoes = await EduInstituicao.query().fetch();

        for (let instituicao of instituicoes.toJSON()) {



            let bolseiros_ies = Database.from('edu_bolseiros').where({ edu_instituicao_id: instituicao.id }).select('id')


            let bolseiros = await EduBolseiro.query().where({ 'edu_instituicao_id': instituicao.id }).getCount();
            let bolseiros_renovados = await EduBolseiroRenovacao.query().whereIn('edu_bolseiro_id', bolseiros_ies).getCount();
            let bolseiros_renovados_ies = await EduBolseiroRenovacao.query().whereNotNull('edu_ies_renovacao_estado_id').whereIn('edu_bolseiro_id', bolseiros_ies).getCount();
            let bolseiros_renovados_inagbe = await EduBolseiroRenovacao.query().whereNotNull('edu_inagbe_renovacao_estado_id').whereIn('edu_bolseiro_id', bolseiros_ies).getCount();

            jsonObj.push({
                //   bolsa_qtd: data_bolsa,
                instituicao_nome: instituicao.nome,
                instituicao_bolseiros: bolseiros,
                instituicao_bolseiros_renovados: bolseiros_renovados,
                instituicao_bolseiros_renovados_ies: bolseiros_renovados_ies,
                instituicao_bolseiros_renovados_inagbe: bolseiros_renovados_inagbe,
            });
        }
        //   }
        //  // //console.log(jsonObj)
        return ResponseHelper.getOnlyDataResponse(jsonObj)
    }


    async registarLog(email, user, pagina, accao, estado, ip, pais, detalhes) {
        return await BaseLogModel.create({
            email: email,
            user: user,
            pagina: pagina,
            accao: accao,
            estado: estado,
            ip: ip,
            pais: pais,
            detalhes: detalhes,
        })
    }

    async estatisticacandidatura({ request, params, response }) {

        try {

            const data = request.all();
            const provincia = await BaseProvincia.query().where({ id: params.provincia }).first()
            let estatistica = {

                provincia: provincia.nome,
                vagas_graduacao: provincia.bolsa_graduacao,
                vagas_posgraduacao: provincia.bolsa_posgraduacao,
                total_vagas: provincia.bolsa_graduacao + provincia.bolsa_posgraduacao,
                total_candidatos: 0,
                candidatos_curso_prioritario: 0,
                candidatos_curso_nao_prioritario: 0,
                candidatos_carenciados: 0,


                total_bolsas: 0,
                bolsas_curso_prioritario: 0,
                bolsas_curso_nao_prioritario: 0,
                bolsas_curso_nao_prioritario: 0,
                bolsas_carenciados: 0,

                bolsas_graduacao: 0,
                bolsas_posgraduacao: 0,
                aprovados: 0,
                rejeitados: 0,
                validados: 0,
                pendentes: 0,
                iniciados: 0,
                raking: 0,
                noraking: 0
            }

            let subquery_institucao_provincias
            if (params.provincia)
                subquery_institucao_provincias = Database.from('edu_instituicoes').where({ base_provincia_id: params.provincia }).select('id')

            let query_candidatura_interna = Database.from('edu_candidatura_internas')
            let query_candidatura_interna_iniciado = Database.from('edu_candidatura_internas')
            let query_candidatura_interna_validado = Database.from('edu_candidatura_internas')
            let query_candidatura_interna_pendente = Database.from('edu_candidatura_internas')
            let query_candidatura_interna_aprovado = Database.from('edu_candidatura_internas')
            let query_candidatura_interna_rejeitado = Database.from('edu_candidatura_internas')

            if (data.instituicao) {
                query_candidatura_interna.where('edu_instituicao_id', data.instituicao)
                query_candidatura_interna_iniciado.where('edu_instituicao_id', data.instituicao)
                query_candidatura_interna_validado.where('edu_instituicao_id', data.instituicao)
                query_candidatura_interna_pendente.where('edu_instituicao_id', data.instituicao)
                query_candidatura_interna_aprovado.where('edu_instituicao_id', data.instituicao)
                query_candidatura_interna_rejeitado.where('edu_instituicao_id', data.instituicao)


            }

            //   if (data.carenciado)
            //     query_candidatura_interna.where('carenciado', data.carenciado)

            if (subquery_institucao_provincias) {
                query_candidatura_interna.whereIn('edu_instituicao_id', subquery_institucao_provincias)
                query_candidatura_interna_iniciado.whereIn('edu_instituicao_id', subquery_institucao_provincias)
                query_candidatura_interna_validado.whereIn('edu_instituicao_id', subquery_institucao_provincias)
                query_candidatura_interna_pendente.whereIn('edu_instituicao_id', subquery_institucao_provincias)
                query_candidatura_interna_aprovado.whereIn('edu_instituicao_id', subquery_institucao_provincias)
                query_candidatura_interna_rejeitado.whereIn('edu_instituicao_id', subquery_institucao_provincias)


            }

            query_candidatura_interna.select('edu_candidatura_id')

            let query_candidatura = EduCandidatura.query()
            let query_candidatura_iniciado = EduCandidatura.query()
            let query_candidatura_validado = EduCandidatura.query()
            let query_candidatura_pendente = EduCandidatura.query()
            let query_candidatura_aprovado = EduCandidatura.query()
            let query_candidatura_rejeitado = EduCandidatura.query()

            let query_candidatura_raking = EduCandidatura.query()

            let query_candidatura_noraking = EduCandidatura.query()


            if (data.tipoDeBolsa) {
                query_candidatura.where('edu_bolsa_id', params.bolsa)
                query_candidatura_iniciado.where('edu_bolsa_id', params.bolsa)
                query_candidatura_validado.where('edu_bolsa_id', params.bolsa)
                query_candidatura_pendente.where('edu_bolsa_id', params.bolsa)
                query_candidatura_aprovado.where('edu_bolsa_id', params.bolsa)
                query_candidatura_rejeitado.where('edu_bolsa_id', params.bolsa)


                query_candidatura_raking.where('edu_bolsa_id', params.bolsa)

                query_candidatura_noraking.where('edu_bolsa_id', params.bolsa)
            }




            if (query_candidatura_interna) {
                query_candidatura.whereIn('id', query_candidatura_interna)
                query_candidatura_iniciado.whereIn('id', query_candidatura_interna)
                query_candidatura_validado.whereIn('id', query_candidatura_interna)
                query_candidatura_aprovado.whereIn('id', query_candidatura_interna)
                query_candidatura_pendente.whereIn('id', query_candidatura_interna)
                query_candidatura_rejeitado.whereIn('id', query_candidatura_interna)

                query_candidatura_raking.whereIn('id', query_candidatura_interna)

                query_candidatura_noraking.whereIn('id', query_candidatura_interna)

            }

            //  query_candidatura_aprovado.where('edu_estado_id', '3')
            //  let candidatos_aprovados = await query_candidatura_aprovado.getCount()

            estatistica.total_candidatos = await query_candidatura.getCount()


            estatistica.iniciados = await query_candidatura_iniciado.where('edu_estado_id', '1').getCount()
            estatistica.validados = await query_candidatura_validado.where('edu_estado_id', '2').getCount()
            estatistica.aprovados = await query_candidatura_aprovado.where('edu_estado_id', '3').getCount()
            estatistica.rejeitados = await query_candidatura_rejeitado.where('edu_estado_id', '4').getCount()
            estatistica.pendentes = await query_candidatura_pendente.where('edu_estado_id', '5').getCount()

            estatistica.raking = await query_candidatura_raking.whereNotNull('classificacao').whereNot({ classificacao: 'NaN' }).getCount()

            //  estatistica.noraking = await query_candidatura_noraking. where({classificacao: 'NaN'}) . orWhereNull('classificacao').getCount()
            estatistica.noraking = await query_candidatura_noraking.where({ classificacao: 'NaN' }).getCount()



            return ResponseHelper.getOnlyDataResponse(estatistica)

        } catch (err) {
            // //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao listar as Candidaturas desta bolsa")
        }

    }

    async estatisticacandidaturainterna({ request, params, response }) {

        try {

            const data = request.all();
            const provincia = await BaseProvincia.query().where({ id: params.provincia }).first()
            let estatistica = {

                provincia: provincia.nome,
                vagas_graduacao: provincia.bolsa_graduacao,
                vagas_posgraduacao: provincia.bolsa_posgraduacao,
                total_vagas: provincia.bolsa_graduacao + provincia.bolsa_posgraduacao,
                total_candidatos: 0,
                candidatos_curso_prioritario: 0,
                candidatos_curso_nao_prioritario: 0,
                candidatos_carenciados: 0,


                total_bolsas: 0,
                bolsas_curso_prioritario: 0,
                bolsas_curso_nao_prioritario: 0,
                bolsas_curso_nao_prioritario: 0,
                bolsas_carenciados: 0,

                bolsas_graduacao: 0,
                bolsas_posgraduacao: 0,
                aprovados: 0,
                rejeitados: 0,
                validados: 0,
                pendentes: 0,
                iniciados: 0,
                raking: 0,
                noraking: 0
            }

            let subquery_institucao_provincias
            if (params.provincia)
                subquery_institucao_provincias = Database.from('edu_instituicoes').where({ base_provincia_id: params.provincia }).select('id')

            let query_candidatura_interna = Database.from('edu_candidaturas')
            let query_candidatura_interna_iniciado = Database.from('edu_candidaturas')
            let query_candidatura_interna_validado = Database.from('edu_candidaturas')
            let query_candidatura_interna_pendente = Database.from('edu_candidaturas')
            let query_candidatura_interna_aprovado = Database.from('edu_candidaturas')
            let query_candidatura_interna_rejeitado = Database.from('edu_candidaturas')

            if (data.instituicao) {
                query_candidatura_interna.where('edu_instituicao_id', data.instituicao)
                query_candidatura_interna_iniciado.where('edu_instituicao_id', data.instituicao)
                query_candidatura_interna_validado.where('edu_instituicao_id', data.instituicao)
                query_candidatura_interna_pendente.where('edu_instituicao_id', data.instituicao)
                query_candidatura_interna_aprovado.where('edu_instituicao_id', data.instituicao)
                query_candidatura_interna_rejeitado.where('edu_instituicao_id', data.instituicao)


            }

            //   if (data.carenciado)
            //     query_candidatura_interna.where('carenciado', data.carenciado)

            if (subquery_institucao_provincias) {

                let subquery_uo_provincias = Database.from('edu_unidade_organicas').where({ base_provincia_id: params.provincia }).select('codigo')

                let subquery_curso_uo = Database.from('edu_cursos').whereIn('edu_unidade_organica_codigo', subquery_uo_provincias).select('id')

                //   query_candidatura.whereIn('edu_instituicao_id', subquery_institucao_provincias)

                //  query_candidatura.whereIn('edu_curso_id', subquery_curso_uo)

                query_candidatura_interna.whereIn('edu_curso_id', subquery_curso_uo)
                query_candidatura_interna_iniciado.whereIn('edu_curso_id', subquery_curso_uo)
                query_candidatura_interna_validado.whereIn('edu_curso_id', subquery_curso_uo)
                query_candidatura_interna_pendente.whereIn('edu_curso_id', subquery_curso_uo)
                query_candidatura_interna_aprovado.whereIn('edu_curso_id', subquery_curso_uo)
                query_candidatura_interna_rejeitado.whereIn('edu_curso_id', subquery_curso_uo)


            }

            query_candidatura_interna.select('id')

            let query_candidatura = EduCandidatura.query()
            let query_candidatura_iniciado = EduCandidatura.query()
            let query_candidatura_validado = EduCandidatura.query()
            let query_candidatura_pendente = EduCandidatura.query()
            let query_candidatura_aprovado = EduCandidatura.query()
            let query_candidatura_rejeitado = EduCandidatura.query()

            let query_candidatura_raking = EduCandidatura.query()

            let query_candidatura_noraking = EduCandidatura.query()


            if (data.tipoDeBolsa) {
                query_candidatura.where('edu_bolsa_id', params.bolsa)
                query_candidatura_iniciado.where('edu_bolsa_id', params.bolsa)
                query_candidatura_validado.where('edu_bolsa_id', params.bolsa)
                query_candidatura_pendente.where('edu_bolsa_id', params.bolsa)
                query_candidatura_aprovado.where('edu_bolsa_id', params.bolsa)
                query_candidatura_rejeitado.where('edu_bolsa_id', params.bolsa)


                query_candidatura_raking.where('edu_bolsa_id', params.bolsa)

                query_candidatura_noraking.where('edu_bolsa_id', params.bolsa)
            }




            if (query_candidatura_interna) {
                query_candidatura.whereIn('id', query_candidatura_interna)
                query_candidatura_iniciado.whereIn('id', query_candidatura_interna)
                query_candidatura_validado.whereIn('id', query_candidatura_interna)
                query_candidatura_aprovado.whereIn('id', query_candidatura_interna)
                query_candidatura_pendente.whereIn('id', query_candidatura_interna)
                query_candidatura_rejeitado.whereIn('id', query_candidatura_interna)

                query_candidatura_raking.whereIn('id', query_candidatura_interna)

                query_candidatura_noraking.whereIn('id', query_candidatura_interna)

            }

            //  query_candidatura_aprovado.where('edu_estado_id', '3')
            //  let candidatos_aprovados = await query_candidatura_aprovado.getCount()

            estatistica.total_candidatos = await query_candidatura.getCount()


            estatistica.iniciados = await query_candidatura_iniciado.where('base_estado_id', '1').getCount()
            estatistica.validados = await query_candidatura_validado.where('base_estado_id', '2').getCount()
            estatistica.aprovados = await query_candidatura_aprovado.where('base_estado_id', '3').getCount()
            estatistica.rejeitados = await query_candidatura_rejeitado.where('base_estado_id', '4').getCount()
            estatistica.pendentes = await query_candidatura_pendente.where('base_estado_id', '5').getCount()

            estatistica.raking = await query_candidatura_raking.whereNotNull('classificacao').whereNot({ classificacao: 'NaN' }).getCount()

            //  estatistica.noraking = await query_candidatura_noraking. where({classificacao: 'NaN'}) . orWhereNull('classificacao').getCount()
            estatistica.noraking = await query_candidatura_noraking.where({ classificacao: 'NaN' }).getCount()




            return ResponseHelper.getOnlyDataResponse(estatistica)

        } catch (err) {
            // //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao listar as Candidaturas desta bolsa")
        }

    }



    async candidatoEstados(query_candidatura, id) {
        let result = await query_candidatura.where('edu_estado_id', 2).getCount()

        return result.toJSON()
    }

    /*
  async teste1(codigo) {
    try {
      let candidato = await EduCandidatura.query()
        .with('pessoa')
        //.where({ base_pessoa_id: codigo })
        
        .with('candidatura_interna').with('estado').with('nivelacademico')
        .limit(2).first()

      let cand = candidato.toJSON()

      // //console.log(cand.pessoa.nome + " ;  " + cand.classificacao + " ; " + cand.edu_estado_id)

      // // //console.log("UPDATE edu_candidaturas SET classificacao = "+data.classificacao+" WHERE  id = "+candidato.id );

      //    c= c+""
      // // //console.log(c);
      //  if (c < 64)
      // await EduCandidatura.query().where({ id: candidato.id }).update({ classificacao: c })

      //  // //console.log(data.classificacao);
    } catch (err) {
      // //console.log(err.message)
      // return ResponseHelper.getErrorResponse("Erro ao listar as Candidaturas desta bolsa")
    }
  }

  async teste2(codigo) {
    try {

      let candidato = await EduCandidatura.query()
       // .where({ base_pessoa_id: codigo })
        .with('pessoa')
        .with('candidatura_interna')
        .with('candidatura_interna.instituicao.provincia')
        .with('estado')
        .with('bolsa')
        .with('nivelacademico')
        .limit(1000)
        .fetch()

      let data = candidato.toJSON()
      // //console.log(data.candidatura_interna.id)


      //return await EduCandidaturaInterna.query().where({ id: candidato.candidatura_interna.id }).update({ carenciado: 5 })
      //return ResponseHelper.getOnlyDataResponse(result)

    } catch (err) {
      // //console.log(err.message)
      //  return ResponseHelper.getErrorResponse("Erro ao listar as Candidaturas desta bolsa")
    }
  }
*/
    async teste({ request, response }) {


        try {
            let dados_bi = [



            ]

            let result = []

            let data = request.all();
            let page = Number(data.page ? data.page : 1);
            let size = Number(data.size ? data.tableSize : 10);

            const candidato = await EduCandidatura.query()
                //      .where('nome', 'like', '%' + data.nome_bi + '%')
                //      .orWhere('ndi', 'like', '%' + data.nome_bi + '%')

            // .where('base_estado_id', '3')

            //  .where('ndi', 'like', '%' + dado + "" + '%') .first();

            //     .where('carenciado', null)
            .whereIn('base_estado_id', [3])
                .whereIn('ndi', dados_bi)

            .with('instituicao').with('curso').with('user')
                .with('cursoFormacaoConcluida')
                .with('instituicaoFormacaoConcluida')
                .with('user')
                .with('validacao')
                .with('anexo')
                .with('anexo.itens')
                .with('anexo.itens.tipo_anexo')
                .with('nivelacademico')
                .with('motivo_exclusao')
                .with('estado')
                .with('BaseNivelFormacaoConcluida')
                .orderBy('nome', 'desc')

            .paginate(1, 300);

            // // //console.log(candidato);

            return ResponseHelper.getOnlyDataResponse(candidato)

        } catch (err) {
            // //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao listar as Candidaturas desta bolsa")
        }

    }

    async testeUnitario({ params, request, response }) {

        try {
            let data = request.all();
            const provincia = await BaseProvincia.query().where({ id: data.provincia }).first()
            let subquery_institucao_provincias
            if (data.provincia)
                subquery_institucao_provincias = Database.from('edu_instituicoes').where({ base_provincia_id: data.provincia }).select('id')
            let query_candidatura_interna = Database.from('edu_candidatura_internas')

            if (data.instituicao)
                query_candidatura_interna.where('edu_instituicao_id', data.instituicao)

            if (data.carenciado)
                query_candidatura_interna.where('carenciado', data.carenciado)

            if (subquery_institucao_provincias)
                query_candidatura_interna.whereIn('edu_instituicao_id', subquery_institucao_provincias)

            query_candidatura_interna.select('edu_candidatura_id')

            let query_candidatura = EduCandidatura.query()
            if (data.tipoDeBolsa)
                query_candidatura.where('edu_bolsa_id', data.tipoDeBolsa)

            let query_candidatura_aprovado = query_candidatura
            query_candidatura_aprovado.where('edu_estado_id', 3)

            query_candidatura.where('edu_estado_id', 2)

            if (query_candidatura_interna)
                query_candidatura.whereIn('id', query_candidatura_interna)

            if (data.nivel_academico == 2)
                query_candidatura_aprovado.where('base_nivel_academico_id', 2)
            else
                query_candidatura_aprovado.where('base_nivel_academico_id', '>', 2)

            const candidatos_aprovados = await query_candidatura_aprovado.getCount()

            // //console.log("aprovados " + candidatos_aprovados + "quotas graduação " + provincia.bolsa_graduacao + "quotas pós-graduação " + provincia.bolsa_posgraduacao)

            if (data.nivel_academico == 2) {
                if (candidatos_aprovados < provincia.bolsa_graduacao)
                    await EduCandidatura.query().where({ id: data.candidato }).update({ edu_estado_id: 3 })
            } else {
                return ResponseHelper.getErrorResponse("numero de vagas esgotada", null)
            }

            if (data.nivel_academico > 2) {
                if (candidatos_aprovados < provincia.bolsa_posgraduacao)
                    await EduCandidatura.query().where({ id: data.candidato }).update({ edu_estado_id: 3 })

            } else {
                return ResponseHelper.getErrorResponse("numero de vagas esgotada", null)
            }

        } catch (err) {
            // //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro na actualização da candidatura")
        }
    }

}

module.exports = BaseLogController
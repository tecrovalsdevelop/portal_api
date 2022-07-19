'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with educandidaturainternas
 */


const EduCandidatura = use('App/Models/EduCandidatura')
const EduCandidaturaInterna = use('App/Models/EduCandidaturaInterna')

const EduBolsa = use('App/Models/EduBolsa')
const User = use('App/Models/User')
const BasePessoa = use('App/Models/BasePessoa')
const ResponseHelper = use('App/Helpers/ResponseHelper')
const GeneralConstants = use('App/Constants/GeneralConstants')
const PdfPrinter = require('pdfmake');
const Helpers = use('Helpers');
const fs = require('fs');
const path = require('path');
const moment = require('moment');

const requestFields = ['base_pessoa_id', 'edu_bolsa_id', 'base_anexo_id'];
const requestFieldsCandidatura = [
    'ano_conclusao', 'ano_ingresso', 'banco', 'base_ano_frequencia_id',
    'base_estado_civil_id', 'base_genero_id', 'base_municipio_id', 'base_municipio_residencia_id', 'base_nivel_formacao_concluida_id',
    'base_nivel_formacao_id', 'base_pais_formacao_concluida_id', 'base_pais_formacao_id',
    'base_pais_residencia_id', 'base_provincia_formacao_concluida_id', 'base_provincia_formacao_id', 'base_provincia_id',
    'base_provincia_residencia_id', 'created_at', 'data_emissao', 'data_expiracao', 'data_nascimento', 'edu_curso_concluido_id',
    'edu_curso_id', 'edu_instituicao_concluida_id', 'edu_instituicao_id', 'endereco', 'estado', 'iban', 'ingresso',
    'mae', 'media', 'ndi', 'nome', 'numero_conta', 'numero_processo_seq', 'pai', 'telefone_alternativo', 'telefone_principal',
    'user_id',
    'docente', 'deficiente', 'carenciado', 'filho_antigo_combatente',

    'edu_bolsa_id', 'base_anexo_id'
];
const Database = use('Database')
class EduCandidaturaInternaController {
    /**
     * Show a list of all educandidaturainternas.
     * GET educandidaturainternas
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

            const candidatura = await EduCandidaturaInterna.query()
                .with('instituicao')
                .with('curso')
                .with('candidatura.bolsa')
                .with('candidatura.pessoa.municipio.provincia')
                .with('candidatura.pessoa.municipio_residencia.provincia')
                .with('candidatura.pessoa.contactos')
                .with('candidatura.pessoa.formacoes.instituicao.provincia')
                .with('candidatura.pessoa.formacoes.curso')
                .with('candidatura.pessoa.anexo.itens.tipo_anexo')
                .paginate(page, size)

            return ResponseHelper.getOnlyDataResponse(candidatura)
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao listar Candidaturas Interna")
        }
    }


    async candidaturaslista({ request, response, view }) {
        try {

            const candidatura = await EduCandidaturaInterna.query()
                .with('instituicao')
                .with('curso')
                .with('candidatura.bolsa')
                .with('candidatura.pessoa.municipio.provincia')
                .with('candidatura.pessoa.municipio_residencia.provincia')
                .with('candidatura.pessoa.contactos')
                .with('candidatura.pessoa.formacoes.instituicao.provincia')
                .with('candidatura.pessoa.formacoes.curso')
                .with('candidatura.pessoa.anexo.itens.tipo_anexo')
                .fetch();

            return ResponseHelper.getOnlyDataResponse(candidatura)
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao listar Candidaturas Interna")
        }
    }



    async salvarCandidatura({ request, response }) {
        try {
            // let request_candidatura = request.all();
            let request_candidatura = request.only(requestFieldsCandidatura);



            //console.log("salvar candidatura .........." + request_candidatura.nome)

            let candidato = null
            let matricula_id = 0;
            let message = ""
            let result_candidatura = await EduCandidaturaInterna.query().where({
                user_id: request_candidatura.user_id,
                edu_bolsa_id: request_candidatura.edu_bolsa_id
            }).first();

            if (result_candidatura) {
                result_candidatura.merge(request_candidatura);
                candidato = await result_candidatura.save();
                message = "dados de" + request_candidatura.nome + " actualizado com sucesso"
            } else {

                let candidato_existe = await EduCandidaturaInterna.query().where('ndi', request_candidatura.ndi).with('user').first();

                if (candidato_existe) {

                    let candidato_json = candidato_existe.toJSON()

                    //console.log("Ja Existe uma candidatura associado ao bi " + request_candidatura.ndi + " com email -  " + candidato_json.user.email)

                    return ResponseHelper.getErrorResponse("Ja Existe uma candidatura associado ao bi " + request_candidatura.ndi + " com email - " + candidato_json.user.email)
                }

                let ultimo_estudante = await EduCandidaturaInterna.query().orderBy('id', 'desc').first();

                let ultimo_numero = 0

                if (ultimo_estudante)
                    ultimo_numero = ultimo_estudante.numero_processo_seq


                let proximo_numero = Number(ultimo_numero) + 1
                request_candidatura.numero_processo_seq = proximo_numero



                candidato = await EduCandidaturaInterna.create(request_candidatura);
                matricula_id = candidato.id
                message = request_candidatura.nome + " foi Salvo com sucesso"
            }

            //console.log(message)


            return ResponseHelper.getSuccessResponse(message, candidato)
        } catch (err) {

            //console.log("candidatura não salvo .......... " + request_candidatura.nome)
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Candidatura Não Efectuada")
        }

    }


    async create({ request, response, view }) {}

    async store({ request, response }) {}

    async show({ params, request, response, view }) {

        const candidatura = await EduCandidaturaInterna.query()
            .where({ id: params.id })
            .with('instituicao')
            .with('curso')
            .with('candidatura.bolsa')
            .with('candidatura.pessoa.municipio.provincia')
            .with('candidatura.pessoa.municipio_residencia.provincia')
            .with('candidatura.pessoa.contactos')
            .with('candidatura.pessoa.formacoes.instituicao.provincia')
            .with('candidatura.pessoa.formacoes.curso')
            .with('candidatura.pessoa.anexo.itens.tipo_anexo')
            .fetch();
    }


    async edit({ params, request, response, view }) {}


    async update({ params, request, response }) {}

    async destroy({ params, request, response }) {}




    async indexcandidaturabolsa({ params, request, response }) {
        try {

            return ResponseHelper.getOnlyDataResponse(
                await EduCandidatura.query()
                .where({ edu_bolsa_id: params.bolsa_id, edu_estado_id: params.estado_id })
                .with('pessoa')
                .with('motivo_exclusao')
                .with('nivelacademico')
                .with('candidatura_interna.instituicao')
                .with('candidatura_interna.instituicao.provincia')
                .with('candidatura_interna.curso')
                .with('pessoa.municipio.provincia')
                .with('pessoa.municipio_residencia.provincia')
                .with('pessoa.contactos')
                .with('pessoa.formacoes.instituicao.provincia')
                .with('pessoa.formacoes.curso')
                .with('pessoa.anexo.itens.tipo_anexo')
                .limit(100)
                .fetch())



        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao listar as Candidaturas desta bolsa")
        }
    }

    async getFiltro(data) {


        try {
            const subquery_institucao = Database
                .from('edu_instituicoes')
                .where({ base_provincia_id: data.provincia })
                .select('id')

            let where_instiuicao = ""
            let where_carenciado = ""
            if (data.instituicao)
                where_instiuicao = 'edu_instituicao_id' + "," + data.instituicao

            if (data.carenciado)
                where_carenciado = 'carenciado' + "," + data.carenciado

            const subquery_candidatura_interna = Database
                .from('edu_candidatura_internas')
                // .where({ where_carenciado })
                // .where({ where_instiuicao })
                .whereIn('edu_instituicao_id', subquery_institucao)
                .select('edu_candidatura_id')

            //console.log('subquery_candidatura_interna')

            return await subquery_candidatura_interna
                // return ResponseHelper.getOnlyDataResponse(candidatura)

        } catch (err) {
            return null
        }
    }

    async indexcandidaturabolsafiltro({ request, params, response }) {

        try {

            const data = request.all();
            //console.log(data)
            //   let subquery_candidatura_interna = await this.getFiltro(data);
            let subquery_institucao_provincias
            if (data.provincia)
                subquery_institucao_provincias = Database
                .from('edu_instituicoes')
                .where({ base_provincia_id: data.provincia })
                .select('id')
            let query_candidatura_interna = Database.from('edu_candidatura_internas')

            // .where({ carenciado: data.carenciado })
            // .where({ edu_instituicao_id: data.instituicao })
            //    .whereIn('edu_instituicao_id', subquery_institucao_provincias)
            //    .select('edu_candidatura_id')

            //  let query_candidatura_interna = EduCandidaturaInterna.query()
            if (data.instituicao)
                query_candidatura_interna.where('edu_instituicao_id', data.instituicao)

            if (data.carenciado)
                query_candidatura_interna.where('carenciado', data.carenciado)

            if (subquery_institucao_provincias)
                query_candidatura_interna.whereIn('edu_instituicao_id', subquery_institucao_provincias)


            query_candidatura_interna.select('edu_candidatura_id')

            // //console.log(subquery_candidatura_interna)


            let query_candidatura = EduCandidatura.query()
            if (data.tipoDeBolsa)
                query_candidatura.where('edu_bolsa_id', data.tipoDeBolsa)
            if (data.estadoPesquisa)
                query_candidatura.where('edu_estado_id', data.estadoPesquisa)

            if (data.nivel_academico) {
                if (data.nivel_academico == 2) {
                    query_candidatura.where('base_nivel_academico_id', data.nivel_academico)
                } else {

                    query_candidatura.whereIn('base_nivel_academico_id', [3, 4, 5])
                        //  query_candidatura.where('base_nivel_academico_id' ,  data.nivel_academico)
                        //  query_candidatura.where('base_nivel_academico_id' ,   data.nivel_academico)
                }
            }

            if (query_candidatura_interna)
                query_candidatura.whereIn('id', query_candidatura_interna)


            const candidatura = await query_candidatura
                .with('nivelacademico')
                .with('estado')
                .with('motivo_exclusao')
                .with('candidatura_interna')
                .with('candidatura_interna.instituicao')
                .with('candidatura_interna.instituicao.provincia')
                .with('candidatura_interna.curso')
                .with('pessoa.municipio.provincia')
                .with('pessoa.municipio_residencia.provincia')
                .with('pessoa.contactos')
                .with('pessoa.formacoes.instituicao.provincia')
                .with('pessoa.formacoes.curso')
                .with('pessoa.anexo.itens.tipo_anexo')
                .orderBy('classificacao', 'desc')
                .limit(50000)
                .fetch()


            return ResponseHelper.getOnlyDataResponse(candidatura)

        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao listar as Candidaturas desta bolsa")
        }

    }



    async indexcandidaturabolsavalidacao({ params, request, response }) {
        try {


            let consulta = {
                edu_bolsa_id: params.bolsa_id,
                edu_estado_id: params.estado_id,
                user_id: params.user_id
            }
            return ResponseHelper.getOnlyDataResponse(
                await EduCandidatura.query()
                .where(consulta)
                .with('pessoa')
                .with('motivo_exclusao')
                .with('nivelacademico')
                .with('candidatura_interna.instituicao')
                .with('candidatura_interna.instituicao.provincia')
                .with('candidatura_interna.curso')
                .with('pessoa.municipio.provincia')
                .with('pessoa.municipio_residencia.provincia')
                .with('pessoa.contactos')
                .with('pessoa.formacoes.instituicao.provincia')
                .with('pessoa.formacoes.curso')
                .with('pessoa.anexo.itens.tipo_anexo')
                .limit(150)
                .fetch())


            /*
                  const pessoa = await BasePessoa.query()
                    .where('ndi', 'like',   params.bi + '%')
                    .orWhere('nome', 'like', '%' +  params.nome + '%')
                    .with('user').firstOrFail();
      
                    //console.log(pessoa.ndi);
                    
                  if (pessoa) {
                    //console.log(pessoa.ndi);
                    return ResponseHelper.getOnlyDataResponse(
                      await EduCandidatura.query()
                        .where({ base_pessoa_id: pessoa.id, user_id:user_id  })
                        //.or ({nome : pessoa.nome})
                        .with('pessoa')
                        .with('pessoa.user')
                        .with('candidatura_externa.instituicao')
                        .with('candidatura_externa.curso')
                        .with('pessoa.municipio.provincia')
                        .with('pessoa.municipio_residencia.provincia')
                        .with('pessoa.contactos')
                        .with('pessoa.formacoes.instituicao.provincia')
                        .with('pessoa.formacoes.curso')
                        .with('pessoa.anexo.itens.tipo_anexo')
                        .with('motivo_exclusao')
                        .with('estado')
                        .with('bolsa')
                        .with('nivelacademico')
                        .limit(1)
                        .fetch())
                  }
      
                  */

        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao listar as Candidaturas desta bolsa")
        }
    }

    async indexcandidaturabolsaBi({ params, request, response }) {
        try {

            let consulta = {
                    edu_bolsa_id: params.bolsa_id,
                    edu_estado_id: params.estado_id,
                    //    user_id: params.user_id
                }
                ///  //console.log(params);
                // let pessoa = await this.findPessoaByBi(params.bi); // data.pessoa.ndi  

            if (params.bi !== "undefined" && params.bi !== '-') {
                const pessoa = await BasePessoa.query()
                    .where('ndi', 'like', '%' + params.bi + '%')
                    // .where('nome', 'like', '%' + params.bi + '%')
                    .with('user').firstOrFail();
                if (pessoa) {
                    ////console.log("encontrado ")
                    //console.log(pessoa.ndi);
                    let result = await EduCandidatura.query()
                        .where({ base_pessoa_id: pessoa.id })
                        .limit(1)
                        .first()

                    //console.log(result.id);
                    let paginate = request.all();
                    let page = Number(paginate.page ? paginate.page : 1);
                    let size = Number(paginate.size ? paginate.size : 10);

                    const candidatura = await EduCandidaturaInterna.query()
                        .where({ edu_candidatura_id: result.id })
                        .with('instituicao')
                        .with('curso')
                        .with('candidatura.bolsa')
                        .with('candidatura.pessoa.municipio.provincia')
                        .with('candidatura.pessoa.municipio_residencia.provincia')
                        .with('candidatura.pessoa.contactos')
                        .with('candidatura.pessoa.formacoes.instituicao.provincia')
                        .with('candidatura.pessoa.formacoes.curso')
                        .with('candidatura.pessoa.anexo.itens.tipo_anexo')
                        // .paginate(page, size)
                        .fetch()

                    //console.log(candidatura.id);
                    return ResponseHelper.getOnlyDataResponse(candidatura)

                }
            } else {
                //console.log("consulta")
                return ResponseHelper.getOnlyDataResponse(
                    await EduCandidatura.query()
                    .where({ edu_bolsa_id: params.bolsa_id, edu_estado_id: params.estado_id })
                    .with('pessoa')
                    .with('pessoa.user')
                    .with('candidatura_interna.instituicao')
                    .with('candidatura_interna.instituicao.provincia')
                    .with('candidatura_interna.curso')
                    .with('pessoa.municipio.provincia')
                    .with('pessoa.municipio_residencia.provincia')
                    .with('pessoa.contactos')
                    .with('pessoa.formacoes.instituicao.provincia')
                    .with('pessoa.formacoes.curso')
                    .with('pessoa.anexo.itens.tipo_anexo')
                    .with('motivo_exclusao')
                    .with('estado')
                    .with('bolsa')
                    .with('nivelacademico')
                    .limit(2000)
                    .fetch())



            }


        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao listar as Candidaturas desta bolsa")
        }
    }


    async indexcandidaturabolsaBi1({ params, request, response }) {
        try {

            let consulta = {
                    edu_bolsa_id: params.bolsa_id,
                    edu_estado_id: params.estado_id,
                    //    user_id: params.user_id
                }
                //console.log(params);
                // let pessoa = await this.findPessoaByBi(params.bi); // data.pessoa.ndi  

            if (params.bi !== "undefined" && params.bi !== '-') {
                const pessoa = await BasePessoa.query()
                    .where('ndi', 'like', '%' + params.bi + '%')
                    // .where('nome', 'like', '%' + params.bi + '%')
                    .with('user').firstOrFail();
                if (pessoa) {
                    ////console.log("encontrado ")
                    //console.log(pessoa.ndi);
                    let result = await EduCandidatura.query()
                        .where({ base_pessoa_id: pessoa.id })
                        .with('pessoa')
                        .with('pessoa.user')
                        .with('motivo_exclusao')
                        .with('candidatura_interna.instituicao')
                        .with('candidatura_interna.instituicao.provincia')
                        .with('candidatura_interna.curso')
                        .with('pessoa.municipio.provincia')
                        .with('pessoa.municipio_residencia.provincia')
                        .with('pessoa.contactos')
                        .with('pessoa.formacoes.instituicao.provincia')
                        .with('pessoa.formacoes.curso')
                        .with('pessoa.anexo.itens.tipo_anexo')
                        .with('motivo_exclusao')
                        .with('estado')
                        .with('bolsa')
                        .with('nivelacademico')
                        .limit(1000)
                        .first()


                    let paginate = request.all();
                    let page = Number(paginate.page ? paginate.page : 1);
                    let size = Number(paginate.size ? paginate.size : 10);

                    const candidatura = await EduCandidaturaInterna.query()
                        .where({ edu_candidatura_id: result.id })
                        .with('instituicao')
                        .with('curso')
                        .with('candidatura.bolsa')
                        .with('candidatura.pessoa.municipio.provincia')
                        .with('candidatura.pessoa.municipio_residencia.provincia')
                        .with('candidatura.pessoa.contactos')
                        .with('candidatura.pessoa.formacoes.instituicao.provincia')
                        .with('candidatura.pessoa.formacoes.curso')
                        .with('candidatura.pessoa.anexo.itens.tipo_anexo')
                        .paginate(page, size)


                    return ResponseHelper.getOnlyDataResponse(candidatura)

                }
            } else {
                //console.log("consulta")
                return ResponseHelper.getOnlyDataResponse(
                    await EduCandidatura.query()
                    .where({ edu_bolsa_id: params.bolsa_id, edu_estado_id: params.estado_id })
                    .with('pessoa')
                    .with('pessoa.user')
                    .with('candidatura_interna.instituicao')
                    .with('candidatura_interna.instituicao.provincia')
                    .with('candidatura_interna.curso')
                    .with('pessoa.municipio.provincia')
                    .with('pessoa.municipio_residencia.provincia')
                    .with('pessoa.contactos')
                    .with('pessoa.formacoes.instituicao.provincia')
                    .with('pessoa.formacoes.curso')
                    .with('pessoa.anexo.itens.tipo_anexo')
                    .with('motivo_exclusao')
                    .with('estado')
                    .with('bolsa')
                    .with('nivelacademico')
                    .limit(2000)
                    .fetch())



            }


        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao listar as Candidaturas desta bolsa")
        }
    }


    async indexcandidaturabolsavalidacaoBi({ params, request, response }) {
        try {


            let consulta = {
                edu_bolsa_id: params.bolsa_id,
                edu_estado_id: params.estado_id,
                user_id: params.user_id
            }

            //console.log(params);
            // let pessoa = await this.findPessoaByBi(params.bi); // data.pessoa.ndi  

            if (params.bi !== "undefined") {
                const pessoa = await BasePessoa.query()
                    .where('ndi', 'like', '%' + params.bi + '%')
                    // .where('nome', 'like', '%' + params.bi + '%')
                    .with('user').firstOrFail();
                if (pessoa) {

                    ////console.log("encontrado ")
                    //console.log(pessoa.ndi);
                    return ResponseHelper.getOnlyDataResponse(
                        await EduCandidatura.query()
                        .where({ base_pessoa_id: pessoa.id })
                        .where({ user_id: params.user_id })
                        .with('pessoa')
                        .with('pessoa.user')
                        .with('candidatura_interna.instituicao')
                        .with('candidatura_interna.instituicao.provincia')
                        .with('candidatura_interna.curso')
                        .with('pessoa.municipio.provincia')
                        .with('pessoa.municipio_residencia.provincia')
                        .with('pessoa.contactos')
                        .with('pessoa.formacoes.instituicao.provincia')
                        .with('pessoa.formacoes.curso')
                        .with('pessoa.anexo.itens.tipo_anexo')
                        .with('motivo_exclusao')
                        .with('estado')
                        .with('bolsa')
                        .with('nivelacademico')
                        .fetch())

                }
            } else {

                return ResponseHelper.getOnlyDataResponse(
                    await EduCandidatura.query()
                    .where(consulta)
                    .with('pessoa')
                    .with('pessoa.user')
                    .with('candidatura_interna.instituicao')
                    .with('candidatura_interna.instituicao.provincia')
                    .with('candidatura_interna.curso')
                    .with('pessoa.municipio.provincia')
                    .with('pessoa.municipio_residencia.provincia')
                    .with('pessoa.contactos')
                    .with('pessoa.formacoes.instituicao.provincia')
                    .with('pessoa.formacoes.curso')
                    .with('pessoa.anexo.itens.tipo_anexo')
                    .with('motivo_exclusao')
                    .with('estado')
                    .with('bolsa')
                    .with('nivelacademico')
                    .fetch())



            }


        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao listar as Candidaturas desta bolsa")
        }
    }

}

module.exports = EduCandidaturaInternaController
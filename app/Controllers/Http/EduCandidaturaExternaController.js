'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with educandidaturaexternas
 */

const EduCandidatura = use('App/Models/EduCandidatura')
const EduCandidaturaExterna = use('App/Models/EduCandidaturaExterna')
const EduBolsa = use('App/Models/EduBolsa')
const EduMotivoExclusao = use('App/Models/EduMotivoExclusoe')

const BasePessoa = use('App/Models/BasePessoa')
const ResponseHelper = use('App/Helpers/ResponseHelper')
const GeneralConstants = use('App/Constants/GeneralConstants')
const PdfPrinter = require('pdfmake');
const Helpers = use('Helpers');
const fs = require('fs');
const path = require('path');
const moment = require('moment');



const requestFields = ['id', 'edu_instituicao_id', 'base_curso_id', 'edu_curso_id', 'edu_motivo_exclusoes_id', 'observacao', 'base_estado_id', 'user'];

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
class EduCandidaturaExternaController {
    /**
     * Show a list of all educandidaturaexternas.
     * GET educandidaturaexternas
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

            const candidatura = await EduCandidaturaExterna.query()
                .with('instituicao')
                .with('curso')
                .with('candidatura.bolsa')
                .with('candidatura.pessoa.municipio.provincia')
                .with('candidatura.pessoa.municipio_residencia.provincia')
                .with('candidatura.pessoa.contactos')
                .with('candidatura.pessoa.formacoes.instituicao.provincia')
                .with('candidatura.pessoa.formacoes.curso')
                .with('candidatura.pessoa.anexo.itens.tipo_anexo')
                // .with('motivo_exclusao')
                .paginate(page, size)


            return ResponseHelper.getOnlyDataResponse(candidatura)
        } catch (err) {
            ////console.log(err.message)
            // return ResponseHelper.getErrorResponse("Erro ao listar Candidaturas Externa")
            return ResponseHelper.getErrorResponse(err.message)
        }

    }
    async candidaturaslista({ params, request, response, view }) {
        try {



            /*  const posts = await Post
        .query()
        .whereHas('category', (builder) => {
          builder.where('slug', 'news')
        })
        .fetch()

        */

            ////console.log(params.bi)


            // const pessoa = await BasePessoa.query().where('name', 'like',    '%'+params.bi+'%').firstOrFail()

            // const posts = await pessoa.EduCandidatura().fetch()



            const candidatura = await EduCandidaturaExterna.query()
                /* .whereHas('candidatura.pessoa', (builder) => {
                   builder.where('name', 'like',    '%'+params.bi+'%')
                   .orwhere ('ndi', 'like', `%${params.bi}%`)  })  */
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
            ////console.log(err.message)
            // return ResponseHelper.getErrorResponse("Erro ao listar Candidaturas Externa")
            return ResponseHelper.getErrorResponse(err.message)
        }
    }


    async buscarCandidaturasExternaPorBi({ params, request, response, view }) {
        try {
            //// //console.log(params)
            let result = await EduCandidaturaExterna.query()
                .where({ ndi: params.ndi })
                .with('curso')
                .with('instituicao')
                .with('cursoFormacaoConcluida')
                .with('instituicaoFormacaoConcluida')
                .with('BasePais')
                .with('BaseProvincia')
                .with('BaseMunicipio')
                .with('BasePaisResidencia')
                .with('BaseProvinciaResidencia')
                .with('BaseProvinciaResidencia')
                 .with('motivo_exclusao')
                .with('estado')
                .with('anexo')
                .with('anexo.itens')
                .with('anexo.itens.tipo_anexo')
                .first()

            if (result)
                return ResponseHelper.getOnlyDataResponse(result)
            else
                return ResponseHelper.getErrorResponse("Candidatura Não Encontrada verifica o numero do BI")

        } catch (err) {
            //// //console.log(err.message)
            return ResponseHelper.getErrorResponse("Candidatura Não Encontrada verifica o numero do BI")
        }
    }



    async salvarCandidatura({ request, response }) {
        try {
            // let request_candidatura = request.all();
            let request_candidatura = request.only(requestFieldsCandidatura);


            let bolsa = await EduBolsa.query().where({ id: bolsa.edu_bolsa_id, }).first();


            if (!bolsa) {
                return ResponseHelper.getErrorResponse("Bolsa Indisponivel !... ")
            }

            let date1 = new Date(bolsa.data_abertura);
            let date2 = new Date(bolsa.data_encerramento);
            let data_abertura = new Date(date1)
            let data_encerramento = new Date(date2)





            if (data_hoje.getTime() < data_abertura.getTime()) {
                return ResponseHelper.getErrorResponse("A Candidatura a está bolsa ainda não está aberta ")
            }

            if (data_hoje.getTime() > data_encerramento.getTime()) {
                return ResponseHelper.getErrorResponse(" A Bolsa Ja está Encerrada.")
            }
            ////console.log("salvar candidatura .........." + request_candidatura.nome)

            let candidato = null
            let matricula_id = 0;
            let message = ""
            let result_candidatura = await EduCandidaturaExterna.query().where({
                user_id: request_candidatura.user_id,
                edu_bolsa_id: request_candidatura.edu_bolsa_id
            }).first();




            if (result_candidatura) {
                result_candidatura.merge(request_candidatura);
                candidato = await result_candidatura.save();
                message = "dados de" + request_candidatura.nome + " actualizado com sucesso"
            } else {

                let candidato_existe = await EduCandidaturaExterna.query()
                    .where('ndi', request_candidatura.ndi)
                    .where('edu_bolsa_id', request_candidatura.edu_bolsa_id)
                    .with('user').first();


                //  console.log("request_candidatura.edu_bolsa_id "+request_candidatura.user_id)
                //  console.log("request_candidatura.edu_bolsa_id " + request_candidatura.edu_bolsa_id)



                if (candidato_existe) {

                    let candidato_json = candidato_existe.toJSON()

                    ////console.log("Ja Existe uma candidatura associado ao bi " + request_candidatura.ndi + " com email -  " + candidato_json.user.email)

                    return ResponseHelper.getErrorResponse("Ja Existe uma candidatura associado ao bi " + request_candidatura.ndi + " com email - " + candidato_json.user.email)
                }

                let ultimo_estudante = await EduCandidaturaExterna.query().orderBy('id', 'desc').first();

                let ultimo_numero = 0

                if (ultimo_estudante)
                    ultimo_numero = ultimo_estudante.numero_processo_seq


                let proximo_numero = Number(ultimo_numero) + 1
                request_candidatura.numero_processo_seq = proximo_numero



                candidato = await EduCandidaturaExterna.create(request_candidatura);
                matricula_id = candidato.id
                message = request_candidatura.nome + " foi Salvo com sucesso"
            }

            ////console.log(message)


            return ResponseHelper.getSuccessResponse(message, candidato)
        } catch (err) {

            ////console.log("candidatura não salvo .......... " + request_candidatura.nome)
            ////console.log(err.message)
            return ResponseHelper.getErrorResponse("Candidatura Não Efectuada")
        }

    }
    /**
     * Render a form to be used for creating a new educandidaturaexterna.
     * GET educandidaturaexternas/create
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async create({ request, response, view }) { }

    /**
     * Create/save a new educandidaturaexterna.
     * POST educandidaturaexternas
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */

    async findCandidaturaById(id) {
        return await EduCandidaturaExterna.query()
            .where({ id: id })
            //.with('pessoa')
            //.with('candidatura_interna.curso.instituicao')
            //.with('candidatura_externa.instituicao')
            //.with('candidatura_externa.curso')
            .first();
    }
    async store({ request, response }) {
        try {
            const data = request.only(requestFields);
            const data_id = request.only(['id', 'edu_curso_id', 'candidatura_interna_id', 'candidatura_externa_id']);
            const data_curso = request.only(['base_curso_id', 'edu_curso_id', 'edu_instituicao_id']);

            delete data.user
            const bolsa = await EduBolsa.find(data.edu_bolsa_id);
            if (!bolsa) {
                return ResponseHelper.getWarningResponse("Não foi encontrada a bolsa seleccionada", bolsa)
            }

            data.estado = GeneralConstants.ESTADOS_CANDIDATURAS.NOVA.code;

            let candidato;
            let candidaturaInterna;
            let candidaturaExterna;
            //// ////console.log("----------------------------------------------------");
            // //// ////console.log(data);
            //// ////console.log("----------------------------------------------------");
            if (data_id.id) {
                candidato = await this.findCandidaturaById(data.id);
                candidato.merge(data);
                await candidato.save();
            } else {
                candidato = await EduCandidaturaExterna.create(data);
            }


            if (bolsa.tipo == GeneralConstants.TIPOS_BOLSAS.INTERNA.code) {
                if (data.candidatura_interna_id) {
                    candidaturaInterna = await this.findCandidaturaInternaById(data.candidatura_interna_id);
                    candidaturaInterna.merge(data_curso.candidatura_interna);
                    await candidaturaInterna.save();
                } else {

                    candidato.candidatura_interna = await candidato.candidatura_interna().create({ edu_curso_id: data_curso.edu_curso_id, edu_instituicao_id: data_curso.edu_instituicao_id, ano_ingresso: data.ano_ingresso, frequencia: data.frequencia, media: data.media })

                }

            } else {

                if (data.candidatura_externa_id) {
                    candidaturaExterna = await this.findCandidaturaExternaById(data.candidatura_externa_id);
                    candidaturaExterna.merge(data.candidatura_externa);
                    await candidaturaExterna.save();
                } else {
                    candidato.candidatura_externa = await candidato.candidatura_externa().create({ base_curso_id: data_curso.base_curso_id, edu_instituicao_id: data_curso.edu_instituicao_id, ano_ingresso: data.ano_ingresso })

                }
            }

            candidatura = await EduCandidaturaExterna.query()
                .where({ id: candidato.id })
                .with('candidatura_interna.curso.instituicao')
                .with('candidatura_externa.curso')
                .with('candidatura_externa.instituicao')
                .first();

            this.registarLog(candidato.id, "candidatura", 'registar', "1", "ip", "pais", "Candidatura Registada Com Sucesso");

            return ResponseHelper.getSuccessResponse("Candidatura registada com sucesso", candidatura)
        } catch (err) {
            //// ////console.log(err.message)
            this.registarLog(candidato.id, "candidatura", 'registar', "0", "ip", "pais", err.message);

            return ResponseHelper.getErrorResponse("Erro ao registar a Candidatura")
        }

        data.estado = GeneralConstants.ESTADOS_CANDIDATURAS.NOVA.code;

        let candidato;
        let candidaturaInterna;
        let candidaturaExterna;
        //// ////console.log("----------------------------------------------------");
        // //// ////console.log(data);
        //// ////console.log("----------------------------------------------------");
        if (data_id.id) {
            candidato = await this.findCandidaturaById(data.id);
            candidato.merge(data);
            await candidato.save();
        } else {
            candidato = await EduCandidaturaExterna.create(data);
        }


        if (bolsa.tipo == GeneralConstants.TIPOS_BOLSAS.INTERNA.code) {
            if (data.candidatura_interna_id) {
                candidaturaInterna = await this.findCandidaturaInternaById(data.candidatura_interna_id);
                candidaturaInterna.merge(data_curso.candidatura_interna);
                await candidaturaInterna.save();
            } else {

                candidato.candidatura_interna = await candidato.candidatura_interna().create({ edu_curso_id: data_curso.edu_curso_id, edu_instituicao_id: data_curso.edu_instituicao_id, ano_ingresso: data.ano_ingresso, frequencia: data.frequencia, media: data.media })

            }

        } else {

            if (data.candidatura_externa_id) {
                candidaturaExterna = await this.findCandidaturaExternaById(data.candidatura_externa_id);
                candidaturaExterna.merge(data.candidatura_externa);
                await candidaturaExterna.save();
            } else {
                candidato.candidatura_externa = await candidato.candidatura_externa().create({ base_curso_id: data_curso.base_curso_id, edu_instituicao_id: data_curso.edu_instituicao_id, ano_ingresso: data.ano_ingresso })

            }
        }

        candidatura = await EduCandidaturaExterna.query()
            .where({ id: candidato.id })
            .with('candidatura_interna.curso.instituicao')
            .with('candidatura_externa.curso')
            .with('candidatura_externa.instituicao')
            .first();

        this.registarLog(candidato.id, "candidatura", 'registar', "1", "ip", "pais", "Candidatura Registada Com Sucesso");

        return ResponseHelper.getSuccessResponse("Candidatura registada com sucesso", candidatura)
    } catch(err) {
        //// ////console.log(err.message)
        this.registarLog(candidato.id, "candidatura", 'registar', "0", "ip", "pais", err.message);

        return ResponseHelper.getErrorResponse("Erro ao registar a Candidatura")
    }


    /**
     * Display a single educandidaturaexterna.
     * GET educandidaturaexternas/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async show({ params, request, response, view }) {

        try {
            const candidatura = await EduCandidaturaExterna.query()
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
                .first();


            return ResponseHelper.getOnlyDataResponse(candidatura)
        } catch (err) {
            ////console.log(err.message)
            // return ResponseHelper.getErrorResponse("Erro ao listar Candidaturas Externa")
            return ResponseHelper.getErrorResponse(err.message)
        }

    }


    async listacandidatura({ params, request, response }) {
        try {

            return ResponseHelper.getOnlyDataResponse(
                await EduCandidatura.query()
                    .with('pessoa')
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
                    .fetch())

        } catch (err) {
            ////console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao listar as Candidaturas")
        }
    }


    async indexcandidaturabolsa({ params, request, response }) {
        try {
            ////console.log(params.bolsa_id)
            let result = await EduCandidatura.query()
                .where({ edu_bolsa_id: params.bolsa_id })
                .with('pessoa')
                .with('pessoa.user')
                // .with('instituicao')
                // .with('curso')
                .with('estado')
                .with('motivo_exclusao')
                .with('nivelacademico')
                .with('candidatura_externa.instituicao')
                .with('candidatura_externa.curso')
                .with('pessoa.municipio.provincia')
                .with('pessoa.municipio_residencia.provincia')
                .with('pessoa.contactos')
                .with('pessoa.formacoes.instituicao.provincia')
                .with('pessoa.formacoes.curso')
                .with('pessoa.anexo.itens.tipo_anexo')
                .fetch()

            ////console.log(result.toJSON())

            return ResponseHelper.getOnlyDataResponse(result)
        } catch (err) {
            ////console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao listar as Candidaturas desta bolsa")
        }
    }





    async edit({ params, request, response, view }) { }

    async update({ params, request, response }) {

        try {
            let data = request.only(requestFields);
            //  console.log("-------------------------------dasdas--------------------------------------");

            delete data.user

            data.base_estado_id = Number(data.base_estado_id)

            // console.log(data)

            let result = await EduCandidaturaExterna.query().where({ id: data.id }).update({ base_estado_id: data.base_estado_id })

            if (data.edu_motivo_exclusoes_id)
                result = await EduCandidaturaExterna.query().where({ id: data.id }).update({
                    edu_motivo_exclusoes_id: data.edu_motivo_exclusoes_id,
                    observacao: data.observacao
                })


            return ResponseHelper.getSuccessResponse("Candidatura Actualizada com sucesso", result)

        } catch (err) {
            //// ////console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro na actualização da candidatura")
        }
    }


    /**
     * Delete a educandidaturaexterna with id.
     * DELETE educandidaturaexternas/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async destroy({ params, request, response }) { }


    async getCandidatoBi({ request, params, response }) {
        try {

            let data = request.all()
            let result = null
            ////console.log(data);
            const pessoa = await BasePessoa.query()
                .where('ndi', 'like', '%' + data.bi + '%')
                // .where('nome', 'like', '%' + params.bi + '%')
                .with('user').firstOrFail();
            if (pessoa) {
                //////console.log("encontrado ")
                ////console.log(pessoa.ndi);

                result = await EduCandidatura.query()
                    .where({ base_pessoa_id: pessoa.id })
                    .with('pessoa')
                    .with('pessoa.user')
                    .with('estado')
                    .with('motivo_exclusao')
                    .with('candidatura_externa.instituicao')
                    .with('candidatura_externa.instituicao.provincia')
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
                    .limit(1000)
                    .fetch()

            }


            return ResponseHelper.getOnlyDataResponse(result)

        } catch (err) {
            ////console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao listar as Candidaturas desta bolsa")
        }
    }




    async indexcandidaturabolsafiltro({ request, params, response }) {

        try {


            const data = request.all();
            ////console.log("filtro data")


            //   let subquery_candidatura_externa = await this.getFiltro(data);
            let subquery_institucao_provincias

            if (data.provincia)
                subquery_institucao_provincias = Database
                    .from('edu_instituicoes')
                    .where({ base_provincia_id: data.provincia })
                    .select('id')

            let query_candidatura_externa = Database.from('edu_candidatura_externas')

            // .where({ carenciado: data.carenciado })
            // .where({ edu_instituicao_id: data.instituicao })
            //    .whereIn('edu_instituicao_id', subquery_institucao_provincias)
            //    .select('edu_candidatura_id')

            //  let query_candidatura_externa = EduCandidaturaInterna.query()
            if (data.instituicao)
                query_candidatura_externa.where('edu_instituicao_id', data.instituicao)

            // if (data.carenciado)
            //  query_candidatura_externa.where('carenciado', data.carenciado)

            if (subquery_institucao_provincias)
                query_candidatura_externa.whereIn('edu_instituicao_id', subquery_institucao_provincias)


            query_candidatura_externa.select('edu_candidatura_id')

            // ////console.log(subquery_candidatura_externa)


            let query_candidatura = EduCandidatura.query()
            if (data.tipoDeBolsa)
                query_candidatura.where('edu_bolsa_id', data.tipoDeBolsa)
            if (data.estadoPesquisa)
                query_candidatura.where('edu_estado_id', data.estadoPesquisa)
            if (query_candidatura_externa)
                query_candidatura.whereIn('id', query_candidatura_externa)


            if (data.nivel_academico) {
                if (data.nivel_academico == 2) {
                    query_candidatura.where('base_nivel_academico_id', data.nivel_academico)
                } else {

                    //  query_candidatura  .whereIn('base_nivel_academico_id', [3,4,5])
                    query_candidatura.where('base_nivel_academico_id', data.nivel_academico)
                    //  query_candidatura.where('base_nivel_academico_id' ,   data.nivel_academico)
                }
            }


            const candidatura = await query_candidatura
                .with('nivelacademico')
                .with('pessoa.user')
                .with('estado')
                .with('candidatura_externa')
                .with('candidatura_externa.instituicao')
                .with('candidatura_externa.instituicao.provincia')
                .with('candidatura_externa.curso')
                .with('pessoa.municipio.provincia')
                .with('pessoa.municipio_residencia.provincia')
                .with('pessoa.contactos')

                .with('pessoa.formacoes.instituicao')
                .with('pessoa.formacoes.instituicao.provincia')
                .with('pessoa.formacoes.curso')
                .with('pessoa.anexo.itens.tipo_anexo')

                .with('BaseProvincia')
                .with('BaseMunicipio')
                .with('BasePaisResidencia')
                .with('BaseProvinciaResidencia')
                .with('BaseProvinciaResidencia')

                .limit(5000)
                .fetch()


            ////console.log("candidatura")
            // ////console.log("candidatura".toJSON());
            return ResponseHelper.getOnlyDataResponse(candidatura)

        } catch (err) {
            ////console.log(err.message)
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
                    .with('estado')
                    .with('motivo_exclusao')
                    .with('nivelacademico')
                    .with('candidatura_externa.instituicao')
                    .with('candidatura_externa.instituicao.provincia')
                    .with('candidatura_externa.curso')
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

                    ////console.log(pessoa.ndi);

                  if (pessoa) {
                    ////console.log(pessoa.ndi);
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
            ////console.log(err.message)
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

            ////console.log(params);
            // let pessoa = await this.findPessoaByBi(params.bi); // data.pessoa.ndi

            if (params.bi !== "undefined" && params.bi !== '-') {
                const pessoa = await BasePessoa.query()
                    .where('ndi', 'like', '%' + params.bi + '%')
                    // .where('nome', 'like', '%' + params.bi + '%')
                    .with('user').firstOrFail();
                if (pessoa) {

                    //////console.log("encontrado ")
                    ////console.log(pessoa.ndi);
                    return ResponseHelper.getOnlyDataResponse(
                        await EduCandidatura.query()
                            .where({ base_pessoa_id: pessoa.id })
                            .with('pessoa')
                            .with('pessoa.user')
                            .with('estado')
                            .with('motivo_exclusao')
                            .with('candidatura_externa.instituicao')
                            .with('candidatura_externa.instituicao.provincia')
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
                            .limit(1000)
                            .fetch())

                }
            } else {
                ////console.log("consulta")
                return ResponseHelper.getOnlyDataResponse(
                    await EduCandidatura.query()
                        .where({ edu_bolsa_id: params.bolsa_id, edu_estado_id: params.estado_id })
                        .with('pessoa')
                        .with('pessoa.user')
                        .with('candidatura_externa.instituicao')
                        .with('candidatura_externa.instituicao.provincia')
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
                        .limit(2000)
                        .fetch())



            }


        } catch (err) {
            ////console.log(err.message)
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

            ////console.log(params);
            // let pessoa = await this.findPessoaByBi(params.bi); // data.pessoa.ndi

            if (params.bi !== "undefined") {
                const pessoa = await BasePessoa.query()
                    .where('ndi', 'like', '%' + params.bi + '%')
                    // .where('nome', 'like', '%' + params.bi + '%')
                    .with('user').firstOrFail();
                if (pessoa) {

                    //////console.log("encontrado ")
                    ////console.log(pessoa.ndi);
                    return ResponseHelper.getOnlyDataResponse(
                        await EduCandidatura.query()
                            .where({ base_pessoa_id: pessoa.id })
                            .where({ user_id: params.user_id })
                            .with('pessoa')
                            .with('pessoa.user')
                            .with('candidatura_externa.instituicao')
                            .with('candidatura_externa.instituicao.provincia')
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
                            .fetch())

                }
            } else {

                return ResponseHelper.getOnlyDataResponse(
                    await EduCandidatura.query()
                        .where(consulta)
                        .with('pessoa')
                        .with('pessoa.user')
                        .with('candidatura_externa.instituicao')
                        .with('candidatura_externa.instituicao.provincia')
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
                        .fetch())



            }


        } catch (err) {
            ////console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao listar as Candidaturas desta bolsa")
        }
    }




    async candidaturaInternaFiltro({ request, response }) {
        try {

            let data = request.all();
            let page = Number(data.page ? data.page : 1);
            let size = Number(data.size ? data.size : 10);

            //// ////console.log(data);

            const candidato = await EduCandidatura.query()
                .where('nome', 'like', '%' + data.nome_bi + '%')
                .orWhere('ndi', 'like', '%' + data.nome_bi + '%')
                .with('instituicao').with('curso')
                .with('user')
                .with('cursoFormacaoConcluida')
                .with('instituicaoFormacaoConcluida')
                .with('anexo')
                .with('anexo.itens')
                .with('anexo.itens.tipo_anexo')
                .with('nivelacademico')
                .with('BaseNivelFormacaoConcluida')
                .with('motivo_exclusao')
                .with('estado')
                .orderBy('classificacao', 'desc')

                .paginate(page, size);

            // //// ////console.log(candidato);

            return ResponseHelper.getOnlyDataResponse(candidato)
        } catch (error) {
            //// ////console.log(error)
            return ResponseHelper.getErrorResponse("nenhum dado encontrado")
        }
    }

    async candidaturaExternaFiltroDados({ request, response }) {
        try {

            let data = request.all();
            let page = Number(data.page ? data.page : 1);
            let size = Number(data.tableSize ? data.tableSize : 10);


            //   console.log("filtrar dados candidaturas externas ........................")


            if (data.nome_bi) {
                const candidato_bi = await EduCandidaturaExterna.query()
                    .where('ndi', 'like', '%' + data.nome_bi + '%')
                    .orWhere('nome', 'like', '%' + data.nome_bi + '%')

                    .where({ edu_bolsa_id: data.edu_bolsa_id })
                    .with('instituicao').with('curso')
                    .with('instituicao.provincia')
                    .with('cursoFormacaoConcluida')
                    .with('instituicaoFormacaoConcluida')

                  
                    .with('anexo')
                    .with('anexo.itens')
                    .with('anexo.itens.tipo_anexo')

                    .with('motivo_exclusao')
                    .with('estado')
                    .with('nivelacademico')

                    .with('BaseNivelFormacaoConcluida')
                    .with('BaseProvincia')
                    .with('BaseMunicipio')
                    .with('BasePaisResidencia')
                    .with('BaseProvinciaResidencia')
                    .with('BaseProvinciaResidencia')

                    .orderBy('classificacao', 'desc')

                    .paginate(page, size);

                // //// ////console.log(candidato);

                return ResponseHelper.getOnlyDataResponse(candidato_bi)
            }



            // console.log("filtrar dados candidaturas externas ........................")

            let query_candidatura = EduCandidaturaExterna.query()

            if (data.base_estado_id) {
                query_candidatura.where('base_estado_id', data.base_estado_id)
            } else
                query_candidatura.whereNotIn('base_estado_id', [2, 3, 4, 5, 6, 7])




            if (data.grau_academico) {
                if (Number(data.grau_academico) == 1)
                    query_candidatura.whereIn('base_nivel_formacao_id', [2, 3])
                else
                    query_candidatura.whereIn('base_nivel_formacao_id', [4, 5, 6])
            }
            if (data.nivel_academico) {
                query_candidatura.where('base_nivel_formacao_id', data.nivel_academico)
            }


            if (data.motivo_exclusao) {
                query_candidatura.where('edu_motivo_exclusoes_id', data.motivo_exclusao)
            }



            const candidato_bi = await query_candidatura
                .with('instituicao').with('curso')

                //  .where({ edu_bolsa_id: 2022 })
                .where({ edu_bolsa_id: data.edu_bolsa_id })
                .with('instituicao.provincia')
                .with('cursoFormacaoConcluida')
                .with('instituicaoFormacaoConcluida')
                  .with('anexo')
                .with('anexo.itens')
                .with('anexo.itens.tipo_anexo')
                .with('motivo_exclusao')
                .with('estado')
                .with('nivelacademico')
                .with('BaseNivelFormacaoConcluida')
                .with('BaseProvincia')
                .with('BaseMunicipio')
                .with('BasePaisResidencia')
                .with('BaseProvinciaResidencia')
                .with('BaseProvinciaResidencia')

                .orderBy('classificacao', 'desc')

                .paginate(page, size);

            // //// ////console.log(candidato);

            return ResponseHelper.getOnlyDataResponse(candidato_bi)






            return ResponseHelper.getOnlyDataResponse(candidato)
        } catch (error) {
            //// ////console.log(error)
            return ResponseHelper.getErrorResponse("nenhum dado encontrado")
        }
    }


    async buscarTodosCandidaturaExterna({ request, response }) {
        try {

            let data = request.all();
            let page = Number(data.page ? data.page : 1);
            let size = Number(data.size ? data.size : 25);

            if (data.nome_bi) {
                const candidatoExterno = await EduCandidaturaExterna.query()
                    .where('ndi', 'like', '%' + data.nome_bi + '%')
                    .orWhere('nome', 'like', '%' + data.nome_bi + '%')
                    .whereIn('edu_bolsa_id', [3, 4, 5])
                    //.whereNotIn('base_estado_id',[4])
                    .with('instituicao')
                    .with('curso')
                    .with('instituicao.provincia')
                    .with('cursoFormacaoConcluida')
                    .with('instituicaoFormacaoConcluida')
                    .with('anexo')
                    .with('anexo.itens')
                    .with('anexo.itens.tipo_anexo')
                    .with('motivo_exclusao')
                    .with('estado')
                    .with('nivelacademico')
                    .with('BaseNivelFormacaoConcluida')
                    .with('BaseProvincia')
                    .with('BaseMunicipio')
                    .with('BasePaisResidencia')
                    .with('BaseProvinciaResidencia')
                    .with('BaseProvinciaResidencia')
                    .orderBy('nome', 'asc')
                    .paginate(page, size);

                return ResponseHelper.getOnlyDataResponse(candidatoExterno)
            } else {

                const candidatoExterno = await EduCandidaturaExterna.query()
                    .whereIn('edu_bolsa_id', [3, 4, 5])
                    //.whereNotIn('base_estado_id',[4])
                    .with('instituicao')
                    .with('curso')
                    .with('instituicao.provincia')
                    .with('cursoFormacaoConcluida')
                    .with('instituicaoFormacaoConcluida')
                     .with('anexo')
                    .with('anexo.itens')
                    .with('anexo.itens.tipo_anexo')
                    .with('motivo_exclusao')
                    .with('estado')
                    .with('nivelacademico')
                    .with('BaseNivelFormacaoConcluida')
                    .with('BaseProvincia')
                    .with('BaseMunicipio')
                    .with('BasePaisResidencia')
                    .with('BaseProvinciaResidencia')
                    .with('BaseProvinciaResidencia')
                    .orderBy('nome', 'asc')
                    .paginate(page, 10);

                return ResponseHelper.getOnlyDataResponse(candidatoExterno)

            }

        } catch (error) {

            return ResponseHelper.getErrorResponse("nenhum dado encontrado")
        }
    }

    async saveCandidaturaExterna({ params, request, response }) {
        try {

            //// ////console.log(" salvar candidato interno ........................")
            const data = request.all();
            let pessoa = request.only(requestFieldsPessoa);
            let candidato_interno = request.only(requestFieldsCandidatoInterno);
            let candidato_externo = request.only(requestFieldsCandidatoExterno);

            let agregado = request.only(requestFieldsAgregado);
            let candidato = data.candidaturas
            let formacao_concluida = data.formacoes


            let result_pessoa = await this.savePessoa(pessoa)

            if (result_pessoa == "Ja existe uma conta com este BI")
                return ResponseHelper.getErrorResponse("Ja existe uma conta com este BI")

            if (result_pessoa) {
                candidato.base_pessoa_id = result_pessoa.id
                formacao_concluida.base_pessoa_id = result_pessoa.id
                agregado.base_pessoa_id = result_pessoa.id

                this.saveFormacao(formacao_concluida)



                let result_candidato = this.saveCandidato(candidato, candidato_interno, candidato_externo)

                //// ////console.log("------------------agregado----------------------")

                //// ////console.log("----------------------------------------")
                this.saveAgregadoFamiliar(agregado)


                return ResponseHelper.getSuccessResponse("candidatura salva com sucesso")
            }
            return ResponseHelper.getErrorResponse("candidatura não foi salvo")
        } catch (err) {
            //// ////console.log(err.message)
            //this.registarLog(username, "user", 'login', "0", "", "", err.message);

            return ResponseHelper.getErrorResponse("candidatura não foi salvo" + err.message)
        }
    }

    async validarCandidatura({ params, request, response }) {

        try {
            let data = request.only(requestFields);

            delete data.user
            // // ////console.log(data)


            const edu_Candidatura = await EduCandidatura.query().where({ id: data.id }).first();

            ////console.log("---------------------------------------------------------------------");
            ////console.log("---------------------------------------------------------------------");

            ////console.log("tentativa de salvar dados administrador .........")
            edu_Candidatura.merge(data);
            edu_Candidatura.save();

            return ResponseHelper.getSuccessResponse("Candidatura Actualizada com sucesso", edu_Candidatura)

        } catch (err) {
            //// ////console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro na actualização da candidatura")
        }
    }




    async buscarTodosCandidatosNoEstadoIniciado({ request, response }) {
        try {

            let data = request.all();
            let page = Number(data.page ? data.page : 1);
            let size = Number(data.size ? data.size : 10);

            //// //console.log(data)
            //// //console.log("listar candidatos .........")
            const candidato = await EduCandidaturaExterna.query()
                .where('nome', 'like', '%' + data.nome_bi + '%')
                .orWhere('ndi', 'like', '%' + data.nome_bi + '%')

                .with('instituicao').with('curso').with('user')
                .with('cursoFormacaoConcluida')
                .with('instituicaoFormacaoConcluida')
                .with('BasePais')
                .with('BaseProvincia')
                .with('BaseMunicipio')
                .with('BasePaisResidencia')
                .with('BaseProvinciaResidencia')
                .with('BaseProvinciaResidencia')
                .with('user')
                .with('anexo')
                .with('anexo.itens')
                .with('anexo.itens.tipo_anexo')
                .with('nivelacademico')
                .with('BaseNivelFormacaoConcluida')

                .paginate(page, size);

            return ResponseHelper.getOnlyDataResponse(candidato)
        } catch (err) {
            console.error(err)
            return ResponseHelper.getErrorResponse("Erro ao listar as Bolsas")
        }
    }


    async buscarTodosCandidatosNoEstadoIniciadoPorUser({ request, response }) {
        try {

            let data = request.all();
            let page = Number(data.page ? data.page : 1);
            let size = Number(data.size ? data.size : 10);

            //// //console.log(data)
            //// //console.log("listar candidatos para validar .........")

            let candidatos
            if (data.nome_bi) {
                candidatos = await EduCandidaturaExterna.query()
                    .where({ validacao_user: data.user })
                    .where('nome', 'like', '%' + data.nome_bi + '%')
                    .orWhere('ndi', 'like', '%' + data.nome_bi + '%')
                    .where({ validacao_user: data.user })
                    .with('instituicao').with('curso').with('user')
                    .with('cursoFormacaoConcluida')
                    .with('instituicaoFormacaoConcluida')
                    .with('BasePais')
                    .with('BaseProvincia')
                    .with('BaseMunicipio')
                    .with('BasePaisResidencia')
                    .with('BaseProvinciaResidencia')
                    .with('BaseProvinciaResidencia')
                    .with('user')
                    .with('userValidar')
                    .with('anexo')
                    .with('anexo.itens')
                    .with('anexo.itens.tipo_anexo')
                    .with('nivelacademico')
                    .with('BaseNivelFormacaoConcluida')

                    .paginate(page, size);
            } else {
                candidatos = await EduCandidaturaExterna.query()
                    .where({ validacao_user: data.user })
                    .where({ base_estado_id: data.base_estado_id })
                    .whereNull('base_estado_id')
                    .orWhere({ base_estado_id: data.base_estado_id })
                    .where({ validacao_user: data.user })
                    .with('instituicao').with('curso').with('user')
                    .with('cursoFormacaoConcluida')
                    .with('instituicaoFormacaoConcluida')
                    .with('BasePais')
                    .with('BaseProvincia')
                    .with('BaseMunicipio')
                    .with('BasePaisResidencia')
                    .with('BaseProvinciaResidencia')
                    .with('BaseProvinciaResidencia')
                    .with('user')
                    .with('anexo')
                    .with('anexo.itens')
                    .with('anexo.itens.tipo_anexo')
                    .with('nivelacademico')
                    .with('BaseNivelFormacaoConcluida')

                    .paginate(page, size);

            }

            return ResponseHelper.getOnlyDataResponse(candidatos)
        } catch (err) {
            console.error(err)
            return ResponseHelper.getErrorResponse("Erro ao listar as candidaturas para validação")
        }
    }


    async buscarCandidatoPresselecionadoParaConfirmarContrato({ request, response }) {

        try {

            let data = request.all();
            let page = Number(data.page ? data.page : 1);
            let size = Number(data.size ? data.size : 10);

            // console.log(data)
            //// console.log("listar candidatos para validar .........")

            let candidatos
            if (data.nome_bi) {
                candidatos = await EduCandidaturaExterna.query()
                    .where('nome', 'like', '%' + data.nome_bi + '%')
                    .where({ contrato_imprenso: data.contrato_imprenso, edu_bolsa_id: data.edu_bolsa_id, base_estado_id: 3 })
                    .orWhere('ndi', 'like', '%' + data.nome_bi + '%')
                    .where({ contrato_imprenso: data.contrato_imprenso, edu_bolsa_id: data.edu_bolsa_id, base_estado_id: 3 })
                    //.whereNull('contrato_validado')
                    .with('instituicao').with('curso').with('user')
                    .with('cursoFormacaoConcluida')
                    .with('instituicaoFormacaoConcluida')
                    .with('BasePais')
                    .with('BaseProvincia')
                    .with('BaseMunicipio')
                    .with('BasePaisResidencia')
                    .with('BaseProvinciaResidencia')
                    .with('user')
                    .with('nivelacademico')
                    .with('BaseNivelFormacaoConcluida')

                    .with('validacaoUser')

                    .paginate(page, size);
            } else {
                let cand = EduCandidatura.query()
                if (data.contrato_validado_id) {
                    cand.where('contrato_validado', data.contrato_validado_id)

                } else {
                    cand.whereNull('contrato_validado')

                }
                if (data.instituicao) {
                    cand.where('edu_instituicao_id', data.instituicao)
                }

                if (data.bols_validacao_confirmado) {

                    if (data.bols_validacao_confirmado == 1)
                        cand.where('bols_validacao_confirmado', 1)
                    else
                        cand.whereNull('bols_validacao_confirmado')
                }

                if (data.provincia) {

                    let subquery_uo_provincias = Database.from('edu_unidade_organicas').where({ base_provincia_id: data.provincia }).select('codigo')
                    if (data.unidade_organica) {
                        subquery_uo_provincias = Database.from('edu_unidade_organicas').where({ id: data.unidade_organica }).select('codigo')
                    } else {
                        subquery_uo_provincias = Database.from('edu_unidade_organicas').whereIn('codigo', subquery_uo_provincias).select('codigo')
                    }
                    let subquery_curso_uo = Database.from('edu_cursos').whereIn('edu_unidade_organica_codigo', subquery_uo_provincias).select('id')

                    cand.whereIn('edu_curso_id', subquery_curso_uo)
                }

                candidatos = await cand
                    .where({ contrato_imprenso: data.contrato_imprenso, edu_bolsa_id: data.edu_bolsa_id, base_estado_id: 3 })
                    .with('instituicao').with('curso').with('user')
                    .with('cursoFormacaoConcluida')
                    .with('instituicaoFormacaoConcluida')
                    .with('BasePais')
                    .with('BaseProvincia')
                    .with('BaseMunicipio')
                    .with('BasePaisResidencia')
                    .with('BaseProvinciaResidencia')
                    .with('BaseProvinciaResidencia')
                    .with('user')
                    .with('nivelacademico')
                    .with('BaseNivelFormacaoConcluida')

                    .with('validacaoUser')
                    .paginate(page, size);

            }

            return ResponseHelper.getOnlyDataResponse(candidatos)
        } catch (err) {
            console.error(err)
            return ResponseHelper.getErrorResponse("Erro ao listar as candidaturas para validação")
        }

    }



    async buscarCandidatoParaAtribuido({ request, response }) {
        try {

            let data = request.all();
            let page = Number(data.page ? data.page : 1);
            let size = Number(data.size ? data.size : 10);

            console.log(data)
            //// //console.log("listar candidatos .........")
            const candidato = await EduCandidaturaExterna.query()
                .where({ base_estado_id: "1", edu_bolsa_id: data.edu_bolsa_id, validacao_user: null })
                .orWhere({ base_estado_id: null, edu_bolsa_id: data.edu_bolsa_id, validacao_user: null })
                .with('instituicao').with('curso').with('user')
                .with('cursoFormacaoConcluida')
                .with('instituicaoFormacaoConcluida')
                .with('BasePais')
                .with('nivelacademico')
                .with('BaseNivelFormacaoConcluida')


                .paginate(page, size);

            return ResponseHelper.getOnlyDataResponse(candidato)
        } catch (err) {
            console.error(err)
            return ResponseHelper.getErrorResponse("Erro ao listar as Bolsas")
        }
    }

    async buscarCandidatoParaValidacaoAtribuido({ request, response }) {
        try {

            let data = request.all();
            let page = Number(data.page ? data.page : 1);
            let size = Number(data.size ? data.size : 10);


            console.log(data)
            const candidato = await EduCandidaturaExterna.query()
                .where({ edu_bolsa_id: data.edu_bolsa_id, validacao_user: data.user })
                //.orWhere({   edu_bolsa_id: data.edu_bolsa_id, validacao_user: data.user })
                .with('instituicao').with('curso').with('user')
                .with('cursoFormacaoConcluida')
                .with('instituicaoFormacaoConcluida')
                .with('BasePais')
                .with('nivelacademico')
                .with('BaseNivelFormacaoConcluida')


                .paginate(page, size);

            return ResponseHelper.getOnlyDataResponse(candidato)
        } catch (err) {
            console.error(err)
            return ResponseHelper.getErrorResponse("Erro ao listar as Bolsas")
        }
    }

    //---------- Metodo para atribuir ou retirar candidatos a um determinado funcionario -------------------------------
    async atribuirCandidatoUser({ request, params, response }) {
        try {
            const data = request.all();
            //// //console.log("-----------------------atribuir candidatos--------------------------------------------")
            let candidatos
            let mensagem
            let nivel = [2, 3, 4, 5, 6]
            /*    if (Number(data.nivel_academico_id) <= 2) {
                            nivel = [2]
                        } else {
                            nivel = [3, 4, 5, 6]
                        }
            */
            //             console.log("ATRIBUIR OU RETIRAR CANDIDATOS ,.....")
            //  console.log(data)

            if (Number(data.atribuir) == 1) {
                candidatos = await EduCandidaturaExterna.query()


                    .where({ base_estado_id: "1", edu_bolsa_id: data.edu_bolsa_id, validacao_user: null })
                    .orWhere({ base_estado_id: null, edu_bolsa_id: data.edu_bolsa_id, validacao_user: null })

                    //   .where({ base_nivel_formacao_id: data.nivel_academico_id, base_estado_id: 1, edu_bolsa_id: data.edu_bolsa_id, validacao_user: null })
                    //   .orWhere({ base_nivel_formacao_id: data.nivel_academico_id, base_estado_id: null, edu_bolsa_id: data.edu_bolsa_id, validacao_user: null })

                    .limit(data.quantidade)
                    .update({ validacao_user: data.user_id })

                console.log(candidatos)
                if (candidatos) {
                    mensagem = "candidatos atribuido com sucesso para validacao " + candidatos
                } else
                    return ResponseHelper.getErrorResponse("Nenhum candidato foi atribuido para este nivel de Formação")

            } else {
                candidatos = await EduCandidaturaExterna.query()
                    .where({ base_nivel_formacao_id: data.nivel_academico_id, base_estado_id: 1, edu_bolsa_id: data.edu_bolsa_id, validacao_user: data.user_id })
                    .orWhere({ base_nivel_formacao_id: data.nivel_academico_id, base_estado_id: null, edu_bolsa_id: data.edu_bolsa_id, validacao_user: data.user_id })
                    .limit(data.quantidade)
                    .update({ validacao_user: null })
                mensagem = "candidatos retirados com sucesso " + candidatos

            }

            //  console.log("....................................................................")

            return ResponseHelper.getSuccessResponse(mensagem, candidatos)
        } catch (err) {
            //// //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao atribuir candidatos para validação")
        }
    }

    async salvarCandidatoValidado({ params, request, response }) {

        try {

            let data = request.only(['id', 'base_estado_id', 'observacao', 'edu_motivo_exclusoes_id', 'docente', 'deficiente', 'carenciado', 'filho_antigo_combatente', 'contrato_user', 'contrato_validado', 'observacao_contrato', 'nome_conta', 'nib', 'iban', 'banco', 'numero_conta']);
            let data_log = request.only(['user_id', 'edu_curso_id', 'media', 'ano_conclusao', 'pontuacao', 'ano_ingresso', 'ingresso', 'docente', 'deficiente', 'carenciado', 'filho_antigo_combatente', 'validacao_user', 'observacao', 'edu_motivo_exclusoes_id', 'classificacao', 'edu_candidatura_id']);

            data_log.edu_candidatura_id = data.id
            let data_full = request.all();

            const edu_Candidatura = await EduCandidaturaExterna.query().where({ id: data.id }).first();

            edu_Candidatura.merge(data);
            edu_Candidatura.save();

            //// //console.log(" candidato validado ... " + data_full.nome);


            // let log = await EduCandidaturaEstado.create(data_log);

            //// //console.log("log de validacao  " + log.id)

            return ResponseHelper.getSuccessResponse("Candidatura Validada com sucesso", edu_Candidatura)

        } catch (err) {
            //// //console.log(err.message)
            return ResponseHelper.getErrorResponse("A Candidatura Não foi Validada")
        }

    }


}

module.exports = EduCandidaturaExternaController

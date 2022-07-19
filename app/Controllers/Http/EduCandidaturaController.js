'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */


const ResponseHelper = use('App/Helpers/ResponseHelper')
const GeneralConstants = use('App/Constants/GeneralConstants')
const PdfPrinter = require('pdfmake');
const Helpers = use('Helpers');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const BaseLog = use('App/Models/BaseLog')

const User = use('App/Models/User')
const EduEstado = use('App/Models/EduEstado')

const BasePessoa = use('App/Models/BasePessoa')
const EduCandidatura = use('App/Models/EduCandidatura')

const EduCandidaturaEstado = use('App/Models/EduCandidaturaEstado')

//----------------------
const EduBolsa = use('App/Models/EduBolsa')

const BaseHabilidadeLiteraria = use('App/Models/BaseHabilidadeLiteraria')
const BaseAgregadoFamiliar = use('App/Models/BaseAgregadoFamiliare')

const EduCandidaturaInterna = use('App/Models/EduCandidaturaInterna')
const EduCandidaturaExterna = use('App/Models/EduCandidaturaExterna')

const BaseProvincia = use('App/Models/BaseProvincia')

const BaseAnexo = use('App/Models/BaseAnexo')
const BaseAnexoItens = use('App/Models/BaseAnexoIten')
const BaseTipoAnexo = use('App/Models/BaseTipoAnexo')

const requestFieldsPessoa = ['id', 'nome', 'user_id', 'data_nascimento', 'base_anexo_id', 'estado_civil',
    'base_municipio_id', 'genero', 'tipo_identificacao', 'ndi', 'dtEmissao', 'base_provincia_id', 'endereco',
    'pais_residencia_id', 'provincia_residencia_id', 'municipio_residencia_id', 'banco', 'conta_bancaria', 'iban', 'telefone_principal', 'telefone_alternativo'
];

const requestFields = ['id', 'edu_instituicao_id', 'edu_curso_id', 'edu_motivo_exclusoes_id', 'observacao', 'base_estado_id', 'user', 'deficiente', 'carenciado'];

const requestFieldsEditarDados = ['id', 'nome', 'ndi', 'data_nascimento', 'telefone_principal', 'base_ano_frequencia_id', 'base_estado_civil_id', 'media', 'base_nivel_formacao_id', 'base_genero_id', 'edu_instituicao_id', 'edu_curso_id', 'edu_unidade_organica_id', 'base_provincia_formacao_id', 'deficiente', 'carenciado'];

const requestFieldsFormacao = ['base_pessoa_id', 'edu_bolsa_id', 'base_anexo_id', 'frequencia', 'ano_ingresso', 'media'];

const requestFieldsCandidato = ['base_pessoa_id', 'edu_bolsa_id', 'base_anexo_id', 'frequencia', 'ano_ingresso', 'media', 'matriculado', 'aceite'];
const requestFieldsCandidatoInterno = ['base_pessoa_id', 'edu_bolsa_id', 'base_anexo_id', 'frequencia', 'ano_ingresso', 'media', 'filho_antigo_combatente', 'necessidade_especial', 'carenciado', 'docente'];
const requestFieldsCandidatoExterno = ['base_pessoa_id', 'edu_bolsa_id', 'base_anexo_id', 'frequencia', 'ano_ingresso', 'media'];
//const requestFieldsAgregado = ['base_pessoa_id', 'edu_bolsa_id', 'base_anexo_id', 'frequencia', 'ano_ingresso', 'media'];

const requestFieldsAgregado = ['pai', 'profissao_pai', 'salario_pai', 'instituicao_empregadora_pai', 'mae', 'base_pessoa_id', 'profissao_mae', 'salario_mae', 'instituicao_empregadora_mae', 'agregados', 'menores', 'trabalhadores'];


const requestFieldsCandidatura = [
    'ano_conclusao', 'ano_ingresso', 'banco', 'base_ano_frequencia_id',
    'base_estado_civil_id', 'base_genero_id', 'base_municipio_id', 'base_municipio_residencia_id', 'base_nivel_formacao_concluida_id',
    'base_nivel_formacao_id', 'base_pais_formacao_concluida_id', 'base_pais_formacao_id',
    'base_pais_residencia_id', 'base_provincia_formacao_concluida_id', 'base_provincia_formacao_id', 'base_provincia_id',
    'base_provincia_residencia_id', 'data_emissao', 'data_expiracao', 'data_nascimento', 'edu_curso_concluido_id',
    'edu_curso_id', 'edu_instituicao_concluida_id', 'edu_instituicao_id', 'endereco', 'estado', 'iban', 'ingresso',
    'mae', 'media', 'ndi', 'nome', 'numero_conta', 'numero_processo_seq', 'pai', 'telefone_alternativo', 'telefone_principal',
    'user_id',
    'docente', 'deficiente', 'carenciado', 'filho_antigo_combatente',

    'edu_bolsa_id', 'base_anexo_id', 'created_at', 'updated_at'
];


const Database = use('Database')

class EduCandidaturaController {

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


    async buscarTodosCandidatosNoEstadoIniciado({ request, response }) {
        try {

            let data = request.all();
            let page = Number(data.page ? data.page : 1);
            let size = Number(data.size ? data.size : 10);

            //// //console.log(data)
            //// //console.log("listar candidatos .........")
            const candidato = await EduCandidatura.query()
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
                candidatos = await EduCandidatura.query()
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
                candidatos = await EduCandidatura.query()
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
                candidatos = await EduCandidatura.query()
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

            //// //console.log(data)
            //// //console.log("listar candidatos .........")
            const candidato = await EduCandidatura.query()
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

    async candidaturaFiltro({ request, response }) {
        try {

            let data = request.all();
            let page = Number(data.page ? data.page : 1);
            let size = Number(data.size ? data.size : 10);

            //// //console.log(data);
            const candidato = await EduCandidatura.query()
                .where('nome', 'like', '%' + data.nome_bi + '%')
                .orWhere('ndi', 'like', '%' + data.nome_bi + '%')
                .with('instituicao').with('curso').with('user')
                .with('cursoFormacaoConcluida')
                .with('instituicaoFormacaoConcluida')
                .with('user')
                .with('anexo')
                .with('anexo.itens')
                .with('anexo.itens.tipo_anexo')
                .with('nivelacademico')
                .with('motivo_exclusao')
                .with('estado')
                .with('BaseNivelFormacaoConcluida')
                .orderBy('classificacao', 'desc')

                .paginate(page, size);

            // //// //console.log(candidato);

            return ResponseHelper.getOnlyDataResponse(candidato)
        } catch (error) {
            //// //console.log(error)
            return ResponseHelper.getErrorResponse("nenhum dado encontrado")
        }
    }


    async buscarBolseiroComContratoAssinado({ request, response }) {
      try {

          let data = request.all();

        const result = await EduCandidatura.query()
              .where('nome', 'like', '%' + data.nome_bi + '%')
              .orWhere('ndi', 'like', '%' + data.nome_bi + '%')
              .where({ contrato_validado: data.contrato_validado })
              .with('instituicao').with('curso').with('user')
              .with('cursoFormacaoConcluida')
              .with('instituicaoFormacaoConcluida')
              .with('user')
              .with('nivelacademico')
              .with('estado')
              .first();

          return ResponseHelper.getOnlyDataResponse(result)
      } catch (error) {
          //// //console.log(error)
          return ResponseHelper.getErrorResponse("nenhum dado encontrado")
      }
  }




















    async candidaturaInternaFiltro({ request, response }) {
        try {

            let data = request.all();
            let page = Number(data.page ? data.page : 1);
            let size = Number(data.size ? data.size : 10);

            //// //console.log(data);

            const candidato = await EduCandidatura.query()
                .where('nome', 'like', '%' + data.nome_bi + '%')
                .orWhere('ndi', 'like', '%' + data.nome_bi + '%')
                .with('instituicao').with('curso').with('user')
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

            // //// //console.log(candidato);

            return ResponseHelper.getOnlyDataResponse(candidato)
        } catch (error) {
            //// //console.log(error)
            return ResponseHelper.getErrorResponse("nenhum dado encontrado")
        }
    }

    async candidaturaInternaFiltroDados({ request, response }) {
        try {

            let data = request.all();
            let page = Number(data.page ? data.page : 1);
            let size = Number(data.tableSize ? data.tableSize : 10);




            if (data.nome_bi) {
                const candidato_bi = await EduCandidatura.query()
                    .where('ndi', 'like', '%' + data.nome_bi + '%')
                    .orWhere('nome', 'like', '%' + data.nome_bi + '%')
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
                    .orderBy('classificacao', 'desc')

                    .paginate(page, size);

                // //// //console.log(candidato);

                return ResponseHelper.getOnlyDataResponse(candidato_bi)
            }



            //// //console.log("logs candidatura instrea filtron....................");

            let query_candidatura = EduCandidatura.query()


            if (data.provincia) {

                // query_candidatura.where('base_provincia_formacao_id', data.provincia)

                //  let subquery_institucao_provincias = Database.from('edu_instituicoes').where({ base_provincia_id: data.provincia }).select('id')
                let subquery_uo_provincias = Database.from('edu_unidade_organicas').where({ base_provincia_id: data.provincia }).select('codigo')


                if (data.unidade_organica) {
                    subquery_uo_provincias = Database.from('edu_unidade_organicas').where({ id: data.unidade_organica }).select('codigo')
                } else {
                    //  subquery_uo_provincias = Database.from('edu_unidade_organicas').select('codigo')
                    subquery_uo_provincias = Database.from('edu_unidade_organicas').whereIn('codigo', subquery_uo_provincias).select('codigo')

                }



                let subquery_curso_uo = Database.from('edu_cursos').whereIn('edu_unidade_organica_codigo', subquery_uo_provincias).select('id')

                //   query_candidatura.whereIn('edu_instituicao_id', subquery_institucao_provincias)


                query_candidatura.whereIn('edu_curso_id', subquery_curso_uo)



            }
            if (data.instituicao) {
                query_candidatura.where('edu_instituicao_id', data.instituicao)
            }
            if (data.base_estado_id) {
                query_candidatura.where('base_estado_id', data.base_estado_id)
            }
            if (data.carenciado) {
                query_candidatura.where('carenciado', data.carenciado)
            }
            if (data.deficiente) {
                query_candidatura.where('deficiente', data.deficiente)
            }
            if (data.filho_antigo_combatente) {
                query_candidatura.where('filho_antigo_combatente', data.filho_antigo_combatente)
            }

            if (data.grau_academico) {
                if (Number(data.grau_academico) == 1)
                    query_candidatura.whereIn('base_nivel_formacao_id', [2, 3])
                else
                    query_candidatura.whereIn('base_nivel_formacao_id', [4, 5, 6])
            }
            if (data.nivel_academico) {
                query_candidatura.where('base_nivel_formacao_id', data.nivel_academico)
            }

            if (data.docente) {
                query_candidatura.where('docente', data.docente)
            }

            if (data.motivo_exclusao) {
                query_candidatura.where('edu_motivo_exclusoes_id', data.motivo_exclusao)
            }

            if (data.ano_conclusao) {
                query_candidatura.where('ano_conclusao', '<', data.ano_conclusao)
            }
            if (data.ano_frequencia) {
                query_candidatura.where('base_ano_frequencia_id', data.ano_frequencia)
            }
            if (data.media) {
                query_candidatura.where('media', '<', data.media)
            }


            if (data.idade_menor) {
                let ano = 2021 - Number(data.idade_menor)
                let ano_nascimento = ano + "-01-01"
                query_candidatura.where('data_nascimento', '>', ano_nascimento)
            }
            if (data.idade_maior) {
                let ano = 2021 - Number(data.idad_maior)
                let ano_nascimento = ano + "-01-01"
                query_candidatura.where('data_nascimento', '>', ano_nascimento)
            }
            /*

                   atribuir: "1",
                   user_id: "",
                   nivel_academico_id: "",
                   base_estado_id: "1",
                   quantidade: "",
                   edu_bolsa_id: "2021",
                   instituicao: "1",
                   unidade_organica: "",
                   curso: "",
                   frequencia_id: "",
                   ano_conclusao_id: "",
                   pais_id: "",
                   provincia: "",
                   tipoDeBolsa: 2021,
                   grau_academico: "",
                   nivel_academico: "",
                   motivo_exclusao: "",
                   edu_estado_id: "",
                   candidato: "",
                   idade: "",
                   docente: "",
                   classificacao: "",
                   ciclo_interrompido: "",
                   media_inferior_catoreze: ""

                   */


            const candidato = await query_candidatura
                .with('instituicao').with('curso').with('user')
                .with('instituicao.provincia')
                .with('cursoFormacaoConcluida')
                .with('instituicaoFormacaoConcluida')
                 .with('anexo')
                .with('anexo.itens')
                .with('anexo.itens.tipo_anexo')
                .with('nivelacademico')
                .with('motivo_exclusao')
                .with('estado')
                .with('BaseNivelFormacaoConcluida')
                .orderBy('classificacao', 'desc')

                .paginate(page, size);


            return ResponseHelper.getOnlyDataResponse(candidato)
        } catch (error) {
            //// //console.log(error)
            return ResponseHelper.getErrorResponse("nenhum dado encontrado")
        }
    }

    async saveCandidaturaInterna({ params, request, response }) {
        try {

            //// //console.log(" salvar candidato interno ........................")
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

                //// //console.log("------------------agregado----------------------")

                //// //console.log("----------------------------------------")
                this.saveAgregadoFamiliar(agregado)


                return ResponseHelper.getSuccessResponse("candidatura salva com sucesso")
            }
            return ResponseHelper.getErrorResponse("candidatura não foi salvo")
        } catch (err) {
            //// //console.log(err.message)
            //this.registarLog(username, "user", 'login', "0", "", "", err.message);

            return ResponseHelper.getErrorResponse("candidatura não foi salvo" + err.message)
        }
    }

    async validarCandidatura({ params, request, response }) {

        try {
            let data = request.only(requestFields);

            delete data.user
            // // //console.log(data)


            const edu_Candidatura = await EduCandidatura.query().where({ id: data.id }).first();

            //console.log("---------------------------------------------------------------------");
            //console.log("---------------------------------------------------------------------");

            //console.log("tentativa de salvar dados administrador .........")
            edu_Candidatura.merge(data);
            edu_Candidatura.save();

            return ResponseHelper.getSuccessResponse("Candidatura Actualizada com sucesso", edu_Candidatura)

        } catch (err) {
            //// //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro na actualização da candidatura")
        }
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
            //// //console.log("----------------------------------------------------");
            // //// //console.log(data);
            //// //console.log("----------------------------------------------------");
            if (data_id.id) {
                candidato = await this.findCandidaturaById(data.id);
                candidato.merge(data);
                await candidato.save();
            } else {
                candidato = await EduCandidatura.create(data);
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

            candidatura = await EduCandidatura.query()
                .where({ id: candidato.id })
                .with('candidatura_interna.curso.instituicao')
                .with('candidatura_externa.curso')
                .with('candidatura_externa.instituicao')
                .first();

            this.registarLog(candidato.id, "candidatura", 'registar', "1", "ip", "pais", "Candidatura Registada Com Sucesso");

            return ResponseHelper.getSuccessResponse("Candidatura registada com sucesso", candidatura)
        } catch (err) {
            //// //console.log(err.message)
            this.registarLog(candidato.id, "candidatura", 'registar', "0", "ip", "pais", err.message);

            return ResponseHelper.getErrorResponse("Erro ao registar a Candidatura")
        }
    }


    async update({ params, request, response }) {

        try {
            let data = request.only(requestFields);
            //console.log("---------------------------------------------------------------------");

            delete data.user
            ////


            const edu_Candidatura = await EduCandidatura.query().where({ id: data.id }).first();


            //console.log("tentativa de salvar dados não salvo .........")

            // return ResponseHelper.getErrorResponse("Dados Não Salvo", edu_Candidatura)


            delete data.base_estado_id
            //console.log(data)
            edu_Candidatura.merge(data);
            edu_Candidatura.save();

            return ResponseHelper.getSuccessResponse("Candidatura Actualizada com sucesso", edu_Candidatura)

        } catch (err) {
            //// //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro na actualização da candidatura")
        }
    }

    //------------------- Metodo para editar dados dos candidatos -----------------------------------------------
    async editarcandidatura({ params, request, response }) {

        try {
            let data = request.only(requestFieldsEditarDados);

            const edu_Candidatura = await EduCandidatura.query().where({ id: data.id }).first();

            edu_Candidatura.merge(data);
            edu_Candidatura.save();

            return ResponseHelper.getSuccessResponse("Candidatura Actualizada com sucesso", edu_Candidatura)

        } catch (err) {
            //// //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro na actualização da candidatura")
        }
    }

    //----------- metodo que confirma a validação de contrato por parte do bolseiro no portal ---------------------
    async BolseiroConfirmaValidacaoDoContrato({ request, response }) {

        try {

            let edu_Candidatura = '';

            let data = request.only(['id', 'bols_validacao_confirmado']);

            if (data.id) {

                edu_Candidatura = await EduCandidatura.query().where({ id: data.id }).first();
                edu_Candidatura.merge(data);
                edu_Candidatura.save();

            }

            return ResponseHelper.getSuccessResponse("Contrato Confirmado com Sucesso", edu_Candidatura)

        } catch (err) {

            return ResponseHelper.getErrorResponse("Erro ao Confirmar Contrato")
        }
    }

    //---------- Metodo para atribuir ou retirar candidatos a um determinado funcionario -------------------------------
    async atribuirCandidatoUser({ request, params, response }) {
        try {
            const data = request.all();
            //// //console.log("-----------------------atribuir candidatos--------------------------------------------")
            let candidatos
            let mensagem

            let nivel = []

            if (Number(data.nivel_academico_id) <= 2) {
                nivel = [2]
            } else {
                nivel = [3, 4, 5, 6]
            }

            //// //console.log(data)

            if (data.atribuir == 1) {
                candidatos = await EduCandidatura.query()



                    .where({ base_nivel_formacao_id: data.nivel_academico_id, base_estado_id: 1, edu_bolsa_id: data.edu_bolsa_id, validacao_user: null })
                    .orWhere({ base_nivel_formacao_id: data.nivel_academico_id, base_estado_id: null, edu_bolsa_id: data.edu_bolsa_id, validacao_user: null })

                    .limit(data.quantidade)
                    .update({ validacao_user: data.user_id })

                if (candidatos) {
                    mensagem = "candidatos atribuido com sucesso para validacao " + candidatos
                } else
                    return ResponseHelper.getErrorResponse("Nenhum candidato foi atribuido para este nivel de Formação")

            } else {
                candidatos = await EduCandidatura.query()

                    .where({ base_nivel_formacao_id: data.nivel_academico_id, base_estado_id: 1, edu_bolsa_id: data.edu_bolsa_id, validacao_user: data.user_id })
                    .orWhere({ base_nivel_formacao_id: data.nivel_academico_id, base_estado_id: null, edu_bolsa_id: data.edu_bolsa_id, validacao_user: data.user_id })

                    .limit(data.quantidade)
                    .update({ validacao_user: null })
                mensagem = "candidatos retirados com sucesso " + candidatos

            }


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

            const edu_Candidatura = await EduCandidatura.query().where({ id: data.id }).first();

            edu_Candidatura.merge(data);
            edu_Candidatura.save();

            //// //console.log(" candidato validado ... " + data_full.nome);


            let log = await EduCandidaturaEstado.create(data_log);

            //// //console.log("log de validacao  " + log.id)

            return ResponseHelper.getSuccessResponse("Candidatura Validada com sucesso", edu_Candidatura)

        } catch (err) {
            //// //console.log(err.message)
            return ResponseHelper.getErrorResponse("A Candidatura Não foi Validada")
        }

    }
    async saveCandidatura({ params, request, response }) {
        try {
            //// //console.log(" salvar candidato externo ........................")
            const data = request.all();
            let pessoa = request.only(requestFieldsPessoa);
            let candidato_interno = request.only(requestFieldsCandidatoInterno);
            let candidato_externo = request.only(requestFieldsCandidatoExterno);


            let candidato = data.candidaturas
            let formacao_concluida = data.formacoes
            let result_pessoa = await this.savePessoa(pessoa)

            if (result_pessoa == "Ja existe uma conta com este BI")
                return ResponseHelper.getErrorResponse("Ja existe uma conta com este BI")

            if (result_pessoa) {
                //// //console.log(result_pessoa)
                candidato.base_pessoa_id = result_pessoa.id
                formacao_concluida.base_pessoa_id = result_pessoa.id

                this.saveFormacao(formacao_concluida)
                let result_candidato = this.saveCandidato(candidato, candidato_interno, candidato_externo)

                return ResponseHelper.getSuccessResponse("candidatura salva com sucesso")
            }
            return ResponseHelper.getErrorResponse("candidatura não foi salvo")
        } catch (err) {
            //// //console.log(err.message)
            //this.registarLog(username, "user", 'login', "0", "", "", err.message);

            return ResponseHelper.getErrorResponse("candidatura não foi salvo" + err.message)
        }
    }


    async savePessoa(data) {
        try {
            let anexo
            if (!data.base_anexo_id) {
                anexo = await BaseAnexo.query().where({ user_id: data.user_id }).first();

                if (anexo)
                    data.base_anexo_id = anexo.id
                //// //console.log("user: " + data.user_id)
                //  //// //console.log(anexo)
            }

            ////// //console.log(data)
            let pessoa;
            if (data.id) {
                pessoa = await this.findPessoaById(data.id);
                data.dtEmissao = data.dtEmissao.substring(0, 10)
                data.data_nascimento = data.data_nascimento.substring(0, 10)
                if (data.user_id == pessoa.user_id) {
                    if (data.ndi != pessoa.ndi) {
                        let bi_exist = await this.findPessoaByBi(data.ndi);
                        if (bi_exist) {
                            this.registarLog(pessoa.nome, "user", 'login', "0", "", "", " Ja existe uma conta com este BI - " + pessoa.ndi);
                            return "Ja existe uma conta com este BI"
                        } else {
                            pessoa.merge(data);
                            await pessoa.save();
                            this.registarLog(pessoa.nome, "pessoa", 'actualizar', "1", "", "", "pessoa salva com sucesso");
                        }
                    } else {
                        pessoa.merge(data);
                        await pessoa.save();
                        this.registarLog(pessoa.nome, "pessoa", 'registar', "0", "", "", "pessoa salva com sucesso");

                    }
                }
            } else {
                data.dtEmissao = data.dtEmissao.substring(0, 10)
                data.data_nascimento = data.data_nascimento.substring(0, 10)
                let bi_exist = await this.findPessoaByBi(data.ndi);
                if (bi_exist) {
                    this.registarLog(data.nome, "pessoa", 'actualizar', "0", "", "", " Ja existe uma conta com este BI - " + data.ndi);
                    return ("Ja existe uma conta com este BI")
                } else {
                    pessoa = await BasePessoa.create(data);
                    pessoa = await this.findPessoaById(pessoa.id);
                    this.registarLog(pessoa.nome, "pessoa", 'registar', "0", "", "", "pessoa salva com sucesso");
                }
            }
            return await pessoa
        } catch (err) {
            //// //console.log(err.message)
            this.registarLog(data.nome, "user", 'login', "0", "", "", err.message);
            return ResponseHelper.getErrorResponse("Não pode Salvar os dados Pessoais")
        }

    }

    async saveFormacao(data) {
        //  //// //console.log(data)
        try {
            let formacao = await BaseHabilidadeLiteraria.query()
                .where({
                    base_pessoa_id: data.base_pessoa_id,
                    nivel_academico: data.nivel_academico
                }).first();

            if (formacao) {
                data.id = formacao.id
                formacao.merge(data);
                let result = await formacao.save();
                //  //// //console.log(result);
            } else {
                formacao = await BaseHabilidadeLiteraria.create(data);
            }

            //  await this.uploadFormacao(pessoa, formacao, request);
            this.registarLog("-", "formacaoConcluida", 'salvar', "1", "", "", "formação concluida salvo com sucesso");
            //   return ResponseHelper.getSuccessResponse("Formação registada com sucesso", formacao);
        } catch (err) {
            //// //console.log(err.message)
            this.registarLog("-", "formacaoConcluida", 'salvar', "0", "", "", err.message);
            // return ResponseHelper.getErrorResponse("Erro registar a formação: " + "deve preencher todos os campos");
        }
    }

    async saveAgregadoFamiliar(data) {
        //  //// //console.log(data)
        try {
            let agregado = await BaseAgregadoFamiliar.query()
                .where({
                    base_pessoa_id: data.base_pessoa_id
                    // nivel_academico: data.nivel_academico
                }).first();

            if (agregado) {
                data.id = agregado.id
                agregado.merge(data);
                let result = await agregado.save();
                //  //// //console.log(result);
            } else {
                agregado = await BaseAgregadoFamiliar.create(data);
            }

            this.registarLog("-", "agregado", 'salvar', "1", "", "", "agregado concluida salvo com sucesso");
            //   return ResponseHelper.getSuccessResponse("Formação registada com sucesso", formacao);
        } catch (err) {
            //// //console.log(err.message)
            this.registarLog("-", "agregado", 'salvar', "0", "", "", err.message);
            // return ResponseHelper.getErrorResponse("Erro registar a formação: " + "deve preencher todos os campos");
        }
    }

    async saveCandidato(data, candidato_interno, candidato_externo) {


        try {
            //// //console.log("candidatura save -----------------------------------------")
            //// //console.log(data)
            //// //console.log("candidatura save-----------------------------------------")

            delete data.candidatura_externa_id
            delete data.candidatura_interna_id

            let candidato_form = {
                ano_ingresso: data.ano_ingresso,
                edu_bolsa_id: data.edu_bolsa_id,
                frequencia: data.frequencia,
                base_pessoa_id: data.base_pessoa_id,
                media: data.media,
                base_nivel_academico_id: data.base_nivel_academico_id
            }




            const bolsa = await EduBolsa.find(data.edu_bolsa_id);
            if (!bolsa) {
                return ResponseHelper.getWarningResponse("Não foi encontrada a bolsa seleccionada", bolsa)
            }
            let candidato = await EduCandidatura.query()
                .where({
                    base_pessoa_id: data.base_pessoa_id,
                    edu_bolsa_id: data.edu_bolsa_id
                }).first();
            candidato_form.estado = GeneralConstants.ESTADOS_CANDIDATURAS.NOVA.code;

            if (candidato) {
                candidato_form.id = candidato.id;
                candidato.merge(candidato_form);
                await candidato.save();
            } else {
                candidato = await EduCandidatura.create(candidato_form);
            }


            delete data.matriculado

            delete data.aceite

            delete data.base_nivel_academico_id
            delete data.edu_bolsa_id
            delete data.base_pessoa_id

            data.edu_candidatura_id = candidato.id
            let candidaturaInterna;
            let candidaturaExterna;

            if (bolsa.tipo == GeneralConstants.TIPOS_BOLSAS.INTERNA.code) {
                candidaturaInterna = await EduCandidaturaInterna.query().where({ edu_candidatura_id: candidato.id }).first();
                if (candidaturaInterna) {
                    data.id = candidaturaInterna.id
                    candidaturaInterna.merge(data);
                    await candidaturaInterna.save();
                } else {
                    candidato.candidatura_interna = await candidato.candidatura_interna().create({ edu_curso_id: data.edu_curso_id, edu_instituicao_id: data.edu_instituicao_id, ano_ingresso: data.ano_ingresso, frequencia: data.frequencia, media: data.media })
                }
            } else {
                candidaturaExterna = await EduCandidaturaExterna.query().where({ edu_candidatura_id: candidato.id }).first();


                if (candidaturaExterna) {

                    data.id = candidaturaExterna.id

                    candidaturaExterna.merge(data);
                    await candidaturaExterna.save();
                } else {

                    candidato.candidatura_externa = await candidato.candidatura_externa().create({ base_curso_id: data.base_curso_id, edu_instituicao_id: data.edu_instituicao_id, ano_ingresso: data.ano_ingresso })
                }
            }


            this.registarLog(candidato.id, "candidatura", 'registar', "1", "ip", "pais", "Candidatura Registada Com Sucesso");

            return ResponseHelper.getSuccessResponse("Candidatura registada com sucesso", candidato)
        } catch (err) {
            //// //console.log(err.message)
            this.registarLog("", "candidatura", 'registar', "0", "ip", "pais", err.message);

            return ResponseHelper.getErrorResponse("Erro ao registar a Candidatura")
        }
    }
    async uploadAnexos({ params, request }) {
        try {

            const user = await User.query().where({ id: params.id }).first();

            if (!user) {
                return ResponseHelper.getErrorResponse("Não foi possível localizar a pessoa")
            }

            let anexo = await BaseAnexo.query().where({ user_id: params.id }).first();
            if (!anexo) {
                anexo = await BaseAnexo.create({ nome: 'Anexos da Pessoa: ' + user.email, estado: 1, user_id: user.id });
            }

            const DIR = Helpers.publicPath(`../../files/public/uploads/${user.email}/`);
            //// //console.log("--------------------caminho uploads...............................")
            //// //console.log(DIR)
            //// //console.log("--------------------caminho uploads...............................")
            let uploadedFilesSuccess = false;
            let uploadErrors = [];
            const tiposAnexos = await BaseTipoAnexo.all();


            for (let i = 0; i < tiposAnexos.rows.length; i++) {
                const tipoAnexo = tiposAnexos.rows[i];
                const uploadedFile = request.file(`uploads_${tipoAnexo.id}`, {
                    types: ['pdf'],
                    size: '1mb'
                })
                if (uploadedFile) {
                    const res = await this.registarAnexoItem(user, anexo, tipoAnexo, uploadedFile, DIR);
                    uploadErrors = res.errors;
                    uploadedFilesSuccess = res.success;
                }
            }

            if (uploadErrors.length || !uploadedFilesSuccess) {
                this.registarLog(user.email, "anexos", 'registar', "0", "ip", "pais", "Sem ficheiros em anexo");

                return ResponseHelper.getErrorResponse(!uploadedFilesSuccess ? "Sem ficheiros em anexo" : uploadedFile.error())
            }
            this.registarLog(user.email, "anexos", 'registar', "1", "ip", "pais", "ficheiros Anexados com sucesso");

            return ResponseHelper.getSuccessResponse("Ficheiros Anexados com sucesso");
        } catch (err) {
            //// //console.log(err.message)
            this.registarLog(user.email, "anexos", 'registar', "0", "ip", "pais", err.message);

            return ResponseHelper.getErrorResponse("Verifica o formato e o tamanho do Anexo")
        }
    }
    async registarAnexoItem(user, anexo, tipoAnexo, uploadedFile, DIR) {
        let uploadedFilesSuccess = 0
        let uploadErrors = [];
        let anexoItem = await BaseAnexoItens.findBy({
            base_anexo_id: anexo.id,
            base_tipo_anexo_id: tipoAnexo.id

        });

        if (!anexoItem) {
            anexoItem = await anexo.itens().create({
                nome: `${tipoAnexo.nome} de ${user.email}`,
                nome_ficheiro: `${tipoAnexo.codigo}`,
                //   url_ficheiro: `${user.email}/${tipoAnexo.codigo}`,
                url_ficheiro: `${user.email}`,
                base_tipo_anexo_id: tipoAnexo.id,

            })
            //   nome_ficheiro : uploadedFile._files[0].clientName,
            //  url_ficheiro : `DIR.${anexoItem.id}.${uploadedFile._files[0].extname}`
        }


        for (let k = 0; k < uploadedFile._files.length; k++) {
            await uploadedFile._files[k].move(DIR, {
                name: `${tipoAnexo.codigo}.${uploadedFile._files[k].extname}`,
                overwrite: true
            })

            if (!uploadedFile._files[k].moved()) {
                uploadErrors.push(uploadedFile._files[k].error())
            } else {
                uploadedFilesSuccess++;
            }
        }

        return {
            errors: uploadErrors,
            success: uploadedFilesSuccess
        }
    }
    // fim do candastro da candidatura

    /*async index({ request, response, view }) {
      try {
        const candidatura = await EduCandidatura.all()
        return ResponseHelper.getSuccessResponse(candidatura)
      } catch (err) {
        //// //console.log(err.message)
        return ResponseHelper.getErrorResponse("Erro ao listar Candidaturas")
      }
    }*/


    /**
     * Show a list of all eduCandidatura.
     * GET eduCandidatura
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */


    async index({ params, request, response }) {
        try {

            return ResponseHelper.getOnlyDataResponse(
                await EduCandidatura.query()
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

                    .fetch())

        } catch (err) {
            //// //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao listar as Candidaturas")
        }
    }

    async resultadoCandidaturaInterna({ params, request, response, view }) { //


        //// //console.log(params.bi);
        // let pessoa = await this.findPessoaByBi(params.bi); // data.pessoa.ndi
        const pessoa = await BasePessoa.query()
            .where('ndi', 'like', '' + params.bi + '')
            .with('user').firstOrFail();
        if (pessoa) {
            //// //console.log(pessoa.ndi);

            try {

                this.registarLog(params.bi, "", "consulta", 'bei', "0", "", "", "sucesso");
                return ResponseHelper.getOnlyDataResponse(
                    await EduCandidatura.query()
                        .where({ base_pessoa_id: pessoa.id, edu_bolsa_id: 1 })
                        .with('pessoa')
                        .with('pessoa.user')
                        .with('candidatura_interna.instituicao')
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
                        .first())
            } catch (err) {

                this.registarLog(params.bi, "", "consulta", 'bei', "0", "", "", err.message);
                //// //console.log(err.message)
                return ResponseHelper.getErrorResponse("candidatura não encontrada")
            }
        }


    }

    async candidaturaListParams({ params, request, response, view }) { //


        //// //console.log(params.bi);
        // let pessoa = await this.findPessoaByBi(params.bi); // data.pessoa.ndi
        const pessoa = await BasePessoa.query()
            .where('ndi', 'like', '%' + params.bi + '%')
            .with('user').firstOrFail();
        if (pessoa) {
            //// //console.log(pessoa.ndi);

            try {
                return ResponseHelper.getOnlyDataResponse(
                    await EduCandidatura.query()
                        .where({ base_pessoa_id: pessoa.id })
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
                        .fetch())
            } catch (err) {
                //// //console.log(err.message)
                return ResponseHelper.getErrorResponse("Erro ao listar Candidaturas")
            }
        }


    }

    // adicionado metodo show

    /**
     * Show eduCandidatura details.
     * Show eduCandidatura/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */

    async show({ params, request, response, view }) {
        try {
            //// //console.log(params)
            let result = await EduCandidatura.query()
                .where({ user_id: params.id })
                .with('user')
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
            return ResponseHelper.getOnlyDataResponse(result)

        } catch (err) {
            //// //console.log(err.message)
            return ResponseHelper.getErrorResponse("Candidatura Não Encontrada")
        }
    }




    async candidaturasporbi({ params, request, response, view }) {
        try {
            //// //console.log(params)
            let result = await EduCandidatura.query()
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


    async consultarContratoValidado({ params, request, response, view }) {
        try {
            //// //console.log(params)
            let result = await EduCandidatura.query()
                .where({ ndi: params.ndi })
                .where({ contrato_validado: 1 })
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


            if (result) {
                return ResponseHelper.getOnlyDataResponse(result)
            } else {
                result = await EduCandidatura.query()
                    .where({ ndi: params.ndi, base_estado_id: 3 })
                    .first()


                //  console.log("O seu Contrato Não foi Validado, por favor  ")
                // console.log(result)
                if (result)
                    return ResponseHelper.getErrorResponse("O seu contrato não foi Validado, por favor  clica no botão reclamação")
            }

            return ResponseHelper.getErrorResponse("Candidatura Não Encontrada verifica o numero do BI")

        } catch (err) {
            //// //console.log(err.message)
            return ResponseHelper.getErrorResponse("Candidatura Não Encontrada verifica o numero do BI")
        }
    }


    /**
     * Update eduCandidatura details.
     * PUT or PATCH eduCandidatura/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */

    async aprovarcandidaturaindividual({ params, request, response }) {

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

            //// //console.log("=====================================================")
            //// //console.log("aprovados " + candidatos_aprovados + "quotas graduação " + provincia.bolsa_graduacao + "quotas pós-graduação " + provincia.bolsa_posgraduacao)

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
            //// //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro na actualização da candidatura")
        }
    }

    async aprovarcandidaturaporcota1({ params, request, response }) {
        try {
            let data = request.all();
            const provincia = await BaseProvincia.query().where({ id: data.provincia }).first()

            let subquery_institucao_provincias = null
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

            if (query_candidatura_interna)
                query_candidatura.whereIn('id', query_candidatura_interna)

            if (data.nivel_academico == 2)
                query_candidatura.where('base_nivel_academico_id', 2)
            else
                query_candidatura.where('base_nivel_academico_id', '>', 2)




            //    //// //console.log(query_candidatura)

            let query_candidatura_aprovado = query_candidatura
            query_candidatura_aprovado.where('edu_estado_id', 3)
            let candidatos_aprovados = await query_candidatura_aprovado.getCount()

            let vagas = 10
            if (data.nivel_academico == 2)
                vagas = provincia.bolsa_graduacao - candidatos_aprovados
            else
                vagas = provincia.bolsa_posgraduacao - candidatos_aprovados

            // query_candidatura.where('edu_estado_id', 2)
            const edu_candidaturas = await query_candidatura.where({ edu_estado_id: 3 })
                .with('nivelacademico').orderBy('classificacao', 'desc').limit(500).fetch()


            //// //console.log(data);
            //// //console.log(vagas);
            //// //console.log(edu_candidaturas.toJSON());
            //// //console.log("==================================================================")
            //// //console.log("NIVEL " + data.nivel_academico + " aprovados " + "  - " + candidatos_aprovados + " quotas graduação " + provincia.bolsa_graduacao + " quotas pós-graduação " + provincia.bolsa_posgraduacao)

            if (data.nivel_academico == 2)
                if (candidatos_aprovados < provincia.bolsa_graduacao) {
                    const candidatura_list = edu_candidaturas.toJSON()
                    //// //console.log("aprovar candidato de graduação " + candidatura_list.length);

                    for (let candidato of candidatura_list) {
                        await EduCandidatura.query().where({ id: candidato.id }).update({ edu_estado_id: 3 })
                        let caandidato_aprovado = candidatos_aprovados - 1
                    }
                    return ResponseHelper.getSuccessResponse("Candidatura Actualizada com sucesso", edu_candidaturas)
                } else {
                    return ResponseHelper.getErrorResponse("numero de vagas esgotada", null)
                }

            if (data.nivel_academico > 2)
                if (candidatos_aprovados < provincia.bolsa_posgraduacao) {

                    const candidatura_list = edu_candidaturas.toJSON()
                    //// //console.log("aprovar candidato de pós-graduação " + candidatura_list.length);
                    for (let candidato of candidatura_list) {
                        await EduCandidatura.query().where({ id: candidato.id }).update({ edu_estado_id: 3 })
                        let caandidato_aprovado = candidatos_aprovados - 1
                    }


                    return ResponseHelper.getSuccessResponse("Candidatura Actualizada com sucesso", edu_candidaturas)
                } else {
                    return ResponseHelper.getErrorResponse("numero de vagas esgotada", null)
                }


        } catch (err) {
            //// //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro na actualização da candidatura")
        }
    }

    async aprovarcandidaturaporcota({ request, params, response }) {

        try {

            const data = request.all();
            const provincia = await BaseProvincia.query().where({ id: data.provincia }).first()

            //  //// //console.log(data)
            //   let subquery_candidatura_interna = await this.getFiltro(data);
            let subquery_institucao_provincias
            let query_candidatura = EduCandidatura.query()
            let query_candidatura_aprovado = EduCandidatura.query()

            if (data.provincia) {

                //subquery_institucao_provincias = Database.from('edu_instituicoes').where({ base_provincia_id: data.provincia }).select('id')


                // query_candidatura.where('base_provincia_formacao_id', data.provincia)

                //  let subquery_institucao_provincias = Database.from('edu_instituicoes').where({ base_provincia_id: data.provincia }).select('id')
                let subquery_uo_provincias = Database.from('edu_unidade_organicas').where({ base_provincia_id: data.provincia }).select('codigo')

                let subquery_curso_uo = Database.from('edu_cursos').whereIn('edu_unidade_organica_codigo', subquery_uo_provincias).select('id')

                //   query_candidatura.whereIn('edu_instituicao_id', subquery_institucao_provincias)

                query_candidatura.whereIn('edu_curso_id', subquery_curso_uo)

                query_candidatura_aprovado.whereIn('edu_curso_id', subquery_curso_uo)
            }




            /* if (data.instituicao)
       query_candidatura.where('edu_instituicao_id', data.instituicao)

       if (data.query_candidatura_aprovado)
       query_candidatura_aprovado.where('edu_instituicao_id', data.instituicao)

       */

            //  if (data.carenciado)
            //    query_candidatura_interna.where('carenciado', data.carenciado)

            // if (subquery_institucao_provincias)
            //   query_candidatura.whereIn('edu_instituicao_id', subquery_institucao_provincias)

            //if (subquery_institucao_provincias)
            //   query_candidatura_aprovado.whereIn('edu_instituicao_id', subquery_institucao_provincias)



            if (data.tipoDeBolsa)
                query_candidatura.where('edu_bolsa_id', data.tipoDeBolsa)
            if (data.tipoDeBolsa)
                query_candidatura_aprovado.where('edu_bolsa_id', data.tipoDeBolsa)


            if (data.grau_academico == 1) {
                query_candidatura.whereIn('base_nivel_formacao_id', [2, 3])
                query_candidatura_aprovado.whereIn('base_nivel_formacao_id', [2, 3])
            } else {
                query_candidatura.whereIn('base_nivel_formacao_id', [4, 5, 6])
                query_candidatura_aprovado.whereIn('base_nivel_formacao_id', [4, 5, 6])
                // query_candidatura.where('base_nivel_academico_id', '>=', data.nivel_academico)
                //  query_candidatura_aprovado.where('base_nivel_academico_id', '>=', data.nivel_academico)

            }



            query_candidatura.where('base_estado_id', 2)
            query_candidatura_aprovado.where('base_estado_id', 3)
            let candidatos_aprovados = await query_candidatura_aprovado.getCount()

            let vagas = 0
            if (data.grau_academico == 1)
                vagas = Number(provincia.bolsa_graduacao) - Number(candidatos_aprovados)
            else
                vagas = Number(provincia.bolsa_posgraduacao) - Number(candidatos_aprovados)


            if (vagas < 0)
                vagas = vagas * (-1)
            //// //console.log(provincia.bolsa_graduacao)
            //// //console.log("aprovados " + candidatos_aprovados)
            //// //console.log("vagas " + vagas)

            let candidatura = ""

            if (data.grau_academico == 1) {
                candidatura = await query_candidatura
                    .with('nivelacademico')
                    //   .with('estado')
                    .orderBy('classificacao', 'desc')
                    .limit(vagas)
                    .fetch()
            } else {
                candidatura = await query_candidatura
                    .with('nivelacademico')
                    //   .with('estado')
                    .orderBy('classificacao', 'desc')
                    .limit(vagas)
                    .fetch()
            }

            let cont = 1;
            //// //console.log("candidatos a provar " + vagas)
            if (candidatura) {
                let candidatura_json = candidatura.toJSON();

                //// //console.log(candidatura_json)
                for (let candidato of candidatura_json) {
                    await EduCandidatura.query().where({ id: candidato.id }).update({ base_estado_id: 3 })
                    //  let caandidato_aprovado = candidatos_aprovados - 1
                    cont++
                    //// //console.log(cont)
                }
            }
            //// //console.log("novos aprovados " + cont)


            return ResponseHelper.getOnlyDataResponse(candidatura)

        } catch (err) {
            //// //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao listar as Candidaturas desta bolsa")
        }

    }


    async relatorioCandidaturapories({ request, params, response }) {

        try {

            const data = request.all();
            const provincia = await BaseProvincia.query().where({ id: data.provincia }).first()

            //  //// //console.log(data)
            //   let subquery_candidatura_interna = await this.getFiltro(data);
            let subquery_institucao_provincias
            let query_candidatura = EduCandidatura.query()
            let query_candidatura_aprovado = EduCandidatura.query()

            if (data.provincia) {



                let instituicoes = await EduInstitucao.query().where({ user_id: params.id }).fech()


                for (let instituicao of instituicoes) {


                    // query_candidatura.where('base_provincia_formacao_id', data.provincia)

                    //  let subquery_institucao_provincias = Database.from('edu_instituicoes').where({ base_provincia_id: data.provincia }).select('id')
                    let subquery_uo_provincias = Database.from('edu_unidade_organicas').where({ base_provincia_id: data.provincia, edu_instituicao_id: instituicao.id }).select('codigo')


                    if (subquery_uo_provincias) {

                        let subquery_curso_uo = Database.from('edu_cursos').whereIn('edu_unidade_organica_codigo', subquery_uo_provincias).select('id')

                        //   query_candidatura.whereIn('edu_instituicao_id', subquery_institucao_provincias)

                        query_candidatura.whereIn('edu_curso_id', subquery_curso_uo)

                        query_candidatura_aprovado.whereIn('edu_curso_id', subquery_curso_uo)


                        if (data.tipoDeBolsa)
                            query_candidatura.where('edu_bolsa_id', data.tipoDeBolsa)
                        if (data.tipoDeBolsa)
                            query_candidatura_aprovado.where('edu_bolsa_id', data.tipoDeBolsa)


                        if (data.grau_academico == 1) {
                            query_candidatura.whereIn('base_nivel_formacao_id', [2, 3])
                            query_candidatura_aprovado.whereIn('base_nivel_formacao_id', [2, 3])
                        } else {
                            query_candidatura.whereIn('base_nivel_formacao_id', [4, 5, 6])
                            query_candidatura_aprovado.whereIn('base_nivel_formacao_id', [4, 5, 6])
                            // query_candidatura.where('base_nivel_academico_id', '>=', data.nivel_academico)
                            //  query_candidatura_aprovado.where('base_nivel_academico_id', '>=', data.nivel_academico)

                        }



                        query_candidatura.where('base_estado_id', 2)
                        query_candidatura_aprovado.where('base_estado_id', 3)
                        let candidatos_aprovados = await query_candidatura_aprovado.getCount()

                        let vagas = 0
                        if (data.grau_academico == 1)
                            vagas = Number(provincia.bolsa_graduacao) - Number(candidatos_aprovados)
                        else
                            vagas = Number(provincia.bolsa_posgraduacao) - Number(candidatos_aprovados)


                        if (vagas < 0)
                            vagas = vagas * (-1)
                        //// //console.log(provincia.bolsa_graduacao)
                        //// //console.log("aprovados " + candidatos_aprovados)
                        //// //console.log("vagas " + vagas)

                        let candidatura = ""

                        if (data.grau_academico == 1) {
                            candidatura = await query_candidatura
                                .with('nivelacademico')
                                //   .with('estado')
                                .orderBy('classificacao', 'desc')
                                .limit(vagas)
                                .fetch()
                        } else {
                            candidatura = await query_candidatura
                                .with('nivelacademico')
                                //   .with('estado')
                                .orderBy('classificacao', 'desc')
                                .limit(vagas)
                                .fetch()
                        }

                        let cont = 1;

                        //// //console.log("novos aprovados " + cont)
                    }
                }
            }

            return ResponseHelper.getOnlyDataResponse(candidatura)

        } catch (err) {
            //// //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao listar as Candidaturas desta bolsa")
        }

    }



    async retirarAprovadocandidaturaporcota({ params, request, response }) {

        try {
            let filtro = request.all();
            const eduCandidatura = await EduCandidatura.query()
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
                .orderBy('classificacao', 'desc')
                .limit(10)
                .fetch()

            const candidatura_list = eduCandidatura.toJSON()

            for (let data of candidatura_list) {
                await EduCandidatura.query().where({ id: data.id }).update({ edu_estado_id: 2 })
            }


            return ResponseHelper.getSuccessResponse("Candidatura Actualizada com sucesso", eduCandidatura)

        } catch (err) {
            //// //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro na actualização da candidatura")
        }

    }




    async candidaturaExtatistica({ params, response, view }) {
        let users = await User.all();
        let estados = await EduEstado.all();
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
    }

    /*
     async index({ params, request, response }) {

       try {
                const eduCandidatura = await EduCandidatura.query().with('motivo_exclusao').fetch()
                return ResponseHelper.getOnlyDataResponse(eduCandidatura)
            } catch (err) {
                console.error(err)
                return ResponseHelper.getErrorResponse("Erro ao listar Candidaturas")
            }
    }
    */
    /*
      async indexcandidaturainterna({ params, request, response }) {

          try {

             return ResponseHelper.getOnlyDataResponse(
                 await EduCandidaturaInterna.query()
              .with('candidatura')
              .with('candidatura.pessoa')
              .with('candidatura.bolsa')
              .with('candidatura.candidatura_interna.instituicao')
              .with('candidatura.candidatura_interna.curso')

              .fetch())

        } catch (err) {
          //// //console.log(err.message)
          return ResponseHelper.getErrorResponse("Erro ao listar Candidaturas Internas")
        }
      }

      async indexcandidaturaexterna({ request, response, view }) {

        try {

          return ResponseHelper.getOnlyDataResponse(
            await EduCandidaturaExterna.query()
            .with('candidatura')
            .with('candidatura.pessoa')
            .with('candidatura.bolsa')
            .with('candidatura.candidatura_externa.instituicao')
            .with('candidatura.candidatura_externa.curso')


            .fetch())

        } catch (err) {
          //// //console.log(err.message)
          return ResponseHelper.getErrorResponse("Erro ao listar Candidaturas Externas")
        }
      }*/


    /**async indexcandidaturabolsa({ params, request, response}) {
    try {

      //// //console.log( params.bolsa_id)
      return ResponseHelper.getOnlyDataResponse(
      await EduCandidatura.query()
      .where({edu_bolsa_id : params.bolsa_id})
      .with('pessoa')
      .with('bolsa')
      .fetch()  )

    } catch (err) {
      //// //console.log(err.message)
      return ResponseHelper.getErrorResponse("Erro ao listar as Candidaturas desta bolsa")
    }
  }*/



    async findPessoaById(id) {
        return BasePessoa.query()
            .where({ id: id })
            .with('municipio.provincia')
            .with('municipio_residencia.provincia')
            .with('contactos')
            .with('formacoes.instituicao.provincia')
            .with('candidaturas.candidatura_interna.curso.instituicao')
            .with('candidaturas.candidatura_externa.instituicao')
            .with('candidaturas.candidatura_externa.curso')
            .first();
    }

    async findPessoaByParamsi(nome, ndi) {
        return BasePessoa.query()
            .where({ nome: nome })
            .or({ ndi: ndi })
            .with('municipio.provincia')
            .with('municipio_residencia.provincia')
            .with('contactos')
            .with('formacoes.instituicao.provincia')
            .with('candidaturas.candidatura_interna.curso.instituicao')
            .with('candidaturas.candidatura_externa.instituicao')
            .with('candidaturas.candidatura_externa.curso')
            .first();
    }


    async findPessoaByUserId(user_id) {
        return BasePessoa.query()
            .where({ user_id: user_id })
            .with('user')

            .with('municipio.provincia')
            .with('municipio_residencia.provincia')
            .with('contactos')
            .with('formacoes.instituicao.provincia')
            .with('candidaturas.candidatura_interna.curso.instituicao')
            .with('candidaturas.candidatura_externa.instituicao')
            .with('candidaturas.candidatura_externa.curso')
            .first();
    }
    async findPessoaByBi(ndi) {
        return BasePessoa.query()
            .Where({ ndi: ndi })
            .with('user')
            .with('municipio.provincia')
            .with('municipio_residencia.provincia')
            .with('contactos')
            .with('formacoes.instituicao.provincia')
            .with('candidaturas.candidatura_interna.curso.instituicao')
            .with('candidaturas.candidatura_externa.instituicao')
            .with('candidaturas.candidatura_externa.curso')
            .first();
    }

    async findPessoaByParams(nome, ndi) {
        return BasePessoa.query()
            .where({ nome: nome })
            .or({ ndi: ndi })
            .with('municipio.provincia')
            .with('municipio_residencia.provincia')
            .with('contactos')
            .with('formacoes.instituicao.provincia')
            .with('candidaturas.candidatura_interna.curso.instituicao')
            .with('candidaturas.candidatura_externa.instituicao')
            .with('candidaturas.candidatura_externa.curso')
            .first();
    }

    async findPessoaById(id) {
        return BasePessoa.query()
            .where({ id: id })
            .with('municipio.provincia')
            .with('municipio_residencia.provincia')
            .with('contactos')
            .with('formacoes.instituicao.provincia')
            .with('candidaturas.candidatura_interna.curso.instituicao')
            .with('candidaturas.candidatura_externa.instituicao')
            .with('candidaturas.candidatura_externa.curso')
            .first();
    }
    async findPessoaByUserId(user_id) {
        return BasePessoa.query()
            .where({ user_id: user_id })
            .with('user')
            .with('municipio.provincia')
            .with('municipio_residencia.provincia')
            .with('contactos')
            .with('formacoes.instituicao.provincia')
            .with('candidaturas.candidatura_interna.curso.instituicao')
            .with('candidaturas.candidatura_externa.instituicao')

            .with('candidaturas.candidatura_externa.curso')
            .first();
    }

    async findCandidaturaById(id) {
        return await EduCandidatura.query()
            .where({ id: id })
            //.with('pessoa')
            //.with('candidatura_interna.curso.instituicao')
            //.with('candidatura_externa.instituicao')
            //.with('candidatura_externa.curso')
            .first();
    }
    async findCandidaturaInternaById(id) {
        return await EduCandidaturaInterna.query()
            .where({ id: id })
            .with('candidatura')
            .with('curso.instituicao')
            .first();
    }
    async findCandidaturaExternaById(id) {
        return await EduCandidaturaExterna.query()
            .where({ id: id })
            .with('candidatura')
            .with('candidatura_externa.instituicao')
            .with('candidatura_externa.curso')
            .first();
    }

    async salvarCandidaturaInfoBanco({ request, response }) {
        try {
            // let request_candidatura = request.all();
            let request_candidatura = request.only(['id', 'banco', 'nome_conta', 'numero_conta', 'nib', 'iban', 'contrato_imprenso',]);

            let candidato = null
            let message = null
            if (request_candidatura.id) {

                let result_candidatura = await EduCandidatura.query().where({ id: request_candidatura.id, }).first();

                if (result_candidatura.contrato_validado == 1)
                    return ResponseHelper.getOnlyDataResponse(" O contrato será imprenso")

                if (result_candidatura.contrato_validado == 2)
                    return ResponseHelper.getOnlyDataResponse(" O contrato será imprenso")

                if (result_candidatura) {
                    result_candidatura.merge(request_candidatura);
                    candidato = await result_candidatura.save();
                    message = "dados bancario de " + request_candidatura.nome + " actualizado com sucesso, imprimindo o contrato"
                }
            }



            return ResponseHelper.getOnlyDataResponse(message)
        } catch (err) {

            //// //console.log("candidatura não salvo .......... " + request_candidatura.nome)
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Candidatura Não Efectuada")
        }

    }





    async salvarCandidatura({ request, response }) {
        try {
            // let request_candidatura = request.all();
            let request_candidatura = request.only(requestFieldsCandidatura);

            let bolsa = await EduBolsa.query().where({ id: request_candidatura.edu_bolsa_id, }).first();


            if (!bolsa) {
                return ResponseHelper.getErrorResponse("Bolsa Indisponivel !... ")
            }

            let date1 = new Date(bolsa.data_abertura);
            let date2 = new Date(bolsa.data_encerramento);
            let data_abertura = new Date(date1)
            let data_encerramento = new Date(date2)


            let data_hoje = new Date()

            if (data_hoje.getTime() < data_abertura.getTime()) {
                return ResponseHelper.getErrorResponse("A Candidatura a está bolsa ainda não está aberta ")
            }

            if (data_hoje.getTime() > data_encerramento.getTime()) {
                return ResponseHelper.getErrorResponse(" A Bolsa Ja está Encerrada.")
            }
            ////console.log("salvar candidatura .........." + request_candidatura.nome)




            //// //console.log("salvar candidatura .........." + request_candidatura.nome)

            let candidato = null
            let matricula_id = 0;
            let message = ""
            let result_candidatura = await EduCandidatura.query().where({
                user_id: request_candidatura.user_id,
                edu_bolsa_id: request_candidatura.edu_bolsa_id
            }).first();

            if (result_candidatura) {




                result_candidatura.merge(request_candidatura);
                candidato = await result_candidatura.save();
                message = "dados de" + request_candidatura.nome + " actualizado com sucesso"





            } else {

                let candidato_existe = await EduCandidatura.query().where(
                    {
                        ndi: request_candidatura.ndi,
                        edu_bolsa_id: request_candidatura.edu_bolsa_id
                    }).with('user').first();


                if (candidato_existe) {

                    let candidato_json = candidato_existe.toJSON()

                    //// //console.log("Ja Existe uma candidatura associado ao bi " + request_candidatura.ndi + " com email -  " + candidato_json.user.email)

                    return ResponseHelper.getErrorResponse("Ja Existe uma candidatura associado ao bi " + request_candidatura.ndi + " com email - " + candidato_json.user.email)
                }

                let ultimo_estudante = await EduCandidatura.query().orderBy('id', 'desc').first();

                let ultimo_numero = 0

                if (ultimo_estudante)
                    ultimo_numero = ultimo_estudante.numero_processo_seq


                let proximo_numero = Number(ultimo_numero) + 1
                request_candidatura.numero_processo_seq = proximo_numero



                candidato = await EduCandidatura.create(request_candidatura);
                matricula_id = candidato.id
                message = request_candidatura.nome + " foi Salvo com sucesso"
            }

            //// //console.log(message)


            return ResponseHelper.getSuccessResponse(message, candidato)
        } catch (err) {

            //// //console.log("candidatura não salvo .......... " + request_candidatura.nome)
            console.log(err)
            return ResponseHelper.getErrorResponse("Candidatura Não Efectuada")
        }

    }


    async salvarCandidaturaExterna({ request, response }) {
        try {
            // let request_candidatura = request.all();
            let request_candidatura = request.only(requestFieldsCandidatura);




            let bolsa = await EduBolsa.query().where({ id: request_candidatura.edu_bolsa_id, }).first();


            if (!bolsa) {
                return ResponseHelper.getErrorResponse("Bolsa Indisponivel !... ")
            }

            let date1 = new Date(bolsa.data_abertura);
            let date2 = new Date(bolsa.data_encerramento);
            let data_abertura = new Date(date1)
            let data_encerramento = new Date(date2)


            let data_hoje = new Date()

            if (data_hoje.getTime() < data_abertura.getTime()) {
                return ResponseHelper.getErrorResponse("A Candidatura a está bolsa ainda não está aberta ")
            }

            if (data_hoje.getTime() > data_encerramento.getTime()) {
                return ResponseHelper.getErrorResponse(" A Bolsa Ja está Encerrada.")
            }
            ////console.log("salvar candidatura .........." + request_candidatura.nome)




            //// //console.log(request_candidatura)

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

                let candidato_existe = await EduCandidaturaExterna.query().where(
                    {
                        ndi: request_candidatura.ndi,
                        edu_bolsa_id: request_candidatura.edu_bolsa_id
                    }).with('user').first();



                //// //console.log(" 2salvar candidatura ..........")
                if (candidato_existe) {

                    let candidato_json = candidato_existe.toJSON()

                    //// //console.log("Ja Existe uma candidatura associado ao bi " + request_candidatura.ndi + " com email -  " + candidato_json.user.email)

                    return ResponseHelper.getErrorResponse("Ja Existe uma candidatura associado ao bi " + request_candidatura.ndi + " com email - " + candidato_json.user.email)
                }

                let ultimo_estudante = await EduCandidaturaExterna.query().where({ edu_bolsa_id: request_candidatura.edu_bolsa_id }).orderBy('id', 'desc').first();

                let ultimo_numero = 0

                if (ultimo_estudante)
                    ultimo_numero = ultimo_estudante.numero_processo_seq


                let proximo_numero = Number(ultimo_numero) + 1
                request_candidatura.numero_processo_seq = proximo_numero



                candidato = await EduCandidaturaExterna.create(request_candidatura);
                matricula_id = candidato.id
                message = request_candidatura.nome + " foi Salvo com sucesso"
            }

            //// //console.log(message)


            return ResponseHelper.getSuccessResponse(message, candidato)
        } catch (err) {

            //   //// //console.log("candidatura não salvo .......... " + request_candidatura.nome)
            console.log(err.message)
            return ResponseHelper.getErrorResponse("Candidatura Não Efectuada")
        }

    }




    async destroy({ params, request, response }) {
        try {

            let candidato = await EduCandidatura.find(params.id);

            if (candidato.estado != GeneralConstants.ESTADOS_CANDIDATURAS.NOVA.code) {
                return ResponseHelper.getWarningResponse("O estado da candidatura não permite o cancelamento")
            }

            candidato.estado = GeneralConstants.ESTADOS_CANDIDATURAS.CANCELADA.code;
            await candidato.save();
            return ResponseHelper.getSuccessResponse("Candidatura cancelada com sucesso", candidato)
        } catch (err) {
            //// //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao cancelar a Candidatura")
        }
    }

    header(text) {
        return { text: text, margins: [0, 0, 0, 8] };
    }

    async imprimirFicha({ params, response }) {

        const candidato = await EduCandidatura.find(params.id);

        if (!candidato) {
            throw Error("Candidatura não encontrada.");
        }

        //const pessoa = await candidato.pessoa().first();

        const pessoa = await BasePessoa.query()
            .where({ id: candidato.base_pessoa_id })
            .with('user')
            .with('municipio.provincia')
            .with('municipio_residencia.provincia')
            .with('agregado')
            .with('anexo.itens.tipo_anexo')
            .first();

        //// //console.log(pessoa.telefone_principal);

        const pessoaMunicipio = pessoa.base_municipio_id ? await pessoa.municipio().first() : { nome: 'Desconhecido' };
        const pessoaProvincia = pessoa.base_municipio_id ? await pessoaMunicipio.provincia().first() : { nome: 'Desconhecida' };
        const pessoaMunicipioResidencia = pessoa.municipio_residencia_id ? await pessoa.municipio_residencia().first() : { nome: 'Desconhecido' };
        const pessoaProvinciaResidencia = pessoa.municipio_residencia_id ? await pessoaMunicipioResidencia.provincia().first() : { nome: 'Desconhecido' };
        const contactos = await pessoa.contactos().fetch();

        const telemovel = contactos.rows.filter(c => c.tipo_contacto == GeneralConstants.TIPOS_CONTACTOS.TELEMOVEL.code).pop();
        const whatsapp = contactos.rows.filter(c => c.tipo_contacto == GeneralConstants.TIPOS_CONTACTOS.WHATSAPP.code).pop();
        const facebook = contactos.rows.filter(c => c.tipo_contacto == GeneralConstants.TIPOS_CONTACTOS.FACEBOOK.code).pop();
        const skype = contactos.rows.filter(c => c.tipo_contacto == GeneralConstants.TIPOS_CONTACTOS.SKYPE.code).pop();
        const email = contactos.rows.filter(c => c.tipo_contacto == GeneralConstants.TIPOS_CONTACTOS.EMAIL.code).pop();

        const contacto = {
            telemovel: telemovel ? pessoa.telefone_principal : ' ',
            whatsapp: whatsapp ? pessoa.telefone_alternativo : ' ',
            facebook: facebook ? facebook.contacto : ' ',
            skype: skype ? skype.contacto : ' ',
            email: email ? pessoa.user.email : ' '
        };

        const bolsa = await candidato.bolsa().first();
        const formacoes = await pessoa.formacoes().fetch();
        const formacao = await pessoa.formacoes().first();

        const formacao_instituicao = formacao.edu_instituicao_id ? await formacao.instituicao().first() : { nome: 'Desconhecida' };
        const formacao_curso = formacao.base_curso_id ? await formacao.curso().first() : { nome: 'Desconhecido' };


        let instituicao;
        let curso;
        let candidatura_desejada;
        const candidatura_interna = await candidato.candidatura_interna().first();
        //candidaturaExterna = await EduCandidaturaExterna.query().where({ edu_candidatura_id: candidato.id }).first();

        if (candidatura_interna) {

            curso = await candidatura_interna.curso().first();
            instituicao = await curso.instituicao().first();
            candidatura_desejada = candidatura_interna;
        } else {
            const candidatura_externa = await candidato.candidatura_externa().first();
            curso = candidatura_externa.base_curso_id ? await candidatura_externa.curso().first() : { nome: 'Desconhecido' };

            instituicao = candidatura_externa.base_instituicao_id ? await candidatura_externa.instituicao().first() : { nome: ' - ' };


            candidatura_desejada = candidatura_externa;
        }

        ////// //console.log(candidatura_desejada.media);

        this.registarLog(pessoa.nome, "imprimir", 'ficha', "1", "ip", "pais", "ok");

        // Define font files

        var fonts = {
            Roboto: {
                normal: (__dirname + '/../../../libs/pdfmake/fonts/Roboto-Regular.ttf'),
                bold: (__dirname + '/../../../libs/pdfmake/fonts/Roboto-Medium.ttf'),
                italics: (__dirname + '/../../../libs/pdfmake/fonts/Roboto-Italic.ttf'),
                bolditalics: (__dirname + '/../../../libs/pdfmake/fonts/Roboto-MediumItalic.ttf')

            }
        };

        const informacao_qr = "Nº Candidato" + pessoa.nome + " ;" + pessoa.nome + " ; " + bolsa.nome + " ; " + curso.nome + " ; " + curso.nome + " ; " + moment(candidato.updated_at).format('DD/MM/YYYY HH:mm');

        var printer = new PdfPrinter(fonts);

        var docDefinition = {
            pageMargins: [20, 10, 10, 10],
            content: [
                { image: __dirname + '/../../../public/assets/angola_ensigna.jpg', width: 55, alignment: 'center', margin: [0, 5] },
                { text: 'REPÚBLICA DE ANGOLA', alignment: 'center' },
                { text: 'MINISTÉRIO DO ENSINO SUPERIOR, CIÊNCIA, TECNOLOGIA E INOVAÇÃO', alignment: 'center' },
                { text: 'INSTITUTO NACIONAL DE GESTÃO DE BOLSAS DE ESTUDO', alignment: 'center', lineHeight: 3 },
                { text: 'Ficha de Candidatura', alignment: 'center', fontSize: 14, lineHeight: 2 },
                { text: "Nº do Candidato : " + pessoa.id, margin: 4, alignment: 'left', fontSize: 10, lineHeight: 1 },
                {
                    table: {
                        widths: [550],

                        body: [

                            [{ text: 'Dados Pessoais', margin: 2 }],
                            [{
                                stack: [
                                    { fontSize: 8, margin: 2, columns: [{ width: 200, text: "Nome" }, { width: 150, text: 'Naturalidade' }, { width: 150, text: 'Província' }] },
                                    { fontSize: 8, lineHeight: 1.5, margin: 2, columns: [{ width: 200, text: pessoa.nome, bold: true }, { width: 150, text: pessoaMunicipio.nome, bold: true }, { width: 150, text: pessoaProvincia.nome, bold: true }] },

                                    { fontSize: 8, margin: 2, columns: [{ width: 200, text: "Bilhete de Identidade" }, { width: 150, text: 'Data de Nascimento' }, { width: 150, text: 'Género' }, { width: 150, text: 'Estado Civil' }] },
                                    { fontSize: 8, lineHeight: 1.5, margin: 2, columns: [{ width: 200, text: pessoa.ndi.toUpperCase(), bold: true }, { width: 150, text: moment(pessoa.data_nascimento).format('DD/MM/YYYY'), bold: true }, { width: 150, text: GeneralConstants.GENEROS.getInfo(pessoa.genero), bold: true }, { width: 150, text: GeneralConstants.ESTADOS_CIVIS.getInfo(pessoa.estado_civil), bold: true }] },

                                    { fontSize: 8, margin: 2, columns: [{ width: 200, text: "Provincia de Residência" }, { width: 150, text: 'Municipio de Residência' }, { width: 150, text: 'Endereço Detalhado' }] },
                                    { fontSize: 8, lineHeight: 1.5, margin: 2, columns: [{ width: 200, text: pessoaProvinciaResidencia.nome, bold: true }, { width: 150, text: pessoaMunicipioResidencia.nome, bold: true }, { width: 150, text: pessoa.endereco, bold: true }] },

                                    { fontSize: 8, margin: 2, columns: [{ width: 200, text: "Telefone principal" }, { width: 150, text: 'telefone alternativo' }, { width: 150, text: 'Skype' }, { width: 150, text: 'whatsapp' }] },
                                    { fontSize: 8, lineHeight: 1.5, margin: 2, columns: [{ width: 200, text: pessoa.telemovel_principal, bold: true }, { width: 150, text: pessoa.telemovel_alternativo, bold: true }, { width: 150, text: contacto.skype, bold: true }, { width: 150, text: contacto.facebook, bold: true }] },

                                    { fontSize: 8, margin: 2, columns: [{ width: "*", text: "E-mail" }] },
                                    { fontSize: 8, lineHeight: 2, margin: 2, columns: [{ text: pessoa.user.email, bold: true }] },
                                ]
                            }],
                            [{ text: 'Dados de Conclusão da Formação', margin: 2 }],
                            [{
                                stack: [
                                    { fontSize: 8, lineHeight: 1.5, margin: 2, columns: [{ width: 300, text: 'Instituição ' }, { width: 150, text: 'Curso ' }] },
                                    { fontSize: 8, lineHeight: 1.5, margin: 2, columns: [{ width: 300, text: formacao_instituicao.nome, bold: true }, { width: 150, text: formacao_curso.nome, bold: true }] },

                                    { fontSize: 8, lineHeight: 1.5, margin: 2, columns: [{ width: 150, text: "Nivel Academico  " }, { width: 150, text: 'Média ' }, { width: 150, text: 'Ano de Ingresso ' }, { width: 150, text: 'Ano de Conclusão ' }] },
                                    { fontSize: 8, lineHeight: 2, margin: 2, columns: [{ width: 150, text: GeneralConstants.NIVEIS_ACADEMICOS.getInfo(formacao.nivel_academico), bold: true }, { width: 150, text: formacao.media, bold: true }, { width: 150, text: formacao.ano_ingresso, bold: true }, { width: 150, text: formacao.ano_conclusao, bold: true }] },
                                ]
                            }],
                            [{ text: 'Dados da Candidatura', margin: 2 }],
                            [{
                                columns: [{
                                    width: "*",
                                    stack: [
                                        { fontSize: 8, margin: 2, columns: [{ width: 150, alignment: 'right', text: "Bolsa:" }, { width: "*", marginLeft: 4, bold: true, text: bolsa.nome }] },
                                        { fontSize: 8, margin: 2, columns: [{ width: 150, alignment: 'right', text: "Instituição:" }, { width: "*", marginLeft: 4, bold: true, text: instituicao.nome }] },
                                        { fontSize: 8, margin: 2, columns: [{ width: 150, alignment: 'right', text: "Curso:" }, { width: "*", marginLeft: 4, bold: true, text: curso.nome }] },
                                        { fontSize: 8, margin: 2, columns: [{ width: 150, alignment: 'right', text: "Nivel Académico:" }, { width: "*", marginLeft: 4, bold: true, text: GeneralConstants.NIVEIS_ACADEMICOS.getInfo(candidato.base_nivel_academico_id) }] },
                                        { fontSize: 8, margin: 2, columns: [{ width: 150, alignment: 'right', text: "Ano de Ingresso:" }, { width: "*", marginLeft: 4, bold: true, text: candidatura_desejada.ano_ingresso }] },
                                        { fontSize: 8, margin: 2, columns: [{ width: 150, alignment: 'right', text: "Média:" }, { width: "*", marginLeft: 4, bold: true, text: candidatura_desejada.media }] },
                                        { fontSize: 8, margin: 2, columns: [{ width: 150, alignment: 'right', text: "Ano de Frequência:" }, { width: "*", marginLeft: 4, bold: true, text: candidatura_desejada.frequencia }] },
                                        { fontSize: 8, margin: 2, columns: [{ width: 150, alignment: 'right', text: "Data da Candidatura:" }, { width: "*", marginLeft: 4, bold: true, text: moment(candidato.updated_at).format('DD/MM/YYYY HH:mm') }] },
                                    ]
                                },
                                { marginTop: 130, width: 150, qr: informacao_qr + '', fit: 150, alignment: 'center' }
                                ]
                            }]
                        ]
                    },
                    layout: {
                        vLineWidth: function () {
                            return 0
                        },
                        hLineWidth: function (i, node) {
                            return i === node.table.body.length ? 0 : 1
                        },

                    }
                },
                { columns: [{ margin: 2, fontSize: 10, width: "*", text: moment().format('DD/MM/YYYY HH:mm:ss') }, { margin: 2, width: 150, alignment: 'center', fontSize: 10, text: 'Processado por computador' }] }
            ]
        };

        var pdfDoc = printer.createPdfKitDocument(docDefinition);
        pdfDoc.pipe(response.response);
        pdfDoc.end();
        const readFile = Helpers.promisify(fs.readFile);
        const file = await readFile(__dirname + '/../../../public/pdfteste.pdf');
        response.send(file)

    }
}

module.exports = EduCandidaturaController

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

const BasePessoa = use('App/Models/BasePessoa')
const EduCandidatura = use('App/Models/EduCandidatura')

//----------------------
const EduBolsa = use('App/Models/EduBolsa')
const BaseNivelAcademico = use('App/Models/BaseNivelAcademico')
const Estados = use('App/Models/EduCandidaturaEstado')
    //----------------------------------

const BaseHabilidadeLiteraria = use('App/Models/BaseHabilidadeLiteraria')
const BaseAgregadoFamiliar = use('App/Models/BaseAgregadoFamiliare')

const EduCandidaturaInterna = use('App/Models/EduCandidaturaInterna')
const EduCandidaturaExterna = use('App/Models/EduCandidaturaExterna')


const BaseAnexo = use('App/Models/BaseAnexo')
const BaseAnexoItens = use('App/Models/BaseAnexoIten')
const BaseTipoAnexo = use('App/Models/BaseTipoAnexo')

const requestFieldsPessoa = ['id', 'nome', 'user_id', 'data_nascimento', 'base_anexo_id', 'estado_civil',
    'base_municipio_id', 'genero', 'tipo_identificacao', 'ndi', 'dtEmissao', 'base_provincia_id', 'endereco',
    'pais_residencia_id', 'provincia_residencia_id', 'municipio_residencia_id', 'banco', 'conta_bancaria', 'iban', 'telefone_principal', 'telefone_alternativo'
];

const requestFieldsFormacao = ['base_pessoa_id', 'edu_bolsa_id', 'base_anexo_id', 'frequencia', 'ano_ingresso', 'media'];

const requestFieldsCandidato = ['base_pessoa_id', 'edu_bolsa_id', 'base_anexo_id', 'frequencia', 'ano_ingresso', 'media', 'matriculado', 'aceite'];
const requestFieldsCandidatoInterno = ['base_pessoa_id', 'edu_bolsa_id', 'base_anexo_id', 'frequencia', 'ano_ingresso', 'media', 'filho_antigo_combatente', 'necessidade_especial', 'carenciado', 'docente'];
const requestFieldsCandidatoExterno = ['base_pessoa_id', 'edu_bolsa_id', 'base_anexo_id', 'frequencia', 'ano_ingresso', 'media'];
//const requestFieldsAgregado = ['base_pessoa_id', 'edu_bolsa_id', 'base_anexo_id', 'frequencia', 'ano_ingresso', 'media'];

const requestFieldsAgregado = ['pai', 'profissao_pai', 'salario_pai', 'instituicao_empregadora_pai', 'mae', 'base_pessoa_id', 'profissao_mae', 'salario_mae', 'instituicao_empregadora_mae', 'agregados', 'menores', 'trabalhadores'];
/**
 * Resourceful controller for interacting with educandidaturas
 */
class EduCandidaturaValidacaoController {


    getIdade(data_nascimento) {
        var data_actual = new Date
        let ano = 0
        let mes = 0
        let dia = 0
        let res = data_nascimento.split("/")

        if (res.length == 3) {
            ano = res[2]
            mes = res[1]
            dia = res[0]
        } else {
            res = data_nascimento.split("-")

            if (Number(res[0]) > 1000) {
                ano = res[0]
                mes = res[1]
                dia = res[2]
            } else {
                ano = res[2]
                mes = res[1]
                dia = res[0]
            }
        }
        let quantos_anos = data_actual.getFullYear() - ano;
        if (data_actual.getMonth() + 1 < mes || data_actual.getMonth() + 1 == mes && data_actual.getDate() < dia) {
            quantos_anos--;
        }

        //console.log(" idade  --- " + quantos_anos)
        return quantos_anos < 0 ? 0 : quantos_anos;
    }


    getIdade1(data_nascimento) {
        var data_actual = new Date
        let quantos_anos = data_actual.getFullYear() - data_nascimento.getFullYear();
        if (data_actual.getMonth() + 1 < data_nascimento.getMonth() || data_actual.getMonth() + 1 == data_nascimento.getMonth() && data_actual.getDate() < data_nascimento.getDate()) {
            quantos_anos--;
        }
        return quantos_anos < 0 ? 0 : quantos_anos;
    }

    async algoritmoBeiGraduacao(candidato, parametro) {


        try {

            //console.log('candidato')
            let classificacao = 0
            let media_percentual = 40 // media 40%  + 5% do agregaado 
            let idade_percentual = 15 // idade 15 % 
                // vamos dividir os cursos prioritario em 2  //curso prioritatrio 25% 
            let curso_prioritario_percentual = 17.5 //curso prioritatrio 25% 
            let curso_prioritario_nao_percentual = 7.5

            let rendimento_percentual = 20 // redimento do agregado  carenciado 20 %

            let media_ideal = 20 // valor maximo da media  
            let idade_ideal = 16 // idade minima aceitavel 20 anos para pos graduação
            let curso_ideal = 1 //curso prioritatrio   
            let rendimento_ideal = 0 // redimento do agregado 
            let carenciado_ideal = 1 // redimento do agregado 
                // let valor_entrada_media = candidato.media ? candidato.media : candidato.pessoa.formacoes[data.pessoa.formacoes.length-1]?.media

            let valor_entrada_media = candidato.media

            candidato.media = candidato.media ? candidato.media : candidato.media

            let candidato_find = await EduCandidatura.query().where({ id: candidato.id }).first();

            let valor_entrada_curso = candidato.curso.baseCursos.prioritario == 1 ? 1 : 0



            let valor_entrada_idade = this.getIdade(candidato.data_nascimento)
            let valor_entrada_carenciado = candidato.carenciado == 1 ? 1 : 0

            let x_carenciado = 0
            if (valor_entrada_carenciado == 1)
                x_carenciado = rendimento_percentual

            // //console.log(candidato.candidatura_interna.curso.baseCursos.prioritario)

            if (valor_entrada_idade <= 16)
                valor_entrada_idade = 25

            if (valor_entrada_idade > 16) {

                let x_media = (valor_entrada_media * media_percentual) / media_ideal

                let x_curso = 0 //    x_curso = (valor_entrada_curso * curso_prioritario_percentual) / 1
                if (valor_entrada_curso == 1)
                    x_curso = curso_prioritario_percentual
                else
                    x_curso = curso_prioritario_nao_percentual

                let x_idade = (idade_ideal * idade_percentual) / valor_entrada_idade


                candidato_find.x_carenciado = x_carenciado.toFixed(2)
                candidato_find.x_media = x_media.toFixed(2)
                candidato_find.x_curso = x_curso.toFixed(2)
                candidato_find.x_idade = x_idade.toFixed(2)

                if (candidato_find.x_media === "NaN")
                    candidato_find.x_media = 0;


                classificacao = x_carenciado + x_media + x_curso + x_idade;
                candidato_find.classificacao = classificacao.toFixed(2);


                if (candidato_find.classificacao === "NaN")
                    candidato_find.classificacao = 0;



                //console.log(candidato.nome)
                //console.log(candidato.ndi)
                //console.log(candidato.id)
                //console.log("Graduação")
                //console.log("x_carenciado - " + x_carenciado)
                //console.log("x_media - " + x_media)
                //console.log("x_curso - " + x_curso)
                //console.log("x_idade - " + x_idade)
                //console.log("classificacao - " + candidato_find.classificacao)
                let result = await candidato_find.save();
                //console.log(classificacao)
                //console.log(result)
                //console.log("----------------------------------------------------------------")
            }
            return
        } catch (err) {
            //console.log(err.message)
        }
    }

    async algoritmoBeiPosGraduacao(candidato, data) {

        try {
            //  let valor_entrada = candidato
            let classificacao = 0
            let media_percentual = 60 // media 60% 
            let idade_percentual = 15 // idade 15 %
            let curso_prioritario = 25 //curso prioritatrio 25% 
            let media_ideal = 20 // valor maximo da media  
            let idade_ideal = 20 // idade minima aceitavel 20 anos para pos graduação
            let curso_ideal = 1 //curso prioritatrio  

            let valor_entrada_media = candidato.media ? candidato.media : 10

            let valor_entrada_curso = candidato.curso.baseCursos.prioritario == 1 ? 1 : 0
            let valor_entrada_idade = this.getIdade(candidato.data_nascimento)

            if (valor_entrada_idade <= 20)
                valor_entrada_idade = 35

            //console.log('candidato idade ' + valor_entrada_idade)
            if (valor_entrada_idade >= 20) {
                let x_media = (valor_entrada_media * media_percentual) / media_ideal
                let x_curso = (valor_entrada_curso * curso_prioritario) / 1
                let x_idade = (idade_ideal * idade_percentual) / valor_entrada_idade

                let x_carenciado = 0



                let candidato_find = await EduCandidatura.query().where({ id: candidato.id }).first();
                candidato_find.classificacao = classificacao.toFixed(2)

                candidato_find.x_carenciado = 0
                candidato_find.x_media = x_media.toFixed(2)
                candidato_find.x_curso = x_curso.toFixed(2)
                candidato_find.x_idade = x_idade.toFixed(2)

                classificacao = x_carenciado + x_media + x_curso + x_idade;
                candidato_find.classificacao = classificacao.toFixed(2);


                //console.log(candidato.nome)
                //console.log(candidato.ndi)
                //console.log("Pos Graduação")
                //console.log("x_carenciado - " + x_carenciado)
                //console.log("x_media - " + x_media)
                //console.log("x_curso - " + x_curso)
                //console.log("x_idade - " + x_idade)
                //console.log("classificacao - " + candidato_find.classificacao)
                let result = await candidato_find.save();
                //console.log(classificacao)
                //console.log(result)
                //console.log("----------------------------------------------------------------")

            }
        } catch (err) {
            //console.log(err.message)
            //return ResponseHelper.getErrorResponse("Erro ao processar o raking")
        }
    }




    async processarRaking({ request, params, response }) {
        try {
            const data = request.all();
            //console.log(data)

            let numero_candidatos = 1000
            let candidatos = await EduCandidatura.query()

            .where({ edu_bolsa_id: params.edu_bolsa_id, classificacao: null })
                .orderBy('id', 'asc')

            .with('anexo')
                .with('anexo.itens')
                .with('nivelacademico')
                .with('curso')
                .with('curso.baseCursos')
                .with('instituicao')
                .limit(numero_candidatos)
                .fetch();

            let candidatos_total = await EduCandidatura.query()
                .where({ edu_bolsa_id: params.edu_bolsa_id, classificacao: null }).limit(numero_candidatos).getCount();

            let mensagem = "processamento raking de " + candidatos_total + " candidatos internos de graduação e pos graduacao"
                //console.log(mensagem)


            let parametro = 0
            let cont = 1
            let numero = candidatos.toJSON();
            for (let candidato of candidatos.toJSON()) {
                //console.log("----------------------- " + cont++ + " de " + numero.length + " -----------------------------------")
                //console.log("nivel de graduação " + candidato.base_nivel_formacao_id)
                //console.log(candidato.nome)
                //console.log(candidato.ndi)

                if (candidato) {
                    if (candidato.base_nivel_formacao_id == 2 || candidato.base_nivel_formacao_id == 3) {
                        //console.log("graduação ");
                        this.algoritmoBeiGraduacao(candidato, parametro)
                    } else {
                        //console.log("pós-graduação  ");
                        this.algoritmoBeiPosGraduacao(candidato, parametro)
                    }
                } else {
                    let candidato_find = await EduCandidatura.query().where({ id: candidato.id }).first();
                    candidato_find.classificacao = 0
                    let result = await candidato_find.save();
                }
            }

            return ResponseHelper.getSuccessResponse(mensagem, candidatos)
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao processar o raking")
        }
    }

    async retirarCandidato(candidatos, data) {
        for (let candidato of candidatos) {
            candidato.query().update({ user_id: data.user_id })
        }

    }

    async atribuirCandidato(candidatos, data) {
        candidatos = await EduCandidatura.query()
            .where({ edu_estado_id: "1", edu_bolsa_id: data.edu_bolsa_id, user_id: null })
            .limit(numero)
            .fetch();
        //   //console.log(candidatos.toJSON()) 
        //  this.atribuirCandidato(candidatos.toJSON(), data)

        for (let candidato of candidatos) {
            candidato.query().update({ user_id: data.user_id })
        }

    }
    async retirarCandidato(candidatos, data) {
        for (let candidato of candidatos) {
            candidato.query().update({ user_id: data.user_id })
        }

    }

    async atribuirCandidatoUser({ request, params, response }) {
        try {
            const data = request.all();
            //console.log(data)
            let candidatos
            let mensagem
            if (data.atribuir == 1) {
                candidatos = await EduCandidatura.query()
                    .where({ base_estado_id: "1", edu_bolsa_id: data.edu_bolsa_id, validacao_user: null })
                    .orWhere({ base_estado_id: null, edu_bolsa_id: data.edu_bolsa_id, validacao_user: null })
                    .limit(data.quantidade)
                    .update({ validacao_user: data.user_id })
                mensagem = "candidatos atribuido com sucesso para validacao " + candidatos
            } else {
                candidatos = await EduCandidatura.query()
                    .where({ base_estado_id: "1", edu_bolsa_id: data.edu_bolsa_id, validacao_user: data.user_id })

                .orWhere({ base_estado_id: null, edu_bolsa_id: data.edu_bolsa_id, validacao_user: data.user_id })
                    .limit(data.quantidade)
                    .update({ validacao_user: null })
                mensagem = "candidatos retirados com sucesso " + candidatos

            }


            return ResponseHelper.getSuccessResponse(mensagem, candidatos)
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao atribuir candidatos para validação")
        }
    }


    async candidatosUser({ request, response }) {

        try {
            const data = request.all();
            //console.log(data)
            candidatos = await EduCandidatura.query()
                .where({ edu_estado_id: edu_estado_id, edu_bolsa_id: data.edu_bolsa_id, user_id: data.user_id }).fetch();
            //  .limit(data.numero)

            return ResponseHelper.getSuccessResponse("candidatos por utilizador", candidatos)
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao listar candidatos user  ")
        }
    }

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
    async saveCandidaturaInterna({ params, request, response }) {
        try {

            //console.log(" salvar candidato interno ........................")
            const data = request.all();
            let pessoa = request.only(requestFieldsPessoa);
            let candidato_interno = request.only(requestFieldsCandidatoInterno);
            let candidato_externo = request.only(requestFieldsCandidatoExterno);

            let agregado = request.only(requestFieldsAgregado);
            let candidato = data.candidaturas
            let formacao_concluida = data.formacoes
            if (candidato.media == "")
                candidato.media = formacao_concluida.media

            //console.log(pessoa)
            //console.log(formacao_concluida)
            //console.log(candidato)
            //console.log(candidato_interno)

            let result_pessoa = await this.savePessoa(pessoa)
                //console.log(result_pessoa)
            if (result_pessoa == "Ja existe uma conta com este BI")
                return ResponseHelper.getErrorResponse("Ja existe uma conta com este BI")

            if (result_pessoa) {
                //console.log(result_pessoa)
                candidato.base_pessoa_id = result_pessoa.id
                formacao_concluida.base_pessoa_id = result_pessoa.id
                agregado.base_pessoa_id = result_pessoa.id

                this.saveFormacao(formacao_concluida)



                let result_candidato = this.saveCandidato(candidato, candidato_interno, candidato_externo)

                //console.log("------------------agregado----------------------")
                //console.log(agregado)
                //console.log("----------------------------------------")
                this.saveAgregadoFamiliar(agregado)


                return ResponseHelper.getSuccessResponse("candidatura salva com sucesso")
            }
            return ResponseHelper.getErrorResponse("candidatura não foi salvo")
        } catch (err) {
            //console.log(err.message)
            //this.registarLog(username, "user", 'login', "0", "", "", err.message);

            return ResponseHelper.getErrorResponse("candidatura não foi salvo" + err.message)
        }
    }
    async saveCandidatura({ params, request, response }) {
        try {
            //console.log(" salvar candidato externo ........................")
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
                //console.log(result_pessoa)
                candidato.base_pessoa_id = result_pessoa.id
                formacao_concluida.base_pessoa_id = result_pessoa.id

                this.saveFormacao(formacao_concluida)
                let result_candidato = this.saveCandidato(candidato, candidato_interno, candidato_externo)

                return ResponseHelper.getSuccessResponse("candidatura salva com sucesso")
            }
            return ResponseHelper.getErrorResponse("candidatura não foi salvo")
        } catch (err) {
            //console.log(err.message)
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
                    //console.log("user: " + data.user_id)
                    //  //console.log(anexo)
            }

            ////console.log(data)
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
            //console.log(err.message)
            this.registarLog(data.nome, "user", 'login', "0", "", "", err.message);
            return ResponseHelper.getErrorResponse("Não pode Salvar os dados Pessoais")
        }

    }
    async saveFormacao(data) {
        //  //console.log(data)
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
                //  //console.log(result);
            } else {
                formacao = await BaseHabilidadeLiteraria.create(data);
            }

            //  await this.uploadFormacao(pessoa, formacao, request);
            this.registarLog("-", "formacaoConcluida", 'salvar', "1", "", "", "formação concluida salvo com sucesso");
            //   return ResponseHelper.getSuccessResponse("Formação registada com sucesso", formacao);
        } catch (err) {
            //console.log(err.message)
            this.registarLog("-", "formacaoConcluida", 'salvar', "0", "", "", err.message);
            // return ResponseHelper.getErrorResponse("Erro registar a formação: " + "deve preencher todos os campos");
        }
    }

    async saveAgregadoFamiliar(data) {
        //  //console.log(data)
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
                //  //console.log(result);
            } else {
                agregado = await BaseAgregadoFamiliar.create(data);
            }

            this.registarLog("-", "agregado", 'salvar', "1", "", "", "agregado concluida salvo com sucesso");
            //   return ResponseHelper.getSuccessResponse("Formação registada com sucesso", formacao);
        } catch (err) {
            //console.log(err.message)
            this.registarLog("-", "agregado", 'salvar', "0", "", "", err.message);
            // return ResponseHelper.getErrorResponse("Erro registar a formação: " + "deve preencher todos os campos");
        }
    }

    async saveCandidato(data, candidato_interno, candidato_externo) {


        try {
            //console.log("candidatura save -----------------------------------------")
            //console.log(data)
            //console.log("candidatura save-----------------------------------------")

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
            //console.log(err.message)
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
            //console.log("--------------------caminho uploads...............................")
            //console.log(DIR)
            //console.log("--------------------caminho uploads...............................")
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
            //console.log(err.message)
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
        //console.log(err.message)
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
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao listar as Candidaturas")
        }
    }

    async candidaturaListParams({ params, request, response, view }) { //


        //console.log(params.bi);
        // let pessoa = await this.findPessoaByBi(params.bi); // data.pessoa.ndi        
        const pessoa = await BasePessoa.query()
            .where('ndi', 'like', '%' + params.bi + '%')
            .with('user').firstOrFail();
        if (pessoa) {
            //console.log(pessoa.ndi);

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
                //console.log(err.message)
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

            return ResponseHelper.getOnlyDataResponse(
                await EduCandidatura.query()
                .where({ id: params.id })
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
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao listar a candidatura")
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
    async update({ params, request, response }) {

        try {

            let data = request.only(['id', 'edu_motivo_exclusao_id', 'edu_estado_id', 'observacao']);

            const eduCandidatura = await EduCandidatura.find(params.id);

            //console.log("validar candidatura");
            //console.log(data);

            eduCandidatura.merge(data);
            await eduCandidatura.save();

            return ResponseHelper.getSuccessResponse("Candidatura Actualizada com sucesso", eduCandidatura)

        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro na actualização da candidatura")
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
                 .with('candidatura_interna.instituicao.provincia')
              .with('candidatura.candidatura_interna.curso')
             
              .fetch())
              
        } catch (err) {
          //console.log(err.message)
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
          //console.log(err.message)
          return ResponseHelper.getErrorResponse("Erro ao listar Candidaturas Externas")
        }
      }*/


    /**async indexcandidaturabolsa({ params, request, response}) {
      try {  
        
        //console.log( params.bolsa_id)
        return ResponseHelper.getOnlyDataResponse( 
        await EduCandidatura.query()
        .where({edu_bolsa_id : params.bolsa_id})
        .with('pessoa')
        .with('bolsa')
        .fetch()  )
  
      } catch (err) {
        //console.log(err.message)
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

    async store({ request, response }) {
        try {
            const data = request.only(requestFields);
            const data_id = request.only(['id', 'candidatura_interna_id', 'candidatura_externa_id']);
            const data_curso = request.only(['base_curso_id', 'edu_curso_id', 'edu_instituicao_id']);

            const bolsa = await EduBolsa.find(data.edu_bolsa_id);
            if (!bolsa) {
                return ResponseHelper.getWarningResponse("Não foi encontrada a bolsa seleccionada", bolsa)
            }

            data.estado = GeneralConstants.ESTADOS_CANDIDATURAS.NOVA.code;

            let candidato;
            let candidaturaInterna;
            let candidaturaExterna;
            //console.log("----------------------------------------------------");
            // //console.log(data);
            //console.log("----------------------------------------------------");
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
            //console.log(err.message)
            this.registarLog(candidato.id, "candidatura", 'registar', "0", "ip", "pais", err.message);

            return ResponseHelper.getErrorResponse("Erro ao registar a Candidatura")
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
            //console.log(err.message)
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

        const pessoa = await candidato.pessoa().first();

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
            telemovel: telemovel ? telemovel.contacto : ' ',
            whatsapp: whatsapp ? whatsapp.contacto : ' ',
            facebook: facebook ? facebook.contacto : ' ',
            skype: skype ? skype.contacto : ' ',
            email: email ? email.contacto : ' '
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

        //console.log(candidatura_desejada.media);

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

                                    { fontSize: 8, margin: 2, columns: [{ width: 200, text: "Telefone" }, { width: 150, text: 'Whatsapp' }, { width: 150, text: 'Skype' }, { width: 150, text: 'Facebook' }] },
                                    { fontSize: 8, lineHeight: 1.5, margin: 2, columns: [{ width: 200, text: contacto.telemovel, bold: true }, { width: 150, text: contacto.whatsapp, bold: true }, { width: 150, text: contacto.skype, bold: true }, { width: 150, text: contacto.facebook, bold: true }] },

                                    { fontSize: 8, margin: 2, columns: [{ width: "*", text: "E-mail" }] },
                                    { fontSize: 8, lineHeight: 2, margin: 2, columns: [{ text: contacto.email, bold: true }] },
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
                        vLineWidth: function() {
                            return 0
                        },
                        hLineWidth: function(i, node) {
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

module.exports = EduCandidaturaValidacaoController
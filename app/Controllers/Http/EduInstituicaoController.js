'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */


const Instituicao = use('App/Models/EduInstituicoes')
const Curso = use('App/Models/EduCurso')
const Pais = use('App/Models/BasePaises')

const EduCandidatura = use('App/Models/EduCandidatura')

//const NivelIes = use('App/Models/EduNilvelInstituicao')
const ResponseHelper = use('App/Helpers/ResponseHelper')

const requestFields = ['id', 'codigo', 'nome', 'nivel_instituicao_id', 'edu_tipo_instituicao_id',
    'base_pais_id', 'edu_natureza_instituicao_id', 'base_provincia_id', 'raking'
];


/**
 * Resourceful controller for interacting with eduinstituicoes
 */

const Database = use('Database')

class EduInstituicaoController {
    /**
     * Show a list of all eduinstituicoes.
     * GET eduinstituicoes
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */



    async index({ request, response }) {
        try {


            const instituicoes = await Instituicao.query()
                .with('cursos')
                .with('nivelInstituicoes')
                .with('tipoInstituicoes')
                .with('naturezaInstituicoes')
                .with('paises')
                .with('provincia')

            .fetch()

            return ResponseHelper.getOnlyDataResponse(instituicoes)
        } catch (error) {
            return ResponseHelper.getErrorResponse("nenhum dado encontrado")
        }
    }


    async indexPaginate({ request, response }) {
        try {

            let paginate = request.all();
            let page = Number(paginate.page ? paginate.page : 1);
            let size = Number(paginate.size ? paginate.size : 10);

            const instituicoes = await Instituicao.query()
                .with('cursos')
                .with('nivelInstituicoes')
                .with('tipoInstituicoes')
                .with('naturezaInstituicoes')
                .with('paises')
                .with('provincia')
                .fetch()
            //    .paginate(page, size)

            return ResponseHelper.getOnlyDataResponse(instituicoes)
        } catch (error) {
            return ResponseHelper.getErrorResponse("nenhum dado encontrado")
        }
    }
    async list({ request, response }) {
        try {

            let paginate = request.all();
            let page = Number(paginate.page ? paginate.page : 1);
            let size = Number(paginate.size ? paginate.size : 10);

            const instituicoes = await Instituicao.query()
                .with('cursos')
                .with('nivelInstituicoes')
                .with('tipoInstituicoes')
                .with('naturezaInstituicoes')
                .with('paises')
                .with('provincia')

            .paginate(page, size)

            return ResponseHelper.getOnlyDataResponse(instituicoes)
        } catch (error) {
            return ResponseHelper.getErrorResponse("nenhum dado encontrado")
        }
    }


    async usuarioFiltro({ request, response }) {
        try {

            let paginate = request.all();
            let page = Number(paginate.page ? paginate.page : 1);
            let size = Number(paginate.size ? paginate.size : 10);



            const instituicoes = await Instituicao.query()
                .where('nome', 'like', '%' + paginate.nome + '%')
                .with('cursos')
                .with('nivelInstituicoes')
                .with('tipoInstituicoes')
                .with('naturezaInstituicoes')
                .with('paises')
                .with('provincia')
                // .orWhere('telefone', 'like', '%' + paginate.email_telefone + '%')
                // .orWhere('username', 'like', '%' + paginate.email_telefone + '%')

            .paginate(page, size);

            return ResponseHelper.getOnlyDataResponse(instituicoes)
        } catch (error) {
            //console.log(error)
            return ResponseHelper.getErrorResponse("nenhum dado encontrado")
        }
    }




    async instituicaoPaisNivelEnsino({ params, request, response }) {
        try {
            let instituicao


            if (params.nivel_id == 1)
                instituicao = await Instituicao.query()
                .where({ nivel_instituicao: params.nivel_id, base_pais_id: params.pais_id })
                .with('paises').with('provincia').fetch()
            else
                instituicao = await Instituicao.query()
                .where({ nivel_instituicao: 2, base_pais_id: params.pais_id })

            .with('paises').with('provincia').fetch()
            return ResponseHelper.getOnlyDataResponse(instituicao)

        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao listar instituições")
        }
    }

    async instituicaoNivelEnsino({ params, request, response }) {
        try {
            let instituicao

            if (params.id == 1)
                instituicao = await Instituicao.query()
                .where({ nivel_instituicao: params.id })
                .with('paises').with('provincia').fetch()
            else
                instituicao = await Instituicao.query()
                .where({ nivel_instituicao: 2 })
                .with('paises').with('provincia').fetch()
            return ResponseHelper.getOnlyDataResponse(instituicao)

        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao listar instituições")
        }
    }

    async instituicaoByPais({ params, request, response }) {
        try {
            return ResponseHelper.getOnlyDataResponse(
                await Instituicao.query()
                .where({ base_pais_id: params.id })
                .with('paises').with('provincia').fetch())

        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao listar instituições")
        }
    }



    async intituicaoangola({ params, request, response }) {
        try {
            return ResponseHelper.getOnlyDataResponse(
                await Instituicao.query()
                .where({
                    base_pais_id: 24,
                })
                .with('paises').with('provincia')
                .orderBy('nome', 'asc')
                .fetch())


        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao listar instituições")
        }
    }




    async intituicaoBypaisnivel({ params, request, response }) {
        try {
            return ResponseHelper.getOnlyDataResponse(
                await Instituicao.query()
                .where({
                    base_pais_id: params.pais_id,
                    nivel_instituicao: params.nivel_id,
                })
                .with('paises').with('provincia').fetch())

        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao listar instituições")
        }
    }

    async intituicaoBypaisprovincianivel({ params, request, response }) {
        try {
            return ResponseHelper.getOnlyDataResponse(
                await Instituicao.query()
                .where({
                    base_provincia_id: params.provincia_id,
                    base_pais_id: params.pais_id,
                    nivel_instituicao: params.nivel_id,
                })
                .with('paises').with('provincia').fetch())

        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao listar instituições")
        }
    }





    async instituicoescandidatos({ params, request, response }) {
        try {
            let instituicoes = await Instituicao.query()
                .where({ base_pais_id: 24, nivel_instituicao: 2, })
                .with('paises')
                .with('provincia')
                .fetch()

            let instituicoeslist = instituicoes.toJSON();
            let instituicoescandidatos = []

            for (let instituicao of instituicoeslist) {

                let query_candidatura_interna = Database.from('edu_candidatura_internas')
                    .where('edu_instituicao_id', instituicao.id)
                    .select('edu_candidatura_id')

                let query_candidatura_todos = await EduCandidatura.query()
                    .where('edu_bolsa_id', 1).where('base_nivel_academico_id', 2).whereIn('id', query_candidatura_interna).getCount()

                let query_candidatura_validado = await EduCandidatura.query()
                    .where('edu_bolsa_id', 1).where('edu_estado_id', 2).where('base_nivel_academico_id', 2).whereIn('id', query_candidatura_interna).getCount()

                let query_candidatura_aprovado = await EduCandidatura.query()
                    .where('edu_bolsa_id', 1).where('edu_estado_id', 3).where('base_nivel_academico_id', 2).whereIn('id', query_candidatura_interna).getCount()

                let query_candidatura_rejeitado = await EduCandidatura.query()
                    .where('edu_bolsa_id', 1).where('edu_estado_id', 4).where('base_nivel_academico_id', 2).whereIn('id', query_candidatura_interna).getCount()

                let inst = {
                    nome: instituicao.nome,
                    provincia: instituicao.provincia.nome,
                    candidatos: query_candidatura_todos,
                    candidatos_validado: query_candidatura_validado,
                    candidatos_aprovado: query_candidatura_aprovado,
                    candidatos_rejeitado: query_candidatura_rejeitado
                }

                //console.log(query_candidatura_validado);
                //console.log(query_candidatura_aprovado);
                //console.log(query_candidatura_rejeitado);

                //console.log(inst);
                instituicoescandidatos.push(inst);
            }



            return ResponseHelper.getOnlyDataResponse(instituicoescandidatos)

        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao listar instituições")
        }
    }

    async raking({ params, request, response }) {
        try {
            return ResponseHelper.getOnlyDataResponse(
                await Instituicao.query()
                .where('raking', '>=', params.raking)
                .with('paises').with('provincia').fetch())

        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao listar instituições")
        }
    }



    /**
     * Create/save a new eduinstituicoe.
     * POST eduinstituicoes
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async store({ request, response }) {
        try {
            const data = request.only(requestFields);
            let result = ""

            if (data.id) {

                let instituicao = await Instituicao.find(data.id);
                instituicao.merge(data);
                await instituicao.save();
            } else
                result = await Instituicao.create(data);

            return ResponseHelper.getSuccessResponse("Instituição criada com sucesso", result)
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao salvar a Instituição")
        }
    }

    async update({ request, response }) {
        try {
            const data = request.only(requestFields);
            let result = ""

            if (data.id) {
                //console.log(data)

                let instituicao = await Instituicao.find(data.id);
                instituicao.merge(data);
                await instituicao.save();
            } else
                result = await Instituicao.create(data);

            return ResponseHelper.getSuccessResponse("Instituição criada com sucesso", result)
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao salvar a Instituição")
        }
    }



    async show({ params, request, response }) {
        try {
            return ResponseHelper.getOnlyDataResponse(
                await Instituicao.query()
                .where({ id: params.id })
                .with('cursos')
                .with('nivelInstituicoes')
                .with('tipoInstituicoes')
                .with('naturezaInstituicoes')
                .with('paises')
                .with('provincia')
                .first()
            )
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao buscar a Instituição")
        }
    }






    /**
     * Delete a eduinstituicoe with id.
     * DELETE eduinstituicoes/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async destroy({ params, request, response }) {
        try {

            const instituicao = await Instituicao.find(params.id);

            if (!instituicao) {
                return ResponseHelper.getWarningResponse("Não foi encontrada a instituição a ser eliminada", instituicao)
            }

            await instituicao.delete();

            return ResponseHelper.getSuccessResponse("Instituição eliminada com sucesso", null)

        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao eliminar a instituição")
        }
    }


    async indexCurso({ params, request, response }) {
        try {

            //console.log(params.id);
            const instituicao = await Instituicao.query().where({ id: params.id }).with('cursos').first();

            if (!instituicao) {
                return ResponseHelper.getWarningResponse("Não foi encontrada a instituição a listar os cursos", instituicao)
            }

            const cursos = JSON.parse(JSON.stringify(instituicao)).cursos;

            return ResponseHelper.getOnlyDataResponse(cursos)
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao listar os cursos da Instituição")
        }
    }

    async storeCurso({ request, params }) {
        try {

            const instituicao = await Instituicao.find(params.id);

            if (!instituicao) {
                return ResponseHelper.getWarningResponse("Não foi encontrada a instituição a adicionar o curso", instituicao)
            }

            let data = request.only(['nome', 'codigo', 'nivel_academico', 'base_curso_id']);
            data.edu_instituicao_id = instituicao.id;

            const curso = await Curso.create(data);
            return ResponseHelper.getSuccessResponse("Curso adicionado com sucesso", curso)
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao adicionar o curso à Instituição")
        }
    }






    async destroyCurso({ params, request, response }) {
        try {

            const curso = await Curso.find(params.id);

            if (!curso) {
                return ResponseHelper.getWarningResponse("Não foi encontrado o curso", curso)
            }

            await curso.delete();

            return ResponseHelper.getSuccessResponse("Curso eliminado com sucesso", null)

        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao eliminar o curso")
        }
    }

}

module.exports = EduInstituicaoController
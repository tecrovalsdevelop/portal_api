'use strict'
const ResponseHelper = use('App/Helpers/ResponseHelper')
const EduCurso = use('App/Models/EduCurso')
const EduUnidadeOrganica = use('App/Models/EduUnidadeOrganica')

const EduInstituicao = use('App/Models/EduInstituicoes')



const requestFields = ['id', 'codigo', 'nome', 'edu_instituicao_id', 'nivel_academico_id',
    'base_curso_id', 'edu_unidade_organica_id', 'duracao', 'edu_instituicoes_codigo', 'edu_unidade_organica_codigo'
];


const Database = use('Database')


/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
/**
 * Resourceful controller for interacting with eduiusos
 */

class EduCursoController {
    /**
     * Show a list of all educusos.
     * GET educiusos
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async index({ request, response }) {
        try {
            return ResponseHelper.getOnlyDataResponse(
                await EduCurso.query()

                .with('instituicao') // ies list
                .with('nivelAcademico')
                .with('baseCursos') //
                .with('unidadeOrganica') //
                .fetch()

            )
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao listar Cursos")
        }
    }


    async store({ request, response }) {
        try {

            const data = request.only(requestFields);
            const edu_curso = await EduCurso.create(data);
            return ResponseHelper.getSuccessResponse("Curso criado com sucesso", edu_curso)

        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao salvar o Curso")
        }
    }

    /**
     * Update eduCursos details.
     * PUT or PATCH eduCursos/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */

    async update({ params, request, response }) {

        try {
            const data = request.only(requestFields);

            let data_all = request.all()

            data.edu_instituicao_id = data_all.instituicao.id
            data.nivel_academico = data_all.nivelAcademico.id
            data.base_curso_id = data_all.baseCursos.id
            data.edu_unidade_organica_id = data_all.unidadeOrganica.id

            //console.log(data_all);

            const cursos = await EduCurso.query()

            .where({ id: params.id })
                .with('instituicao').with('nivelAcademico')
                .with('baseCursos').with('unidadeOrganica')
                .first()

            cursos.merge(data);
            await cursos.save();

            return ResponseHelper.getSuccessResponse("Curso actualizado com sucesso", cursos)

        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao actualizar o Curso")
        }

    }



    async show({ params, request, response }) {
        try {
            return ResponseHelper.getOnlyDataResponse(

                await EduCurso.query().where({ id: params.id })

                .with('instituicao')
                .with('nivelAcademico')
                .with('baseCursos')
                .with('unidadeOrganica')
                .first()
            )
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao buscar o curso")
        }
    }

    async cursosDaIesAngola({ params, request, response }) {
        try {
            let cursos = ""
                //console.log(params)
            let duracao = [1, 2, 3, 4, 5, 6]
            if (params.nivel < 4)
                duracao = [4, 5, 6, 7]
            else
                duracao = [1, 2, 3]

            duracao = [1, 2, 3, 4, 5, 6]
            if (params) {
                cursos = await EduCurso.query()
                    .where({ edu_instituicao_id: params.ies })
                    .whereIn('duracao', duracao)
                    .with('instituicao')
                    .with('nivelAcademico')
                    .with('baseCursos')
                    .with('unidadeOrganica')
                    .orderBy('nome', 'asc')
                    .fetch()
            } else {
                cursos = await EduCurso.query()
                    .where({ edu_instituicao_id: params.ies })

                .whereIn('duracao', duracao)
                    .with('instituicao')
                    .with('nivelAcademico')
                    .with('baseCursos')
                    .with('unidadeOrganica')
                    .orderBy('nome', 'asc')
                    .fetch()
            }
            return ResponseHelper.getOnlyDataResponse(cursos)

        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao listar os Cursos da IES")
        }
    }


    async cursosDaIes({ params, request, response }) {
        try {
            let cursos

            if (params) {
                cursos = await EduCurso.query()
                    .where({ edu_instituicao_id: params.ies_id })
                    .with('instituicao')
                    .with('nivelAcademico')
                    .with('baseCursos')
                    .with('unidadeOrganica')
                    .fetch()
            } else {
                cursos = await EduCurso.query()

                .with('instituicao')
                    .with('nivelAcademico')
                    .with('baseCursos')
                    .with('unidadeOrganica')
                    .fetch()
            }
            return ResponseHelper.getOnlyDataResponse(cursos)

        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao listar os Cursos da IES")
        }
    }


    async cursosIesUniOrg({ params, request, response }) {
        try {
            let cursos
            if (params) {
                cursos = await EduCurso.query()
                    .where({ edu_instituicao_id: params.ies_id, edu_unidade_organica_id: params.unid_org })
                    .with('instituicao')
                    .with('nivelAcademico')
                    .with('baseCursos')
                    .with('unidadeOrganica')
                    .fetch()

                return ResponseHelper.getOnlyDataResponse(cursos)
            } else {
                cursos = await EduCurso.query()

                .with('instituicao')
                    .with('nivelAcademico')
                    .with('baseCursos')
                    .with('unidadeOrganica')
                    .fetch()
            }
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao listar instituições")
        }
    }

    async buscarInstituicaoUnidadeOrganica({ params, request }) {
        try {
            //---- Metodo que busca todas unidades Organica em função ao id da instituição --------------
            let unidade_organica_id = Database.from('edu_cursos')
                .where({ edu_instituicao_id: params.id })
                .select('edu_unidade_organica_codigo')

            let unidadeOrganica = await EduUnidadeOrganica.query()
                .whereIn('codigo', unidade_organica_id)
                .fetch()

            return ResponseHelper.getOnlyDataResponse(unidadeOrganica)

        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao listar instituições")
        }
    }

    async buscarCursosInstituicaoUnidadeOrganica({ params, request }) {
        try {
            //---- Metodo que busca todas unidades Organica em função ao id da instituição --------------
            let cursos_unidade_organicas = await EduCurso.query()
                .where({ edu_unidade_organica_codigo: params.id })
                .fetch('edu_unidade_organica_codigo')


            return ResponseHelper.getOnlyDataResponse(cursos_unidade_organicas)

        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao listar instituições")
        }
    }


    async instituicaoProvincia({ params, request }) {
        try {
            //---- Metodo que busca todas unidades Organica em função ao id da instituição --------------

            //console.log(params.id)

            let unidade_organicas = Database.from('edu_unidade_organicas')
                .where({ base_provincia_id: params.id })
                .select('codigo')

            let instituicoes = null

            if (unidade_organicas) {

                //console.log(unidade_organicas)
                let unidade_organica_instituicao_id = Database.from('edu_cursos')
                    //  .where({ edu_instituicao_id: params.id })
                    .whereIn('edu_unidade_organica_codigo', unidade_organicas)
                    .select('edu_instituicao_id')

                instituicoes = await EduInstituicao.query()
                    .whereIn('id', unidade_organica_instituicao_id)
                    .fetch()

            }

            return ResponseHelper.getOnlyDataResponse(instituicoes)

        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao listar instituições")
        }
    }


}


module.exports = EduCursoController

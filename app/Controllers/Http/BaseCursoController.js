'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Curso = use('App/Models/BaseCurso')

const EduBolsa = use('App/Models/EduBolsa')

const ResponseHelper = use('App/Helpers/ResponseHelper')
const requestFields = ['id', 'nome', 'estado', 'codigo', 'base_area_conhecimento_id', 'grau_academico', 'prioritario', 'programa_merito', 'edu_bolsa_id', 'curso_superior'];

//'base_area_conhecimentos_id','prioritario', 'programa_merito', 'edu_bolsa', 'edu_bolsa','curso_superior'];


/**
 * Resourceful controller for interacting with basecursos
 */
class BaseCursoController {
    /**
     * Show a list of all basecursos.
     * GET basecursos
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async index({ request, response }) {

        try {

            const cursos = await Curso.query()

            // .with('areasdeconhecimento')
            //.with('bolsas')
            .orderBy('nome', 'asc')
                .fetch();

            return ResponseHelper.getOnlyDataResponse(cursos)

        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao listar os cursos")

        }

        /* try {
             return ResponseHelper.getOnlyDataResponse(await Curso.all())
         } catch (err) {
             //console.log(err.message)
             return ResponseHelper.getErrorResponse("Erro ao listar os cursos")
         }*/
    }

    async cursoespecificos({ params }) {

        try {

            //condicoes para ver se a bolsa tem cursos especificos
            let curso = "";
            let bolsa = await EduBolsa.findBy({ id: params.bolsa_id });

            //console.log("------------------------------")
            //console.log(bolsa.curso_especifico)
            //console.log("------------------------------")
            if (bolsa.curso_especifico == 1)
                curso = await Curso.query().where('estado', 1).andWhere('edu_bolsa', params.bolsa_id).fetch()
            else
                curso = await Curso.query().where('estado', 1).fetch();

            return ResponseHelper.getOnlyDataResponse(curso)
        } catch (err) {
            console.error(err)
            return ResponseHelper.getErrorResponse("Erro ao listar os cursos")
        }
    }


    async cursosmerito({ params }) {

            try {

                //condicoes para ver se a bolsa tem cursos especificos
                let curso = "";


                curso = await Curso.query().where('estado', 1).andWhere('programa_merito', 1).fetch()


                return ResponseHelper.getOnlyDataResponse(curso)
            } catch (err) {
                console.error(err)
                return ResponseHelper.getErrorResponse("Erro ao listar os cursos")
            }
        }
        /**
         * Create/save a new basecurso.
         * POST basecursos
         *
         * @param {object} ctx
         * @param {Request} ctx.request
         * @param {Response} ctx.response
         */
    async store({ request, response }) {
        try {

            const data = request.only(requestFields);
            const curso = await Curso.create(data);
            return ResponseHelper.getSuccessResponse("Curso criado com sucesso", curso)

        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao salvar o Curso")
        }
    }

    /**
     * Display a single basecurso.
     * GET basecursos/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async show({ params, request, response }) {
        try {
            return ResponseHelper.getOnlyDataResponse(await Curso.find(params.id))
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao buscar o Curso")
        }
    }

    /**
     * Update basecurso details.
     * PUT or PATCH basecursos/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async update({ params, request, response }) {
        try {

            const data = request.only(requestFields);
            const curso = await Curso.find(params.id);

            curso.merge(data);
            await curso.save();

            return ResponseHelper.getSuccessResponse("Curso actualizado com sucesso", curso)

        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao actualizar o Curso")
        }
    }

    /**
     * Delete a basecurso with id.
     * DELETE basecursos/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async destroy({ params, request, response }) {
        try {

            const curso = await Curso.find(params.id);

            if (!curso) {
                return ResponseHelper.getWarningResponse("Não foi encontrado o curso", curso)
            }

            await curso.delete();

            return ResponseHelper.getSuccessResponse("Curso eliminado com sucesso", null)

        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao eliminar o Curso")
        }
    }
}

module.exports = BaseCursoController
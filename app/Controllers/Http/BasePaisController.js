'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */



const EduCandidatura = use('App/Models/EduCandidatura')

const EduCandidaturaExterna = use('App/Models/EduCandidaturaExterna')



const User = use('App/Models/User')
const BasePaises = use('App/Models/BasePaises')

const ResponseHelper = use('App/Helpers/ResponseHelper')

const requestFields = ['id', 'nome', 'codigo', 'codigo_a2_iso', 'codigo_a3_iso', 'nome_iso', 'icon', 'estado', 'local', 'capital'];


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

/**
 * Resourceful controller for interacting with pais
 */
class BasePaisController {


    /**
     * Show a list of all pais.
     * GET pais
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async index({ request, response }) {

        try {
            const paises = await BasePaises.all()
            return ResponseHelper.getOnlyDataResponse(paises)
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao listar países")
        }

    }

    async paisesActivo({ params }) {
        try {

            const paises = await BasePaises.query().where('estado', 1).fetch()
            return ResponseHelper.getOnlyDataResponse(paises)
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao listar países")
        }

    }
    async paisesRaking({ params }) {
            try {

                const paises = await BasePaises.query()
                    .where('raking', '<=', params.raking)
                    .fetch()
                return ResponseHelper.getOnlyDataResponse(paises)

            } catch (err) {
                //console.log(err.message)
                return ResponseHelper.getErrorResponse("Erro ao listar países")
            }

        }
        /**
         * Create/save a new pai.
         * POST pais
         *
         * @param {object} ctx
         * @param {Request} ctx.request
         * @param {Response} ctx.response
         */
    async store({ request, response }) {
        try {

            const data = request.only(requestFields);
            const pais = await BasePaises.create(data);
            return ResponseHelper.getSuccessResponse("País criado com sucesso", pais)
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao salvar o país")
        }

    }

    /**
     * Display a single pai.
     * GET pais/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async show({ params, request, response }) {

        try {
            const pais = await BasePaises.find(params.id);
            return ResponseHelper.getOnlyDataResponse(pais)
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao buscar o país")
        }

    }

    /**
     * Update pai details.
     * PUT or PATCH pais/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async update({ params, request, response }) {

        try {
            const data = request.only(requestFields);
            const pais = await BasePaises.find(params.id);
            pais.merge(data);
            await pais.save();
            return ResponseHelper.getSuccessResponse("País actualizado com sucesso", pais)
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao actualizar o país")
        }
    }

    /**
     * Delete a pai with id.
     * DELETE pais/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async destroy({ params, request, response }) {
        try {
            const pais = await BasePaises.find(params.id);
            if (!pais) {
                return ResponseHelper.getWarningResponse("Não foi encontrado o país a ser eliminado", pais)
            }
            await pais.delete();
            return ResponseHelper.getSuccessResponse("País eliminado com sucesso", null)
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao eliminar o país")
        }
    }

    async indexProvincia({ params, request, response }) {
        try {
            const pais = await BasePaises.query().where({ id: params.id }).with('provincias').first();

            if (!pais) {
                return ResponseHelper.getWarningResponse("Não foi encontrado o país a listar as províncias", pais)
            }

            const provincias = JSON.parse(JSON.stringify(pais)).provincias;

            return ResponseHelper.getOnlyDataResponse(provincias)
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao listar as províncias do País")
        }
    }






    async showCandidatura({ params, request, response, view }) {
        try {
            //console.log(params)
            let result = await User.query()
                .where({ id: params.id })
                .with('candidaturaInterna.curso')
                .with('candidaturaInterna.instituicao')
                .with('candidaturaInterna.cursoFormacaoConcluida')
                .with('candidaturaInterna.instituicaoFormacaoConcluida')
                .with('candidaturaInterna.BasePais')
                .with('candidaturaInterna.BaseProvincia')
                .with('candidaturaInterna.BaseMunicipio')
                .with('candidaturaInterna.BasePaisResidencia')
                .with('candidaturaInterna.BaseProvinciaResidencia')
                .with('candidaturaInterna.BaseProvinciaResidencia')


                .with('candidaturaInterna.bolsa')
            .with('candidaturaInterna.anexo')
                .with('candidaturaInterna.anexo.itens')
                .with('candidaturaInterna.anexo.itens.tipo_anexo')

            .with('candidaturaInterna.nivelacademico')
                .with('candidaturaInterna.BaseNivelFormacaoConcluida')


                .with('candidaturaExterna.bolsa')
            .with('candidaturaExterna.curso')
                .with('candidaturaExterna.instituicao')
                .with('candidaturaExterna.cursoFormacaoConcluida')
                .with('candidaturaExterna.instituicaoFormacaoConcluida')
                .with('candidaturaExterna.BasePais')
                .with('candidaturaExterna.BaseProvincia')
                .with('candidaturaExterna.BaseMunicipio')
                .with('candidaturaExterna.BasePaisResidencia')
                .with('candidaturaExterna.BaseProvinciaResidencia')
                .with('candidaturaExterna.BaseProvinciaResidencia')

            .with('candidaturaExterna.anexo')
                .with('candidaturaExterna.anexo.itens')
                .with('candidaturaExterna.anexo.itens.tipo_anexo')

            .with('candidaturaExterna.nivelacademico')
                .with('candidaturaExterna.BaseNivelFormacaoConcluida')

            .first()





            return ResponseHelper.getOnlyDataResponse(result)

        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Candidatura Não Encontrada")
        }
    }

    async showCandidaturaInterna({ params, request, response, view }) {
        try {
            //console.log(params)
            let result_interno = await EduCandidatura.query()
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
                .with('user')
                .with('anexo')
                .with('anexo.itens')
                .with('anexo.itens.tipo_anexo')

            .with('nivelacademico')
                .with('BaseNivelFormacaoConcluida')

            .fetch()
            let result_externo = await EduCandidaturaExterna.query()
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
                .with('user')
                .with('anexo')
                .with('anexo.itens')
                .with('anexo.itens.tipo_anexo')

            .with('nivelacademico')
                .with('BaseNivelFormacaoConcluida')

            .fetch()


            let result = Object.assign(result_interno, result_externo);

            return ResponseHelper.getOnlyDataResponse(result)

        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Candidatura Não Encontrada")
        }
    }


    async showCandidaturaExterna({ params, request, response, view }) {
        try {
            //console.log(params)
            let result = await EduCandidaturaExterna.query()
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
                .with('user')
                .with('anexo')
                .with('anexo.itens')
                .with('anexo.itens.tipo_anexo')

            .with('nivelacademico')
                .with('BaseNivelFormacaoConcluida')

            .first()
            return ResponseHelper.getOnlyDataResponse(result)

        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Candidatura Não Encontrada")
        }
    }

    async salvarCandidaturaInterna({ request, response }) {
        try {
            // let request_candidatura = request.all();
            let request_candidatura = request.only(requestFieldsCandidatura);


            //console.log(request_candidatura)
            let candidato = ""
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


            return ResponseHelper.getSuccessResponse(message, candidato)
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Candidatura Não Efectuada")
        }

    }

}

module.exports = BasePaisController

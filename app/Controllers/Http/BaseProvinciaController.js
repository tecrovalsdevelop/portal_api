'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with baseprovincias
 */
const BaseProvincia = use('App/Models/BaseProvincia')
const Pais = use('App/Models/BasePaises')

const ResponseHelper = use('App/Helpers/ResponseHelper')
const GeneralConstants = use('App/Constants/GeneralConstants')

const requestFields = ['id', 'nome', 'estado', 'highchart_code', 'provincia_abbr', 'base_pais_id'];

class BaseProvinciaController {
    /**
     * Show a list of all baseprovincias.
     * GET baseprovincias
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async index({ request, response, view }) {
        try {
            return ResponseHelper.getOnlyDataResponse(await BaseProvincia.all())

        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao listar províncias")
        }
    }



    /**
     * Create/save a new baseprovincia.
     * POST baseprovincias
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async store({ request, response }) {
        try {

            const data = request.only(requestFields);
            const pais = await Pais.find(data.base_pais_id);

            if (!pais) {
                return ResponseHelper.getWarningResponse("País não encontrado")
            }

            const provincia = await BaseProvincia.create(data);

            return ResponseHelper.getSuccessResponse("Província criada com sucesso", provincia)

        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao salvar a província")
        }
    }

    /**
     * Display a single baseprovincia.
     * GET baseprovincias/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async show({ params, request, response, view }) {
        try {
            return ResponseHelper.getOnlyDataResponse(await BaseProvincia.find(params.id))
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao buscar a província")
        }
    }



    /**
     * Update baseprovincia details.
     * PUT or PATCH baseprovincias/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async update({ params, request, response }) {
        try {

            const data = request.only(requestFields);
            const provincia = await BaseProvincia.find(params.id);

            provincia.merge(data);
            await provincia.save();

            return ResponseHelper.getSuccessResponse("Província actualizada com sucesso", provincia)

        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao actualizar a província")
        }
    }

    /**
     * Delete a baseprovincia with id.
     * DELETE baseprovincias/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async destroy({ params, request, response }) {}

    async indexMunicipio({ params }) {
        try {
            const provincia = await BaseProvincia.find(params.id);

            if (!provincia) {
                return ResponseHelper.getWarningResponse("Não foi encontrada a província a listar os municípios", provincia)
            }

            const municipios = await provincia.municipios().fetch();
            return ResponseHelper.getOnlyDataResponse(municipios)
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao listar os municipios da Província")
        }
    }
    async indexInstituicao({ params, request }) {
        try {
            const provincia = await BaseProvincia.find(params.id);

            if (!provincia) {
                return ResponseHelper.getWarningResponse("Não foi encontrada a província a listar as instituições", provincia)
            }

            let nivel_instituicao = 0;
            if (request._qs.nivel_academico)
                nivel_instituicao = GeneralConstants.NIVEIS_ACADEMICOS.getNivelInstituicao(request._qs.nivel_academico);

            const instituicoes = nivel_instituicao ? await provincia.instituicoes().where({ nivel_instituicao: nivel_instituicao.code }).fetch() : await provincia.instituicoes().fetch();
            return ResponseHelper.getOnlyDataResponse(instituicoes)
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao listar as instituições da Província")
        }
    }
}

module.exports = BaseProvinciaController
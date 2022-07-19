'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const ResponseHelper = use('App/Helpers/ResponseHelper')
const AreaConhecimento = use('App/Models/BaseAreaConhecimento')

/**
 * Resourceful controller for interacting with baseareaconhecimentos
 */
class BaseAreaConhecimentoController {


    async index({ request, response }) {

        try {
            return ResponseHelper.getOnlyDataResponse(await AreaConhecimento.all())
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Dados não encontrados")
        }
    }


    async store({ request, response }) {
        try {
            let data = request.all();
            let result = ""
            if (data.id) {
                result = await AreaConhecimento.query().where({ id: data.id }).first();
                result.merge(data);
                await result.save();
            } else {
                result = await AreaConhecimento.create(data);
            }
            return ResponseHelper.getSuccessResponse("Informação Salva com sucesso", result)
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("A Informação não foi Salva")
        }
    }

    async show({ params, request, response }) {
        try {

            let result = await AreaConhecimento.query().where({ id: params.id }).first();
            return ResponseHelper.getOnlyDataResponse(result)

        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("A Informação não foi Salva")
        }
    }

    async update({ params, request, response }) {
        try {
            let data = request.all();
            let result = ""
            if (data.id) {
                result = await AreaConhecimento.query().where({ id: data.id }).first();
                result.merge(data);
                await result.save();
                return ResponseHelper.getSuccessResponse("Informação Salva com sucesso", result)
            } else {

                return ResponseHelper.getErrorResponse("A Informação não foi Salva")
            }

        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("A Informação não foi Salva")
        }
    }

    async destroy({ params, request, response }) {
        try {
            //console.log(params);
            // const anoAvaliacao = await AnoAvaliacao.find(params.id).update({estado: 0});
            const AreaConhecimento = await AreaConhecimento
                .query()
                .where('id', params.id)
                .delete();
            if (!AreaConhecimento) {
                return ResponseHelper.getWarningResponse("Não foi encontrado a anoAvaliacao a ser eliminado", AreaConhecimento)
            }

            return ResponseHelper.getSuccessResponse("anoAvaliacao eliminado com sucesso", null)
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao eliminar o anoAvaliacao")
        }
    }

}

module.exports = BaseAreaConhecimentoController
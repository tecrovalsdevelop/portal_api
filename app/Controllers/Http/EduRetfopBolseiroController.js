'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with EduRetfopBolseiros
 */


const EduRetfopBolseiro = use('App/Models/EduRetfopBolseiro')

const BaseAnexo = use('App/Models/BaseAnexo')
const BaseTipoAnexo = use('App/Models/BaseTipoAnexo')
const BaseAnexoIten = use('App/Models/BaseAnexoIten')
const BasePeriodoAvaliacao = use('App/Models/BasePeriodoAvaliacoe')

const Helpers = use('Helpers');
const ResponseHelper = use('App/Helpers/ResponseHelper')
const requestFields = ['id', 'nome', 'ndi', 'telefone', 'reclamacao', 'estado_reclamacao_id', 'resposta', 'tipo_reclamacao_id', 'edu_candidatura_id'];

class EduRetfopBolseiroController {
  /**
   * Show a list of all EduRetfopBolseiros.
   * GET EduRetfopBolseiros
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, view }) {
  }

  async buscartodoscandidatosretfop({ request, response }) {
    try {
      let data = request.all();
      let page = Number(data.page ? data.page : 1);
      let size = Number(data.size ? data.size : 25);
      if (data.nome_bi) {
        const result = await EduRetfopBolseiro.query()
          .where('bi', 'like', '%' + data.nome_bi + '%')
          .orWhere('nome', 'like', '%' + data.nome_bi + '%')

          .orderBy('nome', 'asc')
          .paginate(page, size);

        return ResponseHelper.getOnlyDataResponse(result)
      } else {
        const result = await EduRetfopBolseiro.query()
          .orderBy('nome', 'asc')
          .paginate(page, 10);
        return ResponseHelper.getOnlyDataResponse(result)

      }

    } catch (error) {

      return ResponseHelper.getErrorResponse("nenhum dado encontrado")
    }
  }

  async pesquisarBolseiroRetfopBi({ request, params, response, view }) {


    try {

      //  const data = request.only(requestFields);
      // const data_full = request.all();


      //  return ResponseHelper.getErrorResponse("AS RECLAMAÇÕES ESTÃO ENCERRADAS!")

      let result = await EduRetfopBolseiro.query()
        .where({ bi: params.bi }).first()


      return ResponseHelper.getOnlyDataResponse(result)

    } catch (err) {
      console.log(err)
      return ResponseHelper.getErrorResponse("Informação não encontrada")
    }
  }

  /**
   * Render a form to be used for creating a new EduRetfopBolseiro.
   * GET EduRetfopBolseiros/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response, view }) {
  }

  /**
   * Create/save a new EduRetfopBolseiro.
   * POST EduRetfopBolseiros
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async salvarAnexoBolseiroRetfop({ params, request, auth, response }) {
    try {


      const data = request.only(requestFields);
      const data_full = request.all();

      let result = await EduRetfopBolseiro.query().where({ bi: data_full.bi }).first()

      if (result.ficheiro_actualizado != 1) {

        console.log(result.bi)
        //  console.log(request.file)
        let pasta = 'bolseiro_retfop';
        let url_file = `uploads/bolsa_retfop/${result.bi}/`;
        const DIR = Helpers.publicPath(`../../files/uploads/bolseiro_retfop/${result.bi}/`);
        const uploadedFile = request.file('upload_', { types: ['image', 'pdf'], size: '2mb' })

        console.log(uploadedFile)
        console.log("salvar o bi .....")

        if (uploadedFile) {
          //console.log(tipo_anexo.codigo)
          let novo_nome = result.bi + "_" + Math.random().toString(20).substr(2, 20) + "." + uploadedFile.extname
          await uploadedFile.move(DIR, { name: `${novo_nome}`, overwrite: true })
          if (!uploadedFile.moved())
            return ResponseHelper.getErrorResponse(" documento não foi salvo")
          // let anexo = await this.registarDocumento(data_full, periodoAvaliacao, tipo_anexo, url_file, novo_nome, 1)
          //console.log("upload concluido com sucesso")

          //console.log(novo_nome + " carregado com sucesso...");
          await EduRetfopBolseiro.query().where({ id: data_full.id }).update({ ficheiro: novo_nome });
        }

        return ResponseHelper.getSuccessResponse("Anexo criado com sucesso", result)
      }
      else {
        return ResponseHelper.getErrorResponse("Já não tem permissao para acutalizar o documento!.")
      }

    } catch (err) {
      console.log(err)
      return ResponseHelper.getErrorResponse("Informação não salva")
    }
  }






  /**
   * Display a single EduRetfopBolseiro.
   * GET EduRetfopBolseiros/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing EduRetfopBolseiro.
   * GET EduRetfopBolseiros/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {
  }

  /**
   * Update EduRetfopBolseiro details.
   * PUT or PATCH EduRetfopBolseiros/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
  }

  /**
   * Delete a EduRetfopBolseiro with id.
   * DELETE EduRetfopBolseiros/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {
  }
}

module.exports = EduRetfopBolseiroController

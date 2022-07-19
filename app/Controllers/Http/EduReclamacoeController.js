'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with edureclamacoes
 */
const EduReclamacoes = use('App/Models/EduReclamacoe')

const BaseAnexo = use('App/Models/BaseAnexo')
const BaseTipoAnexo = use('App/Models/BaseTipoAnexo')
const BaseAnexoIten = use('App/Models/BaseAnexoIten')
const BasePeriodoAvaliacao = use('App/Models/BasePeriodoAvaliacoe')

const Helpers = use('Helpers');
const ResponseHelper = use('App/Helpers/ResponseHelper')
const requestFields = ['id', 'nome', 'ndi', 'telefone', 'reclamacao', 'estado_reclamacao_id', 'resposta', 'tipo_reclamacao_id', 'edu_candidatura_id'];

class EduReclamacoeController {
  /**
   * Show a list of all edureclamacoes.
   * GET edureclamacoes
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */

  async index({ request, response, view }) {
    try {
      return ResponseHelper.getOnlyDataResponse(

        await EduReclamacoes.query()
          .with('anexo.itens.tipo_anexo')

          .fetch()


      );
    } catch (err) {
      //console.log(err.message)
      return ResponseHelper.getErrorResponse("Erro ao listar o Tipo de instituição")
    }
  }

  async reclamacoesporbi({ request, params, response, view }) {
    try {

      let data = request.all();
      let page = Number(data.page ? data.page : 1);
      let size = Number(data.tableSize ? data.tableSize : 5);


      let result = await EduReclamacoes.query()
        .with('anexo.itens.tipo_anexo')

        .where({ ndi: params.ndi })
        .paginate(page, size)

      return ResponseHelper.getOnlyDataResponse(result);


    } catch (err) {
      //console.log(err.message)
      return ResponseHelper.getErrorResponse("Nnhuma Reclamação Encontrada")
    }
  }


  async buscarReclamaccoes({ request, response }) {
    try {

      let data = request.all();
      let page = Number(data.page);
      let size = Number(data.size);


      let reclamacoes;
      if (data.nome_bi) {
        reclamacoes = await EduReclamacoes.query()
          .where('nome', 'like', '%' + data.nome_bi + '%')
          .orWhere('ndi', 'like', '%' + data.nome_bi + '%')
          .with('candidato')
          .with('anexo.itens.tipo_anexo')

          .paginate(page, size)
      } else {
          let reclamacao_query = EduReclamacoes.query()
          if(data.estado_reclamacao_id){
             reclamacao_query.where({ estado_reclamacao_id: data.estado_reclamacao_id })
          }

          if(data.tipo_reclamacao_id){
            reclamacao_query.where({ tipo_reclamacao_id: data.tipo_reclamacao_id })
          }

          reclamacoes = await reclamacao_query
          .with('candidato')
          .with('anexo.itens.tipo_anexo')

          .paginate(page, size)
      }
      // console.log(reclamacoes.toJSON());
      return ResponseHelper.getOnlyDataResponse(reclamacoes)
    } catch (err) {
      //console.log(err.message)
      return ResponseHelper.getErrorResponse("Erro ao listar reclamações")
    }


  }


  /**
   * Render a form to be used for creating a new edureclamacoe.
   * GET edureclamacoes/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response, view }) {
  }

  /**
   * Create/save a new edureclamacoe.
   * POST edureclamacoes
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    try {


      const data = request.only(requestFields);
      const data_full = request.all();


    //  return ResponseHelper.getErrorResponse("AS RECLAMAÇÕES ESTÃO ENCERRADAS!")

      let result = await EduReclamacoes.query()
        .where({ ndi: data_full.ndi, estado_reclamacao_id: 1 }).first()

      if (result)
        return ResponseHelper.getErrorResponse("Não pode Criar nova Reclamação, porque já tem uma reclamação no Estado Iniciado, aguarde a verficação do inagbe!.")

      const reclamacao = await EduReclamacoes.create(data);


      if (reclamacao) {
        const file = request._files;
        if(file.upload_){

          let anexo = await this.upload(request, data_full, reclamacao)

          if (anexo) {
            await EduReclamacoes.query().where({ id: reclamacao.id }).update({ base_anexo_id: anexo.id });
          }
          else {
            return ResponseHelper.getErrorResponse("Informação não salva")
          }

        }


      }

      return ResponseHelper.getSuccessResponse("Reclamação criado com sucesso", reclamacao)

    } catch (err) {
     // console.log(err)
      return ResponseHelper.getErrorResponse("Informação não salva")
    }
  }

  async actualizarReclamacaoEstudante({ request, response }) {
    try {
      let data = request.only(['id', 'nome', 'ndi', 'telefone', 'reclamacao', 'edu_candidatura_id']);
      let data_result = '';

      if (data.id) {
        data_result = await EduReclamacoes.query().where({ id: data.id }).first();
        data_result.merge(data);
        await data_result.save();

      }
      return ResponseHelper.getSuccessResponse("Informação Salva com sucesso", data_result)
    } catch (err) {
      console.log(err)
      return ResponseHelper.getErrorResponse("A Informação não foi Salva")
    }

  }

  async actualizarReclamacaoInagbe({ request, response }) {

    try {
      let data = request.only(['id', 'nome', 'ndi', 'telefone', 'estado_reclamacao_id', 'resposta', 'edu_candidatura_id']);

      let data_result = '';
      if (data.id) {

        data_result = await EduReclamacoes.query().where({ id: data.id }).first();
        data_result.merge(data);
        await data_result.save();
      }
      return ResponseHelper.getSuccessResponse("Informação Salva com sucesso", data_result)
    } catch (err) {
      console.log(err);
      return ResponseHelper.getErrorResponse("A Informação não foi Salva")
    }

  }


  /**
   * Display a single edureclamacoe.
   * GET edureclamacoes/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing edureclamacoe.
   * GET edureclamacoes/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {
  }

  /**
   * Update edureclamacoe details.
   * PUT or PATCH edureclamacoes/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
  }

  /**
   * Delete a edureclamacoe with id.
   * DELETE edureclamacoes/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {
    try {
      //console.log(params);
      // const anoAvaliacao = await AnoAvaliacao.find(params.id).update({estado: 0});
      const EduReclamacoes = await EduReclamacoes
        .query()
        .where('id', params.id)
        .where({ estado_reclamacao_id: 1 })

        .delete();
      if (!EduReclamacoes) {
        return ResponseHelper.getWarningResponse("Só é possivel eliminar a reclamação no estado Iniciado")
      }

      return ResponseHelper.getSuccessResponse("reclamação eliminado com sucesso", null)
    } catch (err) {
      //console.log(err.message)
      return ResponseHelper.getErrorResponse("Reclamação não eliminada")
    }
  }


  async upload(request, data_full, reclamacao) {
    try {

      const periodoAvaliacao = await BasePeriodoAvaliacao.query().where({ estado: 1 }).orderBy("id", "desc").first();
      const tipo_anexo = await BaseTipoAnexo.query().where({ id: 1 }).first()

      let pasta = 'reclamacao';
      let url_file = `uploads/${pasta}/${periodoAvaliacao.nome}/${reclamacao.id}/`;
      const DIR = Helpers.publicPath(`../../files/uploads/${pasta}/${periodoAvaliacao.nome}/${reclamacao.id}/`);
      const uploadedFile = request.file('upload_', { types: ['image', 'pdf'], size: '2mb' })


     // console.log(url_file)
     // console.log(DIR)
     // console.log(request)
      //console.log(uploadedFile)

      if (uploadedFile) {
        //console.log(tipo_anexo.codigo)
        let novo_nome = reclamacao.id + "_" + pasta + "_" + periodoAvaliacao.nome + "_" + reclamacao.ndi + "." + uploadedFile.extname
        await uploadedFile.move(DIR, { name: `${novo_nome}`, overwrite: true })
        if (!uploadedFile.moved())
          return ResponseHelper.getErrorResponse(" documento não foi salvo")
        let anexo = await this.registarDocumento(data_full, periodoAvaliacao, tipo_anexo, url_file, novo_nome, 1)
        //console.log("upload concluido com sucesso")

        //console.log(novo_nome + " carregado com sucesso...");
        return anexo

      } else
        return null


    } catch (err) {
     // console.log(err)
      return "anexo não foi salvo"
    }
  }

  async registarDocumento(pessoa, periodoAvaliacao, tipoAnexo, url_ficheiro, nome_ficheiro, categoria) {
    try {
     // console.log("salvar Anexo....")

      let novo_anexo = {
        nome: pessoa.nome,
        ndi: pessoa.ndi,
        user_id: 0,
        descricao: "anexo de reclamacao" + " - " + pessoa.nome,
        estado: 1,
        base_periodo_avaliacao_id: periodoAvaliacao.id,
        codigo: periodoAvaliacao.id,
        categoria: categoria
      }

      let anexo = await BaseAnexo.query().where({ ndi: pessoa.ndi, base_periodo_avaliacao_id: periodoAvaliacao.id, estado: 1 }).first()

      if (anexo) {
        anexo.merge(novo_anexo)
        anexo.save()
      } else {

        anexo = await BaseAnexo.create(novo_anexo);
      }
      console.log("salvar iten anexo....")


      let novo_tipo_anexo_item = {
        nome: tipoAnexo.nome,
        base_anexo_id: anexo.id,
        base_tipo_anexo_id: tipoAnexo.id,
        nome_ficheiro: nome_ficheiro,
        url_ficheiro: url_ficheiro + nome_ficheiro,
        categoria: categoria
      }



      console.log("salvar iten anexo....")


      //  console.log(novo_tipo_anexo_item)
      let tipo_anexo_item = await BaseAnexoIten.create(novo_tipo_anexo_item);

      console.log("salvar iten anexo....")

      //  this.registarLog(pessoa.ndi, "anexo", tipoAnexo.id, '1', "", "-", "anexo carregado", "anexo carregado");

      return anexo

    } catch (err) {
      console.log(err)
      return null
    }
  }

}

module.exports = EduReclamacoeController

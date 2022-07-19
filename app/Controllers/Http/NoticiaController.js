'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const BaseNoticias = use('App/Models/Noticia')

const ResponseHelper = use('App/Helpers/ResponseHelper')



const requestFields = ['id', 'titulo', 'descricao_menor', 'categoria', 'foto_menor',
    'foto_maior', 'estado'
];

/**
 * Resourceful controller for interacting with noticias
 */
class NoticiaController {
  /**
   * Show a list of all noticias.
   * GET noticias
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response}) {
    try {
      const noticias = await BaseNoticias.query().where({ estado: 1 })
     // .with('noticiaItem')
      .limit(10)
      .orderBy("id", "desc")
      .fetch()
      return ResponseHelper.getOnlyDataResponse(noticias)
  } catch (err) {
      console.error(err)
      return ResponseHelper.getErrorResponse("Erro ao listar as Bolsas")
  }
  }


  /**
   * Render a form to be used for creating a new noticia.
   * GET noticias/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new noticia.
   * POST noticias
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
  }

  /**
   * Display a single noticia.
   * GET noticias/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  async buscarNoticiaId({ request, response}) {
    try {
          let dados = request.all();
          const noticias = await BaseNoticias.query()
         .where({ id: dados.id })
         .with('noticiaItens')
         .first()
          return ResponseHelper.getOnlyDataResponse(noticias);

    } catch (err) {
        console.log(err.message)
        return ResponseHelper.getErrorResponse("Erro ao listar Noticia")
    }
  }


  /**
   * Render a form to update an existing noticia.
   * GET noticias/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update noticia details.
   * PUT or PATCH noticias/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a noticia with id.
   * DELETE noticias/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }

  async bolsasdisponiveisportal({ request, response, view }) {
    try {



        let data = new Date();

        let dia = data.getDate();
        let ano = data.getFullYear()
        let mes_id = data.getMonth() + 1
        let mes = mes_id > 9 ? mes_id : "0" + mes_id;

        let mes_um = 1;
        let data_hoje = data.getFullYear() + "-" + mes + "-" + data.getDate();


        const bolsa = await BaseNoticias.query()
            .where('estado', '1')
            //  .where('data_abertura' , '<=', data_hoje)
            //  .where('data_encerramento' , '>=', data_hoje)
            .with('bolsas')
            .fetch()
        //      return ResponseHelper.getOnlyDataResponse(bolsas)

        const bolsas = await EduBolsa.query()
            .where('estado', '1')
            .where('data_abertura', '<=', data_hoje)
            .where('data_encerramento', '>=', data_hoje)
            .with('EduTipoBolsa')
            .fetch()

        return ResponseHelper.getOnlyDataResponse(bolsas)
    } catch (err) {
        console.error(err)
        return ResponseHelper.getErrorResponse("Erro ao listar as Bolsas")
    }
}


async listagemNoticia({ request, response }) {
  try {

      let data = request.all();
      let page = Number(data.page ? data.page : 1);
      let size = Number(data.size ? data.tableSize : 5);

      const bolsa = await BaseNoticias.query()
      .paginate(page, size)

      return ResponseHelper.getOnlyDataResponse(bolsa)
  } catch (err) {
      console.error(err)
      return ResponseHelper.getErrorResponse("Erro ao listar as Bolsas")
  }
}
}

module.exports = NoticiaController

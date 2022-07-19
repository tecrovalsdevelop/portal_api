'use strict'

const ResponseHelper = use('App/Helpers/ResponseHelper')
const periodoAvaliacao = use('App/Models/BasePeriodoAvaliacoe')

const bolseiroInterno = use('App/Models/EduBolseiroInterno')


/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with baseperiodoavaliacoes
 */
class BasePeriodoAvaliacoeController {
    /**
     * Show a list of all baseperiodoavaliacoes.
     * GET baseperiodoavaliacoes
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async index({ request, response, view }) {
        try {

            const periodoDeAvaliacoes = await periodoAvaliacao.query().orderBy("id", "asc").orderBy('id','desc').fetch();

            return ResponseHelper.getOnlyDataResponse(periodoDeAvaliacoes);
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Dados não encontrados")
        }
    }

    async periodoRenovacao({ request, response, view }) {
        try {

            const periodoDeAvaliacoes = await periodoAvaliacao.query().orderBy("id", "desc").limit(1).fetch();

            return ResponseHelper.getOnlyDataResponse(periodoDeAvaliacoes);
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Dados não encontrados")
        }
    }

    async bolseirointerno({ request, response, parms }) {

        try {

            //console.log("olalall")
            /* let paginate = request.all();

             //console.log(paginate)
             let page = Number(paginate?.page ? paginate?.page : 1);
             let size = Number(paginate?.size ? paginate?.size : 10); */
            const bolseiros_interno = await bolseiroInterno.query().with('bolseiro')
                .with('bolseiro.bolseiroRenovacao.anexo')
                .with('bolseiro.bolseiroRenovacao.anexo.itens')
                .with('bolseiro.bolseiroRenovacao.anexo.itens.tipo_anexo')
                .with('bolseiro.eduInstituicoes')
                .with('bolseiro.eduCurso')
                .with('bolseiro.eduCurso.eduUnidadeOrganica')
                .with('bolseiro.eduCurso.eduUnidadeOrganica.provincia')
                .with('bolseiro.anoFrequencia')
                .with('bolseiro.edutipobolseiro')
                .with('bolseiro.basenivelacademico')
                .with('bolseiro.basegrauacademico')
                .with('bolseiro.eduestadobolsa')
                .with('bolseiro.edutipobolsa')
                .with('bolseiro.periodoAvaliacao')
                .with('bolseiro.baseprovincia')

            .with('bolseiro.bolseiroRenovacao')
                .with('bolseiro.bolseiroRenovacao.periodoAvaliacao')
                .with('bolseiro.bolseiroRenovacao.anoFrequencia')
                .with('bolseiro.bolseiroRenovacao.estadoRenovacao')
                .with('bolseiro.pessoa')
                .with('bolseiro.pessoa.user')
                .with('eduCurso')
                .with('tipoBolsa').with('nivelAcademico')
                .with('grauAcademico')

            .limit(10)
                .fetch();
            //   .paginate(page, size)

            //console.log(bolseiros_interno)

            return ResponseHelper.getOnlyDataResponse(bolseiros_interno);

        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Dados não encontrados")
        }

    }


}

module.exports = BasePeriodoAvaliacoeController
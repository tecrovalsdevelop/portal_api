'use strict'
const Funcionario = use('App/Models/Funcionario');
const EduInstituicoes = use('App/Models/EduInstituicoe');
const ResponseHelper = use('App/Helpers/ResponseHelper')
const User = use('App/Models/User');
const requestFields_funcionario = ['id', 'nome', 'bilhete', 'cargo', 'edu_instituicoes_id', 'edu_unidade_organica_id', 'user_id'];
const requestFields_usuario = ['id', 'username', 'email', 'password', 'telefone', 'base_group_id'];

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with funcionarios
 */
class FuncionarioController {
    /**
     * Show a list of all funcionarios.
     * GET funcionarios
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async index({ request, response }) {
        try {

            let paginate = request.all();
            let page = Number(paginate.page ? paginate.page : 1);
            let size = Number(paginate.size ? paginate.size : 10);

            //console.log(paginate)
            const funcionario = await Funcionario.query()
                .where('bilhete', 'like', '%' + paginate.bi_nome + '%')
                .orWhere('nome', 'like', '%' + paginate.bi_nome + '%')
                .with('user').with('eduInstituicoes').with('unidadeOrganica')
                .paginate(page, size);


            return ResponseHelper.getOnlyDataResponse(funcionario);
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Dados não encontrados")
        }
    }

    async funcionarioPorUser({ request, params, response }) {
        try {

            //console.log(params)

            const funcionario = await Funcionario.query().where({ user_id: params.user_id })
                .with('user').with('eduInstituicoes').with('unidadeOrganica')

            .first();

            //console.log(funcionario.id)

            return ResponseHelper.getOnlyDataResponse(funcionario);
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Dados não encontrados")
        }
    }



    async findUserByEmail(email) {
        return User.query().where({ email: email }).first();
    }

    /**
     * Render a form to be used for creating a new funcionario.
     * GET funcionarios/create
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async create({ request, response, view }) {}

    /**
     * Create/save a new funcionario.
     * POST funcionarios
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */

    async store({ request, response }) {
        try {
            let data_usuario = request.only(requestFields_usuario);
            let data_funcionario = request.only(requestFields_funcionario);

            let email_exist = await this.findUserByEmail(data_usuario.email)
            let funcionario = ""
            if (email_exist) {
                email_exist.merge(data_usuario)
                email_exist.save()
                funcionario = await Instituicao.find(data_funcionario.id)
                if (funcionario) {
                    funcionario.merge(data_funcionario);
                    await funcionario.save();
                } else {
                    funcionario = await Funcionario.create(data_funcionario);
                }

            } else {

                let user = await User.create(data_usuario);
                data_funcionario.user_id = user.id;
                ////console.log(data_funcionario);
                funcionario = await Funcionario.create(data_funcionario);

            }
            //console.log(data_funcionario);
            //   //console.log(data_funcionario);
            return ResponseHelper.getSuccessResponse("Informação Salva com sucesso", funcionario)
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("A Informação não foi Salva")
        }
    }


    async store1({ request, response }) {
            try {
                let data_usuario = request.only(requestFields_usuario);
                let data_funcionario = request.only(requestFields_funcionario);

                let email_exist = await this.findUserByEmail(data_usuario.email)

                if (email_exist) {
                    //console.log('está conta de email ja existe');


                    return ResponseHelper.getErrorResponse("está conta email ja existe", email_exist.email)
                } else {
                    //console.log(data_funcionario);
                    let user = await User.create(data_usuario);
                    data_funcionario.user_id = user.id;
                    ////console.log(data_funcionario);
                    let funcionario = await Funcionario.create(data_funcionario);

                }
                // //console.log(data_usuario);
                //   //console.log(data_funcionario);
                return ResponseHelper.getSuccessResponse("Informação Salva com sucesso", funcionario)
            } catch (err) {
                //console.log(err.message)
                return ResponseHelper.getErrorResponse("A Informação não foi Salva")
            }
        }
        /**
         * Display a single funcionario.
         * GET funcionarios/:id
         *
         * @param {object} ctx
         * @param {Request} ctx.request
         * @param {Response} ctx.response
         * @param {View} ctx.view
         */
    async show({ params, request, response, view }) {}

    /**
     * Render a form to update an existing funcionario.
     * GET funcionarios/:id/edit
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async edit({ params, request, response, view }) {}

    /**
     * Update funcionario details.
     * PUT or PATCH funcionarios/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async update({ params, request, response }) {
        try {
            let data_funcionario = request.only(requestFields_funcionario);


            let funcionario = await Funcionario.query().where({ id: data_funcionario.id, }).first()

            funcionario.merge(data_funcionario)
            funcionario.save()

            // //console.log(data_usuario);
            //   //console.log(data_funcionario);
            return ResponseHelper.getSuccessResponse("Informação Salva com sucesso", funcionario)
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("A Informação não foi Salva")
        }
    }

    /**
     * Delete a funcionario with id.
     * DELETE funcionarios/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async destroy({ params, request, response }) {}
}

module.exports = FuncionarioController
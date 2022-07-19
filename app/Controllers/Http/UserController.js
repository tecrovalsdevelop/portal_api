'use strict'
const User = use('App/Models/User');
const basePessoa = use('App/Models/BasePessoa')

const ResponseHelper = use('App/Helpers/ResponseHelper')

const SmsHelper = use('App/Helpers/SmsHelper')
const NodeMailerHelper = use('App/Helpers/NodeMailerHelper')
const requestFields = ['id', 'username', 'email', 'password', 'telefone', 'base_group_id'];

const crypto = require('crypto') // crypto
var md5 = require('md5');

const BaseLog = use('App/Models/BaseLog')

class UserController {

    async registarLog(user, pagina, accao, estado, ip, pais, detalhes) {
        return await BaseLog.create({
            user: user,
            pagina: pagina,
            accao: accao,
            estado: estado,
            ip: ip,
            pais: pais,
            detalhes: detalhes,
        })
    }

    async index({ request, response }) {
        try {

            let paginate = request.all();
            let page = Number(paginate.page ? paginate.page : 1);
            let size = Number(paginate.size ? paginate.size : 10);

            const users = await User
                .query()
                .paginate(page, size)

            return ResponseHelper.getOnlyDataResponse(users)
        } catch (error) {
            return ResponseHelper.getErrorResponse("nenhum dado encontrado")
        }
    }


    async usuarioFiltro({ request, response }) {
        try {

            let paginate = request.all();
            let page = Number(paginate.page ? paginate.page : 1);
            let size = Number(paginate.size ? paginate.size : 10);


            const users = await User.query()
                .where('email', 'like', '%' + paginate.email_telefone + '%')
                .orWhere('telefone', 'like', '%' + paginate.email_telefone + '%')
                .orWhere('username', 'like', '%' + paginate.email_telefone + '%')

            .paginate(page, size);

            return ResponseHelper.getOnlyDataResponse(users)
        } catch (error) {
            //console.log(error)
            return ResponseHelper.getErrorResponse("nenhum dado encontrado")
        }
    }
    async usuariosInagbe({ request, response }) {
        try {

            const users = await User.query()
                //.where('estado', 1)
                .whereIn('base_group_id', [1, 2])
                //.orderBy("id","asc")
                .fetch();
            // .orWhere('base_estado_id',  '2')
            // .orderBy('username','asc')



            return ResponseHelper.getOnlyDataResponse(users)
        } catch (error) {
            //console.log(error)
            return ResponseHelper.getErrorResponse("nenhum dado encontrado")
        }
    }


    async show({ params, request, response, view }) {
        try {

            const user = await User.query().where({ id: params.id }).first()

            return ResponseHelper.getOnlyDataResponse(user);

        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("Dados não encontrados")
        }
    }


    async store({ request, response }) {
        try {
            let data_all = request.all();
            let data_user = request.only(requestFields);
            let email_exist = await this.findUserByEmail(data_user.email)

            let user = false;
            let user_result = ""
            let user_id = 0

            if (email_exist) {
                //console.log('está conta de email ja existe');
                return ResponseHelper.getErrorResponse("está conta email ja existe", email_exist.email)
            }
            user = await User.create(data_user);
            user_id = user.id


            this.registarLog(user.email, "", "user", 'novasenha', "1", "-", "-", "novas senha com sucesso");
            return ResponseHelper.getSuccessResponse("Informação Salva com sucesso", user)
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("A Informação não foi Salva")
        }
    }



    async update({ request, response }) {
        try {
            let data_all = request.all();
            let data_user = request.only(requestFields);
            let user_result = ""
            let user_id = 0

            if (!data_user.password)
                delete data_user.password

            if (data_user.id) {
                user_id = data_all.id
                user_result = await User.query().where({ id: data_user.id }).first();
                user_result.merge(data_user);
                await user_result.save();
            }

            return ResponseHelper.getSuccessResponse("Informação Salva com sucesso", user_result)
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("A Informação não foi Salva")
        }
    }


    async sendSms() {
        try {
            //  SmsHelper.floppysend('244927667663', 'ola rodolfo');
            SmsHelper.smsBulkgate('244927667663', 'ola rodolfo');
            //  SmsHelper.smsTelesign('244927667663', 'ola rodolfo');


            return ResponseHelper.getSuccessResponse("Mensagem Enviada com Sucesso!...")
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("mensagem não enviada")
        }
    }

    async criarContaCandidato({ request, response }) {
        try {

            //    return ResponseHelper.getErrorResponse("Está encerrada a candidatura de Bolsa de Estudo Interna para o ano lectivo 2021/2022 ! ...")

            let data_all = request.all();
            let data_user = request.only(requestFields);
            let email_exist = await this.findUserByEmail(data_user.email)

            let user = false;
            let user_result = ""
            let user_id = 0

            //console.log("-------------------------------------------------")
            //console.log(data_user.email)
            if (email_exist) {
                //console.log('   está conta de email ja existe');
                return ResponseHelper.getErrorResponse("está conta email ja existe", email_exist.email)
            }


            user = await User.create(data_user);

            //console.log("conta criada com sucesso ....")
            //console.log("-------------------------------------------------")
            //  NodeMailerHelper.enviarEmailContaCriadaCandidato(user, data_all);


            //console.log("email conta criada para candidatura  enviado com sucesso ....")

            return ResponseHelper.getSuccessResponse("Conta Criada Com sucesso!...", user_result)
        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("A Informação não foi Salva")
        }
    }





    async criarContaBolseiro({ request, response }) {
        try {
            let data_all = request.all();
            let data_user = request.only(requestFields);
            let email_exist = await this.findUserByEmail(data_user.email)

            let user = false;
            let user_result = ""
            let user_id = 0

            //console.log("-------------------------------------------------")
            //console.log(data_user.email)
            if (email_exist) {
                //console.log('está conta de email ja existe');
                return ResponseHelper.getErrorResponse("está conta email ja existe", email_exist.email)
            }

            user = await User.create(data_user);
            //console.log("conta criada com sucesso ....")
            //console.log("-------------------------------------------------")

            // NodeMailerHelper.enviarEmailContaCriada(user, data_all);


            //console.log("email conta criada para renovação  enviado com sucesso ....")

            const pessoa_user = await basePessoa.query().with('user').where({ ndi: data_all.bi }).first();
            if (pessoa_user.id) {
                pessoa_user.user_id = user.id
                await pessoa_user.save();
            }

            user_id = user.id
            if (data_all.grupos)
                this.saveGroupsUsers(data_all, user_id)

            this.registarLog(user.email, "user", "criarconta", '1', "", "-", "novas conta criada", "novas conta criada");

            //console.log(user.email + "Conta Criada Com sucesso!...");
            return ResponseHelper.getSuccessResponse("Conta Criada Com sucesso!...", user)
        } catch (err) {

            //console.log("cadastro de usuario A Informação não foi Salva...");
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("A Informação não foi Salva")
        }
    }




    async login({ request, response, auth }) {
        const { email, password } = request.all();
        try {
            let user = await User.query().where({ email: email }).first();

            if (!user) {
                //console.log(email + "  email não Encontrado......");
                this.registarLog(email, "user", "login", '0', "0", "-", "-", "Utilizador não Encontrado...");
                return ResponseHelper.getErrorResponse("email não Encontrado...")
            }
            const token = await auth.attempt(email, password);

            //  //console.log(token);
            if (token) {
                if (user.base_group_id == 1 || user.base_group_id == 2 || user.base_group_id == 3) {
                    let result = Object.assign(user, token);
                    this.registarLog(email, "user", "login", '1', "1", "-", "-", " login feito com sucesso");
                    //console.log(email + "  Login administração Feito com Sucesso...");
                    return ResponseHelper.getSuccessResponse("Login Feito com Sucesso", result)
                } else {
                    //console.log(email + "   ...  não tem permissão ..........");
                    return ResponseHelper.getErrorResponse("login falhou, conta não autorizada")
                }

            }

            //console.log(email + "email ou palavra passe Incorrecta...");
            this.registarLog(email, "user", "login", '0', "0", "-", "-", " Utilizador ou palavra passe Incorrecta");
            return ResponseHelper.getErrorResponse("email ou palavra passe Incorrecta")


        } catch (error) {

            this.registarLog(email, "user", "login", '0', "0", "-", "-", "Utilizador ou palavra passe Incorrecta...");

            //console.log(email + "email ou palavra passe Incorrecta, verificar o email e senha ......");
            return ResponseHelper.getErrorResponse("email ou palavra passe Incorrecta...  verifica o email e senha")
        }
    }


    async activarLoginCandidato() {

        // return await true

        let data = new Date();
        let minuto = Number(data.getMinutes());

        //console.log("minuto  para login ............. " + minuto+ " .........................")
        if (minuto > 0 && minuto < 2) {
            return await true
        }

        if (minuto > 15 && minuto < 17) {
            return await false
        }

        if (minuto > 30 && minuto < 35) {
            return await true
        }

        return await false
    }



    async activarLoginBolseiro() {
        let data = new Date();
        let minuto = Number(data.getMinutes());

        //console.log( data)

        //console.log("minutos actual - " + minuto)

        //  return await true

        if (minuto > 1 && minuto < 5) {
            return await true
        }
        if (minuto > 15 && minuto < 20) {
            return await true
        }
        if (minuto > 35 && minuto < 40) {
            return await true
        }
        return await false
    }

    async loginBolseiro({ request, response, auth }) {
        const { email, password } = request.all();

        //return ResponseHelper.getErrorResponse("O prazo para Renovação de Bolsa terminou ! ...")

        /*
    let activar_login = await this.activarLoginBolseiro();
    if (activar_login) {
      //console.log(email + " pode efectuar o login ...")
    }
    else {

      let data = new Date();
      let minuto = Number(data.getMinutes());

      let tempo_para_login= 0
      if ( minuto>5 && minuto < 15) {
        tempo_para_login= 15 - minuto
      }

      if ( minuto>20 && minuto < 35) {
        tempo_para_login= 35 - minuto
      }

      if (minuto > 35 && minuto < 40 ) {
        tempo_para_login= 40 - minuto
      }

      //console.log(email + " o número máximo de conexões foi excedido, tente mais tarde! ...")
      return ResponseHelper.getErrorResponse("o número máximo de conexões foi excedido, volte a conectar  em " + tempo_para_login + " minutos !. ")

    }

    */


        try {
            let user = await User.query().where({ email: email }).first();

            if (!user) {
                //console.log(email + "  email não Encontrado......");
                this.registarLog(email, "user", "login", '0', "0", "-", "-", "Utilizador não Encontrado...");
                return ResponseHelper.getErrorResponse("email não Encontrado...")
            }
            const token = await auth.attempt(email, password);

            //  //console.log(token);
            if (token) {

                let result = Object.assign(user, token);
                this.registarLog(email, "user", "login", '1', "1", "-", "-", " login feito com sucesso");
                //console.log(email + "  Login  Feito com Sucesso... ");
                return ResponseHelper.getSuccessResponse("Login Feito com Sucesso, ", result)

            }

            //console.log(email + "email ou palavra passe Incorrecta...");
            this.registarLog(email, "user", "login", '0', "0", "-", "-", " Utilizador ou palavra passe Incorrecta");
            return ResponseHelper.getErrorResponse("email ou palavra passe Incorrecta")


        } catch (error) {

            this.registarLog(email, "user", "login", '0', "0", "-", "-", "Utilizador ou palavra passe Incorrecta...");

            //console.log(email + "email ou palavra passe Incorrecta, verificar o email e senha ......");
            return ResponseHelper.getErrorResponse("email ou palavra passe Incorrecta...  verifica o email e senha")
        }
    }


    async loginBolseiroInagbe({ request, response, auth }) {
        const { email, password } = request.all();

        try {
            let user = await User.query().where({ email: email }).first();

            if (!user) {
                //console.log(email + "  email não Encontrado......");
                this.registarLog(email, "user", "login", '0', "0", "-", "-", "Utilizador não Encontrado...");
                return ResponseHelper.getErrorResponse("email não Encontrado...")
            }
            const token = await auth.attempt(email, password);

            //  //console.log(token);
            if (token) {

                let result = Object.assign(user, token);
                this.registarLog(email, "user", "login", '1', "1", "-", "-", " login feito com sucesso");
                //console.log(email + "  Login  Feito com Sucesso... ");
                return ResponseHelper.getSuccessResponse("Login Feito com Sucesso", result)

            }

            //console.log(email + "email ou palavra passe Incorrecta...");
            this.registarLog(email, "user", "login", '0', "0", "-", "-", " Utilizador ou palavra passe Incorrecta");
            return ResponseHelper.getErrorResponse("email ou palavra passe Incorrecta")


        } catch (error) {

            this.registarLog(email, "user", "login", '0', "0", "-", "-", "Utilizador ou palavra passe Incorrecta...");

            //console.log(email + "email ou palavra passe Incorrecta, verificar o email e senha ......");
            return ResponseHelper.getErrorResponse("email ou palavra passe Incorrecta...  verifica o email e senha")
        }
    }




    async loginCandidato({ request, response, auth }) {
        const { email, password } = request.all();


        return ResponseHelper.getErrorResponse("Está encerrada a candidatura de Bolsa de Estudo Interna para o ano lectivo 2021/2022 ! ...")


        let activar_login = await this.activarLoginCandidato();
        if (activar_login) {
            //console.log(email + " pode efectuar o login ...")

        } else {
            let data = new Date();
            let minuto = Number(data.getMinutes());
            let tempo_para_login = 0
            if (minuto > 5 && minuto < 15) {
                tempo_para_login = 15 - minuto
            }

            if (minuto > 5) {
                tempo_para_login = 35 - minuto
            }

            if (minuto > 35 && minuto < 40) {
                tempo_para_login = 40 - minuto
            }

            //console.log(email + " o número máximo de conexões foi excedido, tente mais tarde! ...")
            return ResponseHelper.getErrorResponse("o número máximo de conexões foi excedido, volte a conectar  em " + tempo_para_login + " minutos !. ")
        }
        try {
            let user = await User.query().where({ email: email }).first();

            if (!user) {
                //console.log(email + "  email não Encontrado......");
                this.registarLog(email, "user", "login", '0', "0", "-", "-", "Utilizador não Encontrado...");
                return ResponseHelper.getErrorResponse("email não Encontrado...")
            }
            const token = await auth.attempt(email, password);

            //  //console.log(token);
            if (token) {

                let result = Object.assign(user, token);
                this.registarLog(email, "user", "login", '1', "1", "-", "-", " login feito com sucesso");
                //console.log(email + "  Login  Feito com Sucesso ! TEM 15 MINUTOS PARA FAZER A CANDIDATURA ... ");
                return ResponseHelper.getSuccessResponse("Login Feito com Sucesso ! TEM 15 MINUTOS PARA FAZER A CANDIDATURA ...", result)

            }



            //console.log(email + "email ou palavra passe Incorrecta...");
            this.registarLog(email, "user", "login", '0', "0", "-", "-", " Utilizador ou palavra passe Incorrecta");
            return ResponseHelper.getErrorResponse("email ou palavra passe Incorrecta")


        } catch (error) {

            this.registarLog(email, "user", "login", '0', "0", "-", "-", "Utilizador ou palavra passe Incorrecta...");

            //console.log(email + "email ou palavra passe Incorrecta, verificar o email e senha ......");
            return ResponseHelper.getErrorResponse("email ou palavra passe Incorrecta...  verifica o email e senha")
        }
    }


    async loginCandidatoInagbe({ request, response, auth }) {
        const { email, password } = request.all();

        try {
            let user = await User.query().where({ email: email }).first();

            if (!user) {
                //console.log(email + "  email não Encontrado......");
                this.registarLog(email, "user", "login", '0', "0", "-", "-", "Utilizador não Encontrado...");
                return ResponseHelper.getErrorResponse("email não Encontrado...")
            }
            const token = await auth.attempt(email, password);

            //  //console.log(token);
            if (token) {

                let result = Object.assign(user, token);
                this.registarLog(email, "user", "login", '1', "1", "-", "-", " login feito com sucesso");
                //console.log(email + "  Login  Feito com Sucesso... ");
                return ResponseHelper.getSuccessResponse("Login Feito com Sucesso", result)

            }

            //console.log(email + "email ou palavra passe Incorrecta...");
            this.registarLog(email, "user", "login", '0', "0", "-", "-", " Utilizador ou palavra passe Incorrecta");
            return ResponseHelper.getErrorResponse("email ou palavra passe Incorrecta")


        } catch (error) {

            this.registarLog(email, "user", "login", '0', "0", "-", "-", "Utilizador ou palavra passe Incorrecta...");

            //console.log(email + "email ou palavra passe Incorrecta, verificar o email e senha ......");
            return ResponseHelper.getErrorResponse("email ou palavra passe Incorrecta...  verifica o email e senha")
        }
    }


    async findUserByEmail(email) {
        return User.query().where({ email: email }).first();
    }



    async verificarBilhete({ params, request, response }) {
        try {
            const pessoa_user = await basePessoa.query().with('user').where({ ndi: params.bi }).first();

            let p = null
            if (pessoa_user)
                p = pessoa_user.toJSON()

            //verificar se a pessoa ja tem uma conta
            if (p.user) {
                //console.log(p.ndi + " já esta associado a um email");
                this.registarLog(p.ndi, "", "user", 'bi_ja_associado', "1", "-", "-", " já esta associado a um email");
                return ResponseHelper.getErrorResponse("O BI " + p.ndi + " já esta associado a um email" + " - " + p.user.email)
            }

            //verificar se o bilhete existe
            if (p.ndi) {

                return ResponseHelper.getOnlyDataResponse(pessoa_user);
            }

            //console.log(p.ndi + " O BI  não foi encontrado !.");
            return ResponseHelper.getErrorResponse(" O BI  não foi encontrado !.")
        } catch (err) {
            //console.log(err.message)
            this.registarLog(params.bi, "", "user", 'bi_nao_existe', "1", "-", "-", " BI  não existe.");

            return ResponseHelper.getErrorResponse("BI  não existe!.")
        }

    }




    async receberemail({ request, auth, response }) {

        const data = request.only(requestFields);


        //console.log("enviar email de recuperação............ " + data.email)
        let user = await User.query().where({ email: data.email }).first();
        try {
            if (user) {
                let user_result = user;
                const token = await crypto.randomBytes(4).toString('hex')
                user.token_created_at = new Date()
                user.token = token
                await user.save();
                NodeMailerHelper.enviarEmailRecuperacaoSenha(user);
                // this.registarLog(data.email, "", "user", 'recuperacaosenha', "1", "-", "-", "senha actualizada com sucesso");

                //console.log(data.email + "Email enviado com sucesso ");
                return ResponseHelper.getSuccessResponse("Email enviado com sucesso  ", user_result)
            } else {
                //console.log(user.email + " - este email não existe ");
                //this.registarLog(data.email, "", "user", 'recuperacaosenha', "0", "-", "-", "senha  não actualizada");
                return ResponseHelper.getErrorResponse("email não existe")
            }
        } catch (err) {
            //console.log(err.message)
            // this.registarLog(data.email, "", "user", 'trocarSenha', "0", "ip", "pais", err.message);

            return ResponseHelper.getErrorResponse("o email não existe")
        }

    }


    async criarNovaSenha({ request, auth, response }) {
        const data = request.only(['id', 'username', 'email', 'password', 'token']);
        let user = await User.query().where({ token: data.token }).first();
        try {
            if (user) {
                user.password = data.password
                await user.save();
                let token = await auth.generate(user);
                Object.assign(user, token);
                this.registarLog(user.email, "", "user", 'novasenha', "1", "-", "-", "novas senha com sucesso");
                return ResponseHelper.getSuccessResponse("Senha  recuperada com sucesso  ", user)
            } else {
                //   this.registarLog(data.email, "", "user", 'recuperacaosenha', "0", "-", "-", "senha  não actualizada");
                return ResponseHelper.getErrorResponse("Senha não recuperada, verifica o codigo que enviamos no teu email")
            }
        } catch (err) {
            //console.log(err.message)
            //   this.registarLog(data.email, "", "user", 'trocarSenha', "0", "ip", "pais", err.message);

            return ResponseHelper.getErrorResponse("Senha não actualizar")
        }

    }




}

module.exports = UserController

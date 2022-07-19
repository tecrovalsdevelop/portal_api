'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with baseanexos
 */


const User = use('App/Models/User')

const BasePessoa = use('App/Models/BasePessoa')

const EduCandidatura = use('App/Models/EduCandidatura')

const BaseAnexo = use('App/Models/BaseAnexo')
const BaseTipoAnexo = use('App/Models/BaseTipoAnexo')
const BaseAnexoIten = use('App/Models/BaseAnexoIten')
const BasePeriodoAvaliacao = use('App/Models/BasePeriodoAvaliacoe')

const ResponseHelper = use('App/Helpers/ResponseHelper')

var md5 = require('md5');
const fs = require('fs');
const moment = require('moment');
const Helpers = use('Helpers');
const GeneralConstants = use('App/Constants/GeneralConstants')

const requestFields = ['codigo', 'nome', 'estado', 'categoria', 'obrigatorio'];

const BaseLog = use('App/Models/BaseLog')
class BaseAnexoController {
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
    async upload({ params, request, auth, response }) {
        try {
            //console.log("....... carregar anexo upload.......")
            const pessoa = await BasePessoa.query().where({ user_id: params.user_id }).first()
            const periodoAvaliacao = await BasePeriodoAvaliacao.query().where({ estado: 1 }).orderBy("id", "desc").first();
            const tipo_anexo = await BaseTipoAnexo.query().where({ id: params.id }).first()

            if (pessoa) {

                let pasta = ""
                switch (Number(params.categoria)) {
                    case 1:
                        pasta = 'candidatura';
                        break
                    case 2:
                        pasta = 'renovacao';
                        break
                    case 3:
                        pasta = 'reclamacao';
                        break
                    default:
                        pasta = 'outros';
                        break
                }


                //console.log("carregar anexo upload.......")
                let url_file = `uploads/bei/${pasta}/${periodoAvaliacao.nome}/${pessoa.ndi}/`;
                const DIR = Helpers.publicPath(`../../files/uploads/bei/${pasta}/${periodoAvaliacao.nome}/${pessoa.ndi}/`);
                const uploadedFile = request.file('upload_', { types: ['image', 'pdf'], size: '5mb' })

                if (uploadedFile) {
                    //console.log(tipo_anexo.codigo)
                    let novo_nome = tipo_anexo.codigo + "_" + pasta + "_" + periodoAvaliacao.nome + "_" + pessoa.ndi + "." + uploadedFile.extname
                    await uploadedFile.move(DIR, { name: `${novo_nome}`, overwrite: true })
                    if (!uploadedFile.moved())
                        return ResponseHelper.getErrorResponse(" documento não foi salvo")
                    let anexo = await this.registarDocumento(pessoa, periodoAvaliacao, tipo_anexo, url_file, novo_nome, params.categoria)
                    //console.log("upload concluido com sucesso")

                    //console.log(novo_nome + " carregado com sucesso...");
                    return ResponseHelper.getSuccessResponse(" documento salva com sucesso", anexo)

                } else
                    return ResponseHelper.getErrorResponse(" documento não foi salvo",)

            } else
                return ResponseHelper.getErrorResponse(" documento não foi salvo",)

        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("factura não foi salvo ")
        }
    }

    async uploadCandidatura({ params, request, auth, response }) {
        try {
            //    const candidatura = await EduCandidatura.query().where({ user_id: params.user_id }).first()
            const periodoAvaliacao = await BasePeriodoAvaliacao.query().where({ estado: 1 }).orderBy("id", "desc").first();
            const tipo_anexo = await BaseTipoAnexo.query().where({ id: params.id }).first()



            //console.log("carregar anexo de candidatura .......")
            const user = await User.query().where({ id: params.user_id }).first()

            let candidatura = {
                nome: user.email,
                ndi: user.id,
                user_id: user.id,
            }

            //    //console.log(candidatura)
            if (candidatura) {

                let pasta = ""
                switch (Number(params.categoria)) {
                    case 1:
                        pasta = 'candidatura';
                        break
                    case 2:
                        pasta = 'renovacao';
                        break
                    case 3:
                        pasta = 'reclamacao';
                        break
                    default:
                        pasta = 'outros';
                        break
                }



                let url_file = `uploads/bei/${pasta}/${periodoAvaliacao.nome}/${candidatura.ndi}/`;
                const DIR = Helpers.publicPath(`../../files/uploads/bei/${pasta}/${periodoAvaliacao.nome}/${candidatura.ndi}/`);
                const uploadedFile = request.file('upload_', { types: ['image', 'pdf'], size: '5mb' })

                if (uploadedFile) {
                    //console.log(tipo_anexo.codigo)
                    let novo_nome = tipo_anexo.codigo + "_" + pasta + "_" + periodoAvaliacao.nome + "_" + candidatura.ndi + "." + uploadedFile.extname
                    await uploadedFile.move(DIR, { name: `${novo_nome}`, overwrite: true })
                    if (!uploadedFile.moved())
                        return ResponseHelper.getErrorResponse(" documento não foi salvo")
                    let anexo = await this.registarDocumento(candidatura, periodoAvaliacao, tipo_anexo, url_file, novo_nome, params.categoria)
                    //console.log("upload concluido com sucesso")

                    //console.log(novo_nome + "  anexo  carregado com sucesso...");
                    return ResponseHelper.getSuccessResponse(" documento salva com sucesso", anexo)

                } else
                    return ResponseHelper.getErrorResponse(" documento não foi salvo",)

            } else
                return ResponseHelper.getErrorResponse(" documento não foi salvo",)

        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("factura não foi salvo ")
        }
    }

    async registarDocumento(pessoa, periodoAvaliacao, tipoAnexo, url_ficheiro, nome_ficheiro, categoria) {
        try {

            let novo_anexo = {
                nome: pessoa.nome,
                ndi: pessoa.ndi,
                user_id: pessoa.user_id,
                descricao: "anexo de renovação" + " - " + pessoa.nome,
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

            let novo_tipo_anexo_item = {
                nome: tipoAnexo.nome,
                base_anexo_id: anexo.id,
                base_tipo_anexo_id: tipoAnexo.id,
                nome_ficheiro: nome_ficheiro,
                url_ficheiro: url_ficheiro + nome_ficheiro,
                categoria: categoria
            }

            let tipo_anexo_item = await BaseAnexoIten.query().where({
                base_anexo_id: anexo.id,
                base_tipo_anexo_id: tipoAnexo.id,
            }).first()


            if (tipo_anexo_item) {
                tipo_anexo_item.merge(novo_tipo_anexo_item)
                tipo_anexo_item.save()
            } else {

                //console.log(novo_tipo_anexo_item)
                tipo_anexo_item = await BaseAnexoIten.create(novo_tipo_anexo_item);
            }

            this.registarLog(pessoa.ndi, "anexo", tipoAnexo.id, '1', "", "-", "anexo carregado", "anexo carregado");

            return anexo

        } catch (err) {
            //console.log(err.message)
            return null
        }
    }


    async getPdfByte({ params, response }) {
        try {
            let anexo_item = await BaseAnexoIten.query().where({ id: params.id, }).first()
            const filename = __dirname + '/../../../../files/' + anexo_item.url_ficheiro;
            // METHOD 1
            let data = fs.readFileSync(filename);
            //   response.setHeader('Content-disposition', 'inline; filename="' + anexo_item.nome_ficheiro+ '"');
            //  response.contentType('application/pdf');
            //  response.implicitEnd = false
            // response.send(data); 
            return ResponseHelper.getOnlyDataResponse(data)

        } catch (err) {
            //console.log(err.message)
            return ResponseHelper.getErrorResponse("documento não encontrado ")
        }
    }


    async verAnexo({ params, response }) {
        let anexo_item = await BaseAnexoIten.query().where({ id: params.id, }).first()
        const filename = __dirname + '/../../../../files/' + anexo_item.url_ficheiro;
        // METHOD 1
        let data = fs.readFileSync(filename);
        response.send(data);
    }
    async verAnexoOnline({ params, request, response }) {
        try {
            let anexo_item = await BaseAnexoIten.query().where({ id: params.id, }).first()
            const filename = __dirname + '/../../../../files/' + anexo_item.url_ficheiro;
            console.log("localizar um anexo .....")
            console.log(filename)
            // METHOD 2
            if (fs.existsSync(filename)) {
                console.log("o ficheiro foi encontrados ")
                var readStream = fs.createReadStream(filename);
                readStream.on('open', function () { readStream.pipe(response.response); });
                const readFile = Helpers.promisify(fs.readFile);
                const file = await readFile(filename);
                response.send(file)
            } else
                return ResponseHelper.getErrorResponse("Documento não encontrado")
        } catch (err) {
            console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao eliminar o registo")
        }

    }

    async downloadAnexos1({ params, response }) {

        let anexo_item = await BaseAnexoIten.query().where({ id: params.id, }).first()
        const filename = __dirname + '/../../' + anexo_item.url_ficheiro;
        // METHOD 1
        let data = fs.readFileSync(filename);
        response.send(data);

    }

    async downloadAnexos({ params, response }) {

        let anexo_item = await BaseAnexoIten.query().where({ id: params.id, }).first()
        const filename = __dirname + '/../../' + anexo_item.url_ficheiro;
        // METHOD 1
        let data = fs.readFileSync(filename);
        response.send(data);
    }
    async downloadficheiroretfop({ request, params, response }) {

        let data_full = request.all()
        //   let anexo_item = await BaseAnexoIten.query().where({ id: params.id, }).first()
        //   const filename = __dirname + '/../../' + anexo_item.url_ficheiro;
        const filename = __dirname + '/../../../../files/uploads/' + "bolseiro_retfop/" + data_full.bi + "/" + data_full.ficheiro;
        // METHOD 1
        let data = fs.readFileSync(filename);
        response.send(data);


    }
    async abrirficheiroretfop1({ params, request, response }) {
        try {
            let data_full = request.all()

            // let tipo_anexo_item = await BaseAnexoIten.query().where({ ficheiro: data_full.ficheiro }).first()
            //   const filename = __dirname + '/../../../../' + tipo_anexo_item.url;


            let data = "files/5000246255/2022/doc_funcionarios/2022-06-05T05-55-08_7956d30e303fe.pdf"


            const filename = __dirname + '/../../../../files/uploads/' + "bolseiro_retfop/" + data_full.bi + "/" + data_full.ficheiro;


            console.log("localizar um anexo .....")
            console.log(filename)

            if (fs.existsSync(filename)) {

                console.log("o ficheiro foi encontrados ")
                var readStream = fs.createReadStream(filename);
                readStream.on('open', function () { readStream.pipe(response.response); });
                const readFile = Helpers.promisify(fs.readFile);
                const file = await readFile(filename);
                response.send(file)

            } else
                return ResponseHelper.getErrorResponse("Documento não encontrado")
        } catch (err) {
            console.log(err.message)
            return ResponseHelper.getErrorResponse("Erro ao eliminar o registo")
        }

    }

    async abrirficheiroretfop({ params, request, response }) {
        try {
            let data_full = request.all()
            //   let tipo_anexo_item = await BaseAnexoIten.query().where({ ficheiro: data_full.ficheiro }).first()
            //  const filename = __dirname + '/../../../../' + tipo_anexo_item.url;


            // let data = 'files/uploads/bolseiro_retfop/008087515LA046/008087515LA046_i702hiagdg9a.pdf'

            // const filename = __dirname + '/../../../../'+ data;

            const filename = __dirname + '/../../../../files/uploads/' + 'bolseiro_retfop/' + data_full.bi + '/' + data_full.ficheiro;

            console.log(filename)
            if (fs.existsSync(filename)) {
                var readStream = fs.createReadStream(filename);
                readStream.on('open', function () { readStream.pipe(response.response); });
                const readFile = Helpers.promisify(fs.readFile);
                const file = await readFile(filename);
                response.send(file)
            } else
                return ResponseHelper.getErrorResponse("Documento não encontrado")
        } catch (err) {
            console.log(err.message)
            return ResponseHelper.getErrorResponse("Documento não encontrado")
        }
    }

}

module.exports = BaseAnexoController
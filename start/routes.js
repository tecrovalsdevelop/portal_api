'use strict'
/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(() => {



    //---------------------- Noticiais -----------------------------------------------------

    Route.post('portal-logs', 'PortalLogController.logsPortal').middleware(['connection'])
    Route.get('getportalsobre', 'PortalSobreController.index').middleware(['connection'])

    Route.get('getportalnoticias', 'PortalNoticiaController.getNoticias').middleware(['connection'])
    Route.get('getportalprodutos', 'PortalProdutoController.getProdutos').middleware(['connection'])
    Route.get('getportalservicos', 'PortalProdutoController.getServicos').middleware(['connection'])
    Route.get('getportalprodutos', 'PortalProdutoController.index').middleware(['connection'])
    Route.get('getportalclientes', 'PortalClienteController.index').middleware(['connection'])
    Route.get('getportalparceiros', 'PortalParceiroController.index').middleware(['connection'])
    Route.get('getportalcontactos', 'PortalContactoController.index').middleware(['connection'])
    Route.get('getportalmensagens', 'PortalMensagenController.index').middleware(['connection'])

    Route.get('getportalcurso/:id', 'PortalCursoController.show').middleware(['connection'])
    Route.get('getportalproduto/:id', 'PortalProdutoController.show').middleware(['connection'])
    Route.get('getportalservico/:id', 'PortalServicoController.show').middleware(['connection'])
    Route.get('getportalnoticia/:id', 'PortalNoticiaController.buscarNoticiaId').middleware(['connection'])

    Route.get('getNoticiasPopulares', 'PortalNoticiaController.getNoticiasPopulares').middleware(['connection'])

    Route.get('getPortalPerguntasFrequentes', 'PortalPerguntasFrequenteController.getPortalPerguntasFrequentes').middleware(['connection'])


    
    Route.get('getPortalEventos', 'PortalEventoController.getPortalEvento').middleware(['connection'])
    
    Route.get('getPortalInstituicao', 'PortalInstituicoeController.getPortalInstituicao').middleware(['connection'])
    
    Route.get('getPortalHistorial', 'PortalHistoriaController.getPortalHistorial').middleware(['connection'])
    Route.get('getPortalCeoDiscurso', 'PortalCeoDiscursoController.getPortalCeoDiscurso').middleware(['connection'])
    Route.get('getPortalContacto', 'PortalContactoController.getPortalContacto').middleware(['connection'])

    Route.get('getPortalProfissionais', 'PortalProfissionaiController.getPortalProfissionais').middleware(['connection'])

    
    
    Route.resource('portal-cursos', 'PortalCursoController').middleware(['connection']).apiOnly()
    Route.resource('portal-noticias', 'PortalNoticiaController').middleware(['connection']).apiOnly()
    Route.resource('portal-noticias-itens', 'PortalNoticiaItenController').middleware(['connection']).apiOnly()

    Route.resource('portal-produtos', 'PortalProdutoController').middleware(['connection']).apiOnly()
    Route.resource('portal-clientes', 'PortalClienteController').middleware(['connection']).apiOnly()
    Route.resource('portal-parceiros', 'PortalParceiroController').middleware(['connection']).apiOnly()
    Route.resource('portal-sobre', 'PortalSobreController').middleware(['connection']).apiOnly()
    Route.resource('portal-contactos', 'PortalContactoController').middleware(['connection']).apiOnly()
    Route.resource('portal-mensagens', 'PortalMensagenController').middleware(['connection']).apiOnly()



    //--------------------outros ----------------------------------------------



    Route.get('validacao/:model', 'ValidacaoController.validar')
    Route.post('loginbase', 'UserController.login')
    Route.get('dasboard-bolseiro-renovacao-instituicao', 'BaseLogController.dasboardBolseiroRenovacaoInstituicao')
    Route.get('dasboard-candidatura-nivel-academico', 'BaseLogController.dasboardCandidaturaNivel')
    Route.get('dasboard-candidatura-provincia', 'BaseLogController.dasboardCandidaturaProvincia')
    Route.get('dasboard-candidatura-provincia-ies', 'BaseLogController.dasboardCandidaturaProvinciaIes')
    Route.get('dasboard', 'BaseLogController.dasboard').middleware('auth')
    Route.post('teste', 'BaseLogController.teste').middleware('auth')
    Route.get('dasboardanexos', 'BaseLogController.dasboardAnexos').middleware('auth')
    Route.get('dasboardanexositens', 'BaseLogController.dasboardAnexosItens').middleware('auth')
    Route.get('dasboardusers', 'BaseLogController.dasboardUsers').middleware('auth')
    Route.get('dasboardcandidaturasinterna', 'BaseLogController.dasboardCandidaturaInterna').middleware('auth')
    Route.get('dasboardcandidaturasexterna', 'BaseLogController.dasboardCandidaturaExterna').middleware('auth')

    // --------------------- rota dos bolseiros  ---------------------------------------------
    // Route.post('users', 'UserController.register').middleware('auth')

    // Route.post('login-candidato', 'UserController.login')

    Route.post('login', 'UserController.login')

    Route.post('login-candidato-inagbe', 'UserController.loginCandidatoInagbe')

    Route.post('login-bolseiro-inagbe', 'UserController.loginBolseiroInagbe')

    Route.post('login-candidato', 'UserController.loginCandidato')
    Route.post('criar-conta', 'UserController.criarConta')


    Route.post('login-bolseiro', 'UserController.loginBolseiro')
    Route.post('criar-conta-bolseiro', 'UserController.criarContaBolseiro')

    Route.post('criar-nova-senha', 'UserController.criarNovaSenha')
    Route.post('receber-email', 'UserController.receberemail')

    Route.get('bolseiro-verificar-bilhete/:bi', 'UserController.verificarBilhete')

    Route.get('enviar-sms', 'BaseSmsController.enviarsms')
    Route.get('sendSms', 'UserController.sendSms')


    Route.get('bolseiro-perfil/:user_id', 'EduBolseiroController.getBolseiroByUser').middleware('auth').middleware('auth')
    Route.get('bolseiro-renovacao/:user_id', 'EduBolseiroRenovacoeController.buscarRenovacaoAnoCorrente').middleware('auth')

    Route.get('bolseiro-ultima-bolsa-activo/:user_id', 'EduBolseiroRenovacoeController.bolseiroUltimaBolsaActivo').middleware('auth')

    Route.get('periodo-renovacao', 'BasePeriodoAvaliacoeController.periodoRenovacao')

    Route.get('bolseirointernoteste', 'BasePeriodoAvaliacoeController.bolseirointerno').middleware('auth')



    Route.post('bolseiro-renovar', 'EduBolseiroRenovacoeController.renovar').middleware('auth')

    Route.post('bolseiro-renovacao-upload/:id/anexos/upload', 'BasePessoaController.uploadAnexos').middleware('auth')


    //---------------------- Bolseiro Interno -----------------------------------------------------

    Route.resource('bolseiroInterno', 'EduBolseiroInternoController').apiOnly()

    Route.post('bolseiroInternofiltro', 'EduBolseiroInternoController.bolseiroInternofiltro')


    Route.get('bolseiroInternorenovacao', 'EduBolseiroInternoController.bolseiroInternorenovacao')

    Route.get('bolseiroInternorenovacaoies', 'EduBolseiroInternoController.bolseiroInternorenovacaoies')

    Route.get('bolseirorenovacaofiltro', 'EduBolseiroRenovacoeController.bolseirorenovacaofiltro')

    //---------------------- Noticiais -----------------------------------------------------
    Route.resource('noticias-gerais', 'NoticiaController').apiOnly()

    Route.get('buscarNoticiasId', 'NoticiaItenController.buscarNoticiaPeloId')

    Route.get('buscarNoticiaId', 'NoticiaController.buscarNoticiaId')

    //---------------------- comunicações -----------------------------------------------------

    Route.resource('comunicacao', 'EduComunicacoeController').apiOnly().middleware('auth')
    Route.get('buscar-comunicacao-idBolseiro/:id', 'EduComunicacoeController.getComunicacaoByBolseiro').middleware('auth')
    Route.get('total_comunicacoes_idBolseiro/:id', 'EduComunicacoeController.buscarTotalDeComunicacaoId').middleware('auth')

    //----------------------- comunicação Tipo --------------------------------------------------
    Route.resource('comunicacao_tipo', 'EduComunicacaoTipoController').apiOnly().middleware('auth')

    //---------------------- comunicações Detalhe -----------------------------------------------------
    Route.resource('comunicacao-detalhe', 'EduComunicacaoDetalheController').apiOnly().middleware('auth')

    //---------------------- projectos ----------------------------------------------------------------
    Route.resource('projectos', 'EduProjectoController').apiOnly().middleware('auth')



    //---------------------- pagamentos ----------------------------------------------------------------
    Route.resource('ordem-pagamentos', 'EduOrdemPagamentoController').apiOnly()
    Route.resource('pagamentos', 'EduPagamentoController').apiOnly()

    Route.get('ordem-pagamentos-list', 'EduOrdemPagamentoController.ordemPagamentosList')


    Route.get('periodoavalicaolist', 'BasePeriodoAvaliacoeController.index')


    // ------------------------ fim  da rota dos bolseiros --------------------------------------

    Route.delete('pessoas/:id/formacoes/:formacao_id', 'BasePessoaController.destroyFormacao').middleware('auth')
    Route.resource('bolseiro-renovacao-estado', 'EduBolseiroRenovacaoEstadoController').middleware('auth').apiOnly()
    Route.post('candidaturaanexos/:id/anexos/upload', 'EduCandidaturaController.uploadAnexos').middleware('auth')

    Route.post('pessoas/:id/formacoes/:formacao_id/upload', 'BasePessoaController.uploadFormacao').middleware('auth')
    Route.post('pessoas/:id/anexos/upload', 'BasePessoaController.uploadAnexos').middleware('auth')
    Route.put('pessoas/:id', 'BasePessoaController.save').middleware('auth')
    Route.put('pessoas/:id/formacoes/:formacao_id', 'BasePessoaController.saveFormacao').middleware('auth')

    Route.put('updatepessoa/:id', 'BasePessoaController.updatepessoa').middleware('auth')

    Route.put('update_user_pessoa/:id', 'BasePessoaController.updateUserPessoa').middleware('auth')

    //rota  administração


    Route.resource('estado', 'BaseEstadoController').middleware('auth').apiOnly()

    Route.resource('area-conhecimento', 'BaseAreaConhecimentoController').apiOnly()
    Route.resource('pessoas', 'BasePessoaController').apiOnly().middleware('auth')

    Route.resource('periodoavalicao', 'BasePeriodoAvaliacoeController').apiOnly().middleware('auth')
    Route.resource('anodefrequencia', 'BaseAnoFrequenciaController').apiOnly().middleware('auth')

    Route.resource('funcionario', 'FuncionarioController').middleware('auth').apiOnly()

    Route.get('funcionariobyuser/:user_id', 'FuncionarioController.funcionarioPorUser').middleware('auth')

    Route.resource('edurenovacao', 'EduBolseiroRenovacoeController').apiOnly().middleware('auth')
    Route.post('edurenovacaoies', 'EduBolseiroRenovacoeController.renovacaoIes').middleware('auth')
    Route.post('edurenovacaoinagbe', 'EduBolseiroRenovacoeController.renovacaoInagbe').middleware('auth')
    Route.resource('bolseiro', 'EduBolseiroController').apiOnly().middleware('auth')

    Route.get('allRenovacoes', 'EduBolseiroRenovacoeController.buscarAllRenovacao').middleware('auth')

    Route.resource('bolsas', 'EduBolsaController').middleware('auth').apiOnly()
    Route.get('listagemBolsa', 'EduBolsaController.listagemBolsa').middleware('auth')
    //Route.resource('bolsa-alterar/', 'EduBolsaController.update').middleware('auth').apiOnly()
    //Route.post('bolsa-cadastrar', 'EduBolsaController.store').middleware('auth')

    //rotas validacao


    Route.post('atribuir-candidato-por-user', 'EduCandidaturaController.atribuirCandidatoUser').middleware('auth')

    Route.post('atribuircandidato', 'EduCandidaturaController.atribuirCandidatoUser').middleware('auth')


    Route.put('atribuir-candidato-por-user/:id', 'EduCandidaturaController.atribuirCandidatoUser').middleware('auth')

    Route.put('atribuircandidato/:id', 'EduCandidaturaController.atribuirCandidatoUser').middleware('auth')



    //rotas base
    //   Route.put('users', 'UserController.update').middleware('auth')
    Route.resource('user-cadastro', 'UserController').middleware('auth').apiOnly()
    Route.resource('userslist', 'UserController').middleware('auth').apiOnly()
    Route.resource('users', 'UserController').middleware('auth').apiOnly()



    Route.get('users-inagbe', 'UserController.usuariosInagbe').middleware('auth')
    Route.get('usuarioFiltro', 'UserController.usuarioFiltro').middleware('auth')

    Route.resource('instituicoes', 'EduInstituicaoController').middleware('auth').apiOnly()
    Route.get('instituicoesFiltro', 'EduInstituicaoController.instituicoesFiltro').middleware('auth')



    Route.resource('groups', 'BaseGroupController').middleware('auth').apiOnly()
    Route.resource('constants', 'ConstantController').middleware('auth').apiOnly()
    Route.resource('anosavaliacoes', 'AnoAvaliacaoController').middleware('auth').apiOnly()
    Route.resource('anexos', 'BaseAnexoController').middleware('auth').apiOnly()
    Route.resource('anexoiten', 'BaseAnexoItenController').middleware('auth').apiOnly()
    Route.resource('cursosgerais', 'BaseCursoController').middleware('auth').apiOnly() //CRUD
    Route.resource('tiposanexos', 'BaseTipoAnexoController').middleware('auth').apiOnly()

    Route.get('tiposanexoscandidatura', 'BaseTipoAnexoController.candidatura')
    Route.get('tiposanexoscandidaturagraduacao', 'BaseTipoAnexoController.candidaturagraduacao')

    Route.get('tiposanexoscandidaturaposgraduacao', 'BaseTipoAnexoController.candidaturaposgraduacao')



    Route.get('tiposanexosrenovacao', 'BaseTipoAnexoController.renovacao')
    Route.get('tiposanexosreclamacao', 'BaseTipoAnexoController.reclamacao').middleware('auth')

    Route.post('anexo-upload/:id/user/:user_id/categoria/:categoria', 'BaseAnexoController.upload').middleware('auth')
    Route.post('anexo-upload-candidatura/:id/user/:user_id/categoria/:categoria', 'BaseAnexoController.uploadCandidatura').middleware('auth')


    Route.resource('parametros', 'BaseParametroController').middleware('auth').apiOnly()

    Route.resource('nivelacademicos', 'BaseNivelAcademicoController').middleware('auth').apiOnly()

    Route.post('instituicao', 'EduInstituicaoController.save').middleware('auth') //  salvar instituicao
    Route.resource('instituicoes', 'EduInstituicaoController').middleware('auth').apiOnly() //  CRUD

    Route.resource('nivelinstituicoes', 'EduNivelInstituicoeController').middleware('auth').apiOnly()
    Route.resource('tipoinstituicoes', 'EduTipoInstituicoeController').middleware('auth').apiOnly()

    Route.resource('naturezainstituicoes', 'EduNaturezaInstituicoeController').middleware('auth').apiOnly()

    Route.resource('areasconhecimentos', 'BaseAreaConhecimentoController').middleware('auth').apiOnly()
    Route.resource('paises', 'BasePaisController').apiOnly()
    Route.resource('municipios', 'BaseMunicipioController').apiOnly()
    Route.resource('provincias', 'BaseProvinciaController').apiOnly()




    Route.get('bolsadisponivelportal/:id', 'EduBolsaController.bolsadisponivelportal')

    Route.get('bolsasdisponiveisportal', 'EduBolsaController.bolsasdisponiveisportal')

    Route.resource('bolsaprovincias', 'EduBolsaProvinciaController').middleware('auth').apiOnly()


    Route.resource('tipobolsas', 'EduTipoBolsaController').middleware('auth').apiOnly()
    Route.resource('bolsaresultados', 'EduBolsaResultadoController').middleware('auth').apiOnly()

    Route.resource('bolsaresultados', 'EduBolsaResultadoController').middleware('auth').apiOnly()



    Route.post('salvar-reclamacao', 'EduReclamacoeController.store')

    Route.get('buscarReclamacoes', 'EduReclamacoeController.buscarReclamaccoes').middleware('auth')

    Route.resource('reclamacoes', 'EduReclamacoeController').middleware('auth').apiOnly()

    Route.post('actualizar-reclamacao-estudante', 'EduReclamacoeController.actualizarReclamacaoEstudante').middleware('auth')
    Route.post('actualizar-reclamacao-inagbe', 'EduReclamacoeController.actualizarReclamacaoInagbe')

    Route.post('salvar-confirmacao-validacao-bolseiro', 'EduCandidaturaController.BolseiroConfirmaValidacaoDoContrato')



    Route.get('resultadocbei/:bi', 'EduCandidaturaController.resultadoCandidaturaInterna').middleware('auth')

    Route.resource('unidadesorganica', 'EduUnidadeOrganicaController').middleware('auth').apiOnly()
    Route.resource('educursos', 'EduCursoController').middleware('auth').apiOnly() //CRUD

    Route.get('actualizarcurso', 'EduCursoController.actualizarcurso').middleware('auth') //CRUD

    Route.resource('candidaturainterna', 'EduCandidaturaInternaController').middleware('auth').apiOnly() //CRUD
    Route.resource('candidaturaexterna', 'EduCandidaturaExternaController').middleware('auth').apiOnly() //CRUD

    Route.resource('candidaturas', 'EduCandidaturaController').middleware('auth').apiOnly() //CRUD


    Route.post('validacandidatura', 'EduCandidaturaController.validarCandidatura').middleware('auth') //CRUD

    Route.post('salvar-candidato-validado', 'EduCandidaturaController.salvarCandidatoValidado').middleware('auth')


    Route.post('salvar-candidatura', 'EduCandidaturaController.salvarCandidatura').middleware('auth')


    Route.post('salvar-candidatura-info-banco', 'EduCandidaturaController.salvarCandidaturaInfoBanco')


    Route.post('salvar-candidatura-externa', 'EduCandidaturaController.salvarCandidaturaExterna').middleware('auth')


    Route.post('salvar-candidatura-interna', 'EduCandidaturaInternaController.salvarCandidatura').middleware('auth')


    Route.get('buscar-candidato', 'EduCandidaturaController.buscarTodosCandidatosNoEstadoIniciado').middleware('auth')


    Route.get('buscar-candidato-por-user', 'EduCandidaturaController.buscarTodosCandidatosNoEstadoIniciadoPorUser').middleware('auth')

    Route.get('buscar-candidato-para-validacao', 'EduCandidaturaController.buscarCandidatoParaAtribuido').middleware('auth')
    Route.get('buscar-candidato-para-confirmar-contrato', 'EduCandidaturaController.buscarCandidatoPresselecionadoParaConfirmarContrato').middleware('auth')

    Route.post('aprovarcandidaturaporcota', 'EduCandidaturaController.aprovarcandidaturaporcota').middleware('auth')
    Route.post('aprovarcandidaturaindividual', 'EduCandidaturaController.aprovarcandidaturaindividual').middleware('auth')

    Route.resource('motivosexclusoes', 'EduMotivoExclusoeController').middleware('auth').apiOnly()
    Route.resource('estadosCandidatura', 'EduEstadoController').middleware('auth').apiOnly()

    Route.get('estadoscandidaturavalidacao', 'EduEstadoController.estadoscandidaturavalidacao').middleware('auth')

    Route.get('estadoscandidatura', 'EduEstadoController.estadoscandidatura').middleware('auth')



    Route.resource('generos', 'BaseGeneroController').middleware('auth').apiOnly()

    Route.resource('grupos', 'BaseGroupController').middleware('auth').apiOnly()


    Route.get('estatisticacandidatura/:provincia/bolsa/:bolsa', 'BaseLogController.estatisticacandidatura').middleware('auth')


    Route.get('estatisticacandidaturainterna/:provincia/bolsa/:bolsa', 'BaseLogController.estatisticacandidaturainterna').middleware('auth')

    Route.get('estatisticacandidaturaexterna/:provincia/bolsa/:bolsa', 'BaseLogController.estatisticacandidaturainterna').middleware('auth')


    //validar candidatura interna

    Route.resource('motivo-exclussao', 'EduMotivoExclusoeController').middleware('auth').apiOnly() // CRUD
    Route.get('filtrarCandidatura', 'EduCandidaturaController.candidaturaFiltro').middleware('auth')
    Route.get('filtrarCandidaturaInterna', 'EduCandidaturaController.candidaturaInternaFiltro').middleware('auth')
    Route.post('filtrarDadosCandidaturaInterna', 'EduCandidaturaController.candidaturaInternaFiltroDados').middleware('auth')

    Route.post('filtrarDadosCandidaturaExterna', 'EduCandidaturaExternaController.candidaturaExternaFiltroDados').middleware('auth')

    Route.get('reclamacoesporbi/:ndi', 'EduReclamacoeController.reclamacoesporbi')

    Route.get('candidaturasporbi/:ndi', 'EduCandidaturaController.candidaturasporbi')

    Route.get('candidaturasExternaporbi/:ndi', 'EduCandidaturaExternaController.buscarCandidaturasExternaPorBi')
    Route.get('buscartodoscandidatosexternos', 'EduCandidaturaExternaController.buscarTodosCandidaturaExterna')
    Route.get('buscartodoscandidatosretfop', 'EduRetfopBolseiroController.buscartodoscandidatosretfop')

    Route.get('consultarContratoValidadoPorBi/:ndi', 'EduCandidaturaController.consultarContratoValidado')

    Route.get('filtrarCandidaturaUser', 'EduCandidaturaController.candidaturaFiltroUser').middleware('auth')

    Route.post('candidaturainternabolsasfiltro', 'EduCandidaturaInternaController.indexcandidaturabolsafiltro').middleware('auth')
    Route.get('candidaturainternabolsas/:bolsa_id/estado/:estado_id', 'EduCandidaturaInternaController.indexcandidaturabolsa').middleware('auth')
    Route.get('candidaturainternabolsas/:bolsa_id/estado/:estado_id/bi/:bi/', 'EduCandidaturaInternaController.indexcandidaturabolsaBi').middleware('auth')
    // Route.get('candidaturainternavalidar/:bolsa_id/estado/:estado_id', 'EduCandidaturaInternaController.indexcandidaturabolsa').middleware('auth')
    Route.get('candidaturainternavalidar/:user_id/bolsa/:bolsa_id/estado/:estado_id', 'EduCandidaturaInternaController.indexcandidaturabolsavalidacao').middleware('auth')
    Route.get('candidaturainternavalidar/:user_id/bolsa/:bolsa_id/estado/:estado_id/bi/:bi/', 'EduCandidaturaInternaController.indexcandidaturabolsavalidacaoBi').middleware('auth')
    Route.get('candidaturainternavalidar/:user_id/bolsa/:bolsa_id/estado/:estado_id/bi/:bi/nome/:nome', 'EduCandidaturaInternaController.indexcandidaturabolsavalidacao').middleware('auth')

    //validar candidatura externa

    Route.get('candidaturabolsas/:bolsa_id', 'EduCandidaturaExternaController.indexcandidaturabolsa').middleware('auth')

    Route.post('getcandidatobi', 'EduCandidaturaExternaController.getCandidatoBi').middleware('auth')
    Route.post('candidaturaexternabolsasfiltro', 'EduCandidaturaExternaController.indexcandidaturabolsafiltro').middleware('auth')
    Route.get('candidaturaexternabolsas/:bolsa_id/estado/:estado_id', 'EduCandidaturaExternaController.indexcandidaturabolsa').middleware('auth')
    Route.get('candidaturaexternabolsas/:bolsa_id/estado/:estado_id/bi/:bi/', 'EduCandidaturaExternaController.indexcandidaturabolsaBi').middleware('auth')
    // Route.get('candidaturaexternavalidar/:bolsa_id/estado/:estado_id', 'EduCandidaturaExternaController.indexcandidaturabolsa').middleware('auth')
    Route.get('candidaturaexternavalidar/:user_id/bolsa/:bolsa_id/estado/:estado_id', 'EduCandidaturaExternaController.indexcandidaturabolsavalidacao').middleware('auth')
    Route.get('candidaturaexternavalidar/:user_id/bolsa/:bolsa_id/estado/:estado_id/bi/:bi/', 'EduCandidaturaExternaController.indexcandidaturabolsavalidacaoBi').middleware('auth')
    Route.get('candidaturaexternavalidar/:user_id/bolsa/:bolsa_id/estado/:estado_id/bi/:bi/nome/:nome', 'EduCandidaturaExternaController.indexcandidaturabolsavalidacao').middleware('auth')


    Route.get('list', 'EduCandidaturaExternaController.listacandidatura').middleware('auth')
    Route.put('validar/:candidatura_id', 'EduCandidaturaExternaController.validarCandidatura').middleware('auth')
    Route.put('validarCandidaturaExterna/:candidatura_id', 'EduCandidaturaExternaController.validarCandidatura').middleware('auth')



    Route.get('candidaturaexternabolsas/:bolsa_id/estado/:estado_id', 'EduCandidaturaExternaController.indexcandidaturabolsa').middleware('auth')
    Route.get('processarraking/:edu_bolsa_id/numero/:numero', 'EduCandidaturaValidacaoController.processarRaking').middleware('auth')

    //Gets
    // Route.get('candidaturabolsaswait/:bolsa_id', 'EduCandidaturaController.indexcandidaturabolsa').middleware('auth')
    Route.get('candidaturasinterna', 'EduCandidaturaController.indexcandidaturainterna').middleware('auth')
    Route.get('bolseiroComContratoAssinado', 'EduCandidaturaController.buscarBolseiroComContratoAssinado').middleware('auth')

    Route.get('candidaturasexterna', 'EduCandidaturaController.indexcandidaturaexterna').middleware('auth')

    // /:bolsa_id/nivelacademico/:nivel_academico/estado/:estados_id/motivo/:motivo_id
    Route.get('listarcandidaturas/:parametro', 'EduCandidaturaController.candidaturaListParams').middleware('auth')

    Route.get('cursosies/:ies', 'EduCursoController.cursoInstituicao').middleware('auth')
    Route.get('cursoIesUnidadeOrg/:id', 'EduCursoController.buscarInstituicaoUnidadeOrganica').middleware('auth')


    Route.get('cursoIesUnidadeOrgList/:id', 'EduCursoController.buscarCursosInstituicaoUnidadeOrganica').middleware('auth')




    Route.get('instituicaoProvincia/:id', 'EduCursoController.instituicaoProvincia').middleware('auth')





    Route.get('tiposanexosbolsa/:bolsa_id', 'BaseTipoAnexoController.anexobolsa').middleware('auth')

    Route.get('cursosgeraisespecificos/:bolsa_id', 'BaseCursoController.cursoespecificos').middleware('auth')

    Route.get('cursosgeraismerito', 'BaseCursoController.cursosmerito').middleware('auth')

    Route.get('instituicoes/:id/cursos', 'EduInstituicaoController.indexCurso').middleware('auth')
    Route.get('cursos', 'BaseCursoController.index')


    Route.get('instituicoescandidatos', 'EduInstituicaoController.instituicoescandidatos').middleware('auth')


    Route.get('intituicaoensino', 'EduInstituicaoEnsinoController.index')

    Route.get('intituicaoBypaisprovincianivel/:nivel_id/pais/:pais_id/provincia/:provincia_id', 'EduInstituicaoEnsinoController.intituicaoBypaisprovincianivel')

    Route.get('instituicaopaisnivelensino/:nivel_id/pais/:pais_id', 'EduInstituicaoEnsinoController.instituicaoPaisNivelEnsino').middleware('auth')

    Route.get('instituicaopaisnivel/:pais_id/nivel/:nivel_id', 'EduInstituicaoEnsinoController.intituicaoBypaisnivel').middleware('auth')

    Route.get('intituicao-superior-angola', 'EduInstituicaoController.intituicaoangola')
    Route.get('cursos-superior-angola/:ies/nivel/:nivel', 'EduCursoController.cursosDaIesAngola')



    Route.get('instituicaonivelensino/:id', 'EduInstituicaoController.instituicaoNivelEnsino').middleware('auth')
    Route.get('instituicaopais/:id', 'EduInstituicaoController.instituicaoByPais')
    Route.get('instituicaoraking/:raking', 'EduInstituicaoController.raking').middleware('auth')
    Route.get('paisraking', 'BasePaisController.paisesRaking').middleware('auth')
    Route.get('paisbolsa/:bolsa_id', 'EduBolsaController.getPais').middleware('auth')
    Route.get('cursobolsa/:bolsa_id', 'EduBolsaController.getCurso').middleware('auth')
    Route.get('anexobolsa/:bolsa_id', 'EduBolsaController.getAnexo').middleware('auth')
    Route.get('instituicaopaisraking:/id/rakaing/:raking_id', 'EduInstituicaoController.paisraking').middleware('auth')
    Route.get('instituicoes/:id', 'EduInstituicaoController.show').middleware('auth')
    Route.get('paisesactivo', 'BasePaisController.paisesActivo').middleware('auth')
    Route.get('paises/:id/provincias', 'BasePaisController.indexProvincia').middleware('auth')

    Route.get('provincias/:id/municipios', 'BaseProvinciaController.indexMunicipio').middleware('auth')
    Route.get('provincias/:id/instituicoes', 'BaseProvinciaController.indexInstituicao').middleware('auth')
    Route.get('bolsaslista', 'EduBolsaController.bolsaslista').middleware('auth')
    Route.get('bolsasactivas/:bolsa_id', 'EduBolsaController.bolsasactivas').middleware('auth')
    Route.get('pessoas/users/:user_id', 'BasePessoaController.getByUser').middleware('auth')
    Route.get('pessoas/users/:bi', 'BasePessoaController.getByBi').middleware('auth')


    Route.get('pessoas/:id', 'BasePessoaController.show').middleware('auth')
    Route.get('veranexo/:anexo_item/documento/:id/download', 'BaseAnexoController.verAnexo')
    Route.get('verAnexoonline/:anexo_item/documento/:id/download', 'BaseAnexoController.verAnexoonline')


    Route.get('getpdfbyte/:anexo_item/documento/:id/download', 'BaseAnexoController.getPdfByte')


    Route.get('pesquisarBolseiroRetfopBi/:bi', 'EduRetfopBolseiroController.pesquisarBolseiroRetfopBi')


    Route.post('salvar-anexo-bolseiro-retfop', 'EduRetfopBolseiroController.salvarAnexoBolseiroRetfop')


    Route.get('abrirficheiroretfop', 'BaseAnexoController.abrirficheiroretfop')
    Route.get('downloadficheiroretfop', 'BaseAnexoController.downloadficheiroretfop')



    Route.get('downloadAnexos/:anexo_item/documento/:id/download', 'BaseAnexoController.downloadAnexos').middleware('auth')
    Route.get('candidaturas/:id/ficha', 'EduCandidaturaController.imprimirFicha').middleware('auth')
    Route.get('consultarenovacao/:bi', 'RenovacaoController.findRenovacaoByBi').middleware('auth')

    Route.get('candidaturaslista/:bi', 'EduCandidaturaController.candidaturaListParams').middleware('auth')
    Route.get('candidaturasinternalista', 'EduCandidaturaInternaController.candidaturaslista').middleware('auth')
    Route.get('candidaturasexternalista', 'EduCandidaturaExternaController.candidaturaslista').middleware('auth')

    //Puts

    Route.get('showcandidatura/:id', 'BasePaisController.showCandidatura').middleware('auth')

    Route.get('showcandidaturainterna/:id', 'BasePaisController.showCandidaturaInterna').middleware('auth')
    Route.get('showcandidaturaexterna/:id', 'BasePaisController.showCandidaturaExterna').middleware('auth')

    Route.post('salvarCandidaturaInterna', 'BasePaisController.salvarCandidaturaInterna').middleware('auth')


    Route.put('candidatura/:id', 'EduCandidaturaController.saveCandidatura').middleware('auth')
    Route.put('candidaturainterna/:id', 'EduCandidaturaController.saveCandidaturaInterna').middleware('auth') //?

    //Route.post('instituicoes/:id/cursos', 'EduInstituicaoController.storeCurso').middleware('auth')
    //Route.delete('instituicoes/cursos/:id', 'EduInstituicaoController.destroyCurso').middleware('auth')
    // novas rotas Sam
    // Route.get('users', 'UserController.index').middleware('auth')

}).prefix('api/v1');

Route.get('/', () => {
    return { greeting: 'INAGBE API ' }
})

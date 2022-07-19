class GeneralConstants {

  static CRUD_OPERATIONS = {
      READ : 0,
      INSERT : 1,
      UPDATE : 2,
      DELETE : 3,
      GET : 4,
  }

  static CANDIDATO_SITUACAO = {
    INICIADO : 0,
    FINALIZADO_SEM_FICHA : 1,
    FINALIZADO_COM_FICHA : 2
  }

  static RESPOSTAS_SIM_NAO = {
    NAO : {code : 0, info : 'NÃO'},
    SIM : {code : 1, info : 'SIM'},
    getType : function(){
      return 'SIM_NAO';
    },
    toArray : function()  {
      return [
        GeneralConstants.RESPOSTAS_SIM_NAO.NAO,
        GeneralConstants.RESPOSTAS_SIM_NAO.SIM
      ]
    },
    getInfo : function(code){
      return GeneralConstants.RESPOSTAS_SIM_NAO.toArray().filter(p => p.code == code).pop().info
    }
  }

  static ESTADOS_CANDIDATURAS = {
    NOVA : {code : 1, info : 'Registada', descricao : 'Candidatura Registada com sucesso'},
    CANCELADA : {code : 2, info : 'Cancelada', descricao : 'Candidatura Cancelada pelo Candidato'},
    AVALIACAO : {code : 3, info : 'Avaliação', descricao : 'Candidatura em Avaliação'},
    REJEITADA : {code : 4, info : 'Rejeitada', descricao : 'Candidatura Reijeitada'},
    APROVADA : {code : 5, info : 'Aprovada', descricao : 'Candidatura Aprovada'},
    getType : function(){
      return 'ESTADOS_CANDIDATURAS';
    },
    toArray : function()  {
      return [
        GeneralConstants.ESTADOS_CANDIDATURAS.NOVA,
        GeneralConstants.ESTADOS_CANDIDATURAS.CANCELADA,
        GeneralConstants.ESTADOS_CANDIDATURAS.AVALIACAO,
        GeneralConstants.ESTADOS_CANDIDATURAS.REJEITADA,
        GeneralConstants.ESTADOS_CANDIDATURAS.APROVADA
      ]
    },
    getInfo : function(code){
      return GeneralConstants.ESTADOS_CANDIDATURAS.toArray().filter(p => p.code == code).pop().info
    },
    getDescricao : function(code){
      return GeneralConstants.ESTADOS_CANDIDATURAS.toArray().filter(p => p.code == code).pop().descricao
    }
  }

  static TIPOS_ANEXOS = {
    CERTIFICADO_DIPLOMA : {code : 1, info : 'Certificado/Diploma'},
    BILHETE_IDENTIDADE : {code : 2, info : 'Bilhete de Identidade'},
    ATESTADO_RESIDENCIA : {code : 3, info : 'Atestado de Residência'},
    getType : function(){
      return 'TIPOS_ANEXOS';
    },
    toArray : function()  {
      return [
        GeneralConstants.TIPOS_ANEXOS.CERTIFICADO_DIPLOMA,
        GeneralConstants.TIPOS_ANEXOS.BILHETE_IDENTIDADE,
        GeneralConstants.TIPOS_ANEXOS.ATESTADO_RESIDENCIA
      ]
    },
    getInfo : function(code){
      return GeneralConstants.TIPOS_ANEXOS.toArray().filter(p => p.code == code).pop().info
    }
  }

  static TIPOS_BOLSAS = {
    INTERNA : {code : 0, info : 'Interna'},
    EXTERNA : {code : 1, info : 'Externa'},
    getType : function(){
      return 'TIPOS_BOLSAS';
    },
    toArray : function()  {
      return [
        GeneralConstants.TIPOS_BOLSAS.INTERNA,
        GeneralConstants.TIPOS_BOLSAS.EXTERNA
      ]
    },
    getInfo : function(code){
      return GeneralConstants.TIPOS_BOLSAS.toArray().filter(p => p.code == code).pop().info
    }
  }

  static NIVEIS_ACADEMICOS = {
    ENSINOMEDIO : {code : 1, info : 'ENSINO MEDIO'},
    LICENCIANTURA : {code : 2, info : 'LICENCIATURA'},
    MESTRADO : {code : 3, info : 'MESTRADO'},
    ESPECIALIZACAO : {code : 4, info : 'ESPECIALIZAÇÃO'},
    DOUTORAMENTO : {code : 5, info : 'DOUTORAMENTO'},
    getType : function(){
      return 'NIVEIS_ACADEMICOS';
    },
    toArray : function()  {
      return [
        GeneralConstants.NIVEIS_ACADEMICOS.ENSINOMEDIO,
        GeneralConstants.NIVEIS_ACADEMICOS.LICENCIANTURA,
        GeneralConstants.NIVEIS_ACADEMICOS.MESTRADO,
        GeneralConstants.NIVEIS_ACADEMICOS.ESPECIALIZACAO,
        GeneralConstants.NIVEIS_ACADEMICOS.DOUTORAMENTO
      ]
    },
    getInfo : function(code){
      return GeneralConstants.NIVEIS_ACADEMICOS.toArray().filter(p => p.code == code).pop().info
    },
    getNivelInstituicao : function(code){
      if(code < GeneralConstants.NIVEIS_ACADEMICOS.LICENCIANTURA.code){
        return GeneralConstants.NIVEIS_INSTITUICOES.MEDIO;
      }else{
        return GeneralConstants.NIVEIS_INSTITUICOES.SUPERIOR;
      }
    }
  }

  static GENEROS = {
    MASCULINO : {code : 1, info : 'MASCULINO'},
    FEMININO : {code : 2, info : 'FEMININO'},
    getType : function(){
      return 'GENEROS';
    },
    toArray : function()  {
      return [GeneralConstants.GENEROS.MASCULINO, GeneralConstants.GENEROS.FEMININO]
    },
    getInfo : function(code){
      return GeneralConstants.GENEROS.FEMININO
      return GeneralConstants.GENEROS.toArray().filter(p => p.code == code).pop().info
    }
  }

  static TIPOS_DOCUMENTOS = {
    BILHETE_IDENTIDADE : {code : 1, info : 'BILHETE DE IDENTIDADE'},
    PASSAPORTE : {code : 2, info : 'PASSAPORTE'},
    CARTAO_RESIDENTE : {code : 3, info : 'CARTÃO DE RESIDENTE'},
    OUTRO : {code : 4, info : 'OUTRO'},
    getType : function(){
      return 'TIPOS_DOCUMENTOS';
    },
    toArray : function()  {
      return [
        GeneralConstants.TIPOS_DOCUMENTOS.BILHETE_IDENTIDADE,
        GeneralConstants.TIPOS_DOCUMENTOS.PASSAPORTE,
        GeneralConstants.TIPOS_DOCUMENTOS.CARTAO_RESIDENTE,
        GeneralConstants.TIPOS_DOCUMENTOS.OUTRO,
      ]
    },
    getInfo : function(code){
      return GeneralConstants.TIPOS_DOCUMENTOS.toArray().filter(p => p.code == code).pop().info
    }
  }

  static NIVEIS_INSTITUICOES = {
    MEDIO : {code : 1, info : 'Ensino Médio'},
    SUPERIOR : {code : 2, info : 'Ensino Superior'},
    getType : function(){
      return 'NIVEIS_INSTITUICOES';
    },
    toArray : function()  {
      return [
        GeneralConstants.NIVEIS_INSTITUICOES.MEDIO,
        GeneralConstants.NIVEIS_INSTITUICOES.SUPERIOR
      ]
    },
    getInfo : function(code){
      return GeneralConstants.NIVEIS_INSTITUICOES.toArray().filter(p => p.code == code).pop().info
    }
  }

  static TIPOS_CONTACTOS = {
    TELEMOVEL : {code : 1, info : 'Telemóvel'},
    EMAIL : {code : 2, info : 'E-mail'},
    SKYPE : {code : 3, info : 'Skype'},
    WHATSAPP : {code : 4, info : 'WhatsApp'},
    FACEBOOK : {code : 5, info : 'Facebook'}, 
    OUTRO : {code : 6, info : 'Outro'},
    getType : function(){
      return 'TIPOS_CONTACTOS';
    },
    toArray : function()  {
      return [
        GeneralConstants.TIPOS_CONTACTOS.TELEMOVEL,
        GeneralConstants.TIPOS_CONTACTOS.EMAIL,
        GeneralConstants.TIPOS_CONTACTOS.SKYPE,
        GeneralConstants.TIPOS_CONTACTOS.WHATSAPP,
        GeneralConstants.TIPOS_CONTACTOS.FACEBOOK,
        GeneralConstants.TIPOS_CONTACTOS.OUTRO
      ]
    },
    getInfo : function(code){
      return GeneralConstants.TIPOS_CONTACTOS.toArray().filter(p => p.code == code).pop().info
    }
  }

  static ESTADOS_CIVIS = {
    SOLTEIRO : {code : 1, info : 'Solteiro (a)', codigo : '1'},
    CASADO : {code : 2, info : 'Casado (a)', codigo : '2'},
    DIVORCIADO : {code : 3, info : 'Divorciado (a)', codigo : '3'},
    OUTROS : {code : 4, info : 'Outros', codigo : '4'},
    getType : function(){
      return 'ESTADOS_CIVIS';
    },
    toArray : function()  {
      return [
        GeneralConstants.ESTADOS_CIVIS.SOLTEIRO,
        GeneralConstants.ESTADOS_CIVIS.CASADO,
        GeneralConstants.ESTADOS_CIVIS.DIVORCIADO,
        GeneralConstants.ESTADOS_CIVIS.OUTROS,
      ]
    },
    getInfo : function(code){
      return GeneralConstants.ESTADOS_CIVIS.toArray().filter(p => p.code == code).pop().info
    }
  }

  static USERS_PERFIS = {
    ADMINISTRADOR : {code : 0, info : 'Administrador'},
    CANDIDATO : {code : 1, info : 'Candidato'},
    getType : function(){
      return 'USERS_PERFIS';
    },
    toArray : function()  {
      return [
        GeneralConstants.USERS_PERFIS.ADMINISTRADOR,
        GeneralConstants.USERS_PERFIS.CANDIDATO

      ]
    },
    getInfo : function(code){
      return GeneralConstants.USERS_PERFIS.toArray().filter(p => p.code == code).pop().info
    }
  }

  static ESTADOS = {
    DESACTIVADO : {code : 0, info : 'DESACTIVADO'},
    ACTIVADO : {code : 1, info : 'ACTIVADO'},
    PENDENTE : {code : 2, info : 'PENDENTE'},
    getType : function(){
      return 'ESTADOS';
    },
    toArray : function()  {
      return [
        GeneralConstants.ESTADOS.ACTIVADO,
        GeneralConstants.ESTADOS.DESACTIVADO,
        GeneralConstants.ESTADOS.PENDENTE
      ]
    },
    getInfo : function(code){
      return GeneralConstants.ESTADOS.toArray().filter(p => p.code == code).pop().info
    }
  }

  static USER_AUTH_KEYS = {
    TOKEN_KEY : 'sinac_token',
    USERNAME_KEY : 'sinac_user_nome',
    USERPROFILE_KEY : 'sinac_user_profile'
  }






  
}

module.exports = GeneralConstants

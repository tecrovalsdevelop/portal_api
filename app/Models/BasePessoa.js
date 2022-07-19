'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class BasePessoa extends Model {

  user() {
    return this.belongsTo('App/Models/User');
  }
  bolseiro() {
    return this.hasMany('App/Models/EduBolseiro');
  }
  agregado() {
    return this.hasMany('App/Models/BaseAgregadoFamiliare', 'id', 'base_pessoa_id')
  }
  genero() {
    return this.hasOne('App/Models/BaseGenero', 'genero', 'id')
  }
  municipio() {
    return this.hasOne('App/Models/BaseMunicipio', 'base_municipio_id', 'id')
  }
  municipioresidencia() {
    return this.hasOne('App/Models/BaseMunicipio', 'base_municipio_id', 'id')
  }
  municipio_residencia() {
    return this.hasOne('App/Models/BaseMunicipio', 'base_municipio_id', 'id')
  }
  anexo() {
    return this.hasOne('App/Models/BaseAnexo', 'base_anexo_id', 'id')
  }
  contactos() {
    return this.hasMany('App/Models/BasePessoaContacto', 'id', 'base_pessoa_id')
  }
  formacoes() {
    return this.hasMany('App/Models/BaseHabilidadeLiteraria', 'id', 'base_pessoa_id')
  }
  candidaturas() {
    return this.hasMany('App/Models/EduCandidatura', 'id', 'base_pessoa_id')
  }
  eduCurso() {
    return this.belongsTo('App/Models/EduCurso');
  }

}

module.exports = BasePessoa

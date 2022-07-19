'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class BaseHabilidadeLiteraria extends Model {
  instituicao () {
    return this.hasOne('App/Models/EduInstituicoes','edu_instituicao_id','id')
  }
  curso () {
    return this.hasOne('App/Models/BaseCurso','base_curso_id','id')
  }
}

module.exports = BaseHabilidadeLiteraria

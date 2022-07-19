'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class EduCurso extends Model {

  eduUnidadeOrganica() {
    return this.belongsTo('App/Models/EduUnidadeOrganica', 'edu_unidade_organica_id', 'id');
  }
  unidadeOrganica() {
    return this.belongsTo('App/Models/EduUnidadeOrganica', 'edu_unidade_organica_id', 'id');
  }


  instituicao() {
    return this.hasOne('App/Models/EduInstituicoes', 'edu_instituicao_id', 'id')
  }

  nivelAcademico() {
    return this.hasOne('App/Models/BaseNivelAcademico', 'nivel_academico', 'id')
  }

  baseCursos() {
    return this.hasOne('App/Models/BaseCurso', 'base_curso_id', 'id')
  }

}

module.exports = EduCurso

'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class EduReclamacoe extends Model {

  static get table(){
    return 'edu_reclamacoes';
  }

  candidato() {
    return this.hasOne('App/Models/EduCandidatura', 'edu_candidatura_id', 'id')
  }

  anexo() {
    return this.hasOne('App/Models/BaseAnexo', 'base_anexo_id', 'id')
  }
}

module.exports = EduReclamacoe

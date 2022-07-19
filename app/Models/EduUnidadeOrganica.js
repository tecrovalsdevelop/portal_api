'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class EduUnidadeOrganica extends Model {

    tipoInstituicoes () {
    return this.hasOne('App/Models/EduTipoInstituicoe','edu_tipo_instituicao_id','id')
   }

    provincia () {
    return this.hasOne('App/Models/BaseProvincia','base_provincia_id','id')
    }

  estado () {
    return this.hasOne('App/Models/EduEstado','estado','id')
   }
    
  cursos() {
  }


  tipoInstituicoes() {
    return this.hasOne('App/Models/EduTipoInstituicoe', 'edu_tipo_instituicao_id', 'id')
  }

  provincia() {
    return this.hasOne('App/Models/BaseProvincia', 'base_provincia_id', 'id')
  }

  estado() {
    return this.hasOne('App/Models/EduEstado', 'estado', 'id')
  }


}
module.exports = EduUnidadeOrganica

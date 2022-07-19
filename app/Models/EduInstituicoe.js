'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class EduInstituicoe extends Model {
    
  cursos () {
    return this.hasMany('App/Models/EduCurso','id','edu_instituicao_id')
  }

  paises () {
    return this.hasOne('App/Models/BasePaises','base_pais_id','id')
  }

  provincia () {
    return this.hasOne('App/Models/BaseProvincia','base_provincia_id','id')
  }

  nivelInstituicoes () {
    return this.hasOne('App/Models/EduNivelInstituicao', 'nivel_instituicao','id')
  }

  tipoInstituicoes () {
    return this.hasOne('App/Models/EduTipoInstituicao','edu_tipo_ies','id')
  }

  naturezaInstituicoes () {
    return this.hasOne('App/Models/EduNaturezaInstituicoe','edu_natureza_ies','id')
  }
}

module.exports = EduInstituicoe

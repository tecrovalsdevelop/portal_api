'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class BaseCurso extends Model {

    
    areasdeconhecimento () {
        return this.hasOne('App/Models/BaseAreaConhecimento','base_area_conhecimento_id','id')
      }
    bolsas() {
        return this.hasMany('App/Models/EduBolsa','id','edu_bolsa')
      }

    educursos() {
        return this.hasMany('App/Models/EduCurso','id','curso_superior')
      }

     
   /* paises () {
        return this.hasOne('App/Models/BasePaises','base_pais_id','id')
      }*/
}

module.exports = BaseCurso

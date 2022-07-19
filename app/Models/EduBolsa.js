'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class EduBolsa extends Model {
    
  EduTipoBolsa () {
        return this.hasOne('App/Models/EduTipoBolsa','edu_tipo_bolsa_id','id')
      }
}

module.exports = EduBolsa

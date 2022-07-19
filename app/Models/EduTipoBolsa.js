'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class EduTipoBolsa extends Model {
    bolsas () {
        return this.hasMany('App/Models/EduBolsa','id','edu_tipo_bolsa_id')
      }
}

module.exports = EduTipoBolsa

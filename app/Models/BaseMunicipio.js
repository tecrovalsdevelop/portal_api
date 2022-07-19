'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('App/Models/ModelWithoutTimestamps')

class BaseMunicipio extends Model {
  
  provincia () {
    return this.hasOne('App/Models/BaseProvincia','base_provincia_id','id')
  }
}

module.exports = BaseMunicipio

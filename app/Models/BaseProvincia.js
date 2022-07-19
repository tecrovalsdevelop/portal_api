'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class BaseProvincia extends Model {
  static get createdAtColumn() {
    return null;
  }

  static get updatedAtColumn() {
    return null;
  }
  static boot() {
    super.boot()
    this.addHook('afterCreate', async pais => {
      await pais.municipios().create({ nome: '_OUTRO_', estado: 1 });
    })
  }
  municipios() {
    return this.hasMany('App/Models/BaseMunicipio', 'id', 'base_provincia_id')
  }
  instituicoes() {
    return this.hasMany('App/Models/EduInstituicoes', 'id', 'base_provincia_id')
  }
}

module.exports = BaseProvincia

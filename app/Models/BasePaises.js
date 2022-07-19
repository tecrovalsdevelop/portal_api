'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class BasePaises extends Model {
  static get createdAtColumn() {
    return null;
  }

  static get updatedAtColumn() {
    return null;
  }
  static boot() {
    super.boot()
    this.addHook('afterCreate', async pais => {
      await pais.provincias().create({ nome: '_OUTRA_', estado: 1 });
    })
  }

  provincias() {
    return this.hasMany('App/Models/BaseProvincia', 'id', 'base_pais_id')
  }
}

module.exports = BasePaises

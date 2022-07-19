'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BaseEstadoCivisSchema extends Schema {
  up () {
    this.create('base_estado_civis', (table) => {
      table.increments()
      table.string('nome',30).unique()
      table.string('sigla',14)
      table.timestamps()
    })
  }

  down () {
    this.drop('base_estado_civis')
  }
}

module.exports = BaseEstadoCivisSchema

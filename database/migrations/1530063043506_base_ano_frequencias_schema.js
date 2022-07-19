'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BaseAnoFrequenciasSchema extends Schema {
  up () {
    this.create('base_ano_frequencias', (table) => {
      table.increments()
      table.string('nome',255).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('base_ano_frequencias')
  }
}

module.exports = BaseAnoFrequenciasSchema

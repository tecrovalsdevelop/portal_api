'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BasePaisesSchema extends Schema {
  up () {
    this.create('base_paises', (table) => {
        table.increments()
        table.string('codigo',255).notNullable()
        table.string('codigo_a2_iso',255)
        table.string('codigo_a3_iso',255)
        table.string('nome_iso',255).unique()
        table.string('nome',255).notNullable().unique()
        table.string('capital',255).notNullable()
        table.string('icon',255)
        table.integer('estado',11)
        table.string('local',255)
        table.timestamps()
    })
  }

  down () {
    this.drop('base_paises')
  }
}

module.exports = BasePaisesSchema

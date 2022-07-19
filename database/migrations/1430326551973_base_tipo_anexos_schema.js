'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BaseTipoAnexosSchema extends Schema {
  up () {
    this.create('base_tipo_anexos', (table) => {
      table.increments()
      table  .string('codigo',30).unique().notNullable()
      table  .string('nome',255).notNullable().unique()
           
      table.integer('estado',11).notNullable()
      table.string('categoria',2).defaultTo(null)
      table.string('obrigatorio',255).defaultTo(null)
      table.timestamps()
    })
  }

  down () {
    this.drop('base_tipo_anexos')
  }
}

module.exports = BaseTipoAnexosSchema

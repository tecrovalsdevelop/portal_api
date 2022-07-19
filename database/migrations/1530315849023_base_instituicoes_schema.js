'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BaseInstituicoesSchema extends Schema {
  up () {
    this.create('base_instituicoes', (table) => {
      table.increments()
      table.string('codigo',11)
      table.string('nome',255).notNullable()
      table.integer('base_estado_id',11).unsigned().notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('base_instituicoes')
  }
}

module.exports = BaseInstituicoesSchema

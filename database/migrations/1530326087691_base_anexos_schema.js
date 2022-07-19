'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BaseAnexosSchema extends Schema {
  up () {
    this.create('base_anexos', (table) => {
      table.increments()
      table.string('nbi',14)
      table.string('nome',255).notNullable()
      table.integer('base_periodo_avaliacao_id',11)
      
      table.string('codigo',20)
      table.string('descricao',200)
      table.integer('estado',11).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('base_anexos')
  }
}

module.exports = BaseAnexosSchema

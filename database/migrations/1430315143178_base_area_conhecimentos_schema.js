'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BaseAreaConhecimentosSchema extends Schema {
  up () {
    this.create('base_area_conhecimentos', (table) => {
      table.increments()
      table
      .string('codigo',11)
  table
      .string('nome',255).notNullable()
      
  table.integer('base_estados_id',11).unsigned().notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('base_area_conhecimentos')
  }
}

module.exports = BaseAreaConhecimentosSchema

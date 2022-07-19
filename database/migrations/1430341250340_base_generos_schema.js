'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BaseGenerosSchema extends Schema {
  up () {
    this.create('base_generos', (table) => {
      table.increments()
      table.string('nome',25).notNullable()
      table.string('sigla',20)
      table.timestamps()
    })
  }

  down () {
    this.drop('base_generos')
  }
}

module.exports = BaseGenerosSchema

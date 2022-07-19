'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BaseEstadosSchema extends Schema {
  up () {
    this.create('base_estados', (table) => {
      table.increments()
      table.string('name',45).unique().notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('base_estados')
  }
}

module.exports = BaseEstadosSchema

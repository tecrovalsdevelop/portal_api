'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BaseAgregadoFamiliaresSchema extends Schema {
  up () {
    this.create('base_agregado_familiares', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('base_agregado_familiares')
  }
}

module.exports = BaseAgregadoFamiliaresSchema

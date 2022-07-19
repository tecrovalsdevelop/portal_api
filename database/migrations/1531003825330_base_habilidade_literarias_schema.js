'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BaseHabilidadeLiterariasSchema extends Schema {
  up () {
    this.create('base_habilidade_literarias', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('base_habilidade_literarias')
  }
}

module.exports = BaseHabilidadeLiterariasSchema

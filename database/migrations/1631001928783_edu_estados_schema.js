'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EduEstadosSchema extends Schema {
  up () {
    this.create('edu_estados', (table) => {
      table.increments()
      table.string("descricao")
      table.integer("edu_candidatura_id") 
      table.integer("edu_estado_id")
      table.string("estado")
      table.timestamps()
    })
  }

  down () {
    this.drop('edu_estados')
  }
}

module.exports = EduEstadosSchema

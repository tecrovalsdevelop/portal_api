'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EduBolseiroEstadosSchema extends Schema {
  up () {
    this.create('edu_bolseiro_estados', (table) => {
      table.increments()
      table
      .string('nome',255)
      .notNullable()
 table
      .integer('estado',10)
      .defaultTo(null)
      table.timestamps()
    })
  }

  down () {
    this.drop('edu_bolseiro_estados')
  }
}

module.exports = EduBolseiroEstadosSchema

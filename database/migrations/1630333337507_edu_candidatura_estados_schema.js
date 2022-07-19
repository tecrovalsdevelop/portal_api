'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EduCandidaturaEstadosSchema extends Schema {
  up () {
    this.create('edu_candidatura_estados', (table) => {
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
    this.drop('edu_candidatura_estados')
  }
}

module.exports = EduCandidaturaEstadosSchema

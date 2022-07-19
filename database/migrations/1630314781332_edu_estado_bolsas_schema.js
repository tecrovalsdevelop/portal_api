'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EduEstadoBolsasSchema extends Schema {
  up () {
    this.create('edu_estado_bolsas', (table) => {
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
    this.drop('edu_estado_bolsas')
  }
}

module.exports = EduEstadoBolsasSchema

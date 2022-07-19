'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BaseGrauAcademicosSchema extends Schema {
  up () {
    this.create('base_grau_academicos', (table) => {
      table.increments()
      table
      .string('nome',255)
      .notNullable()
 table
      .integer('estado',10)
      .defaultTo(null)
      table
       .integer('sigla',5)
       .defaultTo(null) 
      table.timestamps()
    })
  }

  down () {
    this.drop('base_grau_academicos')
  }
}

module.exports = BaseGrauAcademicosSchema

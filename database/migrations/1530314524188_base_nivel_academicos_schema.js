'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BaseNivelAcademicosSchema extends Schema {
  up () {
    this.create('base_nivel_academicos', (table) => {
        table.increments()
        table
       .string('nome',255)
       .notNullable()
        table
       .integer('estado',11)
       .defaultTo(null)  
       table
       .integer('sigla',5)
       .defaultTo(null) 
        table.timestamps()
    })
  }

  down () {
    this.drop('base_nivel_academicos')
  }
}

module.exports = BaseNivelAcademicosSchema

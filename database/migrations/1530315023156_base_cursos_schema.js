'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BaseCursosSchema extends Schema {
  up () {
    this.create('base_cursos', (table) => {
      table.increments()
      table.string('codigo',11)
      table.string('nome',255).notNullable()
      table.integer('estado',11)
      table.integer('base_area_conhecimento_id',11).unsigned().notNullable()
      table.integer('prioritario',11)
      table.integer('programa_merito',11)
      table.integer('edu_bolsa_id',11).unsigned().notNullable()
      table.integer('curso_superior',11)
      table.timestamps()
    })
  }

  down () {
    this.drop('base_cursos')
  }
}

module.exports = BaseCursosSchema

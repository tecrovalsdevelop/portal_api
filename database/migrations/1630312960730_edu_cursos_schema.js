'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EduCursosSchema extends Schema {
  up () {
    this.create('edu_cursos', (table) => {
      table.increments()
      table.string('codigo',11)
      table.string('nome',255).notNullable()
      table.integer('edu_instituicao_id',11).unsigned().notNullable()
      table.integer('nivel_academico_id',11).unsigned().notNullable()
      table.integer('base_curso_id',10).unsigned().notNullable()
      table.integer('edu_unidade_organica_id',11).unsigned().notNullable()
      table.string('duracao',45) 
      table.timestamps()
    })
  }

  down () {
    this.drop('edu_cursos')
  }
}

module.exports = EduCursosSchema

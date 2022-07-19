'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EduBolseiroInternosSchema extends Schema {
  up () {
    this.create('edu_bolseiro_internos', (table) => {
      table.increments()
      table.integer('edu_tipo_bolsa_id').unsigned().notNullable()
      table.integer('edu_bolseiro_id').unsigned().notNullable()
      table.integer('edu_curso_id').unsigned().notNullable()
      table.integer('base_grau_academico_id').unsigned().notNullable()
      table.integer('base_nivel_academico_id').unsigned().notNullable()
      table.string('valor_bolsa')
      table.timestamps()
    })
  }

  down () {
    this.drop('edu_bolseiro_internos')
  }
}

module.exports = EduBolseiroInternosSchema

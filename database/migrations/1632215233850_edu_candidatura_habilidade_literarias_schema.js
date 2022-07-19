'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EduCandidaturaHabilidadeLiterariasSchema extends Schema {
  up () {
    this.create('edu_candidatura_habilidade_literarias', (table) => {
      table.increments() 
      table.integer('pessoa_id',10).unsigned().notNullable()
      table.integer('edu_instituicao_id',10).unsigned().notNullable()
      table.integer('base_curso_id',10).unsigned().index('base_curso_id').notNullable()
      table.integer('nivel_academico',11).unsigned().notNullable()
      table.integer('ano_ingresso',11).index('ano_ingresso').notNullable()
      table.integer('ano_conclusao',11).index('ano_conclusao').notNullable()
      table.integer('media',11).index('media').notNullable()
      table.integer('base_anexo_id',10).index('base_anexo_id').unsigned().notNullable()
      table.integer('estado',1).index().notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('edu_candidatura_habilidade_literarias')
  }
}

module.exports = EduCandidaturaHabilidadeLiterariasSchema

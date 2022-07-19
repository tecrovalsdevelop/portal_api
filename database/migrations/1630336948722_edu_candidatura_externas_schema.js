'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EduCandidaturaExternasSchema extends Schema {
  up () {
    this.create('edu_candidatura_externas', (table) => {
       table.increments()
       table
      .integer('edu_candidatura_id',11)
      .unsigned().notNullable()
       table
      .integer('base_curso_id',11)
      .unsigned().notNullable()
       table
      .integer('edu_instituicao_id',11)
      .unsigned().notNullable()
       table
      .date('ano_ingresso').notNullable()
       table
      .float('media')
       table
      .integer('frequencia',11).notNullable()
       table
      .integer('matriculado',11)
       table
      .integer('aceite',11)
       table
      .foreign('edu_candidatura_id','edu_candidatura_externas_edu_candidatura_id_foreign1')
      .references('edu_candidaturas.id')
       table
      .foreign('base_curso_id','edu_candidatura_externas_base_cursos_base_cursos_id_foreign2')
      .references('base_cursos.id')
       table
      .foreign('edu_instituicao_id','edu_candidatura_externas_instituicao_id_foreign3')
       .references('edu_instituicoes.id')
       table.timestamps()
    })
  }

  down () {
    this.drop('edu_candidatura_externas')
  }
}

module.exports = EduCandidaturaExternasSchema

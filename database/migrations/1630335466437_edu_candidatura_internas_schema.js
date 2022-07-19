'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EduCandidaturaInternasSchema extends Schema {
  up () {
    this.create('edu_candidatura_internas', (table) => {
      table.increments()
      table
      .integer('edu_candidatura_id',10)
      .unsigned().notNullable()
      
 table
      .integer('edu_curso_id',10)
      .unsigned().notNullable()
table
      .integer('edu_instituicao_id',10)
      .unsigned().notNullable()
 table
      .date('ano_ingresso').notNullable()
 table
      .float('media')
 table
      .integer('frequencia',1).notNullable()

      table
      .integer('filho_antigo_combatente',11)
      table
      .integer('filho_necessidade_especial',11)
      table
      .integer('carenciado',11)
      table
      .integer('docente',11)

      table.timestamps()

 table
     .foreign('edu_candidatura_id','edu_candidatura_internas_edu_candidatura_id_foreign1')
      .references('edu_candidaturas.id').onDelete('CASCADE').onUpdate('CASCADE')
 table
     .foreign('edu_curso_id','edu_candidatura_internas_edu_cursos_id_foreign2')
      .references('edu_cursos.id').onDelete('CASCADE').onUpdate('CASCADE')
 table
      .foreign('edu_instituicao_id','edu_candidatura_internas_edu_instituicoes_id_foreign3')
       .references('edu_instituicoes.id').onDelete('CASCADE').onUpdate('CASCADE')
 
      
    })
  }

  down () {
    this.drop('edu_candidatura_internas')
  }
}

module.exports = EduCandidaturaInternasSchema

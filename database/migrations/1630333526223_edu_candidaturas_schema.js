'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EduCandidaturasSchema extends Schema {
  up () {
      this.create('edu_candidaturas', (table) => {
      table.increments()
      table
      .integer('base_pessoa_id',11)
      .unsigned().notNullable()
table
      .integer('edu_bolsa_id',10)
      .unsigned().notNullable()
table
      .integer('estado',10)
      .unsigned().notNullable()

table
      .integer('base_anexo_id',10)
      .unsigned().notNullable()

table
      .float('avaliacao',10)
      .unsigned().notNullable()
table
      .float('media',6,2)
      .unsigned().notNullable()
table
      .integer('ano_ingresso',4)
      .unsigned().notNullable()

table
      .integer('frequencia',11)
      .notNullable()
table
      .integer('user_id',11)
      .notNullable()
      
table
      .integer('base_nivel_academico_id',11)
      .unsigned().notNullable()

table.string('matriculado',90)

table.string('aceite',90)

table
      .integer('edu_motivo_exclusoes_id',11)
      .unsigned().notNullable()

table
      .integer('edu_candidatura_estados_id',10)
      .unsigned().notNullable()

      table.string('observacao',500)

      table.string('classificacao',500)

      table.float('x_media',11)

      table.float('x_curso',11)

      table.float('x_idade',11)

      table.float('x_carenciado',11)
         
table
      .foreign('base_anexo_id','edu_candidaturas_base_anexo_id_foreign')
      .references('base_anexos.id')
      
table
     .foreign('base_nivel_academico_id','edu_candidaturas_base_nivel_academico_id_foreign')
     .references('base_nivel_academicos.id')

 table
     .foreign('edu_motivo_exclusao_id','edu_candidaturas_edu_motivo_exclusao_id_foreign')
     .references('edu_motivo_exclusoes')

table
      .foreign('base_pessoa_id','edu_candidaturas_base_pessoa_id_foreign')
      .references('base_pessoas.id')

      table.timestamps()
    })
  }

  down () {
    this.drop('edu_candidaturas')
  }
}

module.exports = EduCandidaturasSchema

'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EduInstituicoesSchema extends Schema {
  up () {
    this.create('edu_instituicoes', (table) => {
      table.increments()
 table
      .string('codigo',20).defaultTo(null)
  table
      .string('nome',255).unique().notNullable()
  table
      .integer('nivel_instituicao_id',11).unsigned().notNullable()
  table
      .integer('edu_tipo_instituicao_id',11).unsigned().notNullable()
  table
      .integer('base_pais_id',11).unsigned().notNullable()
  table
      .integer('edu_natureza_instituicao_id',11).unsigned().notNullable()
  table
      .integer('base_provincia_id',11).unsigned().notNullable()
      .unsigned().notNullable()
  table
      .integer('raking',11)
      .notNullable().default('100')
 
      table.timestamps()
    })
  }

  down () {
    this.drop('edu_instituicoes')
  }
}

module.exports = EduInstituicoesSchema

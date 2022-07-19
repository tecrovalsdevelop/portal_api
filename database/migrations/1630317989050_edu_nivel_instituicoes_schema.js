'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EduNivelInstituicoesSchema extends Schema {
  up () {
    this.create('edu_nivel_instituicoes', (table) => {
      table.increments()
      table
      .string('nome',255).unique()
      .notNullable()
      table 
      .integer('estado',11)
      table.timestamps()
    })
  }

  down () {
    this.drop('edu_nivel_instituicoes')
  }
}

module.exports = EduNivelInstituicoesSchema

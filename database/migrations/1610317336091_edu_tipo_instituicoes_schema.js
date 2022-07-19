'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EduTipoInstituicoesSchema extends Schema {
  up () {
    this.create('edu_tipo_instituicoes', (table) => {
      table.increments()
      table
      .string('codigo',11)
  table
      .string('nome',255)
      .notNullable()
  table
      .integer('estado',11)
      table.timestamps()
    })
  }

  down () {
    this.drop('edu_tipo_instituicoes')
  }
}

module.exports = EduTipoInstituicoesSchema

'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EduUnidadeOrganicasSchema extends Schema {
  up () {
    this.create('edu_unidade_organicas', (table) => {
      table.increments()
      table.string('codigo',20).defaultTo(null)
      table.string('nome',255).notNullable()
      table.integer('estado',11).defaultTo(0)
      table.integer('edu_tipo_instituicao_id',11).unsigned().notNullable()
      table.integer('base_provincia_id',11).unsigned().notNullable()

      table.timestamps()
    })
  }

  down () {
    this.drop('edu_unidade_organicas')
  }
}

module.exports = EduUnidadeOrganicasSchema

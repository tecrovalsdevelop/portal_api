'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EduMotivoExclusoesSchema extends Schema {
  up () {
    this.create('edu_motivo_exclusoes', (table) => {
      table.increments()
      table.string('nome',255).notNullable()
      table.string('descricao',500).defaultTo(null)
      table.timestamps()
    })
  }

  down () {
    this.drop('edu_motivo_exclusoes')
  }
}

module.exports = EduMotivoExclusoesSchema

'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EduBolseiroRenovacaoEstadoSchema extends Schema {
  up () {
    this.create('edu_bolseiro_renovacao_estados', (table) => {
      table.increments()
      table.string('nome',50).notNullable().unique()
      table.timestamps()
    })
  }

  down () {
    this.drop('edu_bolseiro_renovacao_estados')
  }
}

module.exports = EduBolseiroRenovacaoEstadoSchema

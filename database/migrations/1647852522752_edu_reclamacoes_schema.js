'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EduReclamacoesSchema extends Schema {
  up () {
    this.create('edu_reclamacoes', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('edu_reclamacoes')
  }
}

module.exports = EduReclamacoesSchema

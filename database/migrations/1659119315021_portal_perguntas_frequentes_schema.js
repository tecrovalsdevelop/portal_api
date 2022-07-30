'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PortalPerguntasFrequentesSchema extends Schema {
  up () {
    this.create('portal_perguntas_frequentes', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('portal_perguntas_frequentes')
  }
}

module.exports = PortalPerguntasFrequentesSchema

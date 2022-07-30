'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PortalInstituicoesSchema extends Schema {
  up () {
    this.create('portal_instituicoes', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('portal_instituicoes')
  }
}

module.exports = PortalInstituicoesSchema

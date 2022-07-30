'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PortalProfissionaisSchema extends Schema {
  up () {
    this.create('portal_profissionais', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('portal_profissionais')
  }
}

module.exports = PortalProfissionaisSchema

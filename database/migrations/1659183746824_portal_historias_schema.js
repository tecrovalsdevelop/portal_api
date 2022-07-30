'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PortalHistoriasSchema extends Schema {
  up () {
    this.create('portal_historias', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('portal_historias')
  }
}

module.exports = PortalHistoriasSchema

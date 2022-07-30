'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PortalEventosSchema extends Schema {
  up () {
    this.create('portal_eventos', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('portal_eventos')
  }
}

module.exports = PortalEventosSchema

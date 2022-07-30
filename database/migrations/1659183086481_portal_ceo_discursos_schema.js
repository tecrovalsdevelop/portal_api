'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PortalCeoDiscursosSchema extends Schema {
  up () {
    this.create('portal_ceo_discursos', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('portal_ceo_discursos')
  }
}

module.exports = PortalCeoDiscursosSchema

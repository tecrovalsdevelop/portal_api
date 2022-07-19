'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EduRetfopBolseirosSchema extends Schema {
  up () {
    this.create('edu_retfop_bolseiros', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('edu_retfop_bolseiros')
  }
}

module.exports = EduRetfopBolseirosSchema

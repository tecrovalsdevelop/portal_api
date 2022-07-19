'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EduTipoBolseirosSchema extends Schema {
  up () {
    this.create('edu_tipo_bolseiros', (table) => {
      table.increments()
      table.string('nome',255).unique().notNullable()
      table
       .integer('sigla',5)
       .defaultTo(null) 
      table.integer('estado',11)
      table.timestamps()
    })
  }

  down () {
    this.drop('edu_tipo_bolseiros')
  }
}

module.exports = EduTipoBolseirosSchema

'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BaseBancosSchema extends Schema {
  up () {
    this.create('base_bancos', (table) => {
      table.increments()
      table.string('nome',50).notNullable()
      table.string('sigla',20)
   
      table.timestamps()
    })
  }

  down () {
    this.drop('base_bancos')
  }
}

module.exports = BaseBancosSchema

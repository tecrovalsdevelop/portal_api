'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BasePessoaContactosSchema extends Schema {
  up () {
    this.create('base_pessoa_contactos', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('base_pessoa_contactos')
  }
}

module.exports = BasePessoaContactosSchema

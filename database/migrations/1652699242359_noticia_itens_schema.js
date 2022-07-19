'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class NoticiaItensSchema extends Schema {
  up () {
    this.create('noticia_itens', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('noticia_itens')
  }
}

module.exports = NoticiaItensSchema

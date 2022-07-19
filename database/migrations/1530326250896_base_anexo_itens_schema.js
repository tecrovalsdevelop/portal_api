'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BaseAnexoItensSchema extends Schema {
  up () {
    this.create('base_anexo_itens', (table) => {
      table.increments()
      table.string('nome',255)
      table
           .integer('base_anexo_id',10)
           .unsigned()
           .index()
      table.integer('base_tipo_anexo_id',10)
           .unsigned()
           .index()
      table.string('nome_ficheiro',250)
      table.string('url_ficheiro',250)
      table
          .foreign('base_anexo_id')
           .references('base_anexos.id')
           .onDelete('CASCADE').onUpdate('CASCADE')
      table
          .foreign('base_tipo_anexo_id')
           .references('base_tipo_anexos.id')
           .onDelete('CASCADE').onUpdate('CASCADE')
      table.timestamps()
    })
  }

  down () {
    this.drop('base_anexo_itens')
  }
}

module.exports = BaseAnexoItensSchema

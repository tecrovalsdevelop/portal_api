'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EduComunicacaoTiposSchema extends Schema {
  up () {
    this.create('edu_comunicacao_tipos', (table) => {
      table.increments()
      table.string("nome")
      table.string("descricao")  
      table.integer("estado")
      table.timestamps()
    })
  }

  down () {
    this.drop('edu_comunicacao_tipos')
  }
}

module.exports = EduComunicacaoTiposSchema

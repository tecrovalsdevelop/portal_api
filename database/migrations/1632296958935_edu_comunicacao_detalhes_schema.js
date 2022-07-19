'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EduComunicacaoDetalhesSchema extends Schema {
  up () {
    this.create('edu_comunicacao_detalhes', (table) => {
      table.increments() 
      table.integer("edu_comunicacao_id")
      table.integer("base_anexo_id") 
      table.text("texto")  
      table.text("user_id")  
      table.integer("estado")
      table.timestamps()
    })
  }

  down () {
    this.drop('edu_comunicacao_detalhes')
  }
}

module.exports = EduComunicacaoDetalhesSchema

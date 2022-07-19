'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EduComunicacoesSchema extends Schema {
  up () {
    this.create('edu_comunicacoes', (table) => {
      table.increments()
      table.string("nome")
      table.string("bi")
      table.string("email")
      table.integer("edu_bolseiro_id")
      table.integer("base_anexo_id")
      table.integer("edu_comunicacao_tipo_id")
      table.string("telefone")
      table.string("assunto")
      table.text("texto")  
      table.text("resposta")  
      table.integer("estado")
      table.integer("notificacao") 
      table.text("notificacao_ies")  
      table.integer("notificacao_inagbe")
      table.integer("notificacao") 
      table.timestamps()
    })
  }

  down () {
    this.drop('edu_comunicacoes')
  }
}

module.exports = EduComunicacoesSchema

'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EduInformacoesSchema extends Schema {
  up () {
    this.create('edu_informacoes', (table) => {
      table.increments()
      table.string("user_id") 
      table.string("titulo")  
      table.text("resumo")  
      table.text("texto")       
      table.integer("estado") 
      table.integer("base_anexo_id")
      table.integer("notificacao")

      table.timestamps()
    })
  }

  down () {
    this.drop('edu_informacoes')
  }
}

module.exports = EduInformacoesSchema

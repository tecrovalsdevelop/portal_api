'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EduProjectoDetalhesSchema extends Schema {
  up () {
    this.create('edu_projecto_detalhes', (table) => {
      table.increments()
      table.integer("edu_projecto_id")
      table.integer("base_anexo_id") 
      table.text("texto")  
      table.text("user_id")  
      table.integer("estado")
      table.timestamps()
    })
  }

  down () {
    this.drop('edu_projecto_detalhes')
  }
}

module.exports = EduProjectoDetalhesSchema

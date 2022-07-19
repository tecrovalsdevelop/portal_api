'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EduPagamentosSchema extends Schema {
  up () {
    this.create('edu_pagamentos', (table) => {
      table.increments() 
      table.string("edu_bolseiro_id")
      table.string("nome")
      table.string("bi")
      table.string("numero_conta")
      table.string("iban") 
      table.float("valor")
      table.integer("mes")    
      table.integer("estado")
      table.integer("notificacao")
      table.timestamps()
    })
  }

  down () {
    this.drop('edu_pagamentos')
  }
}

module.exports = EduPagamentosSchema

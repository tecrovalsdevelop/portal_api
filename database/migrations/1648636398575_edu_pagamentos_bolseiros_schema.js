'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EduPagamentosBolseirosSchema extends Schema {
  up () {
    this.create('edu_pagamentos_bolseiros', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('edu_pagamentos_bolseiros')
  }
}

module.exports = EduPagamentosBolseirosSchema

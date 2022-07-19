'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EduOrdemPagamentosSchema extends Schema {
  up () {
    this.create('edu_ordem_pagamentos', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('edu_ordem_pagamentos')
  }
}

module.exports = EduOrdemPagamentosSchema

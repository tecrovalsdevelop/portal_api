'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EduTipoPagamentosSchema extends Schema {
  up () {
    this.create('edu_tipo_pagamentos', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('edu_tipo_pagamentos')
  }
}

module.exports = EduTipoPagamentosSchema

'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EduTipoBolsasSchema extends Schema {
  up () {
    this.create('edu_tipo_bolsas', (table) => {
      table.increments()
      table.string('codigo',5).defaultTo(null)
      table.string('nome',255).index().defaultTo(null)
      table.integer('estado',11).defaultTo(0)
      table.integer('idade',11).defaultTo(null)
      table.float('media',4.2).defaultTo(null)
      table.float('curso_prioritario',4.2).defaultTo(null)
      table.float("curso_nao_prioritario",4.2).defaultTo(null)
      table
       .integer('sigla',5)
       .defaultTo(null) 
      table.integer('oferta_actual',11).defaultTo(null)
      table.timestamps()
    })
  }

  down () {
    this.drop('edu_tipo_bolsas')
  }
}

module.exports = EduTipoBolsasSchema

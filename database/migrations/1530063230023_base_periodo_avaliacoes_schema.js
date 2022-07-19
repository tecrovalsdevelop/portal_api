'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BasePeriodoAvaliacoesSchema extends Schema {
  up () {
    this.create('base_periodo_avaliacoes', (table) => {
      table.increments()
      table.string('nome',255).notNullable()
      table.string('descricao',50)
      table.timestamps()
    })
  }

  down () {
    this.drop('base_periodo_avaliacoes')
  }
}

module.exports = BasePeriodoAvaliacoesSchema

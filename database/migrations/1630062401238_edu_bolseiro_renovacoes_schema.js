'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EduBolseiroRenovacoesSchema extends Schema {
  up() {
    this.create('edu_bolseiro_renovacoes', (table) => {
      table.increments()
      table.integer('edu_bolseiro_renovacao_estado_id', 11).unsigned().notNullable()
      table.integer('edu_bolseiro_id', 11).unsigned().notNullable()
      table.integer('base_ano_frequencia_id', 11).unsigned().notNullable()
      table.integer('base_periodo_avaliacao_id', 11).unsigned().notNullable()
      table.integer('ano_frequencia_anterior_id', 11)

      table.integer('base_anexo_id', 11)
      table.timestamps()
    })
  }

  down() {
    this.drop('edu_bolseiro_renovacoes')
  }
}

module.exports = EduBolseiroRenovacoesSchema

'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EduBolseirosSchema extends Schema {
  up () {
    this.create('edu_bolseiros', (table) => {
      table.increments()
      table.integer('edu_tipo_bolseiro_id',11).unsigned().notNullable()
      table.string('codigo_bolsa',20).defaultTo(null)
      table.integer('base_periodo_avaliacao_id',11).defaultTo(null)
      table.integer('base_pessoa_id',11).unsigned().notNullable()
      table.integer('base_nivel_academico_id',11).unsigned().notNullable()
      table.integer('base_grau_academico_id',11).unsigned().notNullable()
      table.integer('edu_estado_bolsa_id',11).unsigned().notNullable()
      table.integer('edu_instituicao_id',11).unsigned().notNullable()
      table.integer('edu_curso_id',11).unsigned().unsigned().notNullable()
      table.integer('duracao',11).defaultTo(null)
      table.integer('base_ano_frequencia_id',11).unsigned().notNullable()
      table.string('cidade',50).defaultTo(null)
      table.string('numero_conta',50).defaultTo(null)
      table.string('iban',50).defaultTo(null)
      table.integer('base_provincia_residencia_id',11).unsigned().notNullable()
      table.integer('edu_tipo_bolsa_id',11).unsigned().notNullable()
      table.date('data_inicio',50).defaultTo(null)
      table.date('data_fim',50).defaultTo(null)
      table.string('estado',50).defaultTo(null)
      table.string('observacao',500).defaultTo(null) 
      table.integer('base_anexo_id',11).unsigned().notNullable()
 
      table.integer('base_banco_id',11).unsigned().notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('edu_bolseiros')
  }
}

module.exports = EduBolseirosSchema

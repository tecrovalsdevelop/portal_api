'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EduBolsasSchema extends Schema {
  up () {
    this.create('edu_bolsas', (table) => {
      table.increments()
      table .string('codigo',255).unique().defaultTo(null)
      table.string('nome',255).unique().notNullable()
      table.integer('base_periodo_avaliacao_id',11).unsigned().notNullable()
      table.integer('edu_tipo_bolsa_id',11).unsigned().notNullable()   
      table.string('video',100).defaultTo(null)
      table.integer('estado',11).defaultTo(null)
      table.integer('tipo',11).defaultTo(null)
      table.date('data_abertura').defaultTo(null)
      table.date('data_encerramento').defaultTo(null)
      table.integer('vagas_disponivel',11).defaultTo(null)
      table.string('patrocinador',100).defaultTo(null)
      table.string('titulo',100).defaultTo(null)
      table.text('descricao').defaultTo(null)
      table.text('requisitos').defaultTo(null)
      table.text('processo_seleccao').defaultTo(null)
      table.text('documentos_necessario').defaultTo(null)
      table.text('cronograma').defaultTo(null)
      table.string('observacao',250).defaultTo(null)
      table.integer('nivel_academico',11).defaultTo(null)
      table.integer('curso_especifico',11).defaultTo(null)
      table.integer('notificacao',11).defaultTo(null)
      table.text('notificacao_mensagem').defaultTo(null)
      table.integer('suporte',11).defaultTo(null)
      table.text('suporte_descricao',11).defaultTo(null)
      table.integer('botao',11).defaultTo(null)
      table.string('botao_link',200).defaultTo(null)
      table
         .foreign('edu_tipo_bolsa_id','fk_edu_bolsas_edu_tipo_bolsa_id')
          .references('edu_tipo_bolsas.id').onDelete('CASCADE').onUpdate('CASCADE')
      table
         .foreign('base_periodo_avaliacao_id','fk_base_periodo_avaliacoes')
          .references('base_periodo_avaliacoes.id').onDelete('CASCADE').onUpdate('CASCADE')
      table.timestamps()
    })
  }

  down () {
    this.drop('edu_bolsas')
  }
}

module.exports = EduBolsasSchema

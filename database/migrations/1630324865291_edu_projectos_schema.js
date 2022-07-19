'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EduProjectosSchema extends Schema {
  up () {
    this.create('edu_projectos', (table) => {
      table.increments()
      table.string('nome',255).notNullable()
      table.string('descricao',500).defaultTo(null)
      table.string('titulo',100).defaultTo(null)
      table.string('resumo',200).defaultTo(null)
      table.integer('edu_bolseiro_id',11).unsigned().notNullable()
      table.integer('base_anexo_id',11).unsigned().notNullable()

      table.integer('notificacao',11) 
     
      table.timestamps()
    })
  }

  down () {
    this.drop('edu_projectos')
  }
}

module.exports = EduProjectosSchema

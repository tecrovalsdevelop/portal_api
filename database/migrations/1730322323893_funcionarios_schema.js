'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FuncionariosSchema extends Schema {
  up () {
    this.create('funcionarios', (table) => {
      table.increments()
      table.string('codigo_funcionario')
      table
           .integer('edu_instituicoes_id',10)
           .unsigned().notNullable()
           table
           .integer('base_pessoas_id',10)
           .unsigned().notNullable()

           
      table.timestamps()
    })
  }

  down () {
    this.drop('funcionarios')
  }
}

module.exports = FuncionariosSchema

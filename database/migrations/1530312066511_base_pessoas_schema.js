'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BasePessoasSchema extends Schema {
     up() {
          this.create('base_pessoas', (table) => {
               table.increments()
               table.string('nome', 150).notNullable()

               table.string('ndi', 14).notNullable()
               table.integer('user_id', 10).unsigned().unique()
               table.timestamp('data_nascimento')
               table.integer('base_genero_id', 11)
               table.integer('base_estado_civil_id', 11)
               table.integer('base_anexo_id', 11)
               table.integer('base_municipio_id', 11)

               table.string('endereco', 150)  .defaultTo(null)
               table.datetime('data_emissao').defaultTo(null)
               table.integer('tipo_identificacao', 11)     .defaultTo(null)
                 table.string('mae', 255).defaultTo(null)
               table.string('pai', 255).defaultTo(null)
           
               table.string('telefone_principal', 30)
               table.string('telefone_alternativo', 30)
               table.string('outro_contacto', 50)

               table.timestamps()
          })
     }

     down() {
          this.drop('base_pessoas')
     }
}

module.exports = BasePessoasSchema

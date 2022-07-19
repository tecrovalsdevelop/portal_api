'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BaseMunicipiosSchema extends Schema {
  up () {
    this.create('base_municipios', (table) => {
      table.increments()
      table.string('nome',255).notNullable()
      table.integer('estado',11).defaultTo(0)
      table
           .integer('base_provincia_id',10)
           .unsigned().notNullable()
      table
          .foreign('base_provincia_id','base_municipios_base_provincia_id_foreign')
           .references('base_provincias.id').onDelete('CASCADE').onUpdate('CASCADE')
      table.timestamps()
    })
  }

  down () {
    this.drop('base_municipios')
  }
}

module.exports = BaseMunicipiosSchema

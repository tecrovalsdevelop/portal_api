'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BaseProvinciasSchema extends Schema {
  up () {
    this.create('base_provincias', (table) => {
      table.increments()
      table
          .string('nome',255)
          .unique().notNullable()
      table
          .integer('estado',11)
      table
          .string('highchart_code',255).defaultTo(null)
      table
          .string('provincia_abbr',255).defaultTo(null)
      table
          .integer('base_pais_id',10).unsigned().unique()
      table
          .foreign('base_pais_id','base_provincias_base_pais_id_foreign')
          .references('base_paises.id')
          .onDelete('CASCADE')
          .onUpdate('CASCADE')
      table.timestamps()
    })
  }

  down () {
    this.drop('base_provincias')
  }
}

module.exports = BaseProvinciasSchema

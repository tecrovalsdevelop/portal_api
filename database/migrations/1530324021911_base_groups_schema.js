'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BaseGroupsSchema extends Schema {
  up () {
    this.create('base_groups', (table) => {
      table.increments()
      table.string('nome',255).unique().notNullable()
      table.integer('estado',11).defaultTo(0)
      table.string('acesso',255).defaultTo(null)
      table.timestamps()
    })
  }

  down () {
    this.drop('base_groups')
  }
}

module.exports = BaseGroupsSchema

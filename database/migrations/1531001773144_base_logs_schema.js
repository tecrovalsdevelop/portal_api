'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BaseLogsSchema extends Schema {
  up () {
    this.create('base_logs', (table) => {
      table.increments()
      table.string("ip")
      table.string("user")
      table.string("pagina")
      table.string("accao") 
      table.string("pais")
      table.string("estado")    
      table.string("detalhes")
      table.timestamps()
    })
  }

  down () {
    this.drop('base_logs')
  }
}

module.exports = BaseLogsSchema

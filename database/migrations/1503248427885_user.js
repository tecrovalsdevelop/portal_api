'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.string('username', 80).notNullable().unique()
      table.string('email', 254).notNullable().unique()
      table.string('password', 60).notNullable()
      table.integer('estado',11)
      table.integer('email_enviado',11)
      table.integer('actualizar_candidatura',11)
      table.datetime('token_created_at')
      table.string('token',100)
      table.timestamps()

    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema

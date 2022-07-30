'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class PortalTestemunho extends Model {
    static get connection() {   
        return   config.get('database.mysql.connection.database')
      }
}

module.exports = PortalTestemunho

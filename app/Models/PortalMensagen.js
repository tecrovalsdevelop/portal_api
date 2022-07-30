'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const config = use('Config')
class PortalMensagen extends Model {
    static get connection() {   
        return   config.get('database.mysql.connection.database')
      }
}

module.exports = PortalMensagen

'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
//const Model = use('App/Models/ModelWithoutTimestamps')
const Model = use('Model')
class BaseAnexo extends Model {
itens() {
    return this.hasMany('App/Models/BaseAnexoIten', 'id', 'base_anexo_id')
  }
}

module.exports = BaseAnexo
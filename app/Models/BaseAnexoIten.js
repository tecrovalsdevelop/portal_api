'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class BaseAnexoIten extends Model {
  
  anexo() {
    return this.hasOne('App/Models/BaseAnexo','base_anexo_id','id')
  }
    tipo_anexo() {
        return this.hasOne('App/Models/BaseTipoAnexo','base_tipo_anexo_id','id')
      }
}

module.exports = BaseAnexoIten

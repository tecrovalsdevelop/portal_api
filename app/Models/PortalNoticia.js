'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const config = use('Config')
class PortalNoticia extends Model {
  static get connection() {   
    return   config.get('database.mysql.connection.database')
  }
  static get table(){
    return 'portal_noticias';
  }

  PortalNoticiaItem(){
    return this.hasMany('App/Models/PortalNoticiaIten','id','portal_noticia_id');
}

}

module.exports = PortalNoticia

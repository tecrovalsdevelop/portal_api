'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const config = use('Config')
class PortalNoticiaIten extends Model {
  static get connection() {   
    return   config.get('database.mysql.connection.database')
  }
  static get table(){
    return 'portal_noticia_itens';
  }
/*
  noticia(){
    return this.belongsTo('App/Models/PortalNoticia','noticias_id','id');
}
*/

}

module.exports = PortalNoticiaIten

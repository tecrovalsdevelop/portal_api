'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class NoticiaIten extends Model {
  static get table(){
    return 'noticia_itens';
  }
/*
  noticia(){
    return this.belongsTo('App/Models/Noticia','noticias_id','id');
}
*/

}

module.exports = NoticiaIten

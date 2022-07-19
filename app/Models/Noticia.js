'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Noticia extends Model {

  static get table(){
    return 'noticias';
  }

  noticiaItens(){
    return this.hasMany('App/Models/NoticiaIten','id','noticias_id');
}

}

module.exports = Noticia

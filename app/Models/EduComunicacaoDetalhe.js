'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class EduComunicacaoDetalhe extends Model {

    
    comunicacao(){
        return this.belongsTo('App/Models/EduComunicacoe','edu_comunicacao_id','id');
    }

    baseAnexo(){
        return this.belongsTo('App/Models/BaseAnexo','base_anexo_id','id');
    }
    user() {
        return this.belongsTo('App/Models/User','user_id','id');
      }
}

module.exports = EduComunicacaoDetalhe

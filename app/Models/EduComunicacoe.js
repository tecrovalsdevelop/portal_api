'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class EduComunicacoe extends Model {

    bolseiro(){
        return this.belongsTo('App/Models/EduBolseiro','edu_bolseiro_id','id');
    }

    baseAnexo(){
        return this.belongsTo('App/Models/BaseAnexo','base_anexo_id','id');
    }

    comunicacaoTipo(){
        return this.belongsTo('App/Models/EduComunicacaoTipo','edu_comunicacao_tipo_id','id');
    }

    comunicacaodetalhe(){
        return this.hasMany('App/Models/EduComunicacaoDetalhe','id','edu_comunicacao_id')
       
    }
   
   


}

module.exports = EduComunicacoe

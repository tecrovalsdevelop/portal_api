'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class EduBolseiroRenovacoes extends Model {

    bolseiro(){
        return this.belongsTo('App/Models/EduBolseiro');
    }

    anoFrequencia(){
        return this.belongsTo('App/Models/BaseAnoFrequencia');
    }

    periodoAvaliacao(){
        return this.belongsTo('App/Models/BasePeriodoAvaliacoe','base_periodo_avaliacao_id','id'); 
    }

    estadoRenovacao(){
        return this.belongsTo('App/Models/EduBolseiroRenovacaoEstado'); 
    }

   
    anexo(){
        return this.belongsTo('App/Models/BaseAnexo');
    }

   
}

module.exports = EduBolseiroRenovacoes

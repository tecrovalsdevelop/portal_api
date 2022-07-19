'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Funcionario extends Model {

    
    eduInstituicoes() {
        return this.belongsTo('App/Models/EduInstituicoe', 'edu_instituicoes_id', 'id');
    }

    unidadeOrganica() {
        return this.belongsTo('App/Models/EduUnidadeOrganica', 'edu_unidade_organica_id', 'id');
      }

      user() {
        return this.belongsTo('App/Models/User','user_id','id');
    }

}

module.exports = Funcionario

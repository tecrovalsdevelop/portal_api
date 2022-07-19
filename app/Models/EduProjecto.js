'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class EduProjecto extends Model {

    bolseiro() {
        return this.belongsTo('App/Models/EduBolseiro');
      }

      baseAnexo(){
        return this.belongsTo('App/Models/BaseAnexo','base_anexo_id','id');
    }
}

module.exports = EduProjecto

'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class EduBolseiroInterno extends Model {


    tipoBolsa() {
        return this.belongsTo('App/Models/EduTipoBolsa','edu_tipo_bolsa_id','id');
    }

    eduCurso() {
        return this.belongsTo('App/Models/EduCurso','edu_curso_id','id');
    }

    bolseiro(){
        return this.belongsTo('App/Models/EduBolseiro','edu_bolseiro_id','id');
    }

    grauAcademico(){
        return this.belongsTo('App/Models/BaseGrauAcademico','base_grau_academico_id','id');
    }

    nivelAcademico(){
        return this.belongsTo('App/Models/BaseNivelAcademico','base_nivel_academico_id','id');
    }

}

module.exports = EduBolseiroInterno

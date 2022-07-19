'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class EduBolseiro extends Model {



    eduCurso() {
        return this.belongsTo('App/Models/EduCurso');
    }

    anoFrequencia() {
        return this.belongsTo('App/Models/BaseAnoFrequencia');
    }

    eduInstituicoes() {
        return this.belongsTo('App/Models/EduInstituicoe', 'edu_instituicao_id', 'id');
    }
    instituicao() {
        return this.belongsTo('App/Models/EduInstituicoe', 'edu_instituicao_id', 'id');
    }

    
    pessoa() {
        return this.belongsTo('App/Models/BasePessoa','base_pessoa_id','id');
    }

    periodoAvaliacao() {
        return this.belongsTo('App/Models/BasePeriodoAvaliacoe', 'base_periodo_avaliacao_id', 'id');
    }

    edutipobolseiro() {
        return this.belongsTo('App/Models/EduTipoBolseiro', 'edu_tipo_bolseiro_id', 'id');
    }

    basenivelacademico() {
        return this.belongsTo('App/Models/BaseNivelAcademico', 'base_nivel_academico_id', 'id');
    }

    basegrauacademico() {
        return this.belongsTo('App/Models/BaseGrauAcademico', 'base_grau_academico_id', 'id');
    }
    eduestadobolsa() {
        return this.belongsTo('App/Models/EduEstadoBolsa', 'edu_estado_bolsa_id', 'id');
    }
    edutipobolsa() {
        return this.belongsTo('App/Models/EduTipoBolsa', 'edu_tipo_bolsa_id', 'id');
    }
    baseprovincia() {
        return this.belongsTo('App/Models/BaseProvincia', 'base_provincia_residencia_id', 'id')
    }

    bolseiroRenovacao() {
        return this.hasMany('App/Models/EduBolseiroRenovacoes', 'id', 'edu_bolseiro_id')
    }



}

module.exports = EduBolseiro

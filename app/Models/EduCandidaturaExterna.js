'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const GeneralConstants = use('App/Constants/GeneralConstants')

class EduCandidaturaExterna extends Model {

    user() {
        return this.hasOne('App/Models/User', 'user_id', 'id')
    }


    curso() {
        return this.hasOne('App/Models/BaseCurso', 'edu_curso_id', 'id')
    }
    instituicao() {
        return this.hasOne('App/Models/EduInstituicaoEnsino', 'edu_instituicao_id', 'id')
    }


    cursoFormacaoConcluida() {
        return this.hasOne('App/Models/BaseCurso', 'edu_curso_concluido_id', 'id')
    }

    instituicaoFormacaoConcluida() {
        return this.hasOne('App/Models/EduInstituicaoEnsino', 'edu_instituicao_concluida_id', 'id')
    }
    BasePais() {
        return this.hasOne('App/Models/BasePaises', 'base_pais_id', 'id')
    }

    BaseProvincia() {
        return this.hasOne('App/Models/BaseProvincia', 'base_provincia_id', 'id')
    }
    BaseMunicipio() {
        return this.hasOne('App/Models/BaseMunicipio', 'base_municipio_id', 'id')
    }

    BasePaisResidencia() {
        return this.hasOne('App/Models/BasePaises', 'base_pais_residencia_id', 'id')
    }

    BaseProvinciaResidencia() {
        return this.hasOne('App/Models/BaseProvincia', 'base_provincia_residencia_id', 'id')
    }
    BaseMunicipioResidencia() {
        return this.hasOne('App/Models/BaseMunicipioResidencia', 'base_municipio_residencia_id', 'id')
    }


    anexo() {
        return this.hasOne('App/Models/BaseAnexo', 'base_anexo_id', 'id')
    }

    /*
      estados () {
        return this.hasMany('App/Models/EduCandidaturaEstado','id','edu_candidatura_interna_id')
      }
     */
    bolsa() {
        return this.hasOne('App/Models/EduBolsa', 'edu_bolsa_id', 'id')
    }

    nivelacademico() {
        return this.hasOne('App/Models/BaseNivelAcademico', 'base_nivel_formacao_id', 'id')
    }
    BaseNivelFormacaoConcluida() {
        return this.hasOne('App/Models/BaseNivelAcademico', 'base_nivel_formacao_concluida_id', 'id')
    }


    candidatura_interna() {
        return this.hasOne('App/Models/EduCandidaturaInterna', 'id', 'edu_candidatura_id')
    }
    candidatura_externa() {
        return this.hasOne('App/Models/EduCandidaturaExterna', 'id', 'edu_candidatura_id')
    }

    motivo_exclusao() {
        return this.hasOne('App/Models/EduMotivoExclusoe', 'edu_motivo_exclusoes_id', 'id')
    }

    estado() {
        return this.hasOne('App/Models/EduEstado', 'estado_candidatura', 'id')
    }
    validacao() {
        return this.hasOne('App/Models/User', 'validacao_user', 'id')
    }

}

module.exports = EduCandidaturaExterna

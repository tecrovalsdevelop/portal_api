'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class EduPagamento extends Model {


    EduCandidato() {
        return this.hasOne('App/Models/EduCandidatura', 'edu_candidatura_id', 'id')
    }

    EduOrdemPagamento() {
        return this.hasOne('App/Models/EduOrdemPagamento', 'edu_ordem_pagamento_id', 'id')
    }

    EduReclamacao() {
        return this.hasOne('App/Models/EduReclamacoe', 'edu_reclamacao_id', 'id')
    }

}

module.exports = EduPagamento

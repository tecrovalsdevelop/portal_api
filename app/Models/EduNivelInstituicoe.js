'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class EduNivelInstituicoe extends Model {
    
    cursos () {
        return this.hasMany('App/Models/EduCursos','id','nivel_academico')
      }
}

module.exports = EduNivelInstituicoe

'use strict'

/*
|--------------------------------------------------------------------------
| BaseGeneroSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Database = use('Database')
class BaseGeneroSeeder {
  async run () {
    await Database.table('base_generos').insert([
      { nome:"Masculino" ,sigla:"M"},    
      { nome:"Femenino"  ,sigla:"F" },  

    ])
  }
}

module.exports = BaseGeneroSeeder

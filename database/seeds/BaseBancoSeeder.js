'use strict'

/*
|--------------------------------------------------------------------------
| BaseBancoSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Database = use('Database')
class BaseBancoSeeder {
  async run () {
    await Database.table('base_bancos').insert([
      { nome:"Banco de Poupança e Credito" ,sigla:"BPC"},    
      { nome:"Banco Angolano de Investimento"  ,sigla:"BAI" },  
      { nome:"Banco Muillenium Atlântico"  ,sigla:"Atlantico" },  
    ])
  }
}

module.exports = BaseBancoSeeder

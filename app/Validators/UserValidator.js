'use strict'

const AppValidator = use('App/Validators/AppValidator')
class CriarContaValidator {

  async fails (errorMessages){
    return AppValidator.fails(this, errorMessages);
  }

  get rules () {
    let id = AppValidator.getParam(this, 'id');
    return {
      // validation rules
      username: `unique:comercial_produtos,codigo_barra,id,${id}|required`,
      email: `unique:comercial_produtos,name,id,${id}|required`,
        _id: `required`, 

    }
  }

  get messages (){
    return {
      'name.unique': 'Já existe um  email associado',
      'name.required': 'O nome é obrigatório.', 
    }
  }
}

module.exports = CriarContaValidator 

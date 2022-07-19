'use strict'

const AppValidator = use('App/Validators/AppValidator')
class UserValidator {

  async fails (errorMessages){
    return AppValidator.fails(this, errorMessages);
  }

  get rules () {
    let id = AppValidator.getParam(this, 'id');
    return {
      // validation rules 
        username: `required`, 
        email: `required`, 
        password: `required`, 
    }
  }

  get messages (){
    return { 
      'username.required': 'nome do utilizador obrigatorio.', 
      'email.required': 'Email obrigatorio .', 
      'password.required': 'Palavra Passe obrigatorio.',  
    }
  }
}

module.exports = UserValidator 

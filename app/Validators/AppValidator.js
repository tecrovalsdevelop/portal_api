'use strict'

const ResponseHelper = use('App/Helpers/ResponseHelper')
class AppValidator {

  /*model = null;

  constructor (model){
    this.model = model;
  }*/

  static fails (validator, errorMessages){
    try {
      //console.log(this.model);
      return validator.ctx.response.send(ResponseHelper.getErrorResponse(errorMessages[0].message));
    } catch (error) {
      return validator.ctx.response.send(errorMessages);
    }
  }

  
  static getParam (validator, param = false){
    try {
      return (param) ? validator.ctx.request.all()[param] : validator.ctx.request.all();
    } catch (error) {
      return error;
    }
  }

}

module.exports = AppValidator

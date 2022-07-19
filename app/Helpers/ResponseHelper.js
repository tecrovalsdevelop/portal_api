
class ResponseHelper {

   static getResponse (messageType, message, data){
        return {
          messageType : messageType,
          message : message,
          data : data
        }
}
static getOnlyDataResponse (data) {
    return {
      messageType : 0,
      message : null,
      data : data
    }
  }

  
static getSuccessResponse(message, data) {
    return {
      messageType : 1,
      message : message,
      data : data
    }
  }
  
  static getWarningResponse (message, data) {
    return {
      messageType : 2,
      message : message,
      data : data
    }
  }
  

static getErrorResponse (message) {
  return {
    messageType : 3,
    message : message,
    data : null
  }
}

}

module.exports = ResponseHelper
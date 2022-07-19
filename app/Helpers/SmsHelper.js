
const twilio = require('twilio');

var TeleSignSDK = require('telesignsdk');
const request = require('request');

var XMLHttpRequest = require("xmlhttprequest-ssl").XMLHttpRequest;
var axios = require('axios');
var qs = require('qs');


class SmsHelper {

  //Activar api menos seguro....
  //https://myaccount.google.com/lesssecureapps 
  static smsBulkgate(telefone, mensagem) {
    try {
      var data = JSON.stringify({
        "application_id": "22079",
        "application_token": "JgyTjNlCwvcBaZTXlTSq6WgEVhxRWKsKm0BCraWGhtaALubDUq",
        "number": telefone,
        "text": mensagem,
        "sender_id": "gText",
        "sender_id_value": "INAGBE"
      });
      var xhr = new XMLHttpRequest();
      xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
          console.log(this.responseText);
        }
      });

      xhr.open("POST", "https://portal.bulkgate.com/api/1.0/simple/transactional");
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(data);
      return 1
    } catch (err) {
      console.log(err.message)
      return 0
    }


  }

  static smsBulkgate1(telefone, mensagem) {
    try {

      url = "https://rest-api.d7networks.com/secure/send"

      payload = "{\n\t\"to\":\"244927667663\",\n\t\"content\":\"Welcome to D7 sms , we will help you to talk with your customer effectively\",\n\t\"from\":\"SMSINFO\",\n\t\"dlr\":\"yes\",\n\t\"dlr-method\":\"GET\", \n\t\"dlr-level\":\"2\", \n\t\"dlr-url\":\"https://portal.inagbeangola.com.com\"\n}"
      headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ZmViczU0MTc6dkR1Vk5LOWY='
      }
      
      response = requests.request("POST", url, headers=headers, data = payload)
      
      print(response.text.encode('utf8'))


      return 1
    } catch (err) {
      console.log(err.message)
      return 0
    }


  }

  static smsTelesign(telefone, mensagem) {

    try {

      const options = {
        method: 'POST',
        url: 'https://telesign-telesign-send-sms-verification-code-v1.p.rapidapi.com/sms-verification-code',
        qs: {
          phoneNumber: telefone,
          message: mensagem,
          verifyCode: 'null', appName: 'INAGBE1'
        },
        headers: {
          'x-rapidapi-host': 'telesign-telesign-send-sms-verification-code-v1.p.rapidapi.com',
          'x-rapidapi-key': '8b6dae01eemsh952976373b0a187p128d17jsnaf8b336c5a38',
          useQueryString: true
        }
      };

      request(options, function (error, response, body) {
        if (error) throw new Error(error);

        console.log(body);
      });


      return 1
    } catch (err) {
      console.log(err.message)
      return 0
    }

  }


  static smsTelesign1(telefone, mensagem) {

    try {
      const customerId = "559123E8-6791-4CCC-BA94-320377EA80EC";
      const apiKey = "x0vmtIkBJWcvQlpSgxaViGUmC6o4oXXG3U1rvP52+1L/ZJxPpy8ELvggjl05GpaWkQuvRUqO9qhSP5jRj3u++w==";
      const rest_endpoint = "https://rest-api.telesign.com";
      const timeout = 10 * 1000; // 10 secs

      const client = new TeleSignSDK(customerId,
        apiKey,
        rest_endpoint,
        timeout // optional
        // userAgent
      );

      const phoneNumber = telefone;
      const message = mensagem;
      const messageType = "ARN";

      console.log("## MessagingClient.message ##");

      function messageCallback(error, responseBody) {
        if (error === null) {
          console.log(`Messaging response for messaging phone number: ${phoneNumber}` +
            ` => code: ${responseBody['status']['code']}` +
            `, description: ${responseBody['status']['description']}`);
        } else {
          console.error("Unable to send message. " + error);
        }
      }
      client.sms.message(messageCallback, phoneNumber, message, messageType);
      return 1
    } catch (err) {
      console.log(err.message)
      return 0
    }

  }


  //0,05 $ = 29,6500 AOA para cada mensagem 
  static smsTwillo(telefone, mensagem) {
    /*
        try {
          // const result = await BaseMensagen.query().fetch(); 
          const TWILIO_ACCOUNT_SID = 'ACeea033d2374104a0bcebf92d1686e273'
          const TWILIO_AUTH_TOKEN = "4fec611b78d4837fca92233bc4743ff8"
          var client = new twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
    
          //  console.log(client)
          let result = ""
          for (let i = 0; i < 4; i++) {
            let result2 = await client.messages.create({
              to: telefone,
              from: '+17722131583',
              body: mensagem
            });
            console.log(i)
          }
          console.log(result)
          return ResponseHelper.getOnlyDataResponse(result)
    
        } catch (err) {
          console.log(err.message)
          return ResponseHelper.getErrorResponse("informação não encontrada")
        }
        */
  }


  // 0,0140 = 8,30200 $ por sms 
  static floppysend(telefone, mensagem) {

    try {
      var data = qs.stringify({
        'to': '244927667663',
        'from': 'INAGBE',
        'dcs': '0',
        'text': 'ola rodolfo ',
        'sched': 'Time-IsoFormat'
      });
      var config = {
        method: 'post',
        url: 'https://api.floppy.ai/sms',
        headers: {
          'x-api-key': 'c8547573785',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: data
      };

      axios(config)
        .then(function (response) {
          console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
          console.log(error);
        });
      return 1
    } catch (err) {
      console.log(err.message)
      return 0
    }
  }

}




module.exports = SmsHelper

const nodemailer = require("nodemailer") // Adonis' mail
const Env = use('Env')

class NodeMailerHelper {

  //Activar api menos seguro....
  //https://myaccount.google.com/lesssecureapps


  // MAIL_HOST= "mail.inagbeangola.com",
  //MAIL_PORT=465
  //MAIL_USERNAME=candidatura@inagbeangola.com
  //MAIL_PASSWORD=Oay?Q+30tNd[



  static enviarEmailContaCriadaCandidato(user, data_all) {
    //const user_find = await User.findByOrFail('email', username)
 
    let mensagem = `
    
    Ola,   <h3>${data_all.username}       </h3>
    
     
    Bem Vindo ao Instituto Nacional de Gestão de Bolsas de Estudo. <br> 
    a tua conta foi criada com sucesso 

    <h3>    Pode fazer o login com os seguintes dados:    </h3>
   
    Link: https://candidatura.inagbeangola.com
    <br> <br> 
    <strong>  Email : </strong> ${data_all.email}    <br> 
    <strong>  Password : </strong>  ${data_all.password}

    <h3> Detalhes da conta:      </h3>
   
    <strong>  Nome : </strong> ${data_all.username}    <br>
    <strong>  Email : </strong> ${data_all.email}    <br>
    <strong>  Telefone : </strong>  ${data_all.telefone}    <br>
    <strong>  Data  : </strong>  ${user.created_at}
     
  
    <br><br>
     siga-nos nas redes sociais e mantenha-se actualizado(a) sobre as  <strong>  bolsas de estudos interna e externa   </strong> <br><br> 
  
`


    // all emails are catched by ethereal.email
    let transporter = nodemailer.createTransport({
      host: Env.get('MAIL_HOST', 'smtp.gmail.com'),
      port: Env.get('MAIL_PORT', '465'),
      auth: {
        user: Env.get('MAIL_USERNAME', 'inagbe.candidatura@gmail.com'),
        pass: Env.get('MAIL_PASSWORD', 'inagbe123angola')
      }
    });
    transporter.sendMail({
      from: Env.get('MAIL_USERNAME', 'inagbe.candidatura@gmail.com'),
      to: user.email,
      subject: "Conta criada com sucesso - INAGBE ANGOLA  ",
      text: " ",

      html: mensagem
    }).then(info => {
      console.log(info);
    }).catch(err => {
      console.log(err);
    });

    console.log("--------------------------------------------------------------------")
  }



  static enviarEmailContaCriada(user, data_all) {
    //const user_find = await User.findByOrFail('email', username)
 
    let mensagem = `
    
    Ola,   <h3>${data_all.username}       </h3>
    
     
    Bem Vindo ao Instituto Nacional de Gestão de Bolsas de Estudo. <br> 
    a tua conta foi criada com sucesso 

    <h3>    Pode fazer o login com os seguintes dados:    </h3>
   
    Link: https://bolseiro.inagbeangola.com
    <br> <br> 
    <strong>  Email : </strong> ${data_all.email}    <br> 
    <strong>  Password : </strong>  ${data_all.password}

    <h3> Detalhes da conta:      </h3>
   
    <strong>  Nome : </strong> ${data_all.username}    <br>
    <strong>  Email : </strong> ${data_all.email}    <br>
    <strong>  Telefone : </strong>  ${data_all.telefone}    <br>
    <strong>  Data  : </strong>  ${user.created_at}
     
  
    <br><br>
     siga-nos nas redes sociais e mantenha-se actualizado(a) sobre as  <strong>  bolsas de estudos interna e externa   </strong> <br><br> 
  
`


    // all emails are catched by ethereal.email
    let transporter = nodemailer.createTransport({
      host: Env.get('MAIL_HOST', 'smtp.gmail.com'),
      port: Env.get('MAIL_PORT', '465'),
      auth: {
        user: Env.get('MAIL_USERNAME', 'inagbe.candidatura@gmail.com'),
        pass: Env.get('MAIL_PASSWORD', 'inagbe123angola')
      }
    });
    transporter.sendMail({
      from: Env.get('MAIL_USERNAME', 'inagbe.candidatura@gmail.com'),
      to: user.email,
      subject: "Conta criada com sucesso - INAGBE ANGOLA  ",
      text: " ",

      html: mensagem
    }).then(info => {
      console.log(info);
    }).catch(err => {
      console.log(err);
    });

    console.log("--------------------------------------------------------------------")
  }


  static enviarEmailRecuperacaoSenha(user) {


    let mensagem = ` Ola,   <h3>${user.username}  </h3>
    
 
     Vamos ajudar a recuperar a sua conta <br> demora apenas alguns segundos
     <br><br> o seu código de recuperação de senha é : <strong> ${user.token} </strong> <br><br> válido por 24 horas`


    let transporter = nodemailer.createTransport({
      host: Env.get('MAIL_HOST', 'smtp.gmail.com'),
      port: Env.get('MAIL_PORT', '465'),
      auth: {
        user: Env.get('MAIL_USERNAME', 'inagbe.candidatura@gmail.com'),
        pass: Env.get('MAIL_PASSWORD', 'inagbe123angola')
      }
    });
    transporter.sendMail({
      from: Env.get('MAIL_USERNAME', 'inagbe.candidatura@gmail.com'),
      to: user.email,
      subject: "Email para recuperação de Senha - INAGBE ANGOLA  ",
      text: " ",

      html: mensagem,
    }).then(info => {
      console.log(info);
    }).catch(err => {
      console.log(err);
    });

    console.log("--------------------------------------------------------------------")
  }

  async enviarEmailLogin(user) {
    //const user_find = await User.findByOrFail('email', username)

  }




}




module.exports = NodeMailerHelper

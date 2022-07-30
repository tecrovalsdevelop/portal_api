const nodemailer = require("nodemailer") // Adonis' mail

class MailerHelper {

    //Activar api menos seguro....
    //https://myaccount.google.com/lesssecureapps

    static enviarEmailContaCriada(user) {
        //const user_find = await User.findByOrFail('email', username) 
        // all emails are catched by ethereal.email
        let transporter = nodemailer.createTransport({
            //  host:  "smtp.gmail.com",
            host: "smtp.hostinger.com",
            port: 465,
            auth: {
                user: 'roval@tecroval.com',
                pass: '001341358La036'
            }
        });
        transporter.sendMail({
            from: 'roval@tecroval.com',
            to: user.email,
            subject: "Conta Criada com sucesso - PORTAL   ",
            text: " ",

            html: " Ola,<br><br> Bem Vindo ao nosso portal  . <br> a tua conta foi criada com sucesso  <br><br> siga-nos nas redes sociais e mantenha-se actualizado(a) sobre as  <strong>  software de facturação e muito mais    </strong> <br><br>  "
        }).then(info => {
            //console.log(info);
        }).catch(err => {
            //console.log(err);
        });

        //console.log("--------------------------------------------------------------------")
    }


    static enviarEmailRecuperacaoSenha(user) {


        //console.log("enviar email .............")
        let transporter = nodemailer.createTransport({
          host: Env.get('MAIL_HOST'),
          port: Env.get('MAIL_PORT'),
          auth: {
              user: Env.get('MAIL_EMAIL'),
              pass: Env.get('MAIL_PASSWORD')
          }
        });
        transporter.sendMail({
            from: 'roval@tecroval.com',
            to: user.email,
            subject: "Email para recuperação de Senha - ROVAL ERP  ",
            text: " ",

            html: " Ola <strong> "+ user.name+" </strong> ,<br><br> Vamos ajudar a recuperar a sua conta <br> demora apenas alguns segundos <br><br><strong> o seu codigo de recuperação de senha é :  " + user.token + " </strong> <br> <br>  válido por 24 horas    <br> <br> o seu Login de acesso é:  <strong> " + user.username + "</strong>    <br>Se você não fez essa solicitação,entre em contacto com o nosso suporte, email: suporte@tecroval.com, whatsapp: +244 931 633 196. <br>  <br>  <strong>  TECROVAL SOLUTIONS <br> Simplicidade eficiência e inovação</strong>  "
        }).then(info => {
            //console.log(info);
        }).catch(err => {
            //console.log(err);
        });

        //console.log("--------------------------------------------------------------------")
    }

    async enviarEmailLogin(user) {
        //const user_find = await User.findByOrFail('email', username)

    }




}




module.exports = MailerHelper
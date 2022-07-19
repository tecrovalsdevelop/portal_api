const Mail = use('Mail') // Adonis' mail

class EmailHelper {

  async enviarEmailNovaConta(user) {
    /*
        await Mail.send('emails.welcome', user.toJSON(), (message) => {
          message
            .to(user.email)
            .from('rodolfomsfrancisco@gmail.com')
            .subject('Conta de Email Criada ' + user.email+"  " )
        })
        */
  }

  static enviarEmailRecuperacaoSenha(user) {
    //const user_find = await User.findByOrFail('email', username)

    console.log("a enviar email....")
   
    Mail.send('emails.recover', user.toJSON() , (message) => {
      message
        .from('candidatura@inagbeangola.com')
        .to(user.email)
    }) 
    console.log("email enviado ....")
  }

  async enviarEmailLogin(user) {
    //const user_find = await User.findByOrFail('email', username)

    console.log("a enviar email....")

    // persisting data (saving)
    // await user.save()
    console.log(user)
    console.log(user.email)
    await Mail.send('emails.recover', { user, token }, (message) => {
      message
        .from('candidatura@inagbeangola.com')
        .to(user.email)
    }) 
    console.log("email enviado ....")
  }
}


module.exports = EmailHelper

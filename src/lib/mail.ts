import nodemailer from 'nodemailer'

export async function getMailClient() {
  const account: nodemailer.TestAccount = await nodemailer.createTestAccount()

  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: account.user,
      pass: account.pass,
    },
  })

  return transporter
}

export async function sendEmail({html, subject, to}: { subject:string, html:string, to: { name:string, address:string } }) {
  const mail = await getMailClient()

  const message = await mail.sendMail({
    from: { name: 'Equipe teste', address: 'oi@exemple.com' },
    to,
    subject,
    html,
  })

  return message
}

// const mail = {
//   getAccount: async () => await nodemailer.createTestAccount(),
//   send: async () => {
//     const email = mail.getAccount()
//   }
// }
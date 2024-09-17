import nodemailer from 'nodemailer';

const sendForgotPasswordEmail = async (userEmail: string, forgotPasswordLink: string) => {
  const { EMAIL_USER, EMAIL_APP_PASSWORD, EMAIL_SERVICE } = process.env;

  const transporter = nodemailer.createTransport({
    service: EMAIL_SERVICE,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_APP_PASSWORD
    },
  });

  const mailOptions = {
    from: EMAIL_USER,
    to: userEmail,
    subject: 'myfavs - Recadastrar senha',
    html: `
<table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #212121; padding: 30px;">
  <tr>
    <td align="center">
      <img src="https://iili.io/dhTLmsn.png" alt="myfavs" width="177" height="161" style="display: block; margin-bottom: 15px;">
      <p style="font-family: Arial, Helvetica, sans-serif; font-size: 18px; color: #ccc; margin-bottom: 15px;">Por favor, clique no link abaixo para recadastrar a sua senha:</p>
      <a href="${forgotPasswordLink}" style="font-family: Arial, Helvetica, sans-serif; font-size: 18px; font-weight: bold; color: #ccc; text-decoration: none;">RECADASTRAR SENHA</a>
    </td>
  </tr>
</table>
`
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('E-mail enviado:', info.messageId);
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
  }
};

export default sendForgotPasswordEmail;

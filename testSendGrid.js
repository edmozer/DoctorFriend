import dotenv from 'dotenv';
dotenv.config();
// testSendGrid.js
// Teste simples de envio de e-mail com SendGrid

import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// sgMail.setDataResidency('eu'); // Descomente se usar subuser EU

const msg = {
  to: 'cavalcante.edmozer@gmail.com', // Seu e-mail real
  from: 'cavalcante.edmozer@gmail.com', // Remetente verificado no SendGrid
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};

sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent');
  })
  .catch((error) => {
    console.error(error);
  });

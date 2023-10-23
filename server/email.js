import {} from 'dotenv/config'
import sgMail from '@sendgrid/mail'
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

export default function sendEmail(name, phone){
    const msg = {
      to: process.env.TO,
      from: {
        name: process.env.NAME,
        email: process.env.FROM_EMAIL
    },
      subject: `Request for call back from ${name}`,
      text: `Recieved a callback request from, \nName: ${name}, \nphone number: ${phone}`,
      html: `<div>
        <h2>Recieved a callback request</h2>
        <p><strong>Name: </strong> ${name} </p>
        <p><strong>Phone: </strong> ${phone} </p>
      </div>`,
    }
    sgMail
      .send(msg)
      .then((response) => {
        console.log(response[0].statusCode)
        console.log(response[0].headers)
      })
      .catch((error) => {
        throw (error)
      })
}


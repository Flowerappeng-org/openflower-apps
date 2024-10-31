const { Kafka } = require('kafkajs')
const config = require('./config')
const nodemailer = require('nodemailer');

const kafka = new Kafka({
  clientId: config.kafka.CLIENTID,
  brokers: config.kafka.BROKERS
})

const topic = config.kafka.TOPIC
const consumer = kafka.consumer({
  groupId: config.kafka.GROUPID
})
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // use SSL
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },  
  tls: {
    ciphers:'SSLv3'
  }
});
const run = async () => {
  try {
    await consumer.connect()
    await consumer.subscribe({ topic, fromBeginning: true })
    await consumer.run({
      eachMessage: async ({ message }) => {
          const jsonObj = JSON.parse(message.value);
          send(jsonObj)
      }
    })
  } catch (error) {
    console.log('err=', error)
  }
}

function send(jsonObj) {
  const campaign = jsonObj.Campaign;
  const user = jsonObj.User;
  
  const mailOptions = {
    from: `${campaign.from}`,
    to: `${user}`,
    subject: `${campaign.subject}`,
    text: `${campaign.content}`
  };
  
// Send the email
transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log('Error:', error);
  } else {
    console.log('Campaign email sent:', info.response);
  }
  });
  console.log(`Send campaign to msg ${user} received`) 
}

run().catch(e => console.error(`[campaign-send-email/consumer] ${e.message}`, e))

const errorTypes = ['unhandledRejection', 'uncaughtException']
const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2']

errorTypes.map(type => {
  process.on(type, async e => {
    try {
      console.log(`process.on ${type}`)
      console.error(e)
      await consumer.disconnect()
      process.exit(0)
    } catch (_) {
      process.exit(1)
    }
  })
})

signalTraps.map(type => {
  process.once(type, async () => {
    try {
      await consumer.disconnect()
    } finally {
      process.kill(process.pid, type)
    }
  })
})

module.exports = {
  send: send
}
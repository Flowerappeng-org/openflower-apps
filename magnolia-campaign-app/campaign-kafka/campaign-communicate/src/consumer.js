const { Kafka } = require('kafkajs')
const config = require('./config')
const { kafkaclient } = require("./client");

const kafka = new Kafka({
  clientId: config.kafka.CLIENTID,
  brokers: config.kafka.BROKERS
})

const topic = config.kafka.TOPIC
const consumer = kafka.consumer({
  groupId: config.kafka.GROUPID
})

const run = async () => {
  await consumer.connect()
  await consumer.subscribe({ topic, fromBeginning: true })
  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        const jsonObj = JSON.parse(message.value)
          
        send(jsonObj)
      } catch (error) {
        console.log('err=', error)
      }
    }
  })
}

async function send(jsonObj) {
  const producer = kafkaclient.producer();
  const campaign = jsonObj.Campaign;
  const campaignEmails = jsonObj.CampaignUsers;
  // TODO implement Kafka schema registry to avoid brittle json contracts
  // for now we get around this by lower casing the json object keys as they could be different casing  
  const newCampaign = lowercaseKeys(campaign);
  const newMessages = [];
  // TODO batch produce to add the audit msg 
  // store fact of how many emails sent
  campaignEmails.forEach(element => {
    var newMessageItem = 
    {
      topic: process.KAFKA_TOPIC_SEND_CAMPAIGN_EMAIL ?? "send-campaign-email",
      messages: [
        {
          key: newCampaign.campaignid.toString(),
          value: JSON.stringify(
            { 
              Campaign: newCampaign,
              User: element
            }),
        },
      ],
    }
    newMessages.push(newMessageItem);
  });

  await producer.connect();
  await producer.sendBatch({topicMessages: newMessages});
}

run().catch(e => console.error(`[example/consumer] ${e.message}`, e))

const errorTypes = ['unhandledRejection', 'uncaughtException']
const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2']

/**
 * Lowercase all top-level keys of the given `object` to lowercase.
 *
 * @returns {Object}
 */
function lowercaseKeys(obj) {  
  if (!isObject(obj)) {
    throw new Error(`You must provide an object to "lowercaseKeys". Received "${typeof obj}"`)
  }

  return Object
    .entries(obj)
    .reduce((carry, [key, value]) => {
      carry[key.toLowerCase()] = value;

      return carry;
    }, {});
}

/**
 * Determine whether the given `value` is an object.
 *
 * @param {*} value
 *
 * @returns {value is object}
 */
function isObject (value) {  
  return Object.prototype.toString.call(value) === '[object Object]'
}

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

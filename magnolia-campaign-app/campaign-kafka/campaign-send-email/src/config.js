module.exports = {
  kafka: {
    TOPIC: 'send-campaign-email',
    BROKERS: [process.env.KAFKA_HOST],
    GROUPID: 'send-campaign-email-consumer-group',
    CLIENTID: 'send-campaign-email-client'
  }
}

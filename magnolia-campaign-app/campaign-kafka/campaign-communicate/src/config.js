module.exports = {
  kafka: {
    TOPIC: 'campaign-communicate',
    BROKERS: [process.env.KAFKA_HOST],
    GROUPID: 'campaign-communicate-consumer-group',
    CLIENTID: 'campaign-communicate-client'
  }
}

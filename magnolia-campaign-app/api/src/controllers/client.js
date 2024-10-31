const { Kafka } = require("kafkajs");

exports.kafka = new Kafka({
  clientId: "newcampaign",
  brokers: [process.env.KAFKA_HOST],
});
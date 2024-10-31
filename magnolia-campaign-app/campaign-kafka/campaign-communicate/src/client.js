const { Kafka } = require("kafkajs");

exports.kafkaclient = new Kafka({
  clientId: "campaignapp",
  brokers: [process.env.KAFKA_HOST],
});
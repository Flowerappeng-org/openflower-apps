# Campaign Communicate
A kafka consumer for OpenFlower Campaign application using Kafka, Node.js and Docker. 

#### Table of Content
* About Kafka Streaming
* Use case - Campaign communicate batch produce multiple messages for each email to be sent
* Build local Kafka environemnt using Docker Compose
* Run the application
* Production

## About Kafka Streaming

Below is the discription from the official Kafka web site.

Apache Kafka® is a distributed streaming platform.

It publishes and subscribes to streams of records, similar to a message queue or enterprise messaging system

Kafka is generally used for two broad classes of applications:

Building real-time streaming data pipelines that reliably get data between systems or applications
Building real-time streaming applications that transform or react to the streams of data

To learn more about Kafka, please visit [Kafka official web site](https://kafka.apache.org/)

Kafka is build in Java, it does provide APIs from many other lanhuages.

* [KafkaJS](https://www.npmjs.com/package/kafkajs) 

I use KafkaJs in this application. 

## Use case - consume messages on the campaign-send-email topic. This topic contains a payload with a campaign object and user object. 
This consumer will consume a message for campaign-communicate topic, and then produce a campaign-send-email message to the campaign-send-email topic for each subscriber. In the future this consumer will batch prooduce audit messages to have a record of how many emails were relayed.

## Configuration

During development its important to note that there is a env variable in `package.json` consumer command:

```
package.json
....
"consumer": "export KAFKA_HOST=localhost:9094 && node ./src/consumer.js",
```

## Build local Kafka environemnt using Docker Compose

`See docker-compose-kafka.yaml`

To bring up Kafka containers, run the command below from terminal

`docker-compose -f docker-compose-kafka.yaml up -d`

To check if containers are up and running:

`docker container ls`
  
# Running 

## Environment Variables
- `KAFKA_HOST - 'kafka:9092'`
- Run `npm run consumer` start consumer 

# Production
  
## Build Docker Image
`docker build -t flowerappengorg/apps-campaigncommunicate-consumer:0.1.0 .`

## Push Docker Image
`docker push flowerappengorg/apps-campaigncommunicate-consumer:0.1.0`

## Run Docker Image
`docker run -d flowerappengorg/apps-campaigncommunicate-consumer:0.1.0 .`

## Restart Single Docker Container only
`docker compose -f kafka-compose.yaml restart campaign-send-email-consumer`

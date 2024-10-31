# Campaign Send Email
A kafka consumer for OpenFlower Campaign application using Kafka, Node.js and Docker. 

#### Table of Content
* About Kafka Streaming
* Use case - relay email for Magnolia campaigns
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
This consumer will consume a message for campaign-send-email topic, and then relay an email based on campaign and user object. 

## Configuration

Durning development you can enable a SMTP server by updating `package.json` consumer command:

```
package.json
....
"consumer": "export SMTP_HOST='YOUR_MAIL_SERVER' && export SMTP_USERNAME='your_username' && export SMTP_PASSWORD='password' && export SMTP_PORT='587' && export KAFKA_HOST=localhost:9094 && node ./src/consumer.js",
```

## Build local Kafka environemnt using Docker Compose

`See docker-compose-kafka.yaml`

To bring up Kafka containers, run the command below from terminal

`docker-compose -f docker-compose-kafka.yaml up -d`

To check if containers are up and running:

`docker container ls`
  
# Running 

## Environment Variables
- `KAFKA_HOST - 'kafka:9092', SMTP_HOST, SMTP_USERNAME, SMTP_PASSWORD, SMTP_PORT`
- Run `npm run consumer` start consumer 

# Production
  
## Build Docker Image
`docker build -t flowerappengorg/apps-campaign-sendemail-consumer:0.1.0 .`

## Push Docker Image
`docker push flowerappengorg/apps-campaign-sendemail-consumer:0.1.0`

## Run Docker Image
`docker run -d flowerappengorg/apps-campaign-sendemail-consumer:0.1.0 .`

## Restart Single Docker Container only
`docker compose -f kafka-compose.yaml restart campaign-send-email-consumer`
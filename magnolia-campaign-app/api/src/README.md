# Campaign API
A Campaign REST API for OpenFlower Campaign application using Node.js and Docker. 

#### Table of Content
* Use case - Campaign API endpoints for Subscribe, Unsubscribe, Execute Campaign. 
* Configuration
* Build local environemnt using Docker Compose
* Run the application
* Production
* Security

## Use case - Campaign API endpoints for Subscribe, Unsubscribe, Execute Campaign. 
This API allows for Subscribe, Unsubscribe, Execute Campaign. 

# Configuration

## Environment Variables
- PG_REST_URL, KAFKA_HOST, PORT, CORS_HOST, KAFKA_TOPIC

## Build local environemnt using Docker Compose

`See docker-compose-kafka.yaml`

To bring up Kafka containers, run the command below from terminal

`docker-compose -f docker-compose-kafka.yaml up -d`

To check if containers are up and running:

`docker container ls` 

# Running 
` npm install && npm run dev`

# Production
 
# Build Docker Image
`docker build -t flowerappengorg/apps-campaign-api:0.3.0 .`

# Push Docker Image
`docker push flowerappengorg/apps-campaign-api:0.3.0`

# Security
This REST API intentionally has no security as it sits behind a API Gateway which handles security concerns.

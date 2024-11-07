# apisix Overview
This is here until apisix is integrated into the OpenFlower product.

# Get the code

git clone -b release/apisix-2.9 https://github.com/apache/apisix-docker.git

# Make a couple config changes for security reasons
Update the `apisix_conf/config.yaml` api key
Change the `dashboard_conf/config.yaml` default admin password

key to use the api: Generate a UUID for this. 
key to use the apix admin api: Generate a UUID for this. 

# Figure out your host for the api gateway
https://somehost/campaign-pgrest/
https://somehost/campaignapi/

# Create API key for a consumer
curl http://localhost:9080/apisix/admin/consumers \
-H "X-API-KEY: someapisixdminkey" -X PUT -d '
{
    "username": "somesvcaccount",
    "plugins": {
        "key-auth": {
            "key": "somekey"
        }
    }
}'

# Campaign api route
curl -i http://127.0.0.1:9080/apisix/admin/routes/1 -H 'X-API-KEY: someapisixadminkey' -X PUT -d '
{
    "uri": "/campaignapi/*",
    "plugins": {
        "proxy-rewrite": {
            "regex_uri": ["^/campaignapi/(.*)","/$1"]
        }
    },
    "upstream": {
        "type": "roundrobin",
        "nodes": {
            "somehost:1232": 1
        }
    }
}'

# Campaign pgrest api route
curl -i http://127.0.0.1:9080/apisix/admin/routes/2 -H 'X-API-KEY: someapisixadminkey' -X PUT -d '
{
    "uri": "/campaign-pgrest/*",
    "plugins": {
        "proxy-rewrite": {
            "regex_uri": ["^/campaign-pgrest/(.*)","/$1"]
        }
    },
    "upstream": {
        "type": "roundrobin",
        "nodes": {
            "somehost:12310": 1
        }
    }
}'

# Setup nginx to proxy pass into some host

# Setup a tls cert for some host
sudo certbot --nginx -d somehost

# Test
curl --location 'https://somehost/campaignapi/subscribe' \
--header 'Content-Type: application/json' \
--header 'apikey: somekey' \
--data-raw '{
    "CampaignId": "3",
    "User": "john.albert.haigh@gmail.com"
}'

# Reference
https://apisix.apache.org/docs/docker/example/
https://boburadvocate.hashnode.dev/manage-net-microservices-apis-with-apache-apisix-api-gateway
https://blog.frankel.ch/fixed-routes-apisix/
https://github.com/apache/apisix/issues/6381
https://github.com/apache/apisix/blob/master/docs/en/latest/FAQ.md#how-to-strip-route-prefix-for-path-matching
https://github.com/apache/apisix/blob/master/docs/en/latest/FAQ.md#how-to-strip-route-prefix-for-path-matching
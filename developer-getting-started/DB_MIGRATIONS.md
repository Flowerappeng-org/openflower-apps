# Database Schema Migrations
## Establish the database schema by importing into a schema.hcl file
atlas schema inspect -u "postgres://postgres:postgres@localhost:5432/PlatformAppsSaas?sslmode=disable"

## Make some schema changes by changing schema.hcl
- Go to `schema.hcl` to add a table

## Apply the changes to the database
atlas schema apply \
  --url "postgres://postgres:postgres@localhost:5432/PlatformAppsSaas?sslmode=disable" \
  --to "file://schema.hcl"

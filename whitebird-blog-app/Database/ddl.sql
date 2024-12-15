-- Database per Tenant Architecture
CREATE TABLE public.blogpost (
	BlogPostId serial4 NOT NULL,
	Title text NOT NULL,
	Description text NOT NULL,
	"Content" varchar NULL,
	"Author" varchar NULL,
	BlogCategoryId serial4 NOT NULL, 
	PostedDate date NULL,
	CONSTRAINT blogpost_pkey PRIMARY KEY (BlogPostId)
);

CREATE TABLE public.blogcategory (
    BlogCategoryId SERIAL PRIMARY KEY,
	Title text NOT NULL,
	CONSTRAINT blogcategory_pkey PRIMARY KEY (BlogCategoryId)
);

-- Shared Database, Shared Schema Multi-Tenant Architecture
CREATE TABLE api.blogpost (
	BlogPostId uuid DEFAULT gen_random_uuid() NOT NULL,
	tenant name DEFAULT CURRENT_USER COLLATE "C" NOT NULL,
	Title text NOT NULL,
	Description text NOT NULL,
	"Content" varchar NULL,
	"Author" varchar NULL,
	BlogCategoryId serial4 NOT NULL, 
	PostedDate date NULL,
	CONSTRAINT blogposttest_pkey PRIMARY KEY (BlogPostId)
);

ALTER TABLE api.blogpost ENABLE ROW LEVEL SECURITY;      

CREATE POLICY blogpost_policy ON api.blogpost
  USING (tenant = current_user)
  WITH CHECK (tenant = current_user);


CREATE TABLE api.blogcategory (
    BlogCategoryId uuid DEFAULT gen_random_uuid() NOT NULL,
	tenant name DEFAULT CURRENT_USER COLLATE "C" NOT NULL,
	Title text NOT NULL,
	CONSTRAINT blogcategorytest_pkey PRIMARY KEY (BlogCategoryId)
);

ALTER TABLE api.blogcategory ENABLE ROW LEVEL SECURITY;      

CREATE POLICY blogcategory_policy ON api.blogcategory
  USING (tenant = current_user)
  WITH CHECK (tenant = current_user);  


  GRANT
  SELECT
, INSERT
, UPDATE
, DELETE
ON api.blogcategory TO webuser;


  GRANT
  SELECT
, INSERT
, UPDATE
, DELETE
ON api.blogpost TO webuser;
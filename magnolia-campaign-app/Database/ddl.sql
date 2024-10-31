CREATE TABLE public.campaign (
	CampaignId serial4 NOT NULL,
	Title text NOT NULL,
	Description text NOT NULL,
	"Content" varchar NULL,
	"From" varchar NULL,
	Subject varchar NULL,
	ExecuteTime varchar NULL,
	OccurrenceFrequency varchar NULL, -- (Daily, Weekly, Monthly)
	StartDate date NULL,
	EndDate date NULL,
	CONSTRAINT campaign_pkey PRIMARY KEY (campaignid)
);

CREATE TABLE public.campaignuser (
    CampaignUserId SERIAL PRIMARY KEY,
	CampaignId serial4 NOT NULL,
	UserCommAddress varchar NULL
);

CREATE TABLE public.campaignuseraudit (
	CampaignUserId serial4 NOT NULL,
	CampaignId serial4 NOT NULL,
	UserCommAddress varchar NULL,
	SentDate date NULL,
	CONSTRAINT campaignuseraudit_pkey PRIMARY KEY (campaignuserid)
);

CREATE TABLE public.videopost (
	VideoPostId serial4 NOT NULL,
	Title text NOT NULL,
	Description text NOT NULL,
	VideoUrl varchar NULL,
	Author varchar NULL,
	PostedDate date NULL,
	CONSTRAINT videopost_pkey PRIMARY KEY (VideoPostId)
);
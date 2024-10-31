const asyncHandler = require("../middlewares/asyncHandler");
const ErrorResponse = require("../util/errorResponse");
const { kafka } = require("./client");

module.exports.unsubscribe = asyncHandler(async (req, res, next) => {  
  const { CampaignId, User } = req.body;
  console.log('----------------------------------------------------------------------------------------------')
  console.log('[unsubscribe]', CampaignId, User) 
  console.log('----------------------------------------------------------------------------------------------')

  if (!CampaignId) {
    return next(new ErrorResponse(`Could not complete the request`, 404));
  }

  if (!User) {
    return next(new ErrorResponse(`Could not complete the request`, 404));
  }
  try {
    const pgrestUrlGetCampaignUsersByIdAndUser = process.env.PG_REST_URL ?? "http://flower-samples-api.bitwebservices.com/";
    const config1 = {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
      },
    }
    const userExistsInCampaign = await 
    fetch(pgrestUrlGetCampaignUsersByIdAndUser + 'campaignuser?campaignid=eq.' + 
      CampaignId + '&usercommaddress=eq.' + User, config1);

    let userExistsResponse = await userExistsInCampaign.json();
    if(userExistsResponse.length > 0){
      return next(new ErrorResponse(`User is already subscribed to this campaign`, 400));
    }
    
    const pgrestUrlGetCampaignById = process.env.PG_REST_URL ?? "http://flower-samples-api.bitwebservices.com/";
    let data =  { 
      campaignid: CampaignId,
      usercommaddress : User
    }
    const config = {
      method: 'POST',
      headers: {
          //'Accept': '*/*',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    }
    const responseCampaign = await fetch(pgrestUrlGetCampaignById + 'campaignuser', config);
    res.status(201).json(data);
  } catch (error) {
    console.log('[error]', error)
    return next(new ErrorResponse(`Unhandled exception` + error, 400));
  }
});

module.exports.subscribe = asyncHandler(async (req, res, next) => {  
  const { CampaignId, User } = req.body;
  console.log('----------------------------------------------------------------------------------------------')
  console.log('[subscribe', CampaignId, User) 
  console.log('----------------------------------------------------------------------------------------------')

  if (!CampaignId) {
    return next(new ErrorResponse(`Could not complete the request`, 404));
  }

  if (!User) {
    return next(new ErrorResponse(`Could not complete the request`, 404));
  }
  try {
    const pgrestUrlGetCampaignUsersByIdAndUser = process.env.PG_REST_URL ?? "http://flower-samples-api.bitwebservices.com/";
    const config1 = {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
      },
    }
    const userExistsInCampaign = await 
    fetch(pgrestUrlGetCampaignUsersByIdAndUser + 'campaignuser?campaignid=eq.' + 
      CampaignId + '&usercommaddress=eq.' + User, config1);

    let userExistsResponse = await userExistsInCampaign.json();
    if(userExistsResponse.length > 0){
      return next(new ErrorResponse(`User is already subscribed to this campaign`, 400));
    }
    
    const pgrestUrlGetCampaignById = process.env.PG_REST_URL ?? "http://flower-samples-api.bitwebservices.com/";
    let data =  { 
      campaignid: CampaignId,
      usercommaddress : User
    }
    const config = {
      method: 'POST',
      headers: {
          //'Accept': '*/*',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    }
    const responseCampaign = await fetch(pgrestUrlGetCampaignById + 'campaignuser', config);
    res.status(201).json(data);
  } catch (error) {
    console.log('[error]', error)
    return next(new ErrorResponse(`Unhandled exception` + error, 400));
  }
});

module.exports.execute = asyncHandler(async (req, res, next) => {
  const { CampaignId } = req.body;
  console.log('----------------------------------------------------------------------------------------------')
  console.log('[execute]', req.body, CampaignId) 
  console.log('----------------------------------------------------------------------------------------------')

  if (!CampaignId) {
    return next(new ErrorResponse(`Could not complete the request`, 404));
  }

  const pgrestUrlGetCampaignById = process.env.PG_REST_URL ?? "http://flower-samples-api.bitwebservices.com/";
  const config = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    },
  }
  const responseCampaign = await fetch(pgrestUrlGetCampaignById + 'campaign?campaignid=eq.' + CampaignId, config);
  let campaign = await responseCampaign.json();
  const pgrestUrlGetCampaignUsersById = process.env.PG_REST_URL ?? "http://flower-samples-api.bitwebservices.com/" ;
  const responseCampaignUsers = await fetch(pgrestUrlGetCampaignUsersById + 'campaignuser?campaignid=eq.' + CampaignId, config);
  let campaignUsers = await responseCampaignUsers.json();
  
  if( (!campaign || !campaignUsers ) ) {
    return next(new ErrorResponse(`Could not complete the request, no campaign users or no campaign`, 404));
  }

  if(campaignUsers.length <= 0) {
    return next(new ErrorResponse(`Could not complete the request, no campaign users`, 404));
  }

  let newCampaignUsers = campaignUsers.map(ci => {return ci.usercommaddress} );
  let messageCampaignSend = { "Campaign": campaign[0], CampaignUsers: newCampaignUsers}
  try {
    const producer = kafka.producer();
    await producer.connect();
    await producer.send({
      topic: process.env.KAFKA_TOPIC ?? "campaign-communicate",
      messages: [
        {         
          key: CampaignId.toString(),
          value: JSON.stringify(messageCampaignSend),
        },
      ],
    });
    const returnMsg = { Campaign: messageCampaignSend.Campaign, TotalTransported: messageCampaignSend.CampaignUsers.length };  
    res.status(201).json(returnMsg);
  } catch (error) {
    console.log('[error]', error)
    return next(new ErrorResponse(`Unhandled exception` + error, 400));
  }
});
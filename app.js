const axios = require('axios');
const _ = require('lodash');
const moment = require('moment');
const { ethers } = require('ethers');
const tweet = require('./tweet');
const cache = require('./cache');

// Format tweet text
function formatAndSendTweet(event) {
    // Handle both individual items + bundle sales
    const assetName = _.get(event, ['buy', 'properties', 'name']);
    const tokenID = _.get(event, ['buy', 'data', 'token_id']);

    const totalPrice = _.get(event, 'sell', 'data', 'quantity');

    const tokenDecimals = _.get(event, ['sell', 'data', 'decimals']);
    const tokenEthPrice = _.get(event, ['sell', 'data', 'quantity']);

    const formattedUnits = ethers.utils.formatUnits(totalPrice, tokenDecimals);
    const formattedEthPrice = formattedUnits * tokenEthPrice;

    const tweetText = `${assetName} bought for ${formattedEthPrice}${ethers.constants.EtherSymbol} TokenID: ${tokenID}. See all: https://immutascan.io/address/0xac98d8d1bb27a94e79fbf49198210240688bb1ed`;

    console.log(tweetText);

    const imageUrl = _.get(event, ['buy', 'properties', 'image_url']);
    
    return tweet.tweetWithImage(tweetText, imageUrl);

}

// Poll OpenSea every 60 seconds & retrieve all sales for a given collection in either the time since the last sale OR in the last minute
setInterval(() => {
    const lastSaleTime = cache.get('lastSaleTime', null) || moment().startOf('minute').subtract(59, "seconds").toISOString();

    console.log(`Last sale: ${cache.get('lastSaleTime', null)}`);

    axios.get('https://api.x.immutable.com/v1/orders', {
        headers: {
            Accept: '*/*'
        },
        params: {
            buy_token_address: process.env.TOKEN_CONTRACT_ADDRESS,
            status: 'filled',
            min_timestamp: lastSaleTime,
        }
    }).then((response) => {
        const events = _.get(response, ['result']);

        const sortedEvents = _.sortBy(events, function(event) {
            const created = _.get(event, 'timestamp');

            return new Date(created);
        })
        _.each(sortedEvents, (event) => {
            const created = _.get(event, 'timestamp');

            cache.set('lastSaleTime', moment(created).toISOString());

            return formatAndSendTweet(event);
        });
    }).catch((error) => {
        console.error(error);
    });
}, 60000);

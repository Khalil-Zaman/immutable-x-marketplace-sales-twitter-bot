# Immutable X Sales Twitter Bot

A bot that monitors Immutable X (ETH Layer 2 "built for NFTs") sales for a given collection & then posts them to Twitter.

Please note, this is an amended fork from an original creation by @dsgriffin.

## Requirements

- [Twitter Developer Account](https://developer.twitter.com/en/apply-for-access) (with [Elevated Access](https://developer.twitter.com/en/portal/products/elevated), as we need v1.1 endpoint access)

- Heroku Account (a free account **should** be fine **if** you tweak the project to run less often than every minute (by default it is every minute), otherwise a $7 a month dyno instance is more than enough).

## Setup

- Clone / Fork / Copy this project to your local public / private git repo

- Create a Twitter Developer App (make sure you change it to have both read / write permissions)

- Create a new Heroku app & set it as a remote branch of your git repo (see [Heroku Remote](https://devcenter.heroku.com/articles/git#creating-a-heroku-remote))

- Make sure you are logged in to the Twitter account you want the bot to run on (as the next step will be authorizing the bot to post on your account)

- Install [Twurl](https://github.com/twitter/twurl) and, using your Twitter Developer consumer key & secret, generate the access token & access secret

In the 'Settings' section of your Heroku app you'll see a 'Config Vars' section. Add the following config vars:

- **CONSUMER_KEY** - Your Twitter Developer App's Consumer Key
- **CONSUMER_SECRET** - Your Twitter Developer App's Consumer Secret
- **ACCESS_TOKEN_KEY** - The Access Token Key of the Twitter Account your bot is posting from
- **ACCESS_TOKEN_SECRET** - The Access Token Secret of the Twitter Account your bot is posting from
- **TOKEN_CONTRACT_ADDRESS** - The contract address of the items of the collection you wish to track (e.g. `0xac98d8d1bb27a94e79fbf49198210240688bb1ed` for Book Games)

Now you're ready to release - just push up the code via. git to the Heroku remote (see [Heroku Remote](https://devcenter.heroku.com/articles/git#creating-a-heroku-remote) if unsure how).

Esnure you have configured such that you are using `worker` dynos and not `web` dynos - you can do this on Heroku under the projecr 'Overview' > 'Dyno Formations' or set this within the CLI of your project with:

```sh
heroku ps:scale web=0
heroku ps:scale worker=1
```

## Modification

As mentioned at the top of the README, it runs every 60 seconds by default - you can change this to run less often if you'd like to keep it on a free Heroku instance.

## License

This code is licensed under the [ISC License](https://choosealicense.com/licenses/isc/).

## Documentation

For more information on the Immutable X API, please see: https://github.com/KadeStroude/immutable-x-marketplace-sales-twitter-bot

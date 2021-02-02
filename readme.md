# This app is for discord bot.

## How to prepare enviroment.

```command
git clone https://github.com/SQZ777/ntericeapp.git
npm install
node app.js
```

you need add .env file in your local.

the .env key value should provide:

```
discordToken=
twitchAuthorization=
twitchClientId=
mongoHost=
TRNApiKey=
```

## Support Services

- Polling 反正我很閒 Youtube Channel latest youtube video.(every 15 seconds)
- Notify when target Twitch streamers are streamming.(Polling)
- Use /apex command to get the APEX player current rank score.
  - format: /apex {platform} {playerName}
  - format example: /apex pc iceonfire
  - support platform: pc, xbox, psn

## TODO

- refresh twitch accesstoken machanism
- set /apex command default platform is PC
- add emoji for /apex command, click this emoji should delete the response message.
- set /apex command for personal
  - ex: /@my_discord_name then response this person's apex rank status
    - before this, should add /apex register command
# Tweet Image Discord
Convert tweet to image and sent to Discord channel.

## APIs
### GET /image
#### Description
View image directly.

#### Request Query String
|require|field|description|example|
|--|--|--|--|
|v|tweetUrl|Url of tweet|`https://twitter.com/DubiStowCh/status/1413787021563232257?s=20`|

#### Response Header
|field|description|
|--|--|
|Content-Type|`image/png`|

#### Response Example
![](/docs/example.png)

### POST /post
#### Description
Post tweet image to Discord via Webhook.

#### Request Query String
|Require|Field|Description|Example|
|--|--|--|--|
|v|tweetUrl|Url of tweet|`https://twitter.com/DubiStowCh/status/1413787021563232257?s=20`|

#### Request Body
None.

#### Response Example
![](/docs/example-discord.png)



## Usage
### Docker Compose
```yaml
version: '3'

services:
  express:
    tty: true
    image: dubistowch/tweet-image-discord
    # build: .
    ports:
      - 3000:3000
    environment:
      # Required
      - HOST=0.0.0.0
      - PORT=3000
      - NODE_ENV=production
      - WEBHOOK=
      - TWITTER_USER=
      # Optional
      - USERNAME=
      - PASSWORD=
      - STYLE_JS=customize/style.js
      - DISCORD_AVATAR=
      - DISCORD_USER=
      - ARCHIVE_DIR=

```

### Environment Variables

|Require|Field|Description|Default|
|--|--|--|--|
|v|HOST|Listening host|`0.0.0.0`|
|v|PORT|Listening port|`3000`|
|v|TWITTER_USER|Filter only this user|`null`|
|v|WEBHOOK|Discord Webhook URL|`null`|
||USERNAME|Basic auth for incomming request|`null`|
||PASSWORD|Basic auth for incomming request|`null`|
||STYLE_JS|Customize image style|`null`|
||DISCORD_AVATAR|Webhook bot avatar|`null`|
||DISCORD_USER|Webhook bot name|`null`|
||ARCHIVE_DIR|Save image to folder|`null`|
||TZ|TimeZone|`Asia/Taipei`|


### Customize

#### Fonts
Just put files in `customize/fonts`.


#### Style Script Example
Create file at `customize/style.js` and set `STYLE_JS` to the script

> Notes: fonts are not included in this repo, install it yourself 

```js
module.exports = (document) => {
    const color = ([
        "#ef835f",
        "#6cc7b8",
        "#bb5d7f",
        "#ffcc71"
    ].sort(() => Math.random() - 0.5))[0]
    console.log('color', color)

    return `
    * { 
        font-family: "jf open 粉圓 1.1", "Noto Sans CJK TC", "Segoe UI", Roboto, Helvetica, Arial, sans-serif!important;
    }
    html, body { 
        background: transparent
    }
    body {
        padding: 15px
    }
    #app > div > div > div {
        padding: 0px;
        border-radius: 20px;
        border: 10px solid ${color};
    }
    #app > div {
        border: none;
    }
    a[aria-label="Twitter 廣告資訊與隱私"] {
        display: none
    }
    div[aria-label="分享"] {
        display: none
    }
    `
}

```
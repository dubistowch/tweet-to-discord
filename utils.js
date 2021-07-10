const fetch = require('node-fetch')
const FormData = require('form-data')

module.exports = {

    getTweetId (tweetUrl) {
        const splitTweetUrl = tweetUrl.split('/')
        const lastItem = splitTweetUrl[splitTweetUrl.length - 1]
        const splitLastItem = lastItem.split('?')
        const tweetId = splitLastItem[0]
        return tweetId
    },

    getTweetUser (tweetUrl) {
        const splitTweetUrl = tweetUrl.split('/')
        const tweetUser = splitTweetUrl[splitTweetUrl.length - 3]
        return tweetUser
    },

    sentToDiscord (screenshot) {
        const formdata = new FormData()
        formdata.append("", screenshot, `${Date.now()}.png`)
        formdata.append("payload_json", JSON.stringify(
            {
            avatar_url: process.env.DISCORD_AVATAR,
            username: process.env.DISCORD_USER,
            }
        ))

        const requestOptions = {
            method: 'POST',
            body: formdata,
        }

        fetch(process.env.WEBHOOK, requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error))
    }
}

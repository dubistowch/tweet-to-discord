
const express = require('express')
const basicAuth = require('express-basic-auth')

const screenshot = require('./screenshot')
const {getTweetId, getTweetUser, sentToDiscord} = require('./utils')

const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 3000
const app = express()

app.use(express.json())

if (process.env.USERNAME && process.env.PASSWORD) {
  app.use(basicAuth({
    users: { [process.env.USERNAME]: process.env.PASSWORD }
  }))
}

app.listen(port, host, () => {
  console.log(`DubiTweet Listening on ${host}:${port}`)
})

app.get('/image', async (req, res) => {
  const { tweetUrl } = req.query
  const tweetId = getTweetId(tweetUrl)
  const tweetUser = getTweetUser(tweetUrl)

  if (`${tweetUser}`.toLowerCase() !== `${process.env.TWITTER_USER}`.toLocaleLowerCase()) {
    console.log('Who is this ?', tweetUser)
    res.status(400)
    res.send('Who is this ?')
    return
  }

  const screenshotPost = await screenshot({
    tweetId,
  })

  res.contentType('image/png')
  res.send(screenshotPost)
})

app.post('/post', async (req, res) => {
  const { tweetUrl } = req.query
  const tweetId = getTweetId(tweetUrl)
  const tweetUser = getTweetUser(tweetUrl)

  if (`${tweetUser}`.toLowerCase() !== `${process.env.TWITTER_USER}`.toLocaleLowerCase()) {
    console.log('Who is this ?', tweetUser)
    res.status(400)
    res.send('Who is this ?')
    return
  }
  
  const screenshotPost = await screenshot({
    tweetId,
  })
  
  sentToDiscord(screenshotPost)

  res.send('ok')
})

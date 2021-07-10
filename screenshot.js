const puppeteer = require('puppeteer')
const fs = require('fs')

const getEmbedTweet = (tweetId) => `https://platform.twitter.com/embed/index.html?dnt=true&embedId=twitter-widget-0&frame=false&hideCard=false&hideThread=true&id=${tweetId}&lang=zh-tw&theme=light&widgetsVersion=ed20a2b%3A1601588405575`
const screenshot = async (props) => {
  try {
    const { tweetId } = props

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })

    const url = getEmbedTweet(tweetId)
    const page = await browser.newPage()
    await page.goto(url, { waitUntil: 'networkidle0' })
    await page.setViewport({ width: 550, height: 500 })

    // register styleScript
    const styleScript = process.env.STYLE_JS
      ? require(process.env.STYLE_JS)
      : () => {};
    await page.exposeFunction('styleScript', (doc) => styleScript(doc))

    // register console.log
    page.on('console', (msg) => console.log(msg.text()))

    // apply style and get height back
    const viewPort = await page.evaluate(async ({ }) => {
      const style = document.createElement('style')
      style.innerHTML = await window.styleScript()
      document.getElementsByTagName('head')[0].appendChild(style)

      const height = document.querySelector('article').offsetHeight
      return { width: 550, height: parseInt(height), deviceScaleFactor: 1.25 }
    }, { })

    await page.setViewport(viewPort)
    const imageBuffer = await page.screenshot({
      type: 'png',
      fullPage: true,
      omitBackground: true,
      encoding: 'binary'
    })

    await browser.close()
    if (process.env.ARCHIVE_DIR) {
      fs.writeFileSync(`/app/${process.env.ARCHIVE_DIR}/${Date.now()}.png`, imageBuffer)
    }
    return imageBuffer
  } catch (err) {
    console.error(err)
  }
}

module.exports = screenshot

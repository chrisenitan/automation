const nodemailer = require("nodemailer")
const fs = require("fs")
const puppeteer = require("puppeteer")
const memory = require("../memory.json")

/* visit a page and take a screenshot
send the image and a link to a user.  */
let ott = async (req) => {
  const browser = await puppeteer.launch({
    headless: false,
    devtools: true,
    defaultViewport: {
      width: 1400,
      height: 760,
    },
    args: ["--window-size=1700,1024"],
  })
  const page = await browser.newPage()

  //try all
  try {
    //define attr
    const sAtt = {}
    //foreach...reduce??
    await page.goto(req[0])
    sAtt.fileName = await page.title()
    await page.screenshot({
      type: "png",
      path: `screenshots/${sAtt.fileName}.png`,
    })
    sAtt.mailBody = `Hello world!`

    //send emails
    try {
      const transporter = await nodemailer.createTransport({
        host: "smtp-mail.outlook.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: memory.email,
          pass: memory.password,
        },
        debug: false, // show debug output
        logger: false, // log information in console
      })

      await transporter.sendMail({
        from: `Fred Foo 👻 <${memory.email}>`,
        to: "futafe@getnada.com",
        subject: "Hello ✔",
        html: sAtt.mailBody,
        attachments: [
          {
            filename: `${sAtt.fileName}.png`,
            path: `screenshots/${sAtt.fileName}.png`,
            cid: `screenshots/${sAtt.fileName}.png`,
          },
        ],
      }).then(res => {
        console.log(res)
      })
 
    } catch (mailError) {
      console.log(mailError)
    }

    await browser.close()
    //delete bloat files
    fs.unlink(`screenshots/${sAtt.fileName}.png`, (err) => {
      if (err) {
        console.log(err)
      }
    })
  } catch (error) {
    console.log(error)
    await browser.close()
  }
}

ott(["https://www.google.com", "https://www.twitter.com"])

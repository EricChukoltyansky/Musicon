const puppeteer = require("puppeteer-extra");
const randomUserAgent = require("user-agents");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const AdblockerPlugin = require("puppeteer-extra-plugin-adblocker");
const cheerio = require("cheerio");

puppeteer.use(StealthPlugin());
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));
const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36";

const searchPage = async (url, callback) => {
  const userAgent = randomUserAgent.random();
  const UA = userAgent || USER_AGENT;

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.setJavaScriptEnabled(true);
  await page.setDefaultNavigationTimeout(0);

  await page.setViewport({
    width: 1920 + Math.floor(Math.random() * 100),
    height: 3000 + Math.floor(Math.random() * 100),
    deviceScaleFactor: 1,
    hasTouch: false,
    isLandscape: false,
    isMobile: false,
  });

  await page.setUserAgent(UA.toString());
  //to do loop through pages if you think in the end its worth it.
  // const number = parseInt($(".numbers").children().last().text().trim()) || 0;
  // const num = 2;
  await page.goto(url);
  const html = await page.content();
  const $ = cheerio.load(html);

  //open pages to get the details
  // await page.evaluate(() => {
  //   document.querySelector("#feed_item_0").click();
  // });

  // await page.evaluate(() => {
  //   const elements = document.querySelectorAll(".feed_item");
  //   elements.forEach((el) => {
  //
  //   });
  // });

  const result = $(".feeditem")
    .map((i, el) => {
      const city = () => {
        const cityName = $(el).find(".subtitle").text().split(",");
        if (cityName[1]) {
          return cityName[1];
        } else {
          const cityName2 = $(el).find(`#feed_item_${i}_title`).text();
          return cityName2.trim();
        }
      };

      const price = $(el).find(`#feed_item_${i}_price`).text().trim();
      const rooms = $(el).find(`#data_rooms_${i}`).text();
      const meters = $(el).find(`#data_SquareMeter_${i}`).text();
      const link = `#feed_item_${i}`;

      return {
        city: city(),
        price,
        rooms,
        meters,
        link,
      };
    })
    .get();
  return callback(result);
};

module.exports = searchPage;

// import puppeteer from "puppeteer";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin());

export const scrapeFromYoutube = async (value) => {
  const searchValue = value;
  console.log("searchValue",searchValue);
  try {
    const input = searchValue.split(" ").join("+");
    // console.log(input)
    const browser = await puppeteer.launch({
      headless: false,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    await page.setDefaultNavigationTimeout(0);
    await page.goto(`https://www.youtube.com/results?search_query=${input}`);
    const results = await page.evaluate(() => {
      let arr = [];
      const res = document.body
        .querySelectorAll(
          "#contents > ytd-item-section-renderer > #contents > ytd-video-renderer > #dismissible > div > #meta > #title-wrapper > h3"
        )
        .forEach((e, i) => {
          let obj = {
            title: e.innerText,
            link: `https://www.youtube.com${e
              .querySelector("#video-title")
              .getAttribute("href")}`,
          };
          if (i < 1) {
            arr.push(obj);
          }
          return;
        });
      console.log(arr);
      return arr;
    });

    console.dir(results);
    browser.close();
    console.log(results);
    return results;
  } catch (err) {
    console.error("e", err);
  }
};

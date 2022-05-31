import puppeteer from 'puppeteer';
import fastload from 'fastload';
import create_debug from '../utils/create_debug.js'

const { error, info, warn } = create_debug('random_images');
const BASE_URL = 'https://bing.oneneko.com';
const INDEX_URL = BASE_URL + '/wallpaper/097a1e7a.html';


(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    devtools: false
  });
  const page = await browser.newPage();
  await page.goto(INDEX_URL);
  const list = await run_pages()(page, 10);
  await browser.close();
  info(list);
  list.forEach(url => {
    fastload(url, 'c://users/vzan/Desktop');
  });
})();

async function get_image_url(page) {
  try {
    const background_image = await page.$eval('.img_body', el => el.attributes['1']['value']);
    const url = background_image.match(/\/image\/.*\.(jpg|png|jpeg)/g)?.[0];
    return url ? BASE_URL + url : null
  } catch(err) {
    error(err);
    return null
  }
}

async function next_page(page) {
  try {
    await Promise.all([
      page.waitForNavigation(),
      page.click('.nav_right a:last-of-type'),
    ]);
    const url = await get_image_url(page);
    return url || null
  } catch (err) {
    error(err);
    return null;
  }
}

function run_pages(list = []) {
  return async function(page, count) {
    if (count > 0) {
      info(`Getting image url...`);
      const url = await next_page(page);
      url && list.push(url) && await run_pages(list)(page, --count);
      return list
    } else {
      warn('Get images url done');
      return list;
    }
  }
}

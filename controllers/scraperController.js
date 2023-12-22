// scraperController.js
const express = require('express');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

const router = express.Router();

const getSelectorByURL = (url) => {
  if (url.includes('geeksforgeeks')) {
    return '.problems_problem_content__Xm_eO';
  } else if (url.includes('leetcode')) {
    return '.xFUwe';
  } else if (url.includes('codeforces')) {
    return '.problem-statement';
  } else if (url.includes('codechef')) {
    return '._problemBody_iu0mi_33';
  } else if (url.includes('hackerearth')) {
    return '.problem-details';
  } else {
    return null;
  }
};

router.post('/api/scrape', async (req, res) => {
  try {
    const url = req.body.url;
    if (!url) {
      return res.status(400).send('URL parameter is missing');
    }

    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    const selectorToWaitFor = getSelectorByURL(url);
    if (!selectorToWaitFor) {
      return res.status(400).send('Unsupported website');
    }

    await page.waitForSelector(selectorToWaitFor);

    const htmlContent = await page.content();
    const $ = cheerio.load(htmlContent);
    const specificDivContent = $(selectorToWaitFor).html();

    res.send(specificDivContent);
    await browser.close();
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;

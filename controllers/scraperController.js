// scraperController.js
const express = require('express');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

const router = express.Router();

const getSpecificDivContent = (url, $) => {
  if (url.includes('geeksforgeeks')) {
    return $('.problems_problem_content__Xm_eO').html();
  } else if (url.includes('leetcode')) {
    return $('.xFUwe').html();
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

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForTimeout(2500);
    const htmlContent = await page.content();
    const $ = cheerio.load(htmlContent);

    const specificDivContent = getSpecificDivContent(url, $);
    if (specificDivContent === null) {
      return res.status(400).send('Unsupported website');
    }

    console.log(specificDivContent);
    res.send(specificDivContent);
    await browser.close();
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;


class MyPuppeteer extends Helper {

  // before/after hooks
  _before() {
    // remove if not used
  }

  _after() {
    // remove if not used
  }

  // add custom methods here
  // If you need to access other helpers
  // use: this.helpers['helperName']

  async goBack() {
    const page = this.helpers['Puppeteer'].page;
    //await page.emulateMedia('screen');
    return page.goBack();
  }

  async grabTextFromOrBlank(locator) {
    const els = await this.helpers['Puppeteer']._locate(locator);
    // assertElementExists(els, locator);
    if (!els)
      return '';
    const texts = [];
    for (const el of els) {
      texts.push(await (await el.getProperty('innerText')).jsonValue());
    }
    if (texts.length === 1) return texts[0];
    return texts;
  }


}

module.exports = MyPuppeteer;

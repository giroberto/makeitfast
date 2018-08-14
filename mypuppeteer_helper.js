
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


}

module.exports = MyPuppeteer;

const puppeteer = require("puppeteer");
const chai = require("chai");
const expect = chai.expect;
const { Given, When, Then, Before, After } = require("cucumber");
const {selectTime, bookTickets,checkSeat} = require("../../lib/util.js");
const { setDefaultTimeout } = require("cucumber");
const { getText } = require("../../lib/commands.js");
setDefaultTimeout(60000);

let movieDay = "nav.page-nav > a:nth-child(2)";
let lastBookDay = "nav.page-nav > a:nth-child(7)";
let movieTime = "[data-seance-id='129']"; 
let ticketHint = "p.ticket__hint";
let confirmingText = "Потверждено";

Before(async function () {
  const browser = await puppeteer.launch({ headless: false, slowMo: 50 });
  const page = await browser.newPage();
  this.browser = browser;
  this.page = page;
});

After(async function () {
  if (this.browser) {
    await this.browser.close();
  }
});

Given("user is on {string} page", async function (string) {
  return await this.page.goto(`http://qamid.tmweb.ru/client${string}`, {
    setTimeout: 20000,
  });
});

When("user select {int}-th day and movie", async function (int1) {
  await movieDay(
    this.page,
    `nav.page-nav > a:nth-child(${int1})`,
    movieTime
  );
});

When("select and book {int} row and {int} seat", async function (int1, int2) {
  await bookTickets(this.page, int1, int2);
});

When(
  "select and book {int} row and {int},{int},{int} seats",
  async function (int1, int2, int3, int4) {
    await bookTickets(this.page, int1, int2, int3, int4);
  }
);

When(
  "sees that {int} row and {int} seat is taken trying select them",
  async function (int1, int2) {
    await checkSeat(this.page, int1, int2);
    try {
      await bookTickets(this.page, int1, int2);
    } catch (error) {
      expect(error).to.be.an("error");
      expect(error.message).to.be.equal("Seat is taken");
    }
  }
);

Then("user received confirmation", async function () {
  const actual = await getText(this.page, ticketHint);
  expect(actual).contain(confirmingText);
});

Then("Book button is not active", async function () {
  const buttonStatus = await this.page.$eval(
    ".acceptin-button",
    (el) => el.disabled
  );
  expect(buttonStatus).equal(true);
});
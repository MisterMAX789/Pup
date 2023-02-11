const { selectTime, bookTickets,checkSeat} = require("./lib/util.js");
const { getText } = require("./lib/commands");

let page;
let movieDay = "nav.page-nav > a:nth-child(2)";
let lastBookDay = "nav.page-nav > a:nth-child(7)";
let movieTime = "[data-seance-id='129']"; // 

describe(" Booking movie tickets ", () => {
  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto("http://qamid.tmweb.ru/client/index.php");
    await page.setDefaultNavigationTimeout(0);
  });

  afterEach(() => {
    page.close();
  });

  test("Should booking ticket ", async () => {
    await selectTime(page, movieDay, movieTime);
    await bookTickets(page, 1, 2);
    const actual = await getText(page, "p.ticket__hint");
    expect(actual).toContain("Подтверждено");
  });

  test("Should booking three tickets for Movie in the last day ", async () => {
    await selectTime(page, lastBookDay, movieTime);
    await bookTickets(page, 5, 6, 7, 8);
    const actual = await getText(page, "p.ticket__hint");
    expect(actual).toContain("Подтверждено");
  });

  test("Should try to book ticket  if seat is taken already", async () => {
    await expect(async () => {
      await selectTime(page, movieDay, movieTime);
      await bookTickets(page, 1, 2);
    }).rejects.toThrowError("Seat is taken");
  });

  test("Check if the place is free after booking  ", async () => {
    let row = 5;
    let seat = 4;
    await selectTime(page, lastBookDay, movieTime);
    await bookTickets(page, row, seat);
    await page.goto("http://qamid.tmweb.ru/client/index.php");
    await selectTime(page, lastBookDay, movieTime);
    await checkSeat(page, row, seat);
    const classExist = await page.$eval(
      `div.buying-scheme__wrapper > div:nth-child(${row}) > span:nth-child(${seat})`,
      (el) => el.classList.contains("buying-scheme__chair_taken")
    );
    expect(classExist).toEqual(true);
  });
});

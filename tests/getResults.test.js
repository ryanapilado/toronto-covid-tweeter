const { getResults, validateResults } = require("..");
const fs = require("fs")
const dayjs = require('dayjs');

const caseData = JSON.parse(fs.readFileSync('tests/caseData.json'));

test.each(caseData)("results: %s",
 async (date, torontoNewCases, ontarioNewCases, toronto7DayAvg, ontario7DayAvg) => {
  const results = await getResults(dayjs(date), validateResults);
  expect(results).toMatchObject({
      'torontoNewCases': torontoNewCases,
      'ontarioNewCases': ontarioNewCases,
      'toronto7DayAvg': toronto7DayAvg,
      'ontario7DayAvg': ontario7DayAvg
  });
})

test("results fail validation", async () => {
  await expect(getResults(dayjs("2020-08-14"), () => false))
    .rejects.toEqual("Suspicious case counts, likely scraping error.");
})

test("validateResults happy path", () => {
  let results = {
    torontoNewCases: 180,
    toronto7DayAvg: 100,
    ontarioNewCases: 56,
    ontario7DayAvg: 100
  }
  expect(validateResults(results)).toBeTruthy();
})

test("validateResults high", () => {
  let results = {
    torontoNewCases: 201,
    toronto7DayAvg: 100,
    ontarioNewCases: 56,
    ontario7DayAvg: 100
  }
  expect(validateResults(results)).toBeFalsy();
})

test("validateResults low", () => {
  let results = {
    torontoNewCases: 180,
    toronto7DayAvg: 100,
    ontarioNewCases: 48,
    ontario7DayAvg: 100
  }
  expect(validateResults(results)).toBeFalsy();
})

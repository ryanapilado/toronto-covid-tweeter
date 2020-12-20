const { getResults } = require("..");
const fs = require("fs")
const dayjs = require('dayjs');

const caseData = JSON.parse(fs.readFileSync('tests/caseData.json'));

test.each(caseData)("results: %s",
 async (date, torontoNewCases, ontarioNewCases, toronto7DayAvg, ontario7DayAvg) => {
  const results = await getResults(dayjs(date));
  expect(results).toMatchObject({
      'torontoNewCases': torontoNewCases,
      'ontarioNewCases': ontarioNewCases,
      'toronto7DayAvg': toronto7DayAvg,
      'ontario7DayAvg': ontario7DayAvg
  });
})

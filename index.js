const twit = require('twit');
const axios = require('axios');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
dayjs.extend(utc);
dayjs.extend(timezone);

exports.tweetReport = async (req, res) => {

  let date;
  if (req.query.hasOwnProperty('date')) {
    date = dayjs(req.query.date).tz("America/Toronto");
  } else {
    date = dayjs().tz("America/Toronto");
  }

  const responses = await Promise.all(
    Array.from(Array(7).keys()).map(i => {
        const dateString = date.subtract(i, 'day').format("YYYY-MM-DD");
        const reportURL = process.env.READ_REPORT_ENDPOINT + '?date=' + dateString;
        return axios.get(reportURL)
    })
  )

  const torontoNewCases = responses[0].data.torontoNewCases;
  const ontarioNewCases = responses[0].data.ontarioNewCases;
  const toronto7DayAvg = get7DayAvg(responses, 'torontoNewCases');
  const ontario7DayAvg = get7DayAvg(responses, 'ontarioNewCases');

  const twitter = new twit({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
  });

  let message = 
    `${torontoNewCases} new cases of COVID-19 in Toronto yesterday` +
    ` and ${ontarioNewCases} in Ontario.` +
    ` 7-day averages are ${toronto7DayAvg} and ${ontario7DayAvg} respectively.` +
    ` #toronto #covid19 #coronavirus`;

  twitter.post('statuses/update', { status: message }, function(error, data, response) {

    if (error) {
      res.status(500).send(error);
    }

    res.status(200).send();

  });

}

function get7DayAvg(responses, key) {
  const sum = responses.map(response => response.data[key])
    .reduce((a, b) => a + b, 0);
  return Math.round(sum / responses.length);
}

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


  return getResults(date)
    .then(results => {

      let message = 
        `${results.torontoNewCases} new cases of COVID-19 in Toronto yesterday` +
        ` and ${results.ontarioNewCases} in Ontario.` +
        ` 7-day averages are ${results.toronto7DayAvg} and ${results.ontario7DayAvg} respectively.` +
        ` #toronto #covid19 #coronavirus`;

      return postTweet(message);
    })
    .then(result => res.status(200).send())
    .catch(err => res.status(400).send(err));

}

function postTweet(message) {
  const twitter = new twit({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
  });

  return twitter.post('statuses/update', { status: message });
}

function getResults(date) {
  return Promise.allSettled(
    Array.from(Array(7).keys()).map(i => {
        const dateString = date.subtract(i, 'day').format("YYYY-MM-DD");
        const reportURL = process.env.READ_REPORT_ENDPOINT + '?date=' + dateString;
        return axios.get(reportURL);
    })
  ).then(results => {
    if (results[0].status === "rejected") return Promise.reject("Today's data not available yet.");
    const responses = results
                        .filter(result => result.status === "fulfilled")
                        .map(result => result.value);
    return {
      torontoNewCases : responses[0].data.torontoNewCases,
      ontarioNewCases : responses[0].data.ontarioNewCases,
      toronto7DayAvg : get7DayAvg(responses, 'torontoNewCases'),
      ontario7DayAvg : get7DayAvg(responses, 'ontarioNewCases')
    }
  });
}

function get7DayAvg(responses, key) {
  const sum = responses.map(response => response.data[key])
    .reduce((a, b) => a + b, 0);
  return Math.round(sum / responses.length);
}

exports.getResults = getResults;
exports.postTweet = postTweet;